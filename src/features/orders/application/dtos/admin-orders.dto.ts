
export interface AdminOrdersQueryDto {
  page?: number
  per_page?: number
  search?: string
  status?: string
  payment_status?: string
  date_from?: string
  date_to?: string
}
