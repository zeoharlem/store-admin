
import type { AdminOrderDetails } from '@/features/orders/domain/entities/order-details'
import type { AdminOrderCancellationRepository } from '@/features/orders/domain/repositories/admin-order-cancellation.repository'

export class CancelAdminOrderUseCase {
  constructor(private readonly repository: AdminOrderCancellationRepository) {}

  async execute(
    orderId: string,
    reason: string
  ): Promise<AdminOrderDetails> {
    const normalizedOrderId = orderId.trim()
    const normalizedReason = reason.trim()

    if (!normalizedOrderId) {
      throw new Error('An order ID is required.')
    }

    if (!normalizedReason) {
      throw new Error('Please provide a reason for cancellation.')
    }

    if (normalizedReason.length > 1000) {
      throw new Error('The cancellation reason cannot exceed 1000 characters.')
    }

    return this.repository.cancelAdminOrder(normalizedOrderId, normalizedReason)
  }
}
