import type { AdminOrderPayment } from '../entities/admin-order-payment'

export interface AdminOrderPaymentRepository {
  getAdminOrderPayments(
    orderId: string,
    signal?: AbortSignal
  ): Promise<AdminOrderPayment[]>
}
