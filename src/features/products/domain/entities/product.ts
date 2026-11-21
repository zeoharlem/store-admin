
export interface ProductPrimaryImage {
  id: string
  url: string
  alt_text: string | null
}

export interface Product {
  id: string
  store_id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  status: string
  moderation_status: string
  published_at: string | null
  created_at: string
  updated_at: string
  primary_image: ProductPrimaryImage | null
}

export interface AdminProductsPagination {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface AdminProductsResult {
  items: Product[]
  pagination: AdminProductsPagination
}
