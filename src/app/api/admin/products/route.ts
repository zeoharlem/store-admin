
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { ApiError } from '@/shared/infrastructure/http/errors/api-errors'
import { createAuthenticatedServerAxios } from '@/shared/infrastructure/http/clients/authenticated-server-axios'

const PRODUCT_QUERY_PARAMS = [
  'page',
  'per_page',
  'search',
  'status',
  'moderation_status'
] as const

export async function GET(request: NextRequest) {
  try {
    const params: Record<string, string> = {}

    for (const key of PRODUCT_QUERY_PARAMS) {
      const value = request.nextUrl.searchParams.get(key)

      if (value !== null && value.trim() !== '') {
        params[key] = value.trim()
      }
    }

    const api = createAuthenticatedServerAxios()
    const response = await api.get('/admin/products', { params })

    return NextResponse.json(response.data, {
      status: response.status
    })
  } catch (error) {
    if (error instanceof ApiError) {
      const status =
        error.status === 0
          ? 503
          : error.status >= 400 && error.status < 500
            ? error.status
            : 502

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

    console.error('Unexpected admin products error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unable to retrieve products at this time.'
        }
      },
      { status: 500 }
    )
  }
}
