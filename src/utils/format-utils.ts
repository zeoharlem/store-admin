
export function formatOrderAmount(
  amountMinor: number,
  currency: string
): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amountMinor / 100)
}
