
import type { AdminProductsQueryDto } from '@/features/products/application/dtos/admin-products.dto'

import type { AdminProductsResult } from '@/features/products/domain/entities/product'

export interface ProductRepository {
  getAdminProducts(
    query: AdminProductsQueryDto,
    signal?: AbortSignal
  ): Promise<AdminProductsResult>
}
