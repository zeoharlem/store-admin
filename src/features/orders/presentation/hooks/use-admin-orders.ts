
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { GetAdminOrdersUseCase } from '@/features/orders/application/usecases/get-admin-orders.usecase'
import { OrderRepositoryImpl } from '@/features/orders/infrastructure/repositories/order.repository.impl'

import type { AdminOrdersResult } from '@/features/orders/domain/entities/order'
import type { AdminOrdersQueryDto } from '@/features/orders/application/dtos/admin-orders.dto'

const orderRepository = new OrderRepositoryImpl()
const getAdminOrdersUseCase = new GetAdminOrdersUseCase(orderRepository)

const DEFAULT_PER_PAGE = 20
const SEARCH_DEBOUNCE_MS = 350

interface UseAdminOrdersReturn {
  result: AdminOrdersResult | null
  loading: boolean
  error: string | null

  page: number
  perPage: number

  search: string
  status: string
  paymentStatus: string
  dateFrom: string
  dateTo: string

  setPage: (page: number) => void
  setPerPage: (perPage: number) => void
  setSearch: (search: string) => void
  setStatus: (status: string) => void
  setPaymentStatus: (paymentStatus: string) => void
  setDateFrom: (dateFrom: string) => void
  setDateTo: (dateTo: string) => void

  resetFilters: () => void
}

export function useAdminOrders(): UseAdminOrdersReturn {
  const [result, setResult] = useState<AdminOrdersResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [page, setPageState] = useState(1)
  const [perPage, setPerPageState] = useState(DEFAULT_PER_PAGE)

  const [search, setSearchState] = useState('')
  const [status, setStatusState] = useState('')
  const [paymentStatus, setPaymentStatusState] = useState('')
  const [dateFrom, setDateFromState] = useState('')
  const [dateTo, setDateToState] = useState('')

  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search input.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [search])

  // Build the backend query.
  const query = useMemo<AdminOrdersQueryDto>(() => ({
    page,
    per_page: perPage,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(status && { status }),
    ...(paymentStatus && { payment_status: paymentStatus }),
    ...(dateFrom && { date_from: dateFrom }),
    ...(dateTo && { date_to: dateTo })
  }), [
    page,
    perPage,
    debouncedSearch,
    status,
    paymentStatus,
    dateFrom,
    dateTo
  ])

  // Load orders whenever the query changes.
  useEffect(() => {
    const controller = new AbortController()

    async function loadOrders() {
      setLoading(true)
      setError(null)

      try {
        const response = await getAdminOrdersUseCase.execute(
          query,
          controller.signal
        )

        if (!controller.signal.aborted) {
          setResult(response)
        }
      } catch (err) {
        if (controller.signal.aborted) return

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load orders. Please try again.'
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadOrders()

    return () => controller.abort()
  }, [query])

  const setPage = useCallback((nextPage: number) => {
    setPageState(Math.max(1, nextPage))
  }, [])

  const setPerPage = useCallback((nextPerPage: number) => {
    if (!Number.isInteger(nextPerPage) || nextPerPage < 1) return

    setPerPageState(nextPerPage)
    setPageState(1)
  }, [])

  const setSearch = useCallback((value: string) => {
    setSearchState(value)
    setPageState(1)
  }, [])

  const setStatus = useCallback((value: string) => {
    setStatusState(value)
    setPageState(1)
  }, [])

  const setPaymentStatus = useCallback((value: string) => {
    setPaymentStatusState(value)
    setPageState(1)
  }, [])

  const setDateFrom = useCallback((value: string) => {
    setDateFromState(value)
    setPageState(1)
  }, [])

  const setDateTo = useCallback((value: string) => {
    setDateToState(value)
    setPageState(1)
  }, [])

  const resetFilters = useCallback(() => {
    setSearchState('')
    setDebouncedSearch('')
    setStatusState('')
    setPaymentStatusState('')
    setDateFromState('')
    setDateToState('')
    setPageState(1)
  }, [])

  return {
    result,
    loading,
    error,

    page,
    perPage,

    search,
    status,
    paymentStatus,
    dateFrom,
    dateTo,

    setPage,
    setPerPage,
    setSearch,
    setStatus,
    setPaymentStatus,
    setDateFrom,
    setDateTo,

    resetFilters
  }
}
