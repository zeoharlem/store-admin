'use client'

import { useEffect, useState } from 'react'

import type { AdminOrderDetails } from '@/features/orders/domain/entities/order-details'
import { getAdminOrderDetailsUseCase } from '@/features/orders/application/usecases/get-admin-order-details.usecase'

interface OrderDetailsState {
  data: AdminOrderDetails | null
  isLoading: boolean
  error: string | null
}

export function useAdminOrderDetails(orderId: string) {
  const [state, setState] = useState<OrderDetailsState>({
    data: null,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    if (!orderId) {
      setState({
        data: null,
        isLoading: false,
        error: 'An order ID is required.'
      })

      return
    }

    const controller = new AbortController()

    async function loadOrder() {
      setState({
        data: null,
        isLoading: true,
        error: null
      })

      try {
        const data = await getAdminOrderDetailsUseCase.execute(orderId, controller.signal)

        if (!controller.signal.aborted) {
          setState({
            data,
            isLoading: false,
            error: null
          })
        }
      } catch (error) {
        if (controller.signal.aborted) return

        const message = error instanceof Error ? error.message : 'Unable to load order details.'

        setState({
          data: null,
          isLoading: false,
          error: message
        })
      }
    }

    void loadOrder()

    return () => controller.abort()
  }, [orderId])

  return state
}
