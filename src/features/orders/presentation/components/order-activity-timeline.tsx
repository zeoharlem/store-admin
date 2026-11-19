
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import type { OrderStatusHistoryEntry } from '@/features/orders/domain/entities/order-details'

interface OrderActivityTimelineProps {
  history: OrderStatusHistoryEntry[]
}

function formatStatus(status: string | null): string {
  if (!status) return 'Initial'

  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

export function OrderActivityTimeline({
                                        history
                                      }: OrderActivityTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Activity</CardTitle>
      </CardHeader>

      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No activity history is available for this order.
          </p>
        ) : (
          <div className="relative space-y-6">
            {history.map((entry, index) => (
              <div
                key={`${entry.created_at}-${entry.vendor_order_id ?? 'parent'}-${index}`}
                className="relative flex gap-4"
              >
                <div className="relative flex flex-col items-center">
                  <span className="z-10 mt-1 size-3 rounded-full border-2 border-primary bg-background" />

                  {index !== history.length - 1 && (
                    <span className="absolute top-4 h-[calc(100%+1.5rem)] w-px bg-border" />
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1 pb-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">
                      {entry.old_status
                        ? `${formatStatus(entry.old_status)} → ${formatStatus(entry.new_status)}`
                        : `Created with status ${formatStatus(entry.new_status)}`}
                    </p>

                    <time className="text-xs text-muted-foreground">
                      {formatDate(entry.created_at)}
                    </time>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {entry.vendor_order_number
                      ? `Vendor order ${entry.vendor_order_number}`
                      : 'Parent order'}
                  </p>

                  {entry.reason && (
                    <p className="text-sm text-muted-foreground">
                      {entry.reason}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground">
                    By {entry.changed_by_name || 'System'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
