import React, { useEffect, useState, useMemo } from 'react'
import type { Product } from '@/entities/product'
import { calculateFreight } from '@/shared/lib'
import { CartContext } from './cartContext'
import type { CartItem } from './types'

const CART_STORAGE_KEY = 'fake_store_cart_v1'

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err)
    }
  }, [items])

  const MAX_LIMIT_PER_PERSON = 5

  const addToCart = (product: Product, quantity = 1): boolean => {
    if (product.stock <= 0) return false
    const maxAllowed = Math.min(product.stock, MAX_LIMIT_PER_PERSON)

    let success = true
    setItems((prev) => {
      const existing = prev.find((item) => item.product.product_id === product.product_id)
      if (existing) {
        const nextQty = existing.quantity + quantity
        if (nextQty > maxAllowed) {
          success = false
          return prev
        }
        return prev.map((item) =>
          item.product.product_id === product.product_id ? { ...item, quantity: nextQty } : item,
        )
      } else {
        if (quantity > maxAllowed) {
          success = false
          return prev
        }
        return [...prev, { product, quantity }]
      }
    })
    return success
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.product_id === productId) {
          const maxAllowed = Math.min(item.product.stock, MAX_LIMIT_PER_PERSON)
          const finalQty = Math.min(quantity, maxAllowed)
          return { ...item, quantity: finalQty }
        }
        return item
      }),
    )
  }


  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.product_id !== productId))
  }

  const clearCart = () => {
    setItems([])
    try {
      localStorage.removeItem(CART_STORAGE_KEY)
    } catch {}
  }

  const subtotal = useMemo(() => {
    const sum = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
    return Number(sum.toFixed(2))
  }, [items])

  const unitsCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0)
  }, [items])

  const freight = useMemo(() => {
    return calculateFreight(subtotal, items.length)
  }, [subtotal, items.length])

  const total = useMemo(() => {
    return Number((subtotal + freight).toFixed(2))
  }, [subtotal, freight])

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        freight,
        total,
        itemsCount: items.length,
        unitsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
