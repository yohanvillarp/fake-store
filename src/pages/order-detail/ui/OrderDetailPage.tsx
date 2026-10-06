import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  CreditCard,
  FileCode,
  CheckCircle2,
  HelpCircle,
  Package,
} from 'lucide-react'
import { api, type ApiOrderDetail } from '@/shared/api'
import { formatBRL, formatDate } from '@/shared/lib'
import { PixelButton, PixelLoader } from '@/shared/ui'
import { ProductPixelArt } from '@/shared/assets'
import { ViewDataRecordModal } from '@/features/view-data-record'
import { WhyOltpModal } from '@/features/why-oltp-card'

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<ApiOrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDataModalOpen, setIsDataModalOpen] = useState(false)
  const [isWhyOltpModalOpen, setIsWhyOltpModalOpen] = useState(false)

  useEffect(() => {
    if (!orderId) return
    let ignore = false
    api
      .getOrder(orderId)
      .then((data) => {
        if (!ignore) setOrder(data)
      })
      .catch((err) => {
        console.error('Failed to load order detail:', err)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [orderId])

  if (loading) {
    return (
      <PixelLoader
        variant="page"
        message="Cargando detalles del pedido..."
        submessage="Recuperando comprobante y desglose transaccional..."
      />
    )
  }

  if (!order) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <div className="bg-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] p-8 space-y-3">
          <h2 className="font-mono font-bold text-lg text-zinc-900">PEDIDO NO ENCONTRADO</h2>
          <p className="text-xs text-zinc-500">
            No se encontró ningún registro para el identificador especificado.
          </p>
          <Link to="/orders">
            <PixelButton variant="primary" size="sm">
              Volver a pedidos
            </PixelButton>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 py-8 max-w-4xl mx-auto">
      {/* Botón de retorno simple */}
      <div className="flex items-center justify-between">
        <Link to="/orders">
          <button
            type="button"
            className="pixel-button bg-white text-zinc-800 text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer hover:bg-zinc-100"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Todos los pedidos</span>
          </button>
        </Link>
      </div>

      {/* Recibo Comercial Principal */}
      <div className="bg-white border-3 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] p-6 sm:p-8 space-y-6">
        {/* Cabecera del Recibo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-zinc-900 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-black text-2xl sm:text-3xl text-zinc-900 tracking-wider">
                {order.order_code}
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-500">
              Comprobante de compra de Fake Store
            </p>
          </div>

          <div className="sm:text-right space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 border-2 border-emerald-900 font-mono font-bold text-xs uppercase">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{order.order_status === 'delivered' ? 'Entregado' : 'Pagado'}</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1.5 text-xs font-mono text-zinc-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(order.order_purchase_timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Información del Cliente y Entrega */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-zinc-50 border-2 border-zinc-900 font-mono text-xs">
          <div>
            <span className="text-zinc-500 font-bold uppercase block text-[10px] mb-1">
              Información del Cliente
            </span>
            <p className="font-bold text-sm text-zinc-900">
              {order.customer.first_name} {order.customer.last_name}
            </p>
            <p className="text-zinc-600 mt-0.5">{order.customer.email}</p>
          </div>

          <div>
            <span className="text-zinc-500 font-bold uppercase block text-[10px] mb-1">
              Dirección de Entrega
            </span>
            <p className="font-bold text-zinc-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              {order.customer.city} • {order.customer.state} ({order.customer.country || 'Brasil'})
            </p>
            <p className="text-zinc-600 mt-0.5">Código Postal / CEP: {order.customer.zip_code}</p>
          </div>
        </div>

        {/* Tabla de Artículos del Pedido */}
        <div className="space-y-3">
          <h3 className="font-mono font-bold text-xs text-zinc-500 uppercase tracking-wider">
            Productos en el Pedido
          </h3>

          <div className="border-2 border-zinc-900 overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-zinc-100 border-b-2 border-zinc-900">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">PRODUCTO</th>
                  <th className="p-3 text-center">CANTIDAD</th>
                  <th className="p-3 text-right">PRECIO UNITARIO</th>
                  <th className="p-3 text-right">ENVÍO</th>
                  <th className="p-3 text-right">SUBTOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50">
                    <td className="p-3 font-bold text-zinc-500">{item.order_item_id || idx + 1}</td>
                    <td className="p-3 font-bold text-zinc-900">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white border border-zinc-900 p-0.5 flex items-center justify-center shrink-0">
                          <ProductPixelArt
                            productId={item.product_id}
                            size="sm"
                            className="w-7 h-7"
                          />
                        </div>
                        <span>{item.display_name || 'Artículo'}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold text-blue-600">{item.quantity}</td>
                    <td className="p-3 text-right">{formatBRL(item.unit_price)}</td>
                    <td className="p-3 text-right text-zinc-500">{formatBRL(item.freight_value)}</td>
                    <td className="p-3 text-right font-bold text-zinc-900">
                      {formatBRL((item.unit_price || 0) * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Desglose de Pago y Totales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Método de Pago */}
          <div className="p-4 bg-zinc-50 border-2 border-zinc-900 font-mono text-xs space-y-2">
            <span className="text-zinc-500 font-bold uppercase block text-[10px]">
              Forma de Pago
            </span>
            {order.payments.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-zinc-700" />
                  <span className="font-bold uppercase text-zinc-900">
                    {p.payment_type?.replace(/_/g, ' ')}
                  </span>
                  <span className="text-zinc-500">
                    ({p.payment_installments || 1} {p.payment_installments === 1 ? 'cuota' : 'cuotas'})
                  </span>
                </div>
                <span className="font-bold text-zinc-900">{formatBRL(p.payment_value)}</span>
              </div>
            ))}
          </div>

          {/* Resumen Financiero */}
          <div className="p-4 bg-zinc-100 border-2 border-zinc-900 font-mono text-xs space-y-2">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal productos:</span>
              <span className="font-bold text-zinc-900">{formatBRL(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Costo de envío:</span>
              <span className="font-bold text-zinc-900">{formatBRL(order.freight_value)}</span>
            </div>
            <div className="pt-2 border-t-2 border-zinc-900 flex justify-between text-base">
              <span className="font-black text-zinc-900 uppercase">Total Pagado:</span>
              <span className="font-black text-xl text-blue-700">{formatBRL(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Herramientas de Demostración Técnica al FINAL de la vista */}
      <section className="bg-zinc-100 border-2 border-zinc-900 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-zinc-800 font-mono font-bold text-xs uppercase tracking-wider mb-1">
              <Package className="w-4 h-4 text-blue-600" />
              <span>Herramientas de Demostración Técnica</span>
            </div>
            <p className="text-xs font-mono text-zinc-500 max-w-xl">
              Explora los registros relacionales persistidos en PostgreSQL o consulta cómo funciona la arquitectura OLTP de esta transacción.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Botón: ¿Qué ocurrió con los datos? */}
            <PixelButton
              variant="outline"
              size="sm"
              onClick={() => setIsWhyOltpModalOpen(true)}
              className="text-xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-zinc-700" />
              <span>¿Qué ocurrió con los datos?</span>
            </PixelButton>

            {/* Botón: Ver registro de datos (SQL RAW) */}
            <PixelButton
              variant="accent"
              size="sm"
              onClick={() => setIsDataModalOpen(true)}
              className="text-xs"
            >
              <FileCode className="w-3.5 h-3.5 text-zinc-900" />
              <span>Ver registro de datos (SQL)</span>
            </PixelButton>
          </div>
        </div>
      </section>

      {/* Modal 1: Explicación Educativa OLTP (Al ser solicitada) */}
      <WhyOltpModal
        isOpen={isWhyOltpModalOpen}
        onClose={() => setIsWhyOltpModalOpen(false)}
      />

      {/* Modal 2: Registro Relacional Raw de PostgreSQL */}
      <ViewDataRecordModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        order={order}
      />
    </div>
  )
}
