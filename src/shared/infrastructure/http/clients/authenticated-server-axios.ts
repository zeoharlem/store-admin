import 'server-only'

import axios, {
  AxiosHeaders,
  type AxiosHeaderValue,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse
} from 'axios'

import { normalizeAxiosError } from '../interceptors/error.interceptor'

import { clearAuthCookies, getAuthTokens, setAuthCookies } from '@/features/auth/infrastructure/session/auth-cookies'

import type { ApiResponse } from '@/shared/infrastructure/http/types/api-reponses'
import { ApiError } from '@/shared/infrastructure/http/errors/api-errors'

interface RefreshTokenData {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
}

/**
 * Coalesces simultaneous refresh operations within this Node.js process.
 * This is not a distributed lock.
 */
const refreshRequests = new Map<string, Promise<RefreshTokenData>>()

const baseURL = process.env.VENDOR_API_BASE_URL

if (!baseURL) {
  throw new Error('VENDOR_API_BASE_URL is not configured.')
}

const apiBaseURL = `${baseURL.replace(/\/+$/, '')}/api/v1`

/**
 * Converts Axios request headers into an AxiosHeaders instance.
 * This avoids the Partial<RawAxiosHeaders> TypeScript incompatibility.
 */
function buildHeaders(configHeaders?: AxiosRequestConfig['headers']): AxiosHeaders {
  const headers = new AxiosHeaders()

  if (!configHeaders) {
    return headers
  }

  Object.entries(configHeaders).forEach(([name, value]) => {
    if (value !== undefined) {
      headers.set(name, value as AxiosHeaderValue)
    }
  })

  return headers
}

/**
 * Performs the upstream refresh request.
 * Cookie persistence is deliberately handled by each caller.
 */
async function performRefresh(refreshToken: string): Promise<RefreshTokenData> {
  const response = await axios.post<ApiResponse<RefreshTokenData>>(
    `${apiBaseURL}/auth/refresh`,
    {
      refresh_token: refreshToken
    },
    {
      timeout: 20_000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
  )

  const result = response.data

  if (!result?.success) {
    throw new ApiError(
      result?.error?.message ?? 'Your session has expired.',
      response.status,
      result?.error?.code ?? 'SESSION_REFRESH_FAILED',
      result?.error?.details
    )
  }

  const tokens = result.data

  if (
    !tokens?.access_token ||
    !tokens?.refresh_token ||
    !Number.isFinite(tokens.expires_in) ||
    tokens.expires_in <= 0
  ) {
    throw new ApiError('The authentication server returned invalid session tokens.', 502, 'INVALID_REFRESH_RESPONSE')
  }

  return tokens
}

/**
 * Shares the upstream refresh request between concurrent requests
 * using the same refresh token.
 */
async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenData> {
  const existingRequest = refreshRequests.get(refreshToken)

  if (existingRequest) {
    return existingRequest
  }

  const refreshRequest = performRefresh(refreshToken)

  refreshRequests.set(refreshToken, refreshRequest)

  try {
    return await refreshRequest
  } finally {
    if (refreshRequests.get(refreshToken) === refreshRequest) {
      refreshRequests.delete(refreshToken)
    }
  }
}

/**
 * Refreshes the token and persists the rotated cookies
 * in the current request context.
 */
async function refreshAndPersist(refreshToken: string): Promise<RefreshTokenData> {
  try {
    const tokens = await refreshAccessToken(refreshToken)

    await setAuthCookies({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in
    })

    return tokens
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      await clearAuthCookies()

      throw new ApiError('Your session has expired. Please sign in again.', 401, 'SESSION_EXPIRED')
    }

    if (axios.isAxiosError(error)) {
      const normalizedError = normalizeAxiosError(error)

      if (normalizedError.status === 401) {
        await clearAuthCookies()

        throw new ApiError('Your session has expired. Please sign in again.', 401, 'SESSION_EXPIRED')
      }

      throw normalizedError
    }

    throw error
  }
}

export class AuthenticatedServerAxios {
  private readonly client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: apiBaseURL,
      timeout: 20_000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }

  async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    const auth = await getAuthTokens()

    let currentAccessToken = auth.accessToken
    let currentRefreshToken = auth.refreshToken

    // Refresh proactively if the access cookie is missing.
    if (!currentAccessToken && currentRefreshToken) {
      const tokens = await refreshAndPersist(currentRefreshToken)

      currentAccessToken = tokens.access_token
      currentRefreshToken = tokens.refresh_token
    }

    if (!currentAccessToken) {
      throw new ApiError('You must sign in to continue.', 401, 'AUTHENTICATION_REQUIRED')
    }

    const headers = buildHeaders(config.headers)

    headers.set('Authorization', `Bearer ${currentAccessToken}`)

    try {
      return await this.client.request<ApiResponse<T>>({
        ...config,
        headers
      })
    } catch (error) {
      const shouldRefresh = axios.isAxiosError(error) && error.response?.status === 401

      if (!shouldRefresh) {
        throw normalizeAxiosError(error)
      }

      if (!currentRefreshToken) {
        await clearAuthCookies()

        throw new ApiError('Your session has expired. Please sign in again.', 401, 'SESSION_EXPIRED')
      }

      // Refresh and persist the newly rotated token pair.
      const tokens = await refreshAndPersist(currentRefreshToken)

      const retryHeaders = buildHeaders(config.headers)

      retryHeaders.set('Authorization', `Bearer ${tokens.access_token}`)

      try {
        return await this.client.request<ApiResponse<T>>({
          ...config,
          headers: retryHeaders
        })
      } catch (retryError) {
        // Only clear cookies when the retried request is
        // rejected as unauthorized. Preserve the session
        // for network errors and other server failures.
        if (axios.isAxiosError(retryError) && retryError.response?.status === 401) {
          await clearAuthCookies()

          throw new ApiError('Your session has expired. Please sign in again.', 401, 'SESSION_EXPIRED')
        }

        throw normalizeAxiosError(retryError)
      }
    }
  }

  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({
      ...config,
      method: 'GET',
      url
    })
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.request<T>({
      ...config,
      method: 'POST',
      url,
      data
    })
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.request<T>({
      ...config,
      method: 'PUT',
      url,
      data
    })
  }

  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.request<T>({
      ...config,
      method: 'PATCH',
      url,
      data
    })
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>({
      ...config,
      method: 'DELETE',
      url
    })
  }
}

export function createAuthenticatedServerAxios(): AuthenticatedServerAxios {
  return new AuthenticatedServerAxios()
}
