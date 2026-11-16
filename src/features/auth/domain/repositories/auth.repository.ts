import { AuthUser } from "../entities/auth-user"

export interface LoginCredentials {
    email: string
    password: string
}

export interface LoginResult {
    accessToken: string
    tokenType: string
    expiresIn: number
    refreshToken: string
    user: AuthUser
}

export interface AuthRepository {
    login(credentials: LoginCredentials): Promise<LoginResult>
}
