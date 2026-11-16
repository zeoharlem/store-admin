import type { AppUser, UserFormData, UserStatus } from '@/features/users/domain'

export const getUserStats = (users: AppUser[]) => ({
  totalUsers: users.length,
  activeUsers: users.filter(user => user.status === 'Active').length,
  pendingUsers: users.filter(user => user.status === 'Pending').length,
  paidUsers: users.filter(user => user.plan !== 'Basic').length
})

export const addUser = (users: AppUser[], data: UserFormData): AppUser[] => [
  ...users,
  {
    id: crypto.randomUUID(),
    name: data.name.trim(),
    email: data.email.trim(),
    role: data.role,
    plan: data.plan,
    status: data.status,
    billing: 'Manual',
    company: data.company?.trim() || undefined,
    country: data.country?.trim() || undefined,
    contact: data.contact?.trim() || undefined,
    joinedDate: new Date().toISOString()
  }
]

export const updateUser = (users: AppUser[], id: string, data: Partial<UserFormData>): AppUser[] =>
  users.map(user =>
    user.id === id
      ? {
          ...user,
          ...data,
          name: data.name?.trim() ?? user.name,
          email: data.email?.trim() ?? user.email,
          company: data.company?.trim() ?? user.company,
          country: data.country?.trim() ?? user.country,
          contact: data.contact?.trim() ?? user.contact
        }
      : user
  )

export const deleteUsers = (users: AppUser[], ids: string[]): AppUser[] => {
  const idsToDelete = new Set(ids)

  return users.filter(user => !idsToDelete.has(user.id))
}

export const setUserStatus = (users: AppUser[], id: string, status: UserStatus): AppUser[] =>
  users.map(user => (user.id === id ? { ...user, status } : user))

export const setUsersStatus = (users: AppUser[], ids: string[], status: UserStatus): AppUser[] => {
  const idsToUpdate = new Set(ids)

  return users.map(user => (idsToUpdate.has(user.id) ? { ...user, status } : user))
}
