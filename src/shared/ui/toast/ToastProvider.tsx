import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ShoppingBag, X } from 'lucide-react'
import { ToastContext, type ToastItem } from './toastContext'

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    ({
      message,
      productName,
      actionLabel = 'Ver carrito',
      actionUrl = '/cart',
      duration = 2800,
    }: {
      message: string
      productName?: string
      actionLabel?: string
      actionUrl?: string
      duration?: number
    }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      const newToast: ToastItem = { id, message, productName, actionLabel, actionUrl }

      setToasts((prev) => [...prev.slice(-2), newToast])

      setTimeout(() => {
        removeToast(id)
      }, duration)
    },
    [removeToast],
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Overlay Container */}
      <aside
        aria-label="Notificaciones"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto bg-white border-2 border-zinc-900 shadow-[5px_5px_0px_0px_rgba(24,24,27,1)] p-3.5 flex items-center justify-between gap-3 animate-slideIn"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 bg-emerald-500 text-white border border-zinc-900 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-900 leading-tight">
                  {toast.message}
                </p>
                {toast.productName && (
                  <p className="text-[11px] font-mono text-zinc-500 truncate mt-0.5">
                    {toast.productName}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {toast.actionUrl && (
                <Link
                  to={toast.actionUrl}
                  onClick={() => removeToast(toast.id)}
                  className="px-2.5 py-1 bg-zinc-900 text-white font-mono text-[11px] font-bold uppercase hover:bg-blue-600 transition-colors border border-zinc-900 flex items-center gap-1"
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>{toast.actionLabel}</span>
                </Link>
              )}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                aria-label="Cerrar notificación"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </aside>
    </ToastContext.Provider>
  )
}
