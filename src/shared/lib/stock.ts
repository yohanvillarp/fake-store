export const MAX_UNITS_PER_PERSON = 5

export interface StockStatus {
  label: string
  variant: 'normal' | 'low' | 'single' | 'out'
  badgeClass: string
  isAvailable: boolean
  isOutOfStock: boolean
  maxAllowed: number
}

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) {
    return {
      label: 'Agotado',
      variant: 'out',
      badgeClass: 'bg-zinc-200 text-zinc-700 border-zinc-700',
      isAvailable: false,
      isOutOfStock: true,
      maxAllowed: 0,
    }
  }

  if (stock === 1) {
    return {
      label: '¡Última unidad!',
      variant: 'single',
      badgeClass: 'bg-rose-100 text-rose-900 border-rose-900 font-black animate-pulse',
      isAvailable: true,
      isOutOfStock: false,
      maxAllowed: 1,
    }
  }

  if (stock <= 5) {
    return {
      label: `Últimas ${stock} unidades`,
      variant: 'low',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-900 font-bold',
      isAvailable: true,
      isOutOfStock: false,
      maxAllowed: stock,
    }
  }

  return {
    label: `Stock: ${stock}`,
    variant: 'normal',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-900',
    isAvailable: true,
    isOutOfStock: false,
    maxAllowed: MAX_UNITS_PER_PERSON,
  }
}
