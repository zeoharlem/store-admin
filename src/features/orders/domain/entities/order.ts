
export interface OrderCustomer {
  id: string
  email: string
  phone: string | null
  first_name: string | null
  last_name: string | null
}

export interface AdminOrder {
  id: string
  order_number: string
  status: string
  payment_status: string
  currency: string

  subtotal_minor: number
  shipping_minor: number
  tax_minor: number
  discount_minor: number
  total_minor: number

  paid_at: string | null
  created_at: string
  updated_at: string

  customer: OrderCustomer

  vendor_order_count: number
  vendor_order_statuses: Record<string, number>
  item_count: number
}

export interface OrdersPagination {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface AdminOrdersResult {
  items: AdminOrder[]
  pagination: OrdersPagination
}
