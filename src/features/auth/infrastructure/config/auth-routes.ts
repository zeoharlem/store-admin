export const AUTH_ROUTES = {
    login: '/pages/auth/login',
    defaultAuthenticated: '/dashboard/orders'
} as const

export const PROTECTED_ROUTE_PREFIXES = [
    '/dashboard',
    '/apps',
    '/orders',
    '/products',
    '/payments',
    '/disputes',
    '/settings'
] as const

export const AUTH_ONLY_ROUTES = [
    AUTH_ROUTES.login
] as const
