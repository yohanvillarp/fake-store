import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight, Trash2, ArrowLeft, Truck } from 'lucide-react'
import { useCart, CartItemRow } from '@/entities/cart'
import { formatBRL } from '@/shared/lib'
import { PixelButton, PixelCard } from '@/shared/ui'

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, freight, total, itemsCount } =
    useCart()

  if (itemsCount === 0) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto space-y-6">
        <div className="p-8 bg-white border-3 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] space-y-4">
          <div className="w-16 h-16 bg-zinc-100 border-2 border-zinc-900 flex items-center justify-center mx-auto text-zinc-400 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]">
            <ShoppingBag className="w-8 h-8" />
          </div>

          <h2 className="font-mono font-black text-2xl text-zinc-900 uppercase">
            TU CARRITO ESTÁ VACÍO
          </h2>

          <p className="text-xs font-mono text-zinc-500">
            Aún no has agregado productos. Explora nuestra colección y encuentra tus favoritos.
          </p>

          <div className="pt-2">
            <Link to="/shop">
              <PixelButton variant="primary" size="md">
                <span>Ir a la tienda</span>
                <ArrowRight className="w-4 h-4" />
              </PixelButton>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 py-8">
      {/* Título de la página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-zinc-900 gap-4">
        <div>
          <h1 className="font-mono font-black text-3xl text-zinc-900 uppercase">
            Tu Carrito ({itemsCount})
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-0.5">
            Revisa tus artículos antes de finalizar la compra.
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-mono font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1.5 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Vaciar carrito</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Izquierda: Lista de Productos en el Carrito */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItemRow
              key={item.product.product_id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}

          <div className="pt-4 flex justify-between items-center">
            <Link to="/shop">
              <button
                type="button"
                className="text-xs font-mono font-bold text-blue-600 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Seguir comprando</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Derecha: Resumen del Pedido */}
        <div>
          <PixelCard variant="raised" className="space-y-6 sticky top-24">
            <h3 className="font-mono font-black text-lg text-zinc-900 uppercase border-b-2 border-zinc-900 pb-3">
              Resumen del pedido
            </h3>

            <div className="space-y-3 text-sm font-mono">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal ({itemsCount} productos)</span>
                <span className="font-bold text-zinc-900">{formatBRL(subtotal)}</span>
              </div>

              <div className="flex justify-between text-zinc-600">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-zinc-500" />
                  Envío estimado
                </span>
                <span className="font-bold text-zinc-900">{formatBRL(freight)}</span>
              </div>

              <div className="pt-3 border-t-2 border-zinc-900 flex justify-between text-base">
                <span className="font-black text-zinc-900 uppercase">Total estimado</span>
                <span className="font-black text-xl text-blue-700">{formatBRL(total)}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/checkout" className="block">
                <PixelButton variant="primary" size="lg" className="w-full text-sm py-3">
                  <span>CONTINUAR COMPRA</span>
                  <ArrowRight className="w-4 h-4" />
                </PixelButton>
              </Link>
            </div>

            <p className="text-[11px] font-mono text-zinc-400 text-center">
              Precios calculados en Reales brasileños (R$).
            </p>
          </PixelCard>
        </div>
      </div>
    </div>
  )
}
