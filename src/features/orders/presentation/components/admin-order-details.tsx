'use client'

import Link from 'next/link'

import { ArrowLeft, ExternalLink, MapPin, Package, Truck, UserRound } from 'lucide-react'

import { useAdminOrderDetails } from '@/features/orders/presentation/hooks/use-admin-order-details'
import { CancelAdminOrderDialog } from '@/features/orders/presentation/components/cancel-admin-order-dialog'

import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { OrderActivityTimeline } from './order-activity-timeline'
import { OrderPaymentInformation } from './order-payment-information'

import type {
  AdminOrderDetails,
  AdminVendorOrderDetails,
  OrderAddress
} from '@/features/orders/domain/entities/order-details'
import { formatOrderAmount } from '@/utils/format-utils'

function formatDate(value: string | null) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

function statusVariant(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'delivered':
    case 'paid':
    case 'success':
      return 'default'

    case 'pending':
    case 'pending_payment':
    case 'processing':
    case 'accepted':
    case 'ready_to_ship':
      return 'secondary'

    case 'failed':
    case 'rejected':
    case 'cancelled':
    case 'refunded':
      return 'destructive'

    default:
      return 'outline'
  }
}

function StatusBadge({ status }: { status: string }) {
  return <Badge variant={statusVariant(status)}>{status.replaceAll('_', ' ')}</Badge>
}

function AddressContent({ address }: { address: OrderAddress }) {
  if (!address || Object.keys(address).length === 0) {
    return <p className='text-muted-foreground text-sm'>No address provided.</p>
  }

  return (
    <div className='space-y-1 text-sm'>
      {Object.entries(address).map(([key, value]) => {
        if (value === null || value === '') return null

        return (
          <p key={key} className='capitalize'>
            <span className='text-muted-foreground'>{key.replaceAll('_', ' ')}:</span> {String(value)}
          </p>
        )
      })}
    </div>
  )
}

