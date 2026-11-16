
import 'server-only'

import { cookies } from 'next/headers'

const ACCESS_COOKIE = 'vendor_access_token'
const REFRESH_COOKIE = 'vendor_refresh_token'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/'
}

export async function setAuthCookies(
  tokens: AuthTokens
): Promise<void> {
  if (
    !tokens.accessToken ||
    !tokens.refreshToken ||
    !Number.isFinite(tokens.expiresIn) ||
    tokens.expiresIn <= 0
  ) {
    throw new Error('Invalid authentication tokens.')
  }

  const cookieStore = await cookies()

  cookieStore.set(ACCESS_COOKIE, tokens.accessToken, {
    ...cookieOptions,
    maxAge: tokens.expiresIn
  })

  // Session cookie. Set maxAge when the backend exposes
  // the refresh-token expiration.
  cookieStore.set(REFRESH_COOKIE, tokens.refreshToken, {
    ...cookieOptions
  })
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.set(ACCESS_COOKIE, '', {
    ...cookieOptions,
    maxAge: 0
  })

  cookieStore.set(REFRESH_COOKIE, '', {
    ...cookieOptions,
    maxAge: 0
  })
}

export async function getAuthTokens(): Promise<{
  accessToken: string | undefined
  refreshToken: string | undefined
}> {
  const cookieStore = await cookies()

  return {
    accessToken: cookieStore.get(ACCESS_COOKIE)?.value,
    refreshToken: cookieStore.get(REFRESH_COOKIE)?.value
  }
}
