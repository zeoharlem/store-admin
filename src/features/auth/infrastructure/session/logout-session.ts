
import 'server-only'

import axios from 'axios'

import { normalizeAxiosError } from '@/shared/infrastructure/http/interceptors/error.interceptor'

import {
  clearAuthCookies,
  getAuthTokens
} from './auth-cookies'
import { ApiError } from '@/shared/infrastructure/http/errors/api-errors'

const baseURL = process.env.VENDOR_API_BASE_URL

export async function logoutSession(): Promise<void> {
  const { refreshToken } = await getAuthTokens()

  try {
    if (!baseURL) {
      throw new ApiError(
        'Vendor API URL is not configured.',
        500,
        'API_CONFIGURATION_ERROR'
      )
    }

    if (refreshToken) {
      await axios.post(
        `${baseURL.replace(/\/+$/, '')}/api/v1/auth/logout`,
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
    }
  } catch (error) {
    throw normalizeAxiosError(error)
  } finally {
    // Always clear local session cookies, even if the backend is unavailable.
    await clearAuthCookies()
  }
}
