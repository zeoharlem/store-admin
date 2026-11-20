
'use client'

import { useCallback, useEffect, useState } from 'react'

import type { AdminOrderDetails } from '@/features/orders/domain/entities/order-details'
import { getAdminOrderDetailsUseCase } from '@/features/orders/application/usecases/get-admin-order-details.usecase'

interface OrderDetailsState {
  data: AdminOrderDetails | null
  isLoading: boolean
  error: string | null
}

const initialState: OrderDetailsState = {
  data: null,
  isLoading: true,
  error: null
}

export function useAdminOrderDetails(orderId: string) {
  const [state, setState] = useState<OrderDetailsState>(initialState)
  const [reloadKey, setReloadKey] = useState(0)

  const refetch = useCallback(() => {
    setReloadKey(current => current + 1)
  }, [])

  useEffect(() => {
    if (!orderId) return

    const controller = new AbortController()

    async function loadOrder() {
      try {
        const data = await getAdminOrderDetailsUseCase.execute(
          orderId,
          controller.signal
        )

        if (!controller.signal.aborted) {
          setState({
            data,
            isLoading: false,
            error: null
          })
        }
      } catch (error) {
        if (controller.signal.aborted) return

        const message =
          error instanceof Error
            ? error.message
            : 'Unable to load order details.'

        setState({
          data: null,
          isLoading: false,
          error: message
        })
      }
    }

    void loadOrder()

    return () => controller.abort()
  }, [orderId, reloadKey])

  if (!orderId) {
    return {
      data: null,
      isLoading: false,
      error: 'An order ID is required.',
      refetch
    }
  }

  return {
    ...state,
    refetch
  }
}
