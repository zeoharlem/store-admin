
export interface ApiErrorPayload {
    code: string
    message: string
    details?: unknown
}

export interface ApiMeta {
    page?: number
    per_page?: number
    total?: number
    total_pages?: number
    [key: string]: unknown
}

export type ApiResponse<T> =
    | {
        success: true
        data: T
        meta?: ApiMeta
    }
    | {
        success: false
        error: ApiErrorPayload
    }
