'use client'

import { useCallback, useEffect, useState } from 'react'

import type { AdminOrderPayment } from '../../domain/entities/admin-order-payment'
import { AdminOrderPaymentRepositoryImpl } from '../../infrastructure/repositories/admin-order-payment.repository.impl'
import { GetAdminOrderPaymentsUseCase } from '../../application/usecases/get-admin-order-payments.usecase'

const repository = new AdminOrderPaymentRepositoryImpl()
const getAdminOrderPayments = new GetAdminOrderPaymentsUseCase(repository)

interface UseAdminOrderPaymentsReturn {
  payments: AdminOrderPayment[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useAdminOrderPayments(
  orderId: string
): UseAdminOrderPaymentsReturn {
  const [payments, setPayments] = useState<AdminOrderPayment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPayments = useCallback(
    async (signal?: AbortSignal) => {
      if (!orderId) {
        setPayments([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await getAdminOrderPayments.execute(orderId, signal)

        if (!signal?.aborted) {
          setPayments(result)
        }
      } catch (err) {
        if (!signal?.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to retrieve payment information.'
          )
        }
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false)
        }
      }
    },
    [orderId]
  )

  useEffect(() => {
    const controller = new AbortController()

    void loadPayments(controller.signal)

    return () => controller.abort()
  }, [loadPayments])

  const refetch = useCallback(
    () => loadPayments(),
    [loadPayments]
  )

  return {
    payments,
    isLoading,
    error,
    refetch
  }
}
