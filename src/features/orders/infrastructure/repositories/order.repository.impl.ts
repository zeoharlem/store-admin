import type { AdminOrdersQueryDto } from '@/features/orders/application/dtos/admin-orders.dto'

import type { AdminOrdersResult } from '@/features/orders/domain/entities/order'

import type { OrderRepository } from '@/features/orders/domain/repositories/order.repository'
import { browserAxios } from '@/shared/infrastructure/http/clients/browser-axios'


export class OrderRepositoryImpl implements OrderRepository {
  async getAdminOrders(query: AdminOrdersQueryDto,signal?: AbortSignal): Promise<AdminOrdersResult> {
    const response = await browserAxios.get('/api/admin/orders', {
      params: query,
      signal
    })

    return response.data.data as AdminOrdersResult
  }
}
