import type { AppUser, UserFilters, UserSorting } from '@/features/users/domain'

export const DEFAULT_USER_FILTERS: UserFilters = {
  role: 'all',
  plan: 'all',
  status: 'all',
  search: ''
}

export const filterUsers = (users: AppUser[], filters: UserFilters): AppUser[] => {
  const normalizedSearch = filters.search.trim().toLowerCase()

  return users.filter(user => {
    if (filters.role !== 'all' && user.role !== filters.role) {
      return false
    }

    if (filters.plan !== 'all' && user.plan !== filters.plan) {
      return false
    }

    if (filters.status !== 'all' && user.status !== filters.status) {
      return false
    }

    if (normalizedSearch) {
      const matchesName = user.name.toLowerCase().includes(normalizedSearch)
      const matchesEmail = user.email.toLowerCase().includes(normalizedSearch)

      if (!matchesName && !matchesEmail) {
        return false
      }
    }

    return true
  })
}

const compareUsers = (a: AppUser, b: AppUser, column: UserSorting['id']): number => {
  switch (column) {
    case 'user':
      return a.name.localeCompare(b.name)
    case 'role':
      return a.role.localeCompare(b.role)
    case 'plan':
      return a.plan.localeCompare(b.plan)
    case 'billing':
      return a.billing.localeCompare(b.billing)
    case 'status':
      return a.status.localeCompare(b.status)
    case 'joinedDate':
      return new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime()
    default:
      return 0
  }
}

export const sortUsers = (users: AppUser[], sorting: UserSorting | null): AppUser[] => {
  if (!sorting) {
    return users
  }

  return [...users].sort((a, b) => {
    const comparison = compareUsers(a, b, sorting.id)

    return sorting.desc ? -comparison : comparison
  })
}

export const paginateUsers = (
  users: AppUser[],
  currentPage: number,
  rowsPerPage: number
): { paginatedUsers: AppUser[]; totalPages: number; showingFrom: number; showingTo: number } => {
  const totalPages = Math.max(1, Math.ceil(users.length / rowsPerPage))
  const safePage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safePage - 1) * rowsPerPage

  const paginatedUsers = users.slice(startIndex, startIndex + rowsPerPage)

  return {
    paginatedUsers,
    totalPages,
    showingFrom: users.length === 0 ? 0 : (safePage - 1) * rowsPerPage + 1,
    showingTo: Math.min(safePage * rowsPerPage, users.length)
  }
}

export const buildUserListState = ({
  users,
  filters,
  sorting,
  currentPage,
  rowsPerPage
}: {
  users: AppUser[]
  filters: UserFilters
  sorting: UserSorting | null
  currentPage: number
  rowsPerPage: number
}) => {
  const filteredUsers = filterUsers(users, filters)
  const sortedUsers = sortUsers(filteredUsers, sorting)
  const { paginatedUsers, totalPages, showingFrom, showingTo } = paginateUsers(sortedUsers, currentPage, rowsPerPage)

  return {
    filteredUsers,
    sortedUsers,
    paginatedUsers,
    totalPages,
    totalFilteredCount: sortedUsers.length,
    showingFrom,
    showingTo
  }
}
