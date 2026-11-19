

import { ApiError } from '../errors/api-errors'
import type { ApiResponse } from '../types/api-reponses'

export function unwrapResponse<T>(response: ApiResponse<T>, status = 200): T {
    if (!response.success) {
        throw new ApiError(
            response.error.message,
            status >= 400 ? status : 400,
            response.error.code,
            response.error.details
        )
    }

    return response.data
}