function OrderSummary({ order }: { order: AdminOrderDetails }) {
  const currency = order.currency

  const rows = [
    ['Subtotal', order.subtotal_minor],
    ['Discount', -order.discount_minor],
    ['Tax', order.tax_minor],
    ['Shipping', order.shipping_minor]
  ] as const

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order summary</CardTitle>
      </CardHeader>

      <CardContent className='space-y-3'>
        {rows.map(([label, amount]) => (
          <div key={label} className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>{label}</span>
            <span>
              {formatOrderAmount(Math.abs(Number(amount)), currency)}
              {amount < 0 ? ' −' : ''}
            </span>
          </div>
        ))}

        <Separator />

        <div className='flex items-center justify-between font-semibold'>
          <span>Total</span>
          <span className='text-lg'>{formatOrderAmount(Number(order.total_minor), currency)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function VendorOrderCard({ vendorOrder }: { vendorOrder: AdminVendorOrderDetails }) {
  return (
    <Card>
      <CardHeader className='flex flex-row flex-wrap items-start justify-between gap-3'>
        <div className='space-y-1'>
          <CardTitle className='text-base'>Vendor order #{vendorOrder.order_number}</CardTitle>
          <p className='text-muted-foreground text-sm'>Created {formatDate(vendorOrder.created_at)}</p>
        </div>

        <StatusBadge status={vendorOrder.status} />
      </CardHeader>

      <CardContent className='space-y-5'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className='text-right'>Price</TableHead>
                <TableHead className='text-right'>Qty</TableHead>
                <TableHead className='text-right'>Total</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {vendorOrder.items.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className='min-w-[180px]'>
                      <p className='font-medium'>{item.product_name}</p>
                      {item.variant_name && <p className='text-muted-foreground text-xs'>{item.variant_name}</p>}
                      {item.attributes && Object.keys(item.attributes).length > 0 && (
                        <p className='text-muted-foreground mt-1 text-xs'>
                          {Object.entries(item.attributes)
                            .map(([key, value]) => `${key}: ${String(value)}`)
                            .join(' · ')}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>{item.sku || '—'}</TableCell>

                  <TableCell className='text-right whitespace-nowrap'>
                    {formatOrderAmount(Number(item.unit_price_minor), item.currency)}
                  </TableCell>

                  <TableCell className='text-right'>{item.quantity}</TableCell>

                  <TableCell className='text-right font-medium whitespace-nowrap'>
                    {formatOrderAmount(Number(item.line_total_minor), item.currency)}
                  </TableCell>
                </TableRow>
              ))}

              {vendorOrder.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className='text-muted-foreground h-20 text-center'>
                    No items found for this vendor order.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Separator />

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <p className='text-muted-foreground text-xs'>Accepted</p>
            <p className='mt-1 text-sm'>{formatDate(vendorOrder.accepted_at)}</p>
          </div>

          <div>
            <p className='text-muted-foreground text-xs'>Shipped</p>
            <p className='mt-1 text-sm'>{formatDate(vendorOrder.shipped_at)}</p>
          </div>

          <div>
            <p className='text-muted-foreground text-xs'>Delivered</p>
            <p className='mt-1 text-sm'>{formatDate(vendorOrder.delivered_at)}</p>
          </div>

          <div>
            <p className='text-muted-foreground text-xs'>Completed</p>
            <p className='mt-1 text-sm'>{formatDate(vendorOrder.completed_at)}</p>
          </div>
        </div>

        {(vendorOrder.shipping_provider || vendorOrder.tracking_number || vendorOrder.tracking_url) && (
          <>
            <Separator />

            <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-start gap-3'>
                <Truck className='text-muted-foreground mt-0.5 size-4' />

                <div className='space-y-1 text-sm'>
                  <p className='font-medium'>Shipment information</p>
                  {vendorOrder.shipping_provider && (
                    <p className='text-muted-foreground'>{vendorOrder.shipping_provider}</p>
                  )}
                  {vendorOrder.tracking_number && (
                    <p className='text-muted-foreground'>Tracking: {vendorOrder.tracking_number}</p>
                  )}
                </div>
              </div>

              {vendorOrder.tracking_url && (
                <a
                  href={vendorOrder.tracking_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline'
                >
                  Track shipment
                  <ExternalLink className='size-3.5' />
                </a>
              )}
            </div>
          </>
        )}

        <Separator />

        <div className='flex justify-end'>
          <div className='space-y-1 text-right'>
            <p className='text-muted-foreground text-xs'>Vendor order total</p>
            <p className='text-base font-semibold'>
              {formatOrderAmount(Number(vendorOrder.total_minor), vendorOrder.currency)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function OrderDetailsSkeleton() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-8 w-64' />
      <Skeleton className='h-28 w-full' />
      <div className='grid gap-6 lg:grid-cols-3'>
        <Skeleton className='h-72 lg:col-span-2' />
        <Skeleton className='h-72' />
      </div>
      <Skeleton className='h-64 w-full' />
    </div>
  )
}

function OrderDetailsContent({ order, onOrderCancelled }: { order: AdminOrderDetails; onOrderCancelled: () => void }) {
  const customerName = order.customer
    ? `${order.customer.first_name} ${order.customer.last_name}`.trim()
    : 'Unknown customer'

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-start gap-3'>
          <Link
            href='/orders'
            aria-label='Back to orders'
            className={buttonVariants({
              variant: 'outline',
              size: 'icon'
            })}
          >
            <ArrowLeft className='size-4' />
          </Link>

          <div className='space-y-1'>
            <div className='flex flex-wrap items-center gap-2'>
              <h1 className='text-2xl font-semibold tracking-tight'>Order #{order.order_number}</h1>

              <StatusBadge status={order.status} />
              <StatusBadge status={order.payment_status} />
            </div>

            <p className='text-muted-foreground text-sm'>Placed on {formatDate(order.created_at)}</p>
          </div>
        </div>

        {order.status === 'pending_payment' &&
          order.payment_status !== 'paid' &&
          !order.paid_at &&
          order.vendor_orders.length > 0 &&
          order.vendor_orders.every(vendorOrder => vendorOrder.status === 'pending') && (
            <CancelAdminOrderDialog orderId={order.id} onCancelled={onOrderCancelled} />
          )}
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <Package className='text-muted-foreground size-5' />
                <CardTitle>Order items</CardTitle>
              </div>
              <p className='text-muted-foreground text-sm'>
                {order.vendor_orders.length} vendor order
                {order.vendor_orders.length === 1 ? '' : 's'} in this order
              </p>
            </CardHeader>

            <CardContent className='space-y-5'>
              {order.vendor_orders.map(vendorOrder => (
                <VendorOrderCard key={vendorOrder.id} vendorOrder={vendorOrder} />
              ))}

              {order.vendor_orders.length === 0 && (
                <p className='text-muted-foreground py-8 text-center text-sm'>No vendor orders found.</p>
              )}
            </CardContent>
          </Card>

          {order.customer_note && (
            <Card>
              <CardHeader>
                <CardTitle>Customer note</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm whitespace-pre-wrap'>{order.customer_note}</p>
              </CardContent>
            </Card>
          )}

          <OrderPaymentInformation orderId={order.id} />

          <OrderActivityTimeline history={order.status_history ?? []} />
        </div>

        <div className='space-y-6'>
          <OrderSummary order={order} />

          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <UserRound className='text-muted-foreground size-5' />
                <CardTitle>Customer</CardTitle>
              </div>
            </CardHeader>

            <CardContent className='space-y-3'>
              <div>
                <p className='font-medium'>{customerName}</p>
                <p className='text-muted-foreground text-sm'>{order.customer?.email || '—'}</p>
                <p className='text-muted-foreground text-sm'>{order.customer?.phone || '—'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <MapPin className='text-muted-foreground size-5' />
                <CardTitle>Shipping address</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <AddressContent address={order.shipping_address} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <MapPin className='text-muted-foreground size-5' />
                <CardTitle>Billing address</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <AddressContent address={order.billing_address} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment status</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <StatusBadge status={order.payment_status} />
              <p className='text-muted-foreground text-sm'>
                {order.paid_at ? `Paid on ${formatDate(order.paid_at)}` : 'Payment date is not available.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function AdminOrderDetails({ orderId }: { orderId: string }) {
  const { data, isLoading, error, refetch } = useAdminOrderDetails(orderId)

  if (isLoading) {
    return <OrderDetailsSkeleton />
  }

  if (error || !data) {
    return (
      <div className='space-y-4'>
        <Button variant='ghost'>
          <Link href='/orders'>
            <ArrowLeft className='mr-2 size-4' />
            Back to orders
          </Link>
        </Button>

        <Card>
          <CardContent className='py-10 text-center'>
            <p className='font-medium'>Unable to load this order</p>
            <p className='text-muted-foreground mt-1 text-sm'>{error || 'The requested order could not be found.'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <OrderDetailsContent order={data} onOrderCancelled={refetch} />
}
