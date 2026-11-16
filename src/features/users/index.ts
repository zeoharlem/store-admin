import { getUsers as loadUsers } from '@/features/users/application/user-data-service'
import { InMemoryUserRepository } from '@/features/users/infrastructure/in-memory-user-repository'

const userRepository = new InMemoryUserRepository()

export const getUsers = () => loadUsers(userRepository)
