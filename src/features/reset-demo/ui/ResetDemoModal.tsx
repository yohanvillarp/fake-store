import React, { useState } from 'react'
import { RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react'
import { api } from '@/shared/api'
import { useCart } from '@/entities/cart'
import { Modal, PixelButton } from '@/shared/ui'

interface ResetDemoModalProps {
  isOpen: boolean
  onClose: () => void
  onResetComplete?: () => void
}

export const ResetDemoModal: React.FC<ResetDemoModalProps> = ({
  isOpen,
  onClose,
  onResetComplete,
}) => {
  const { clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleReset = async () => {
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const res = await api.resetDemo()
      clearCart()
      setSuccessMsg(res.message || 'Datos de demostración reiniciados con éxito.')
      if (onResetComplete) {
        onResetComplete()
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al reiniciar los datos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="REINICIAR DATOS DE DEMOSTRACIÓN"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 font-mono text-xs">
        {successMsg ? (
          <div className="p-4 bg-emerald-50 border-2 border-emerald-900 text-emerald-900 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">DATOS RESTABLECIDOS</h4>
              <p className="mt-1 text-emerald-800">{successMsg}</p>
              <div className="mt-4">
                <PixelButton
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onClose()
                    window.location.reload()
                  }}
                >
                  Recargar página
                </PixelButton>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="p-3 bg-amber-50 border-2 border-amber-900 text-amber-950 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">¿Deseas reiniciar los datos de demostración?</p>
                <p className="mt-1 text-amber-900 leading-relaxed">
                  Esta acción restablecerá el inventario inicial de todos los productos en la base de datos y vaciará el carrito local.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-800 text-rose-900">
                {errorMsg}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200">
              <PixelButton variant="outline" size="sm" onClick={onClose} disabled={loading}>
                Cancelar
              </PixelButton>

              <PixelButton
                variant="danger"
                size="sm"
                onClick={handleReset}
                disabled={loading}
              >
                <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Restableciendo...' : 'Confirmar reinicio'}</span>
              </PixelButton>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
