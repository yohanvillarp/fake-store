const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatBRL(amount: number | null | undefined): string {
  if (amount == null || isNaN(amount)) return 'R$ 0,00'
  return brlFormatter.format(amount)
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—'
  try {
    const d = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  } catch {
    return String(dateString)
  }
}

export function calculateFreight(subtotal: number, itemsCount: number): number {
  if (itemsCount === 0 || subtotal <= 0) return 0
  const freight = 15.0 + (itemsCount - 1) * 3.9
  return Number(freight.toFixed(2))
}
