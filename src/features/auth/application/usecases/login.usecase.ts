import type { AuthRepository, LoginResult } from '../../domain/repositories/auth.repository'
import type { LoginDto } from '../dtos/login.dto'

export class LoginUseCase {
    constructor(
        private readonly authRepository: AuthRepository
    ) { }

    async execute(input: LoginDto): Promise<LoginResult> {
        return this.authRepository.login(
            {
                email: input.email.trim(),
                password: input.password
            }
        )
    }
}
