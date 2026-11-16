import type { AppUser } from '@/features/users/domain'

export interface UserRepository {
  findAll(): AppUser[]
}
