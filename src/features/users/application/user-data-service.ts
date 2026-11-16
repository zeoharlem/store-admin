import type { AppUser } from '@/features/users/domain'
import type { UserRepository } from '@/features/users/domain/repositories/user-repository'

export const getUsers = (repository: UserRepository): AppUser[] => repository.findAll()
