'use client'

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  CreditCard,
  Loader2,
  XCircle
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { useAdminOrderPayments } from '../hooks/use-admin-order-payments'

import type { AdminOrderPayment } from '../../domain/entities/admin-order-payment'
import { formatOrderAmount } from '@/utils/format-utils'

interface OrderPaymentInformationProps {
  orderId: string
}

function formatDate(value: string | null): string {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

function formatLabel(value: string): string {
  return value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function PaymentStatusBadge({ status }: { status: string }) {
  switch (status.toLowerCase()) {
    case 'success':
      return (
        <Badge className="gap-1">
          <CheckCircle2 className="size-3" />
          Successful
        </Badge>
      )

    case 'failed':
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="size-3" />
          Failed
        </Badge>
      )

    case 'pending':
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock3 className="size-3" />
          Pending
        </Badge>
      )

    case 'initialized':
      return (
        <Badge variant="outline" className="gap-1">
          <Clock3 className="size-3" />
          Initialized
        </Badge>
      )

    default:
      return <Badge variant="outline">{formatLabel(status)}</Badge>
  }
}

function PaymentDetail({
                         label,
                         value
                       }: {
  label: string
  value: string
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="break-all text-sm font-medium">{value}</p>
    </div>
  )
}

function PaymentAttempt({ payment }: { payment: AdminOrderPayment }) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <CreditCard className="size-5 text-muted-foreground" />
          </div>

          <div className="min-w-0 space-y-1">
            <p className="font-medium">
              {formatLabel(payment.provider)} payment
            </p>
            <p className="break-all text-xs text-muted-foreground">
              Reference: {payment.reference}
            </p>
          </div>
        </div>

        <PaymentStatusBadge status={payment.status} />
      </div>

      <Separator />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <PaymentDetail
          label="Amount"
          value={formatOrderAmount(
            payment.amount_minor,
            payment.currency
          )}
        />

        <PaymentDetail
          label="Provider"
          value={formatLabel(payment.provider)}
        />

        <PaymentDetail
          label="Transaction ID"
          value={payment.provider_transaction_id ?? '—'}
        />

        <PaymentDetail
          label="Created"
          value={formatDate(payment.created_at)}
        />

        <PaymentDetail
          label="Initialized"
          value={formatDate(payment.initialized_at)}
        />

        <PaymentDetail
          label="Verified"
          value={formatDate(payment.verified_at)}
        />

        <PaymentDetail
          label="Failed"
          value={formatDate(payment.failed_at)}
        />
      </div>

      {payment.failure_reason && (
        <>
          <Separator />

          <div className="flex items-start gap-2 rounded-md bg-destructive/5 p-3 text-sm">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <div className="min-w-0">
              <p className="font-medium text-destructive">
                Payment failure reason
              </p>
              <p className="mt-1 break-words text-muted-foreground">
                {payment.failure_reason}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function OrderPaymentInformation({
                                          orderId
                                        }: OrderPaymentInformationProps) {
  const { payments, isLoading, error } =
    useAdminOrderPayments(orderId)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Payment information</CardTitle>
            <CardDescription>
              Payment attempts associated with this order.
            </CardDescription>
          </div>

          {!isLoading && (
            <Badge variant="outline">
              {payments.length}{' '}
              {payments.length === 1 ? 'attempt' : 'attempts'}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading payment information...
          </div>
        ) : error ? (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <CreditCard className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium">
              No payment attempts found
            </p>
            <p className="text-sm text-muted-foreground">
              No payment attempts have been recorded for this order.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <PaymentAttempt
                key={payment.id}
                payment={payment}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
