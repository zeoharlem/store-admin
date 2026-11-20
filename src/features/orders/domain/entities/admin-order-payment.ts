export interface AdminOrderPayment {
  id: string
  order_id: string
  provider: string
  reference: string
  provider_transaction_id: string | null
  amount_minor: number
  currency: string
  status: 'pending' | 'initialized' | 'success' | 'failed' | string
  failure_reason: string | null
  initialized_at: string | null
  verified_at: string | null
  failed_at: string | null
  created_at: string
  updated_at: string
}
