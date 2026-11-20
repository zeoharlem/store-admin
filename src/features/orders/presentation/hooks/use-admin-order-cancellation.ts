
'use client'

import { useCallback, useState } from 'react'

import { CancelAdminOrderUseCase } from '@/features/orders/application/usecases/cancel-admin-order.usecase'
import { AdminOrderCancellationRepositoryImpl } from '@/features/orders/infrastructure/repositories/admin-order-cancellation.repository.impl'

const repository = new AdminOrderCancellationRepositoryImpl()
const cancelAdminOrderUseCase = new CancelAdminOrderUseCase(repository)

export function useAdminOrderCancellation() {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cancelOrder = useCallback(
    async (orderId: string, reason: string) => {
      setIsPending(true)
      setError(null)

      try {
        return await cancelAdminOrderUseCase.execute(orderId, reason)
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to cancel this order.'

        setError(message)
        throw error
      } finally {
        setIsPending(false)
      }
    },
    []
  )

  return {
    cancelOrder,
    isPending,
    error,
    clearError: () => setError(null)
  }
}
