
'use client'

import { useMemo } from 'react'

import {
  flexRender,
  getCoreRowModel,
  type ColumnDef,
  type PaginationState,
  useReactTable
} from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import type { AdminOrder } from '@/features/orders/domain/entities/order'
import { useAdminOrders } from '@/features/orders/presentation/hooks/use-admin-orders'
import { formatOrderAmount } from '@/utils/format-utils'

function formatOrderDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

function getCustomerName(order: AdminOrder): string {
  const name = [
    order.customer.first_name,
    order.customer.last_name
  ]
    .filter(Boolean)
    .join(' ')

  return name || order.customer.email
}

function getStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'completed':
    case 'delivered':
      return 'border-green-200 bg-green-50 text-green-700'

    case 'pending':
    case 'pending_payment':
      return 'border-yellow-200 bg-yellow-50 text-yellow-700'

    case 'processing':
    case 'accepted':
    case 'ready_to_ship':
    case 'shipped':
      return 'border-blue-200 bg-blue-50 text-blue-700'

    case 'cancelled':
    case 'failed':
    case 'rejected':
      return 'border-red-200 bg-red-50 text-red-700'

    default:
      return 'border-gray-200 bg-gray-50 text-gray-700'
  }
}

function StatusBadge({ status }: { status: string }) {
  const label = status.replaceAll('_', ' ')

  return (
    <Badge
      variant='outline'
      className={`capitalize ${getStatusClass(status)}`}
    >
      {label}
    </Badge>
  )
}

export function AdminOrdersDataTable() {
  const {
    result,
    loading,
    error,
    page,
    perPage,
    search,
    status,
    paymentStatus,
    dateFrom,
    dateTo,
    setPage,
    setPerPage,
    setSearch,
    setStatus,
    setPaymentStatus,
    setDateFrom,
    setDateTo,
    resetFilters
  } = useAdminOrders()

  const orders = result?.items ?? []
  const pagination = result?.pagination

  const columns = useMemo<ColumnDef<AdminOrder>[]>(
    () => [
      {
        accessorKey: 'order_number',
        header: 'Order',
        cell: ({ row }) => (
          <span className='font-medium'>
            {row.original.order_number}
          </span>
        )
      },
      {
        id: 'customer',
        header: 'Customer',
        cell: ({ row }) => (
          <div className='min-w-0'>
            <p className='font-medium'>
              {getCustomerName(row.original)}
            </p>
            <p className='text-muted-foreground text-xs'>
              {row.original.customer.email}
            </p>
          </div>
        )
      },
      {
        accessorKey: 'total_minor',
        header: 'Amount',
        cell: ({ row }) => (
          <span className='font-medium tabular-nums'>
            {formatOrderAmount(
              row.original.total_minor,
              row.original.currency
            )}
          </span>
        )
      },
      {
        accessorKey: 'status',
        header: 'Order status',
        cell: ({ row }) => (
          <StatusBadge status={row.original.status} />
        )
      },
      {
        accessorKey: 'payment_status',
        header: 'Payment',
        cell: ({ row }) => (
          <StatusBadge status={row.original.payment_status} />
        )
      },
      {
        accessorKey: 'vendor_order_count',
        header: 'Vendor orders',
        cell: ({ row }) => (
          <span>{row.original.vendor_order_count}</span>
        )
      },
      {
        accessorKey: 'item_count',
        header: 'Items',
        cell: ({ row }) => (
          <span>{row.original.item_count}</span>
        )
      },
      {
        accessorKey: 'created_at',
        header: 'Date',
        cell: ({ row }) => (
          <span className='whitespace-nowrap text-sm'>
            {formatOrderDate(row.original.created_at)}
          </span>
        )
      }
    ],
    []
  )

  const paginationState: PaginationState = {
    pageIndex: page - 1,
    pageSize: perPage
  }

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination?.total_pages ?? 0,
    state: {
      pagination: paginationState
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater(paginationState)
          : updater

      if (next.pageSize !== perPage) {
        setPerPage(next.pageSize)
      } else if (next.pageIndex + 1 !== page) {
        setPage(next.pageIndex + 1)
      }
    }
  })

  const totalPages = pagination?.total_pages ?? 0
  const totalRecords = pagination?.total ?? 0

  return (
    <div className='space-y-4'>
      {/* Filters */}
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-3 md:flex-row'>
          <Input
            placeholder='Search order number or customer...'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className='md:max-w-sm'
          />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className='h-9 rounded-md border bg-background px-3 text-sm'
          >
            <option value=''>All order statuses</option>
            <option value='pending_payment'>Pending payment</option>
            <option value='paid'>Paid</option>
            <option value='cancelled'>Cancelled</option>
          </select>

          <select
            value={paymentStatus}
            onChange={(event) => setPaymentStatus(event.target.value)}
            className='h-9 rounded-md border bg-background px-3 text-sm'
          >
            <option value=''>All payment statuses</option>
            <option value='pending'>Pending</option>
            <option value='paid'>Paid</option>
            <option value='failed'>Failed</option>
            <option value='refunded'>Refunded</option>
          </select>

          <Button
            variant='outline'
            onClick={resetFilters}
            disabled={
              !search &&
              !status &&
              !paymentStatus &&
              !dateFrom &&
              !dateTo
            }
          >
            Clear filters
          </Button>
        </div>

        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground text-sm'>
              From
            </span>
            <Input
              type='date'
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
              className='w-auto'
            />
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground text-sm'>
              To
            </span>
            <Input
              type='date'
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
              className='w-auto'
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-32 text-center'
                >
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-32 text-center text-destructive'
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-32 text-center text-muted-foreground'
                >
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.original.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='text-muted-foreground text-sm'>
          Showing {orders.length > 0 ? (page - 1) * perPage + 1 : 0}
          {' - '}
          {Math.min(page * perPage, totalRecords)}
          {' of '}
          {totalRecords} orders
        </div>

        <div className='flex items-center gap-2'>
          <select
            value={perPage}
            onChange={(event) => setPerPage(Number(event.target.value))}
            className='h-9 rounded-md border bg-background px-2 text-sm'
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>

          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage(page - 1)}
            disabled={page <= 1 || loading}
          >
            Previous
          </Button>

          <span className='text-sm tabular-nums'>
            {page} / {Math.max(totalPages, 1)}
          </span>

          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
