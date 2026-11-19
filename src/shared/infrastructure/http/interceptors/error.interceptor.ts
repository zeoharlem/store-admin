import axios, { type AxiosError } from 'axios'

import type { ApiErrorPayload } from '../types/api-reponses'
import { ApiError } from '../errors/api-errors'

interface ErrorResponse {
  success?: boolean
  error?: ApiErrorPayload
}

export function normalizeAxiosError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (!axios.isAxiosError<ErrorResponse>(error)) {
    return new ApiError('An unexpected error occurred.', 500, 'INTERNAL_SERVER_ERROR')
  }

  const axiosError = error as AxiosError<ErrorResponse>
  const status = axiosError.response?.status ?? 0
  const payload = axiosError.response?.data

  if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
    return new ApiError('The request timed out. Please try again.', 408, 'REQUEST_TIMEOUT')
  }

  if (!axiosError.response) {
    return new ApiError('Unable to connect to the server. Please check your connection.', 0, 'NETWORK_ERROR')
  }

  if (payload?.error?.message && payload.error.code) {
    return new ApiError(payload.error.message, status, payload.error.code, payload.error.details)
  }

  return new ApiError(
    status >= 500 ? 'An unexpected server error occurred.' : 'The request could not be completed.',
    status,
    'HTTP_ERROR'
  )
}
