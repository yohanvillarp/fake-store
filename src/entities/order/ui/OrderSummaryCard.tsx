import React from 'react'
import { Link } from 'react-router-dom'
import { Package, Calendar, MapPin, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react'
import type { ApiOrderSummary } from '@/shared/api'
import { formatBRL, formatDate } from '@/shared/lib'
import { PixelButton } from '@/shared/ui'

interface OrderSummaryCardProps {
  order: ApiOrderSummary
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ order }) => {
  return (
    <div className="bg-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] p-5 transition-transform hover:-translate-y-0.5">
      {/* Cabecera de la tarjeta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono font-black text-lg text-zinc-900 tracking-wider">
            {order.order_code}
          </span>
          <span className="inline-flex items-center gap-1 pixel-badge bg-emerald-100 text-emerald-900 border-emerald-900 font-mono font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>Pagado</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(order.order_purchase_timestamp)}</span>
        </div>
      </div>

      {/* Datos del pedido */}
      <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div>
          <span className="text-zinc-400 block text-[10px] uppercase font-bold mb-1">
            Cliente y Destino
          </span>
          <span className="font-bold text-zinc-900 block truncate">{order.customer_name}</span>
          <span className="text-zinc-600 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
            {order.city} • {order.state}
          </span>
        </div>

        <div>
          <span className="text-zinc-400 block text-[10px] uppercase font-bold mb-1">
            Artículos y Pago
          </span>
          <span className="font-bold text-zinc-900 flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-zinc-600" />
            {order.items_count} {order.items_count === 1 ? 'producto' : 'productos'} ({order.total_units} unidades)
          </span>
          <span className="text-zinc-600 flex items-center gap-1 mt-0.5 capitalize">
            <CreditCard className="w-3 h-3 text-zinc-500 shrink-0" />
            {order.payment_type?.replace(/_/g, ' ') || 'tarjeta'}
          </span>
        </div>

        <div className="sm:text-right">
          <span className="text-zinc-400 block text-[10px] uppercase font-bold mb-1">
            Total del Pedido
          </span>
          <span className="font-mono font-black text-xl text-zinc-900">
            {formatBRL(order.total)}
          </span>
          <span className="text-[11px] text-zinc-500 block">
            Envío: {formatBRL(order.freight_value)}
          </span>
        </div>
      </div>

      {/* Botón de acción */}
      <div className="pt-4 border-t border-zinc-200 flex justify-end">
        <Link to={`/orders/${order.order_id}`}>
          <PixelButton variant="outline" size="sm">
            <span>Ver detalles del pedido</span>
            <ChevronRight className="w-4 h-4" />
          </PixelButton>
        </Link>
      </div>
    </div>
  )
}
