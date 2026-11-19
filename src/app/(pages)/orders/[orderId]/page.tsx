import { AdminOrderDetails } from '@/features/orders/presentation/components/admin-order-details'

interface OrderDetailsPageProps {
  params: Promise<{
    orderId: string
  }>
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { orderId } = await params

  return <AdminOrderDetails orderId={orderId} />
}
