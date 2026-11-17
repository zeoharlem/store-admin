
import { NextRequest, NextResponse } from 'next/server'

import {
    ACCESS_COOKIE,
    REFRESH_COOKIE
} from '@/features/auth/infrastructure/session/auth-cookie-names'

import {
    AUTH_ROUTES,
    AUTH_ONLY_ROUTES,
    PROTECTED_ROUTE_PREFIXES
} from '@/features/auth/infrastructure/config/auth-routes'

function isProtectedRoute(pathname: string): boolean {
    return PROTECTED_ROUTE_PREFIXES.some(
        prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
}

function isAuthOnlyRoute(pathname: string): boolean {
    return AUTH_ONLY_ROUTES.some(
        route => pathname === route || pathname.startsWith(`${route}/`)
    )
}

function getSafeReturnUrl(
    pathname: string,
    search: string
): string {
    // Only preserve an application-relative path.
    if (!pathname.startsWith('/') || pathname.startsWith('//')) {
        return AUTH_ROUTES.defaultAuthenticated
    }

    return `${pathname}${search}`
}

export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl

    const accessToken = request.cookies.get(ACCESS_COOKIE)?.value
    const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value

    const hasSession =
        Boolean(accessToken || refreshToken)

    // Redirect unauthenticated visitors away from protected modules.
    if (isProtectedRoute(pathname) && !hasSession) {
        const loginUrl = new URL(AUTH_ROUTES.login, request.url)

        loginUrl.searchParams.set('next',getSafeReturnUrl(pathname, search))

        return NextResponse.redirect(loginUrl)
    }

    // An authenticated visitor should not see the login page.
    if (isAuthOnlyRoute(pathname) && hasSession) {
        return NextResponse.redirect(
            new URL(AUTH_ROUTES.defaultAuthenticated, request.url)
        )
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/apps/:path*',
        '/pages/auth/login/:path*'
    ]
}
