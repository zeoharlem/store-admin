import { NextRequest, NextResponse } from 'next/server'

import { ApiError } from '@/shared/infrastructure/http/errors/api-errors'
import { createAuthenticatedServerAxios } from '@/shared/infrastructure/http/clients/authenticated-server-axios'

interface RouteContext {
  params: Promise<{
    orderId: string
  }>
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { orderId } = await params

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Order ID is required.'
        },
        { status: 400 }
      )
    }

    const api = createAuthenticatedServerAxios()

    const response = await api.get(
      `/admin/orders/${encodeURIComponent(orderId)}/payments`
    )

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

    console.error('Unexpected admin order payments error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unable to retrieve order payment details.'
        }
      },
      { status: 500 }
    )
  }
}
