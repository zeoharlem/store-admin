
import { NextResponse } from 'next/server'
import { ApiError } from '@/shared/infrastructure/http/errors/api-errors'
import { logoutSession } from '@/features/auth/infrastructure/session/logout-session'

export async function POST() {
  try {
    await logoutSession()

    return NextResponse.json({
      success: true,
      data: {
        message: 'You have been signed out successfully.'
      }
    })
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message
          }
        },
        { status: error.status >= 400 ? error.status : 500 }
      )
    }

    console.error('Logout error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'LOGOUT_FAILED',
          message: 'Unable to complete logout.'
        }
      },
      { status: 500 }
    )
  }
}
