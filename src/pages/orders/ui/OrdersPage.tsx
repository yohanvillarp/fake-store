import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, ShoppingBag, ArrowRight } from 'lucide-react'
import { api, type ApiOrderSummary } from '@/shared/api'
import { OrderSummaryCard } from '@/entities/order'
import { PixelButton, PixelLoader } from '@/shared/ui'

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<ApiOrderSummary[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {
    setLoading(true)
    api
      .getOrders()
      .then((data) => setOrders(data))
      .catch((err) => console.error('Failed to load orders:', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let ignore = false
    api
      .getOrders()
      .then((data) => {
        if (!ignore) setOrders(data)
      })
      .catch((err) => console.error('Failed to load orders:', err))
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="space-y-8 py-8">
      {/* Banner de Cabecera */}
      <div className="bg-white border-3 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-mono font-black text-3xl text-zinc-900 uppercase">
            Pedidos Realizados
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-1">
            Historial de compras registradas en Fake Store.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PixelButton
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </PixelButton>
        </div>
      </div>

      {/* Lista de Pedidos */}
      {loading ? (
        <PixelLoader
          variant="page"
          message="Consultando historial de pedidos..."
          submessage="Recuperando tus órdenes registradas en el sistema..."
        />
      ) : orders.length === 0 ? (
        <div className="bg-white border-3 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-zinc-100 border-2 border-zinc-900 flex items-center justify-center mx-auto text-zinc-400 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]">
            <ShoppingBag className="w-8 h-8" />
          </div>

          <h3 className="font-mono font-black text-2xl text-zinc-900 uppercase">
            AÚN NO HAY PEDIDOS
          </h3>

          <p className="text-xs font-mono text-zinc-500">
            Realiza una compra en la tienda para ver el registro completo de tu pedido aquí.
          </p>

          <div className="pt-2">
            <Link to="/shop">
              <PixelButton variant="primary" size="md">
                <ShoppingBag className="w-4 h-4" />
                <span>Explorar tienda</span>
                <ArrowRight className="w-4 h-4" />
              </PixelButton>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderSummaryCard key={order.order_id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
