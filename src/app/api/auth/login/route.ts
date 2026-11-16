import { NextRequest, NextResponse } from 'next/server'

import { LoginUseCase } from '@/features/auth/application/usecases/login.usecase'
import { AuthRepositoryImpl } from '@/features/auth/infrastructure/repositories/auth.repository.impl'
import { ApiError } from '@/shared/infrastructure/http/errors/api-errors'
import { setAuthCookies } from '@/features/auth/infrastructure/session/auth-cookies'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      email?: string
      password?: string
    }

    if (
      typeof body.email !== 'string' ||
      typeof body.password !== 'string' ||
      !body.email.trim() ||
      !body.password
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email and password are required.'
          }
        },
        { status: 422 }
      )
    }

    const repository = new AuthRepositoryImpl()
    const loginUseCase = new LoginUseCase(repository)

    const result = await loginUseCase.execute({
      email: body.email,
      password: body.password
    })

    await setAuthCookies({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn
    })

    return NextResponse.json({
      success: true,
      data: {
        user: result.user
      }
    })

  } catch (error) {
    if (error instanceof ApiError) {
      const status = error.status === 0
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

    console.error('Unexpected login error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred.'
        }
      },
      { status: 500 }
    )
  }
}
