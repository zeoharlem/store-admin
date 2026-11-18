
import type { AdminOrdersResult } from '@/features/orders/domain/entities/order'

import type { OrderRepository } from '@/features/orders/domain/repositories/order.repository'
import type { AdminOrdersQueryDto } from '@/features/orders/application/dtos/admin-orders.dto'

export class GetAdminOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(
    query: AdminOrdersQueryDto,
    signal?: AbortSignal
  ): Promise<AdminOrdersResult> {
    return this.orderRepository.getAdminOrders(query, signal)
  }
}
