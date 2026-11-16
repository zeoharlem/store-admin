'use client'

// React Imports
import { useCallback, useMemo, useState } from 'react'

// Type Imports
import type { AppUser, UserFilters, UserFormData, UserSheetMode, UserSorting, UserStatus } from '@/features/users/domain'

// Data Imports
import { buildUserListState, DEFAULT_USER_FILTERS } from '@/features/users/application/user-list-service'
import { addUser, deleteUsers, getUserStats, setUserStatus, setUsersStatus, updateUser } from '@/features/users/application/user-management-service'
import { getUsers } from '@/features/users'

const DEFAULT_ROWS_PER_PAGE = 10
const DEFAULT_CURRENT_PAGE = 1

const removeIdsFromSelection = (selectedUserIds: string[], ids: string[]): string[] => {
  const idSet = new Set(ids)

  return selectedUserIds.filter(id => !idSet.has(id))
}

export function useUserApp() {
  const [users, setUsers] = useState<AppUser[]>(getUsers)
  const [filters, setFiltersState] = useState<UserFilters>(DEFAULT_USER_FILTERS)
  const [rowsPerPage, setRowsPerPageState] = useState(DEFAULT_ROWS_PER_PAGE)
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE)
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [sorting, setSorting] = useState<UserSorting | null>(null)
  const [sheetMode, setSheetMode] = useState<UserSheetMode | null>(null)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)

  const stats = useMemo(() => getUserStats(users), [users])

  const userList = useMemo(
    () =>
      buildUserListState({
        users,
        filters,
        sorting,
        currentPage,
        rowsPerPage
      }),
    [currentPage, filters, rowsPerPage, sorting, users]
  )

  const {
    filteredUsers,
    sortedUsers,
    paginatedUsers,
    totalPages,
    totalFilteredCount,
    showingFrom,
    showingTo
  } = userList

  const editingUser = useMemo(() => users.find(user => user.id === editingUserId) ?? null, [editingUserId, users])

  const paginatedUserIds = useMemo(() => paginatedUsers.map(user => user.id), [paginatedUsers])

  const isAllSelected = paginatedUsers.length > 0 && paginatedUserIds.every(id => selectedUserIds.includes(id))

  const isIndeterminate = paginatedUserIds.some(id => selectedUserIds.includes(id)) && !isAllSelected

  // Vars
  // Converts string[] → Record<string, boolean> for TanStack controlled selection
  const rowSelection = Object.fromEntries(selectedUserIds.map(id => [id, true]))

  const handleFilterChange = useCallback((nextFilters: Partial<UserFilters>) => {
    setFiltersState(prev => ({ ...prev, ...nextFilters }))
    setCurrentPage(DEFAULT_CURRENT_PAGE)
  }, [])

  const handleSearchChange = useCallback((search: string) => {
    setFiltersState(prev => ({ ...prev, search }))
    setCurrentPage(DEFAULT_CURRENT_PAGE)
  }, [])

  const handleRowsPerPageChange = useCallback((n: number) => {
    setRowsPerPageState(n)
    setCurrentPage(DEFAULT_CURRENT_PAGE)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleSortingChange = useCallback((nextSorting: UserSorting | null) => {
    setSorting(nextSorting)
    setCurrentPage(DEFAULT_CURRENT_PAGE)
  }, [])

  const handleSelectUser = useCallback((id: string) => {
    setSelectedUserIds(prev => (prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]))
  }, [])

  const handleSelectAll = useCallback((userIds: string[]) => {
    setSelectedUserIds(prev => {
      const allSelected = userIds.length > 0 && userIds.every(id => prev.includes(id))

      if (allSelected) {
        return removeIdsFromSelection(prev, userIds)
      }

      return [...new Set([...prev, ...userIds])]
    })
  }, [])

  const handleClearSelection = useCallback(() => {
    setSelectedUserIds([])
  }, [])

  const handleAddUser = useCallback((data: UserFormData) => {
    setUsers(prev => addUser(prev, data))
    setSheetMode(null)
    setEditingUserId(null)
  }, [])

  const handleUpdateUser = useCallback((id: string, data: Partial<UserFormData>) => {
    setUsers(prev => updateUser(prev, id, data))
    setSheetMode(null)
    setEditingUserId(null)
  }, [])

  const handleDeleteUser = useCallback((id: string) => {
    setUsers(prev => deleteUsers(prev, [id]))
    setSelectedUserIds(prev => removeIdsFromSelection(prev, [id]))
  }, [])

  const handleBulkDelete = useCallback(() => {
    setUsers(prev => deleteUsers(prev, selectedUserIds))
    setSelectedUserIds(prev => removeIdsFromSelection(prev, selectedUserIds))
  }, [selectedUserIds])

  const handleUpdateStatus = useCallback((id: string, status: UserStatus) => {
    setUsers(prev => setUserStatus(prev, id, status))
  }, [])

  const handleBulkUpdateStatus = useCallback(
    (status: UserStatus) => {
      setUsers(prev => setUsersStatus(prev, selectedUserIds, status))
    },
    [selectedUserIds]
  )

  const handleOpenAddSheet = useCallback(() => {
    setSheetMode('add')
    setEditingUserId(null)
  }, [])

  const handleOpenEditSheet = useCallback((userId: string) => {
    setSheetMode('edit')
    setEditingUserId(userId)
  }, [])

  const handleCloseSheet = useCallback(() => {
    setSheetMode(null)
    setEditingUserId(null)
  }, [])

  return {
    users,
    stats,
    filters,
    paginatedUsers,
    filteredUsers,
    sortedUsers,
    totalPages,
    totalFilteredCount,
    showingFrom,
    showingTo,
    rowsPerPage,
    currentPage,
    selectedUserIds,
    isAllSelected,
    isIndeterminate,
    rowSelection,
    sorting,
    sheetMode,
    editingUser,
    handleFilterChange,
    handleSearchChange,
    handleRowsPerPageChange,
    handlePageChange,
    handleSortingChange,
    handleSelectUser,
    handleSelectAll,
    handleClearSelection,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
    handleBulkDelete,
    handleUpdateStatus,
    handleBulkUpdateStatus,
    handleOpenAddSheet,
    handleOpenEditSheet,
    handleCloseSheet
  }
}
