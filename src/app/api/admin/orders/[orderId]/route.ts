import { NextRequest, NextResponse } from 'next/server'

import { createAuthenticatedServerAxios } from '@/shared/infrastructure/http/clients/authenticated-server-axios'
import { normalizeAxiosError } from '@/shared/infrastructure/http/interceptors/error.interceptor'

interface RouteContext {
  params: Promise<{ orderId: string }>
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
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
    const response = await api.get(`/admin/orders/${encodeURIComponent(orderId)}`)

    return NextResponse.json(response.data, {
      status: response.status
    })
  } catch (error) {
    const normalizedError = normalizeAxiosError(error)

    return NextResponse.json(normalizedError, {
      status: normalizedError.status ?? 500
    })
  }
}
