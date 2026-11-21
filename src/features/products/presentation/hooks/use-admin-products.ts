
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { GetAdminProductsUseCase } from '@/features/products/application/usecases/get-admin-products.usecase'
import { ProductRepositoryImpl } from '@/features/products/infrastructure/repositories/product.repository.impl'

import type { AdminProductsResult } from '@/features/products/domain/entities/product'
import type { AdminProductsQueryDto } from '@/features/products/application/dtos/admin-products.dto'

const productRepository = new ProductRepositoryImpl()
const getAdminProductsUseCase = new GetAdminProductsUseCase(productRepository)

const DEFAULT_PER_PAGE = 20
const SEARCH_DEBOUNCE_MS = 350

interface UseAdminProductsReturn {
  result: AdminProductsResult | null
  loading: boolean
  error: string | null

  page: number
  perPage: number

  search: string
  status: string
  moderationStatus: string

  setPage: (page: number) => void
  setPerPage: (perPage: number) => void

  setSearch: (search: string) => void
  setStatus: (status: string) => void
  setModerationStatus: (status: string) => void

  resetFilters: () => void
  refetch: () => void
}

export function useAdminProducts(): UseAdminProductsReturn {
  const [result, setResult] = useState<AdminProductsResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [page, setPageState] = useState(1)
  const [perPage, setPerPageState] = useState(DEFAULT_PER_PAGE)

  const [search, setSearchState] = useState('')
  const [status, setStatusState] = useState('')
  const [moderationStatus, setModerationStatusState] = useState('')

  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // Debounce search input.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [search])

  // Build the backend query.
  const query = useMemo<AdminProductsQueryDto>(
    () => ({
      page,
      per_page: perPage,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(status && { status }),
      ...(moderationStatus && {
        moderation_status: moderationStatus
      })
    }),
    [page, perPage, debouncedSearch, status, moderationStatus]
  )

  // Load products whenever the query changes.
  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      setLoading(true)
      setError(null)

      try {
        const response = await getAdminProductsUseCase.execute(
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
            : 'Unable to load products. Please try again.'
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadProducts()

    return () => controller.abort()
  }, [query, reloadKey])

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

  const setModerationStatus = useCallback((value: string) => {
    setModerationStatusState(value)
    setPageState(1)
  }, [])

  const resetFilters = useCallback(() => {
    setSearchState('')
    setDebouncedSearch('')
    setStatusState('')
    setModerationStatusState('')
    setPageState(1)
  }, [])

  const refetch = useCallback(() => {
    setReloadKey(current => current + 1)
  }, [])

  return {
    result,
    loading,
    error,

    page,
    perPage,

    search,
    status,
    moderationStatus,

    setPage,
    setPerPage,

    setSearch,
    setStatus,
    setModerationStatus,

    resetFilters,
    refetch
  }
}
