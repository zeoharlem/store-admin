
import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'

import { ApiError } from '@/shared/infrastructure/http/errors/api-errors'
import { createAuthenticatedServerAxios } from '@/shared/infrastructure/http/clients/authenticated-server-axios'

const ORDER_QUERY_PARAMS = [
    'page',
    'per_page',
    'search',
    'status',
    'payment_status',
    'date_from',
    'date_to'
] as const

export async function GET(request: NextRequest) {
    console.log('[ADMIN ORDERS] BFF route reached');

    try {
        const params: Record<string, string> = {}

        for (const key of ORDER_QUERY_PARAMS) {
            const value = request.nextUrl.searchParams.get(key)

            if (value !== null && value.trim() !== '') {
                params[key] = value.trim()
            }
        }

        const api = createAuthenticatedServerAxios()
        const response = await api.get('/admin/orders', { params });

        return NextResponse.json(response.data, {
            status: response.status
        })
    } catch (error) {
        if (error instanceof ApiError) {
            const status = error.status === 0 ? 503 : error.status >= 400 && error.status < 500 ? error.status : 502

            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: error.code,
                        message: error.message,
                        ...(error.details !== undefined && {
                            details: error.details
                        })
                    }
                },
                { status }
            )
        }

        console.error('Unexpected admin orders error:', error)

        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Unable to retrieve orders at this time.'
                }
            },
            { status: 500 }
        )
    }
}
