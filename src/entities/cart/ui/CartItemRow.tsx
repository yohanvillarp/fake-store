import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, Minus, Trash2 } from 'lucide-react'
import type { CartItem } from '../model/types'
import { formatBRL } from '@/shared/lib'
import { ProductPixelArt } from '@/shared/assets'

interface CartItemRowProps {
  item: CartItem
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { product, quantity } = item
  const itemTotal = product.price * quantity
  const maxAllowed = Math.min(product.stock, 5)
  const isMaxStock = quantity >= maxAllowed

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] gap-4">
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 min-w-0">
        <Link
          to={`/product/${product.product_id}`}
          className="w-16 h-16 bg-slate-50 border-2 border-zinc-900 flex items-center justify-center shrink-0 p-1 pixel-grid-pattern hover:opacity-90 transition-opacity"
          title={product.display_name}
        >
          <ProductPixelArt
            productId={product.product_id}
            categoryName={product.category_name}
            size="sm"
          />
        </Link>

        <div className="min-w-0">
          <h4 className="font-bold text-sm text-zinc-900 truncate">
            <Link
              to={`/product/${product.product_id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {product.display_name}
            </Link>
          </h4>
          <p className="text-xs text-zinc-500 font-mono">
            {formatBRL(product.price)} c/u • <span className="text-zinc-400">Límite: 5 u.</span>
          </p>
          {isMaxStock && (
            <span className="text-[10px] font-mono text-amber-700 font-bold block mt-0.5">
              {maxAllowed < product.stock
                ? 'Límite de 5 unidades por persona alcanzado'
                : `Máximo disponible alcanzado (${product.stock} u.)`}
            </span>
          )}
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        {/* Quantity Controls */}
        <div className="flex items-center border-2 border-zinc-900 bg-zinc-50 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
          <button
            type="button"
            className="p-1.5 hover:bg-zinc-200 transition-colors disabled:opacity-30 cursor-pointer"
            onClick={() => onUpdateQuantity(product.product_id, quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Disminuir cantidad"
          >
            <Minus className="w-3.5 h-3.5 text-zinc-900" />
          </button>

          <span className="px-3 font-mono font-bold text-sm text-zinc-900 select-none">
            {quantity}
          </span>

          <button
            type="button"
            className="p-1.5 hover:bg-zinc-200 transition-colors disabled:opacity-30 cursor-pointer"
            onClick={() => onUpdateQuantity(product.product_id, quantity + 1)}
            disabled={isMaxStock}
            title={
              maxAllowed < product.stock
                ? 'Límite de 5 unidades por persona'
                : 'Stock máximo alcanzado'
            }
            aria-label="Aumentar cantidad"
          >
            <Plus className="w-3.5 h-3.5 text-zinc-900" />
          </button>
        </div>

        {/* Line Total */}
        <div className="text-right min-w-[90px]">
          <span className="font-mono font-bold text-base text-zinc-900">
            {formatBRL(itemTotal)}
          </span>
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onRemove(product.product_id)}
          className="p-2 border border-zinc-900 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] cursor-pointer"
          aria-label="Eliminar producto"
          title="Eliminar producto"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
