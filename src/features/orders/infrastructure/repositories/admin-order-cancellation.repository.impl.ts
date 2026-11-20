
import axios from 'axios'

import type { AdminOrderDetails } from '@/features/orders/domain/entities/order-details'
import type { AdminOrderCancellationRepository } from '@/features/orders/domain/repositories/admin-order-cancellation.repository'
import { browserAxios } from '@/shared/infrastructure/http/clients/browser-axios'

interface CancelAdminOrderResponse {
  success: boolean
  data: AdminOrderDetails
  message?: string
}

export class AdminOrderCancellationRepositoryImpl
  implements AdminOrderCancellationRepository
{
  async cancelAdminOrder(
    orderId: string,
    reason: string
  ): Promise<AdminOrderDetails> {
    try {
      const response = await browserAxios.post<CancelAdminOrderResponse>(
        `/api/admin/orders/${encodeURIComponent(orderId)}/cancel`,
        { reason }
      )

      return response.data.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as
          | { message?: string }
          | undefined

        throw new Error(
          responseData?.message ?? 'Unable to cancel this order.'
        )
      }

      throw error instanceof Error
        ? error
        : new Error('Unable to cancel this order.')
    }
  }
}
