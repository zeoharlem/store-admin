
import type { AdminOrdersResult } from '@/features/orders/domain/entities/order'
import type { AdminOrdersQueryDto } from '@/features/orders/application/dtos/admin-orders.dto'

export interface OrderRepository {
  getAdminOrders(
    query: AdminOrdersQueryDto,
    signal?: AbortSignal
  ): Promise<AdminOrdersResult>
}
