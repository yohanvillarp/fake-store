import React, { useState } from 'react'
import { Database, ChevronDown, ChevronUp, CheckCircle2, ArrowRight } from 'lucide-react'

export const WhyOltpCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-zinc-900 text-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] p-5">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-400 text-zinc-950 font-bold border border-zinc-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-mono font-bold text-sm tracking-wide text-amber-400 uppercase">
              Academic Context: Why is this an OLTP System?
            </h4>
            <p className="text-xs text-zinc-400">
              Operational processing vs. Power BI analytical processing (OLAP)
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-1 text-zinc-400 hover:text-white transition-colors"
          aria-label={isExpanded ? 'Collapse card' : 'Expand card'}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-zinc-800 text-xs space-y-3 font-mono">
          <div className="text-zinc-300">
            <span className="font-bold text-amber-300">THIS OPERATION EXECUTED AN ACID TRANSACTION:</span>
            <ul className="mt-2 space-y-1.5 pl-1 text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Created 1 order header row (<code className="text-amber-200">fake_store_orders</code>).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Upserted customer operational contact info (<code className="text-amber-200">fake_store_customers</code>).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Created line item details (<code className="text-amber-200">fake_store_order_items</code>).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Registered payment settlement (<code className="text-amber-200">fake_store_payments</code>).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Decremented live product stock immediately in PostgreSQL.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Recorded precise UTC timestamps and committed changes together.</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-none flex items-center justify-between flex-wrap gap-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white px-2 py-0.5 font-bold">OLTP</span>
              <span className="text-zinc-300">Records individual live transactions at high concurrency.</span>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500" />
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-zinc-950 px-2 py-0.5 font-bold">OLAP (Power BI)</span>
              <span className="text-zinc-300">Analyzes and aggregates millions of historical records.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
