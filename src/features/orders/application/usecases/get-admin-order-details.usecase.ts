import type { OrderRepository } from '@/features/orders/domain/repositories/order.repository'
import { OrderRepositoryImpl } from '@/features/orders/infrastructure/repositories/order.repository.impl'

export class GetAdminOrderDetailsUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  execute(orderId: string, signal?: AbortSignal) {
    return this.orderRepository.getAdminOrderDetails(orderId, signal)
  }
}

const orderRepository = new OrderRepositoryImpl()

export const getAdminOrderDetailsUseCase = new GetAdminOrderDetailsUseCase(orderRepository)
