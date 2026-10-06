import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Scale,
  Box,
  Tag,
  Hash,
} from 'lucide-react'
import { api, type ApiProduct } from '@/shared/api'
import { useCart } from '@/entities/cart'
import { ProductPixelArt } from '@/shared/assets'
import {
  formatBRL,
  getCategoryLabelEs,
  getCategoryBadgeClass,
  getStockStatus,
} from '@/shared/lib'
import { PixelButton, PixelLoader, useToast } from '@/shared/ui'

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { showToast } = useToast()

  const [product, setProduct] = useState<ApiProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    if (!productId) return
    let ignore = false
    api
      .getProduct(productId)
      .then((data) => {
        if (!ignore) setProduct(data)
      })
      .catch((err) => {
        console.error('Failed to load product detail:', err)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [productId])

  if (loading) {
    return (
      <PixelLoader
        variant="page"
        message="Cargando detalles del producto..."
        submessage="Consultando especificaciones técnicas y disponibilidad de inventario..."
      />
    )
  }

  if (!product) {
    return (
      <div className="py-16 text-center bg-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] p-8 max-w-md mx-auto space-y-4">
        <h3 className="font-mono font-bold text-lg text-zinc-900">PRODUCTO NO ENCONTRADO</h3>
        <p className="text-xs text-zinc-500">
          El identificador solicitado no coincide con ningún artículo disponible.
        </p>
        <Link to="/shop">
          <PixelButton variant="primary" size="sm">
            Volver a la tienda
          </PixelButton>
        </Link>
      </div>
    )
  }

  const stockInfo = getStockStatus(product.stock)
  const isOutOfStock = stockInfo.isOutOfStock
  const maxAllowed = stockInfo.maxAllowed
  const isMaxStock = quantity >= maxAllowed
  const categoryLabel = getCategoryLabelEs(product.category_name)
  const categoryBadge = getCategoryBadgeClass(product.category_name)

  const handleAddToCart = () => {
    if (isOutOfStock) return
    const success = addToCart(product, quantity)
    if (success) {
      setJustAdded(true)
      setTimeout(() => setJustAdded(false), 2000)

      showToast({
        message: `${quantity}x ${product.display_name} añadido al carrito`,
        actionLabel: 'Ver carrito',
        actionUrl: '/cart',
      })

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('fake-store:cart-bounce'))
      }
    } else {
      showToast({
        message: 'Límite alcanzado: máximo 5 unidades por persona para este artículo',
        actionLabel: 'Ver carrito',
        actionUrl: '/cart',
      })
    }
  }


  return (
    <div className="space-y-8 py-8 max-w-5xl mx-auto">
      {/* Navegación de retorno */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="pixel-button bg-white text-zinc-800 text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer hover:bg-zinc-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Columna Izquierda: Showcase Pixel Art Grande */}
        <div className="bg-white border-3 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] p-8 flex flex-col items-center justify-center relative min-h-[380px] pixel-grid-pattern">
          {/* Badge de Stock en esquina */}
          <div className="absolute top-4 right-4">
            <span className={`pixel-badge ${stockInfo.badgeClass}`}>
              {stockInfo.label}
            </span>
          </div>

          {/* Gran Ilustración Sprite Pixel */}
          <div className="p-4 flex items-center justify-center">
            <ProductPixelArt
              productId={product.product_id}
              categoryName={product.category_name}
              size="lg"
            />
          </div>
        </div>

        {/* Columna Derecha: Información y Compra */}
        <div className="bg-white border-3 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Categoría */}
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 border ${categoryBadge}`}
              >
                {categoryLabel}
              </span>
            </div>

            {/* Nombre del producto */}
            <h1 className="text-2xl sm:text-3xl font-black font-mono text-zinc-900 leading-tight">
              {product.display_name}
            </h1>

            {/* Precio */}
            <div className="text-3xl font-black font-mono text-zinc-900">
              {formatBRL(product.price)}
            </div>

            {/* Stock disponible text */}
            <div className="pt-2">
              <p className="text-xs font-mono text-zinc-600">
                Disponibilidad:{' '}
                <strong className={isOutOfStock ? 'text-rose-600' : 'text-zinc-900'}>
                  {product.stock > 0 ? `${product.stock} unidades en stock` : 'Agotado'}
                </strong>
              </p>
            </div>

            {/* Selector de cantidad y botón Añadir */}
            <div className="pt-4 border-t-2 border-zinc-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-bold text-zinc-700 uppercase">
                  Cantidad:
                </label>
                <span className="text-[11px] font-mono text-zinc-500 bg-amber-50 border border-amber-300 px-2 py-0.5 font-bold">
                  Límite: máx. 5 por persona
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Controles de cantidad */}
                <div className="flex items-center border-2 border-zinc-900 bg-zinc-50 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2.5 hover:bg-zinc-200 transition-colors disabled:opacity-30 cursor-pointer"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="w-4 h-4 text-zinc-900" />
                  </button>

                  <span className="px-5 font-mono font-bold text-base text-zinc-900 select-none">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxAllowed, q + 1))}
                    disabled={isMaxStock || isOutOfStock}
                    className="p-2.5 hover:bg-zinc-200 transition-colors disabled:opacity-30 cursor-pointer"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-4 h-4 text-zinc-900" />
                  </button>
                </div>

                {/* Botón Añadir */}
                <div className="flex-1">
                  <PixelButton
                    variant={justAdded ? 'accent' : 'primary'}
                    size="md"
                    className="w-full py-3"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4 text-zinc-900" />
                        <span className="font-black text-zinc-900">¡AÑADIDO AL CARRITO!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{isOutOfStock ? 'PRODUCTO AGOTADO' : 'AÑADIR AL CARRITO'}</span>
                      </>
                    )}
                  </PixelButton>
                </div>
              </div>

              {/* Mensaje de límite de stock */}
              {isMaxStock && !isOutOfStock && (
                <p className="text-xs font-mono font-bold text-amber-700">
                  {maxAllowed < product.stock
                    ? 'Has alcanzado el límite máximo de 5 unidades por persona para este artículo.'
                    : `Has alcanzado el stock disponible (${product.stock} unidades).`}
                </p>
              )}
            </div>


            {/* Detalles del producto (Ficha técnica comercial) */}
            <div className="pt-6 border-t-2 border-zinc-900 space-y-3">
              <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-zinc-700">
                Detalles del producto:
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-zinc-50 border border-zinc-200 flex items-center gap-2.5">
                  <Scale className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">Peso</span>
                    <span className="font-bold text-zinc-800">{product.weight_g} g</span>
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 flex items-center gap-2.5">
                  <Box className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">Dimensiones</span>
                    <span className="font-bold text-zinc-800">
                      {product.length_cm} × {product.width_cm} × {product.height_cm} cm
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 flex items-center gap-2.5">
                  <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">Categoría</span>
                    <span className="font-bold text-zinc-800">{categoryLabel}</span>
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 flex items-center gap-2.5">
                  <Hash className="w-4 h-4 text-purple-600 shrink-0" />
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase">Código Producto</span>
                    <span className="font-bold text-zinc-800 font-mono text-[11px] truncate block" title={product.product_id}>
                      {product.product_id.slice(0, 10)}…
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
