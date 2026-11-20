'use client'

import { useState } from 'react'
import { Loader2, XCircle } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import { useAdminOrderCancellation } from '@/features/orders/presentation/hooks/use-admin-order-cancellation'

interface CancelAdminOrderDialogProps {
  orderId: string
  onCancelled: () => void
}

export function CancelAdminOrderDialog({ orderId, onCancelled }: CancelAdminOrderDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')

  const { cancelOrder, isPending, error, clearError } = useAdminOrderCancellation()

  async function handleCancel() {
    const normalizedReason = reason.trim()

    if (!normalizedReason) {
      return
    }

    try {
      await cancelOrder(orderId, normalizedReason)

      setOpen(false)
      setReason('')
      clearError()
      onCancelled()
    } catch {
      // The hook exposes the API error for display.
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return

    setOpen(nextOpen)

    if (!nextOpen) {
      setReason('')
      clearError()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        className={buttonVariants({
          variant: 'destructive',
          size: 'sm'
        })}
      >
        <XCircle className='mr-2 h-4 w-4' />
        Cancel order
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this order?</AlertDialogTitle>

          <AlertDialogDescription>
            This action will cancel the order and its pending vendor orders. Any reserved inventory will be released.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className='space-y-2'>
          <label htmlFor='cancellation-reason' className='text-sm font-medium'>
            Reason for cancellation
          </label>

          <Textarea
            id='cancellation-reason'
            placeholder='Enter the reason for cancelling this order...'
            value={reason}
            onChange={event => {
              setReason(event.target.value)
              clearError()
            }}
            maxLength={1000}
            rows={4}
            disabled={isPending}
          />

          <div className='flex justify-end'>
            <span className='text-muted-foreground text-xs'>{reason.length}/1000</span>
          </div>

          {error && (
            <p className='text-destructive text-sm' role='alert'>
              {error}
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Keep order</AlertDialogCancel>

          <Button variant='destructive' onClick={handleCancel} disabled={isPending || !reason.trim()}>
            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isPending ? 'Cancelling...' : 'Confirm cancellation'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
