import { browserAxios } from '@/shared/infrastructure/http/clients/browser-axios'

import type { AdminOrderPayment } from '../../domain/entities/admin-order-payment'
import type { AdminOrderPaymentRepository } from '../../domain/repositories/admin-order-payment.repository'

interface AdminOrderPaymentsResponse {
  success: boolean
  data: {
    payments: AdminOrderPayment[]
  }
}

export class AdminOrderPaymentRepositoryImpl
  implements AdminOrderPaymentRepository
{
  async getAdminOrderPayments(
    orderId: string,
    signal?: AbortSignal
  ): Promise<AdminOrderPayment[]> {
    const response = await browserAxios.get<AdminOrderPaymentsResponse>(
      `/api/admin/orders/${encodeURIComponent(orderId)}/payments`,
      { signal }
    )

    return response.data.data.payments ?? []
  }
}
