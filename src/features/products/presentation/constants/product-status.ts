
export const PRODUCT_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' }
] as const

export const PRODUCT_MODERATION_STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' }
] as const

export const PRODUCT_STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    className: 'bg-yellow-100 text-yellow-700'
  },
  published: {
    label: 'Published',
    className: 'bg-green-100 text-green-700'
  },
  archived: {
    label: 'Archived',
    className: 'bg-gray-100 text-gray-700'
  }
} as const

export const PRODUCT_MODERATION_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-700'
  },
  approved: {
    label: 'Approved',
    className: 'bg-green-100 text-green-700'
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-700'
  }
} as const
