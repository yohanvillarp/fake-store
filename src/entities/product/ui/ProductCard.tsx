import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Eye, Check } from 'lucide-react'
import type { Product } from '../types'
import { ProductPixelArt } from '@/shared/assets'
import {
  formatBRL,
  getCategoryLabelEs,
  getCategoryBadgeClass,
  getStockStatus,
} from '@/shared/lib'
import { PixelButton, useToast } from '@/shared/ui'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { showToast } = useToast()
  const [isJustAdded, setIsJustAdded] = useState(false)
  const stockInfo = getStockStatus(product.stock)
  const categoryLabel = getCategoryLabelEs(product.category_name)
  const categoryBadge = getCategoryBadgeClass(product.category_name)

  const handleAdd = () => {
    if (stockInfo.isOutOfStock) return

    if (onAddToCart) {
      onAddToCart(product)
    }

    // Temporary button state
    setIsJustAdded(true)
    setTimeout(() => setIsJustAdded(false), 1600)

    // Trigger toast notification
    showToast({
      message: 'Producto añadido al carrito (máx. 5 por persona)',
      productName: product.display_name,
      actionLabel: 'Ver carrito',
      actionUrl: '/cart',
    })

    // Dispatch global cart event for header badge animation
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fake-store:cart-bounce'))
    }
  }

  return (
    <div className="bg-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] group overflow-hidden">
      <div>
        {/* Pixel Art Showcase Frame */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b-2 border-zinc-900 flex items-center justify-center relative min-h-[170px] pixel-grid-pattern">
          <Link
            to={`/product/${product.product_id}`}
            className="transition-transform group-hover:scale-105 duration-150 flex items-center justify-center"
            title={`Ver detalles de ${product.display_name}`}
          >
            <ProductPixelArt
              productId={product.product_id}
              categoryName={product.category_name}
              size="md"
            />
          </Link>

          {/* Stock Status Badge */}
          <div className="absolute top-2.5 right-2.5">
            <span className={`pixel-badge ${stockInfo.badgeClass}`}>
              {stockInfo.label}
            </span>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-4 sm:p-5">
          <div className="mb-2">
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border ${categoryBadge}`}
            >
              {categoryLabel}
            </span>
          </div>

          <h3 className="font-bold text-sm sm:text-base text-zinc-900 mb-1 leading-snug line-clamp-1">
            <Link
              to={`/product/${product.product_id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {product.display_name}
            </Link>
          </h3>

          <div className="mt-2 flex items-center justify-between font-mono">
            <span className="text-lg sm:text-xl font-black text-zinc-900">
              {formatBRL(product.price)}
            </span>
            <span className="text-[10px] text-zinc-500 font-bold bg-zinc-100 border border-zinc-200 px-1.5 py-0.5">
              Máx. 5 u.
            </span>
          </div>
        </div>
      </div>

      {/* Commercial Actions: Guaranteed Equal Grid & Heights */}
      <div className="p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2">
        <Link to={`/product/${product.product_id}`} className="w-full min-w-0">
          <PixelButton
            variant="outline"
            size="sm"
            className="w-full h-8 sm:h-9 text-[11px] font-bold px-1.5 whitespace-nowrap flex items-center justify-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Detalles</span>
          </PixelButton>
        </Link>

        {onAddToCart && (
          <PixelButton
            variant={isJustAdded ? 'accent' : 'primary'}
            size="sm"
            className="w-full h-8 sm:h-9 text-[11px] font-bold px-1.5 whitespace-nowrap flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
            disabled={stockInfo.isOutOfStock}
            onClick={handleAdd}
          >
            {isJustAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                <span className="font-black text-zinc-900 truncate">¡Listo!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{stockInfo.isOutOfStock ? 'Agotado' : 'Añadir'}</span>
              </>
            )}
          </PixelButton>
        )}
      </div>
    </div>
  )
}
