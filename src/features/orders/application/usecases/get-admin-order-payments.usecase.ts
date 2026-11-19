import type { AdminOrderPayment } from '../../domain/entities/admin-order-payment'
import type { AdminOrderPaymentRepository } from '../../domain/repositories/admin-order-payment.repository'

export class GetAdminOrderPaymentsUseCase {
  constructor(
    private readonly repository: AdminOrderPaymentRepository
  ) {}

  execute(
    orderId: string,
    signal?: AbortSignal
  ): Promise<AdminOrderPayment[]> {
    if (!orderId.trim()) {
      throw new Error('Order ID is required.')
    }

    return this.repository.getAdminOrderPayments(orderId, signal)
  }
}
