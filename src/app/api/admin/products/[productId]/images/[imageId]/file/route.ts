
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { ApiError } from '@/shared/infrastructure/http/errors/api-errors'
import { createAuthenticatedServerAxios } from '@/shared/infrastructure/http/clients/authenticated-server-axios'

export const runtime = 'nodejs'

interface RouteContext {
  params: Promise<{
    productId: string
    imageId: string
  }>
}

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif'
])

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { productId, imageId } = await params

    if (!productId || !imageId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_IMAGE_REQUEST',
            message: 'Product ID and image ID are required.'
          }
        },
        { status: 400 }
      )
    }

    const api = createAuthenticatedServerAxios()

    const response = await api.get<ArrayBuffer>(
      `/products/${encodeURIComponent(productId)}/images/${encodeURIComponent(imageId)}/file`,
      {
        responseType: 'arraybuffer'
      }
    )

    const image = Buffer.from(response.data)

    const contentType = String(
      response.headers['content-type'] ?? ''
    )
      .split(';')[0]
      .trim()
      .toLowerCase()

    if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_IMAGE_CONTENT_TYPE',
            message: 'The requested resource is not a supported image.'
          }
        },
        { status: 502 }
      )
    }

    return new NextResponse(new Uint8Array(image), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(image.length),
        'Content-Disposition': 'inline',
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff'
      }
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

    console.error('Unexpected product image error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unable to retrieve product image.'
        }
      },
      { status: 500 }
    )
  }
}
