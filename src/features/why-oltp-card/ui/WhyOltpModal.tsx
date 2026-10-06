import React from 'react'
import { Modal } from '@/shared/ui'
import {
  Database,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Layers,
} from 'lucide-react'


interface WhyOltpModalProps {
  isOpen: boolean
  onClose: () => void
}

export const WhyOltpModal: React.FC<WhyOltpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="¿QUÉ OCURRIÓ CON LOS DATOS? (ARQUITECTURA OLTP)"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6 font-mono text-xs text-zinc-800">
        {/* Banner explicativo */}
        <div className="p-4 bg-zinc-900 text-white border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="font-bold text-sm">
              TRANSACCIÓN ACID OPERACIONAL EN POSTGRESQL
            </span>
          </div>
          <span className="text-[11px] bg-blue-600 px-2 py-0.5 text-white font-bold">
            OLTP ➔ POWER BI READY
          </span>
        </div>

        {/* 1. Flujo Relacional de Entidades */}
        <div className="p-4 bg-zinc-50 border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] space-y-3">
          <h4 className="font-bold text-sm text-zinc-900 uppercase flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            1. Secuencia de Persistencia Relacional
          </h4>
          <p className="text-zinc-600 text-xs leading-relaxed">
            Al pulsar &quot;Realizar Pedido&quot;, la API de Vercel Serverless abrió una única transacción SQL que afectó de forma coordinada a 5 tablas en PostgreSQL:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center pt-2">
            <div className="p-2.5 bg-white border border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)]">
              <span className="block font-bold text-blue-700">1. Cliente</span>
              <span className="text-[10px] text-zinc-500">fake_store_customers</span>
            </div>
            <div className="p-2.5 bg-white border border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)]">
              <span className="block font-bold text-blue-700">2. Pedido</span>
              <span className="text-[10px] text-zinc-500">fake_store_orders</span>
            </div>
            <div className="p-2.5 bg-white border border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)]">
              <span className="block font-bold text-blue-700">3. Items</span>
              <span className="text-[10px] text-zinc-500">fake_store_order_items</span>
            </div>
            <div className="p-2.5 bg-white border border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)]">
              <span className="block font-bold text-blue-700">4. Pago</span>
              <span className="text-[10px] text-zinc-500">fake_store_payments</span>
            </div>
            <div className="p-2.5 bg-white border border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)]">
              <span className="block font-bold text-blue-700">5. Stock</span>
              <span className="text-[10px] text-zinc-500">fake_store_products</span>
            </div>
          </div>
        </div>

        {/* 2. Bloque Transaccional BEGIN ... COMMIT */}
        <div className="p-4 bg-zinc-900 text-zinc-100 border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 text-xs">Garantía Atómica (ACID):</span>
            <span className="text-[10px] text-zinc-400">PostgreSQL Transaction</span>
          </div>
          <pre className="text-[11px] font-mono leading-relaxed overflow-x-auto text-emerald-400 bg-zinc-950 p-3 border border-zinc-800">
{`BEGIN;
  -- 1. Bloqueo de fila y validación de stock concurrente
  SELECT stock FROM fake_store_products WHERE product_id = $1 FOR UPDATE;
  
  -- 2. Inserción de cabecera de pedido y cliente
  INSERT INTO fake_store_customers (...) VALUES (...) ON CONFLICT DO UPDATE;
  INSERT INTO fake_store_orders (order_id, total, status, ...) VALUES (...);
  
  -- 3. Inserción de líneas de pedido y distribución de flete
  INSERT INTO fake_store_order_items (...) VALUES (...);
  
  -- 4. Registro del método de pago
  INSERT INTO fake_store_payments (...) VALUES (...);
  
  -- 5. Decremento atómico del stock disponible
  UPDATE fake_store_products SET stock = stock - $qty WHERE product_id = $1;
COMMIT;`}
          </pre>
          <p className="text-[11px] text-zinc-400">
            Si cualquiera de los pasos falla o no hay suficiente stock, se ejecuta <code className="text-rose-400">ROLLBACK</code> inmediato: no quedan registros huérfanos ni cobros inconsistentes.
          </p>
        </div>

        {/* 3. Conexión con Power BI (OLTP vs OLAP) */}
        <div className="p-4 bg-zinc-50 border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] space-y-3">
          <h4 className="font-bold text-sm text-zinc-900 uppercase flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            3. Integración con Power BI (OLAP)
          </h4>

          <div className="flex items-center justify-between flex-wrap gap-2 p-3 bg-white border border-zinc-300 text-xs">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white px-2 py-0.5 font-bold">OLTP (Fake Store)</span>
              <span className="text-zinc-700">Registra transacciones vivas en tiempo real.</span>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-400" />
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-zinc-950 px-2 py-0.5 font-bold">OLAP (Power BI)</span>
              <span className="text-zinc-700">Analiza y agrega datos históricos de Olist.</span>
            </div>
          </div>

          <p className="text-zinc-600 text-xs leading-relaxed">
            Al pulsar <strong>&quot;Refresh&quot;</strong> en Power BI, el informe consulta la base de datos PostgreSQL mediante DirectQuery o importación programada. Los pedidos creados aquí (<code className="text-zinc-900 bg-zinc-200 px-1">source = &apos;fake_store&apos;</code>) se integran directamente con los 100.000 registros históricos del dataset Olist.
          </p>
        </div>

        {/* Cierre */}
        <div className="p-3 bg-zinc-100 border border-zinc-300 text-[11px] text-zinc-600 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Integridad referencial y compatibilidad con el esquema Olist garantizadas.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Cerrar explicación
          </button>
        </div>
      </div>
    </Modal>
  )
}
