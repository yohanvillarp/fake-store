import React, { useEffect, useState } from 'react'
import {
  LoaderCircle,
  UserCheck,
  ShoppingBag,
  CreditCard,
  PackageCheck,
  Check,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react'

export interface StepItem {
  id: number
  title: string
  desc: string
  icon: React.ReactNode
}

interface TransactionProcessorModalProps {
  isOpen: boolean
  isProcessing: boolean
  error?: string | null
  onSuccessDone?: () => void
}

const STEPS: StepItem[] = [
  {
    id: 1,
    title: 'Validando información del cliente',
    desc: 'Verificando dirección de entrega y datos de contacto',
    icon: <UserCheck className="w-5 h-5 text-blue-600" />,
  },
  {
    id: 2,
    title: 'Creando pedido',
    desc: 'Asignando código de compra y registro temporal',
    icon: <ShoppingBag className="w-5 h-5 text-amber-600" />,
  },
  {
    id: 3,
    title: 'Registrando productos',
    desc: 'Calculando precios unitarios y distribución del envío',
    icon: <PackageCheck className="w-5 h-5 text-purple-600" />,
  },
  {
    id: 4,
    title: 'Procesando pago',
    desc: 'Registrando cuotas y validación del importe total',
    icon: <CreditCard className="w-5 h-5 text-indigo-600" />,
  },
  {
    id: 5,
    title: 'Actualizando inventario',
    desc: 'Asegurando disponibilidad de stock para cada artículo',
    icon: <PackageCheck className="w-5 h-5 text-emerald-600" />,
  },
  {
    id: 6,
    title: 'Confirmando compra',
    desc: 'Finalizando el registro del pedido de forma segura',
    icon: <Check className="w-5 h-5 text-emerald-600" />,
  },
]

export const TransactionProcessorModal: React.FC<TransactionProcessorModalProps> = ({
  isOpen,
  isProcessing,
  error,
  onSuccessDone,
}) => {
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    if (!isOpen || error) return

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length) return prev + 1
        return prev
      })
    }, 450)

    return () => {
      clearInterval(interval)
      setCurrentStep(1)
    }
  }, [isOpen, error])

  useEffect(() => {
    if (!isProcessing && !error && currentStep === STEPS.length && onSuccessDone) {
      const timeout = setTimeout(() => {
        onSuccessDone()
      }, 700)
      return () => clearTimeout(timeout)
    }
  }, [isProcessing, error, currentStep, onSuccessDone])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border-3 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] overflow-hidden">
        {/* Cabecera */}
        <div className="p-5 border-b-2 border-zinc-900 bg-zinc-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!error && isProcessing && (
              <LoaderCircle className="w-5 h-5 animate-spin text-amber-400" />
            )}
            <h3 className="font-mono font-bold text-sm tracking-wider uppercase">
              {error ? 'No se pudo completar el pedido' : 'Procesando tu pedido'}
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">Seguro</span>
        </div>

        {/* Contenido de pasos */}
        <div className="p-6">
          {error ? (
            <div className="p-4 bg-rose-50 border-2 border-rose-900 text-rose-950 shadow-[3px_3px_0px_0px_rgba(159,18,57,1)] mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-rose-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">EL PEDIDO NO PUDO COMPLETARSE</h4>
                  <p className="text-xs mt-1 text-rose-800">{error}</p>
                  <p className="text-[11px] font-mono text-rose-700 mt-2">
                    Garantía de seguridad: No se realizó ningún cobro ni se generaron cargos indebidos.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {STEPS.map((step) => {
                const isDone = currentStep > step.id
                const isCurrent = currentStep === step.id

                return (
                  <div
                    key={step.id}
                    className={`flex items-center justify-between p-3 border-2 transition-all ${
                      isDone
                        ? 'border-zinc-900 bg-emerald-50 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]'
                        : isCurrent
                          ? 'border-zinc-900 bg-blue-50 shadow-[3px_3px_0px_0px_rgba(37,99,235,1)] scale-[1.01]'
                          : 'border-zinc-200 bg-zinc-50 opacity-40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-none border border-zinc-900 flex items-center justify-center font-mono font-bold text-xs ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                              ? 'bg-blue-600 text-white animate-pulse'
                              : 'bg-zinc-200 text-zinc-700'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                      </div>

                      <div>
                        <h4 className="font-bold text-xs text-zinc-900">{step.title}</h4>
                        <p className="text-[11px] text-zinc-500">{step.desc}</p>
                      </div>
                    </div>

                    <div className="shrink-0 pl-2">
                      {isDone ? (
                        <span className="text-[10px] font-mono font-bold uppercase text-emerald-800">
                          Listo
                        </span>
                      ) : isCurrent ? (
                        <LoaderCircle className="w-4 h-4 animate-spin text-blue-600" />
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pie informativo amigable */}
          <div className="mt-5 pt-4 border-t border-zinc-200 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verificación y consistencia garantizada
            </span>
            <span>Fake Store</span>
          </div>
        </div>
      </div>
    </div>
  )
}
