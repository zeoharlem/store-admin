
export interface OrderDetailsCustomer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
}

export type OrderAddress = Record<string, string | number | null> | null

export interface OrderDetailsItem {
  id: string
  product_variant_id: string
  product_name: string
  variant_name: string | null
  sku: string | null
  attributes: Record<string, unknown> | null
  quantity: number
  unit_price_minor: number
  discount_minor: number
  tax_minor: number
  line_total_minor: number
  currency: string
  created_at: string
}

export interface AdminVendorOrderDetails {
  id: string
  order_number: string
  store_id: string
  status: string
  currency: string
  subtotal_minor: number
  shipping_minor: number
  tax_minor: number
  discount_minor: number
  total_minor: number
  accepted_at: string | null
  shipped_at: string | null
  delivered_at: string | null
  customer_confirmed_at: string | null
  acceptance_deadline: string | null
  completed_at: string | null
  cancelled_at: string | null
  shipping_provider: string | null
  tracking_number: string | null
  tracking_url: string | null
  created_at: string
  updated_at: string
  items: OrderDetailsItem[]
}

export interface AdminOrderDetails {
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
  shipping_address: OrderAddress
  billing_address: OrderAddress
  customer_note: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
  customer: OrderDetailsCustomer | null
  vendor_orders: AdminVendorOrderDetails[]
  status_history: OrderStatusHistoryEntry[]
  payments: AdminOrderPayment[]
}

export interface AdminOrderPayment {
  id: string
  order_id: string
  provider: string
  reference: string
  provider_transaction_id: string | null
  amount_minor: number
  currency: string
  status: string
  failure_reason: string | null
  initialized_at: string | null
  verified_at: string | null
  failed_at: string | null
  created_at: string
  updated_at: string
}

export interface OrderStatusHistoryEntry {
  order_id: string
  vendor_order_id: string | null
  vendor_order_number: string | null
  old_status: string | null
  new_status: string
  changed_by: string | null
  changed_by_name: string
  reason: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}
