import type { Product } from '@/entities/product'

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => boolean
  updateQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  subtotal: number
  freight: number
  total: number
  itemsCount: number
  unitsCount: number
}
