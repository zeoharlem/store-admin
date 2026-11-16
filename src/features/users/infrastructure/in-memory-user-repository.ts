import type { AppUser } from '@/features/users/domain'
import type { UserRepository } from '@/features/users/domain/repositories/user-repository'
import { users as seedUsers } from '@/fake-db/apps/users'

export class InMemoryUserRepository implements UserRepository {
  constructor(private readonly database: AppUser[] = seedUsers) {}

  findAll(): AppUser[] {
    return [...this.database]
  }
}
