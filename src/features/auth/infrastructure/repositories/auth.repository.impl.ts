
import type {
    AuthRepository,
    LoginCredentials,
    LoginResult
} from '../../domain/repositories/auth.repository'

import { serverAxios } from '@/shared/infrastructure/http/clients/server-axios'
import { ApiResponse } from '@/shared/infrastructure/http/types/api-reponses'
import { unwrapResponse } from '@/shared/infrastructure/http/utils/unwrap-response'

interface VendorLoginData {
    access_token: string
    token_type: string
    expires_in: number
    refresh_token: string
    user: {
        id: string
        email: string
        first_name: string
        last_name: string
        status: string
    }
}

export class AuthRepositoryImpl implements AuthRepository {
    async login(credentials: LoginCredentials): Promise<LoginResult> {
        const response = await serverAxios.post<ApiResponse<VendorLoginData>>('/auth/login', credentials)

        const data = unwrapResponse(response.data, response.status)

        return {
            accessToken: data.access_token,
            tokenType: data.token_type,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            user: data.user
        }
    }
}
