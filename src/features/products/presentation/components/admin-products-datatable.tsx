
'use client'

import { useMemo } from 'react'

import Link from 'next/link'

import {
  type ColumnDef,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  ImageIcon,
  PlusIcon,
  RotateCcwIcon,
  SearchIcon
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import type { Product } from '@/features/products/domain/entities/product'

import {
  PRODUCT_MODERATION_STATUS_CONFIG,
  PRODUCT_MODERATION_STATUS_OPTIONS,
  PRODUCT_STATUS_CONFIG,
  PRODUCT_STATUS_OPTIONS
} from '@/features/products/presentation/constants/product-status'

import { useAdminProducts } from '@/features/products/presentation/hooks/use-admin-products'

const formatDate = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

const getStatusBadge = (
  status: string,
  config: Record<string, { label: string; className: string }>
) => {
  const statusConfig = config[status]

  if (!statusConfig) {
    return (
      <Badge variant='outline'>
        {status.replaceAll('_', ' ')}
      </Badge>
    )
  }

  return (
    <Badge
      variant='outline'
      className={statusConfig.className}
    >
      {statusConfig.label}
    </Badge>
  )
}

export function AdminProductsDataTable() {
  const {
    result,
    loading,
    error,
    page,
    perPage,
    search,
    status,
    moderationStatus,
    setPage,
    setPerPage,
    setSearch,
    setStatus,
    setModerationStatus,
    resetFilters
  } = useAdminProducts()

  const products = result?.items ?? []

  const pagination = result?.pagination

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Product',
        cell: ({ row }) => {
          const product = row.original

          return (
            <div className='flex min-w-[220px] items-center gap-3'>
              <div className='flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted'>
                {product.primary_image ? (
                  <img
                    src={`/api/admin/products/${encodeURIComponent(product.id)}/images/${encodeURIComponent(product.primary_image.id)}/file`}
                    alt={product.primary_image.alt_text ?? product.name}
                    className='size-10 rounded-md object-cover'
                  />
                ) : (
                  <div className='flex size-10 items-center justify-center rounded-md bg-muted'>
                    <ImageIcon className='size-4 text-muted-foreground' />
                  </div>
                )}
              </div>

              <div className='min-w-0 space-y-1'>
                <p className='truncate font-medium'>
                  {product.name}
                </p>

                <p className='truncate text-xs text-muted-foreground'>
                  {product.slug}
                </p>
              </div>
            </div>
          )
        }
      },
      {
        accessorKey: 'status',
        header: 'Product Status',
        cell: ({ row }) =>
          getStatusBadge(
            row.original.status,
            PRODUCT_STATUS_CONFIG
          )
      },
      {
        accessorKey: 'moderation_status',
        header: 'Moderation',
        cell: ({ row }) =>
          getStatusBadge(
            row.original.moderation_status,
            PRODUCT_MODERATION_STATUS_CONFIG
          )
      },
      {
        accessorKey: 'created_at',
        header: 'Date Created',
        cell: ({ row }) => (
          <span className='whitespace-nowrap text-sm text-muted-foreground'>
            {formatDate(row.original.created_at)}
          </span>
        )
      },
      {
        id: 'actions',
        header: '',
        enableHiding: false,
        cell: ({ row }) => (
          <div className='flex justify-end'>
            <Button
              nativeButton={false}
              render={<Link href={`/products/${row.original.id}`} />}
              variant='ghost'
              size='sm'
            >
              <EyeIcon className='size-4' />
              View
            </Button>
          </div>
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
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),

    manualPagination: true,
    pageCount: pagination?.total_pages ?? 0,

    state: {
      pagination: paginationState
    },

    onPaginationChange: updater => {
      const next =
        typeof updater === 'function'
          ? updater(paginationState)
          : updater

      if (next.pageSize !== perPage) {
        setPerPage(next.pageSize)

        return
      }

      if (next.pageIndex + 1 !== page) {
        setPage(next.pageIndex + 1)
      }
    }
  })

  const handleReset = () => {
    resetFilters()
  }

  return (
    <div className='space-y-5'>
      {/* Header */}
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div className='space-y-1'>
          <h2 className='text-lg font-semibold'>
            Products
          </h2>

          <p className='text-sm text-muted-foreground'>
            Manage and review products across your marketplace.
          </p>
        </div>

        <Button
          nativeButton={false}
          render={<Link href='/products/create' />}
        >
          <PlusIcon className='size-4' />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className='flex flex-col gap-3 lg:flex-row lg:items-center'>
        <div className='relative w-full lg:max-w-sm'>
          <SearchIcon className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />

          <Input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder='Search products...'
            className='pl-9'
          />
        </div>

        <Select
          value={status || 'all'}
          onValueChange={value =>
            setStatus(!value || value === 'all' ? '' : value)
          }
        >
          <SelectTrigger className='w-full lg:w-[190px]'>
            <SelectValue placeholder='Product status' />
          </SelectTrigger>

          <SelectContent>
            {PRODUCT_STATUS_OPTIONS.map(option => (
              <SelectItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={moderationStatus || 'all'}
          onValueChange={value =>
            setModerationStatus(
              !value || value === 'all' ? '' : value
            )
          }
        >
          <SelectTrigger className='w-full lg:w-[220px]'>
            <SelectValue placeholder='Moderation status' />
          </SelectTrigger>

          <SelectContent>
            {PRODUCT_MODERATION_STATUS_OPTIONS.map(option => (
              <SelectItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant='outline'
          onClick={handleReset}
          className='shrink-0'
        >
          <RotateCcwIcon className='mr-2 size-4' />
          Reset
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className='rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive'>
          {error}
        </div>
      )}

      {/* Table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
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
            {loading && products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-32 text-center text-muted-foreground'
                >
                  Loading products...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-32 text-center text-muted-foreground'
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
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
        <div className='text-sm text-muted-foreground'>
          {pagination ? (
            <>
              Showing {products.length} of {pagination.total} products
            </>
          ) : (
            'Showing 0 products'
          )}
        </div>

        <div className='flex flex-wrap items-center gap-3'>
          <Select
            value={String(perPage)}
            onValueChange={value => setPerPage(Number(value))}
          >
            <SelectTrigger className='w-[100px]'>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {[10, 20, 50, 100].map(size => (
                <SelectItem
                  key={size}
                  value={String(size)}
                >
                  {size} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className='text-sm text-muted-foreground'>
            Page {page} of {pagination?.total_pages ?? 0}
          </span>

          <div className='flex items-center gap-1'>
            <Button
              variant='outline'
              size='icon'
              disabled={page <= 1 || loading}
              onClick={() => setPage(page - 1)}
              aria-label='Previous page'
            >
              <ChevronLeftIcon className='size-4' />
            </Button>

            <Button
              variant='outline'
              size='icon'
              disabled={
                !pagination ||
                page >= pagination.total_pages ||
                loading
              }
              onClick={() => setPage(page + 1)}
              aria-label='Next page'
            >
              <ChevronRightIcon className='size-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
