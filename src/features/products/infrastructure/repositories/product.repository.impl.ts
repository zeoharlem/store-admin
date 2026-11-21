

import type { AdminProductsQueryDto } from '@/features/products/application/dtos/admin-products.dto'
import type { AdminProductsResult } from '@/features/products/domain/entities/product'
import type { ProductRepository } from '@/features/products/domain/repositories/product.repository'
import { browserAxios } from '@/shared/infrastructure/http/clients/browser-axios'

export class ProductRepositoryImpl implements ProductRepository {
  async getAdminProducts(
    query: AdminProductsQueryDto,
    signal?: AbortSignal
  ): Promise<AdminProductsResult> {
    const response = await browserAxios.get('/api/admin/products', {
      params: query,
      signal
    })

    return response.data.data as AdminProductsResult
  }
}
