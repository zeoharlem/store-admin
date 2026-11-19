
import type { AdminOrdersResult } from '@/features/orders/domain/entities/order'
import type { AdminOrdersQueryDto } from '@/features/orders/application/dtos/admin-orders.dto'
import type{ AdminOrderDetails } from '@/features/orders/domain/entities/order-details'

export interface OrderRepository {
  getAdminOrders(
    query: AdminOrdersQueryDto,
    signal?: AbortSignal
  ): Promise<AdminOrdersResult>

  getAdminOrderDetails(
    orderId: string,
    signal?: AbortSignal
  ): Promise<AdminOrderDetails>
}
