
import type { AdminOrderDetails } from '@/features/orders/domain/entities/order-details'

export interface AdminOrderCancellationRepository {
  cancelAdminOrder(
    orderId: string,
    reason: string
  ): Promise<AdminOrderDetails>
}
