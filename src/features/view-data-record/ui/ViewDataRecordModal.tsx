import React, { useState } from 'react'
import type { ApiOrderDetail } from '@/shared/api'
import { Modal, PixelBadge } from '@/shared/ui'
import { Database, FileText, ShoppingCart, CreditCard, User } from 'lucide-react'

interface ViewDataRecordModalProps {
  isOpen: boolean
  onClose: () => void
  order: ApiOrderDetail
}

type TabType = 'order' | 'items' | 'payment' | 'customer'

export const ViewDataRecordModal: React.FC<ViewDataRecordModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('order')

  const renderTable = (rows: { field: string; value: React.ReactNode; note?: string }[]) => (
    <div className="border-2 border-zinc-900 bg-white shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] overflow-x-auto">
      <table className="w-full text-left text-xs font-mono">
        <thead className="bg-zinc-100 border-b-2 border-zinc-900">
          <tr>
            <th className="p-3 font-bold text-zinc-900 w-1/3">DATABASE COLUMN</th>
            <th className="p-3 font-bold text-zinc-900 w-1/2">PERSISTED VALUE</th>
            <th className="p-3 font-bold text-zinc-500">OLIST SPEC</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {rows.map((r, idx) => (
            <tr key={idx} className="hover:bg-zinc-50">
              <td className="p-3 font-bold text-blue-900">{r.field}</td>
              <td className="p-3 text-zinc-900 font-semibold">{r.value}</td>
              <td className="p-3 text-zinc-400 text-[11px]">{r.note || 'compatible'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="POSTGRESQL RAW TRANSACTION RECORD"
      maxWidth="max-w-4xl"
      resetScrollKey={activeTab}
    >
      <div className="space-y-5">
        {/* Banner */}
        <div className="p-4 bg-zinc-900 text-white border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <span className="font-mono font-bold text-sm">
              RELATIONAL ENTITIES PERSISTED FOR {order.order_code}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <PixelBadge variant="fake_store">SOURCE = FAKE_STORE</PixelBadge>
            <span className="text-[11px] font-mono text-zinc-400">Power BI Ready</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-zinc-900 gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('order')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 border-t-2 border-x-2 border-zinc-900 transition-colors cursor-pointer ${
              activeTab === 'order' ? 'bg-blue-600 text-white -mb-[2px] z-10' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            1. ORDER ({order.order_code})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 border-t-2 border-x-2 border-zinc-900 transition-colors cursor-pointer ${
              activeTab === 'items' ? 'bg-blue-600 text-white -mb-[2px] z-10' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            2. ORDER ITEMS ({order.items.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payment')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 border-t-2 border-x-2 border-zinc-900 transition-colors cursor-pointer ${
              activeTab === 'payment' ? 'bg-blue-600 text-white -mb-[2px] z-10' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            3. PAYMENTS ({order.payments.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customer')}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 border-t-2 border-x-2 border-zinc-900 transition-colors cursor-pointer ${
              activeTab === 'customer' ? 'bg-blue-600 text-white -mb-[2px] z-10' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            4. CUSTOMER
          </button>
        </div>

        {/* Tab 1: ORDER */}
        {activeTab === 'order' && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-600">
              Corresponds to <code className="bg-zinc-100 px-1 py-0.5 border border-zinc-300">olist_orders_dataset.csv</code>
            </p>
            {renderTable([
              { field: 'order_id', value: order.order_id, note: 'PK UUID' },
              { field: 'order_code', value: order.order_code, note: 'Human reference' },
              { field: 'customer_id', value: order.customer_id, note: 'FK to customer' },
              { field: 'order_status', value: order.order_status, note: 'Status enum' },
              { field: 'order_purchase_timestamp', value: order.order_purchase_timestamp, note: 'TIMESTAMPTZ' },
              { field: 'order_approved_at', value: order.order_approved_at, note: 'TIMESTAMPTZ' },
              { field: 'subtotal', value: `R$ ${order.subtotal?.toFixed(2)}`, note: 'NUMERIC(10,2)' },
              { field: 'freight_value', value: `R$ ${order.freight_value?.toFixed(2)}`, note: 'NUMERIC(10,2)' },
              { field: 'total', value: `R$ ${order.total?.toFixed(2)}`, note: 'NUMERIC(10,2)' },
              { field: 'source', value: <PixelBadge variant="fake_store">{order.source}</PixelBadge>, note: 'OLTP tag' },
            ])}
          </div>
        )}

        {/* Tab 2: ORDER ITEMS */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            <p className="text-xs text-zinc-600">
              Corresponds to <code className="bg-zinc-100 px-1 py-0.5 border border-zinc-300">olist_order_items_dataset.csv</code>
            </p>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 border-2 border-zinc-900 bg-zinc-50 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                  <div className="font-bold text-xs text-zinc-900 mb-2 flex items-center justify-between">
                    <span>ITEM #{item.order_item_id || idx + 1}: {item.display_name || 'Product'}</span>
                    <span className="font-mono text-blue-700">Qty: {item.quantity}</span>
                  </div>
                  {renderTable([
                    { field: 'order_id', value: order.order_id },
                    { field: 'order_item_id', value: item.order_item_id || idx + 1, note: 'Sequential index' },
                    { field: 'product_id', value: item.product_id, note: 'Olist real ID' },
                    { field: 'quantity', value: item.quantity, note: 'Purchased units' },
                    { field: 'unit_price', value: `R$ ${Number(item.unit_price || 0).toFixed(2)}`, note: 'Recalculated on server' },
                    { field: 'freight_value', value: `R$ ${Number(item.freight_value || 0).toFixed(2)}`, note: 'Freight share' },
                  ])}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: PAYMENT */}
        {activeTab === 'payment' && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-600">
              Corresponds to <code className="bg-zinc-100 px-1 py-0.5 border border-zinc-300">olist_order_payments_dataset.csv</code>
            </p>
            {order.payments.map((p, idx) => (
              <div key={idx}>
                {renderTable([
                  { field: 'order_id', value: order.order_id },
                  { field: 'payment_sequential', value: p.payment_sequential || 1, note: 'Sequential' },
                  { field: 'payment_type', value: p.payment_type, note: 'credit_card / boleto...' },
                  { field: 'payment_installments', value: p.payment_installments || 1, note: 'Installment count' },
                  { field: 'payment_value', value: `R$ ${Number(p.payment_value || order.total).toFixed(2)}`, note: 'NUMERIC(10,2)' },
                ])}
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: CUSTOMER */}
        {activeTab === 'customer' && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-600">
              Corresponds to <code className="bg-zinc-100 px-1 py-0.5 border border-zinc-300">olist_customers_dataset.csv</code>
            </p>
            {renderTable([
              { field: 'customer_id', value: order.customer.customer_id || order.customer_id, note: 'Unique identifier' },
              { field: 'first_name', value: order.customer.first_name },
              { field: 'last_name', value: order.customer.last_name },
              { field: 'email', value: order.customer.email },
              { field: 'city', value: order.customer.city },
              { field: 'state', value: order.customer.state, note: 'Brazilian State Code' },
              { field: 'country', value: order.customer.country || 'Brazil' },
              { field: 'zip_code', value: order.customer.zip_code },
              { field: 'source', value: <PixelBadge variant="fake_store">fake_store</PixelBadge> },
            ])}
          </div>
        )}

        {/* Footer info */}
        <div className="p-3 bg-zinc-100 border border-zinc-300 text-[11px] text-zinc-600 flex justify-between items-center">
          <span>OLTP Atomic Guarantee: All tables updated in 1 single transaction</span>
          <span className="font-bold text-zinc-900">Power BI Query Ready</span>
        </div>
      </div>
    </Modal>
  )
}
