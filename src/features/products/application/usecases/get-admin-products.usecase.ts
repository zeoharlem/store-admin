
import type { AdminProductsQueryDto } from '@/features/products/application/dtos/admin-products.dto'
import type { AdminProductsResult } from '@/features/products/domain/entities/product'
import type { ProductRepository } from '@/features/products/domain/repositories/product.repository'

export class GetAdminProductsUseCase {
  constructor(
    private readonly productRepository: ProductRepository
  ) {}

  async execute(
    query: AdminProductsQueryDto,
    signal?: AbortSignal
  ): Promise<AdminProductsResult> {
    return this.productRepository.getAdminProducts(query, signal)
  }
}
