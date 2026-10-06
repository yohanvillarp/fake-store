import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CreditCard,
  FileText,
  Ticket,
  Wallet,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react'
import { useCart } from '@/entities/cart'
import { api, type ApiOrderDetail } from '@/shared/api'
import { formatBRL } from '@/shared/lib'
import { PixelButton, PixelCard, PixelBadge } from '@/shared/ui'
import { TransactionProcessorModal } from '@/features/transaction-processor'

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, freight, total, clearCart } = useCart()

  // Form State
  const [firstName, setFirstName] = useState('Mariana')
  const [lastName, setLastName] = useState('Silva')
  const [email, setEmail] = useState('mariana.silva@example.com')
  const [country] = useState('Brasil')
  const [state, setState] = useState('SP')
  const [city, setCity] = useState('São Paulo')
  const [address, setAddress] = useState('Av. Paulista, 1000')
  const [zipCode, setZipCode] = useState('01310-100')

  // Payment State
  const [paymentType, setPaymentType] = useState<string>('credit_card')
  const [installments, setInstallments] = useState<number>(1)
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8829')
  const [cardHolder, setCardHolder] = useState('MARIANA SILVA')
  const [cardExpiry, setCardExpiry] = useState('11/29')
  const [cardCvv, setCardCvv] = useState('842')

  // Transaction Processing State
  const [isProcessingModal, setIsProcessingModal] = useState(false)
  const [isApiLoading, setIsApiLoading] = useState(false)
  const [transactionError, setTransactionError] = useState<string | null>(null)
  const [confirmedOrder, setConfirmedOrder] = useState<ApiOrderDetail | null>(null)

  const brazilianStates = [
    'SP',
    'RJ',
    'MG',
    'RS',
    'PR',
    'SC',
    'BA',
    'PE',
    'CE',
    'GO',
    'DF',
    'ES',
    'AM',
    'PA',
  ]

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) return

    setTransactionError(null)
    setIsProcessingModal(true)
    setIsApiLoading(true)

    const payload = {
      customer: {
        first_name: firstName,
        last_name: lastName,
        email,
        country: 'Brazil',
        state,
        city,
        zip_code: zipCode,
      },
      items: items.map((item) => ({
        product_id: item.product.product_id,
        quantity: item.quantity,
      })),
      payment: {
        payment_type: paymentType,
        payment_installments: paymentType === 'credit_card' ? installments : 1,
      },
    }

    try {
      const response = await api.createOrder(payload)
      setIsApiLoading(false)
      // Save confirmed order and clear cart ONLY on successful transaction
      setConfirmedOrder(response.order)
      clearCart()
    } catch (err) {
      setIsApiLoading(false)
      const errorMsg =
        err instanceof Error ? err.message : 'No se pudo completar el pedido.'
      setTransactionError(errorMsg)
    }
  }

  // Vista de confirmación de pedido
  if (confirmedOrder) {
    return (
      <div className="py-12 max-w-2xl mx-auto space-y-8 animate-fadeIn">
        <div className="bg-white border-3 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 border-2 border-zinc-900 flex items-center justify-center mx-auto text-emerald-600 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <PixelBadge variant="fake_store">COMPRA EXITOSA</PixelBadge>
            <h1 className="font-mono font-black text-3xl text-zinc-900 uppercase mt-2">
              ¡PEDIDO CONFIRMADO!
            </h1>
            <p className="font-mono font-bold text-xl text-blue-600 mt-1">
              {confirmedOrder.order_code}
            </p>
            <p className="text-xs font-mono text-zinc-500 mt-1">
              Gracias por tu compra. Tu pedido ha sido registrado con éxito.
            </p>
          </div>

          <div className="p-4 bg-zinc-50 border-2 border-zinc-900 font-mono text-xs text-left space-y-2">
            <div className="flex justify-between border-b border-zinc-200 pb-2">
              <span className="text-zinc-500">Cliente:</span>
              <span className="font-bold text-zinc-900">
                {confirmedOrder.customer.first_name} {confirmedOrder.customer.last_name}
              </span>
            </div>
            <div className="flex justify-between border-b border-zinc-200 pb-2">
              <span className="text-zinc-500">Destino:</span>
              <span className="font-bold text-zinc-900">
                {confirmedOrder.customer.city} • {confirmedOrder.customer.state}
              </span>
            </div>
            <div className="flex justify-between border-b border-zinc-200 pb-2">
              <span className="text-zinc-500">Total pagado:</span>
              <span className="font-black text-zinc-900 text-sm">
                {formatBRL(confirmedOrder.total)}
              </span>
            </div>
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Estado:</span>
              <span className="uppercase">Pagado</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to={`/orders/${confirmedOrder.order_id}`} className="w-full sm:w-auto">
              <PixelButton variant="primary" size="md" className="w-full">
                <span>VER DETALLES DEL PEDIDO</span>
                <ArrowRight className="w-4 h-4" />
              </PixelButton>
            </Link>

            <Link to="/shop" className="w-full sm:w-auto">
              <PixelButton variant="outline" size="md" className="w-full">
                <span>SEGUIR COMPRANDO</span>
              </PixelButton>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <p className="font-mono text-sm text-zinc-500">Tu carrito está vacío. Nada que pagar.</p>
        <Link to="/shop">
          <PixelButton variant="primary" size="sm">
            Ir a la tienda
          </PixelButton>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 py-8">
      {/* Título */}
      <div className="pb-4 border-b-2 border-zinc-900">
        <h1 className="font-mono font-black text-3xl text-zinc-900 uppercase">
          Finalizar Compra
        </h1>
        <p className="text-xs font-mono text-zinc-500 mt-0.5">
          Completa tus datos de envío y confirma tu pedido.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Columna Izquierda: Datos del Cliente y Envío */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tarjeta: Información de Contacto */}
          <PixelCard className="space-y-4">
            <h3 className="font-mono font-bold text-sm text-zinc-900 uppercase border-b border-zinc-200 pb-2">
              1. Información del Cliente
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-zinc-700 uppercase mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="pixel-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-zinc-700 uppercase mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="pixel-input text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono font-bold text-zinc-700 uppercase mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pixel-input text-xs"
                />
              </div>
            </div>
          </PixelCard>

          {/* Tarjeta: Dirección de Entrega */}
          <PixelCard className="space-y-4">
            <h3 className="font-mono font-bold text-sm text-zinc-900 uppercase border-b border-zinc-200 pb-2">
              2. Dirección de Entrega (Brasil)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono font-bold text-zinc-700 uppercase mb-1">
                  Calle y Número *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pixel-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-zinc-700 uppercase mb-1">
                  Código Postal (CEP) *
                </label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="pixel-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-zinc-700 uppercase mb-1">
                  Ciudad *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="pixel-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-zinc-700 uppercase mb-1">
                  Estado (UF) *
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="pixel-input py-2 bg-white text-xs cursor-pointer"
                >
                  {brazilianStates.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-zinc-700 uppercase mb-1">
                  País
                </label>
                <input
                  type="text"
                  disabled
                  value={country}
                  className="pixel-input bg-zinc-100 cursor-not-allowed text-zinc-600 text-xs"
                />
              </div>
            </div>
          </PixelCard>

          {/* Tarjeta: Método de Pago */}
          <PixelCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
              <h3 className="font-mono font-bold text-sm text-zinc-900 uppercase">
                3. Método de Pago (Simulación)
              </h3>
              <span className="text-[10px] font-mono text-zinc-500 uppercase bg-amber-100 text-amber-900 px-2 py-0.5 border border-amber-300">
                PAGO DEMO • SIN CARGOS REALES
              </span>
            </div>

            {/* Pestañas de Métodos de Pago */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'credit_card', label: 'Tarjeta de Crédito', icon: <CreditCard className="w-4 h-4" /> },
                { id: 'boleto', label: 'Boleto Bancario', icon: <FileText className="w-4 h-4" /> },
                { id: 'voucher', label: 'Vale / Cupón', icon: <Ticket className="w-4 h-4" /> },
                { id: 'debit_card', label: 'Tarjeta de Débito', icon: <Wallet className="w-4 h-4" /> },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentType(m.id)}
                  className={`p-3 border-2 font-mono text-xs font-bold uppercase flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentType === m.id
                      ? 'bg-blue-600 text-white border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:border-zinc-900'
                  }`}
                >
                  {m.icon}
                  <span className="text-center">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Detalles de Tarjeta de Crédito */}
            {paymentType === 'credit_card' && (
              <div className="p-4 bg-zinc-50 border-2 border-zinc-900 space-y-4 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono font-bold text-zinc-700 uppercase mb-1">
                      Número de Tarjeta (Simulado)
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="pixel-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-zinc-700 uppercase mb-1">
                      Titular de la Tarjeta
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="pixel-input text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-zinc-700 uppercase mb-1">
                        Vencimiento
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="pixel-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-zinc-700 uppercase mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="pixel-input text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Opción de Cuotas */}
                <div className="pt-2 border-t border-zinc-200">
                  <label className="block text-xs font-mono font-bold text-zinc-800 uppercase mb-1">
                    Cuotas:
                  </label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="pixel-input py-2 text-xs font-mono font-bold bg-white cursor-pointer"
                  >
                    <option value={1}>1 cuota de {formatBRL(total)} (sin interés)</option>
                    <option value={2}>2 cuotas de {formatBRL(total / 2)}</option>
                    <option value={3}>3 cuotas de {formatBRL(total / 3)}</option>
                    <option value={6}>6 cuotas de {formatBRL(total / 6)}</option>
                  </select>
                </div>
              </div>
            )}

            {paymentType === 'boleto' && (
              <div className="p-4 bg-zinc-50 border border-zinc-300 font-mono text-xs text-zinc-600">
                Se generará un boleto bancario simulado que quedará registrado y validado para la demostración.
              </div>
            )}

            {paymentType === 'voucher' && (
              <div className="p-4 bg-zinc-50 border border-zinc-300 font-mono text-xs text-zinc-600">
                Se aplicará el importe completo mediante cupón de crédito comercial demo.
              </div>
            )}

            {paymentType === 'debit_card' && (
              <div className="p-4 bg-zinc-50 border border-zinc-300 font-mono text-xs text-zinc-600">
                Pago mediante tarjeta de débito en un único cobro inmediato.
              </div>
            )}
          </PixelCard>
        </div>

        {/* Columna Derecha: Resumen y Botón de Pago */}
        <div>
          <PixelCard variant="raised" className="space-y-6 sticky top-24">
            <h3 className="font-mono font-black text-lg text-zinc-900 uppercase border-b-2 border-zinc-900 pb-3">
              Resumen del Pedido
            </h3>

            {/* Lista resumida de artículos */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.product.product_id}
                  className="flex items-center justify-between text-xs font-mono py-1.5 border-b border-zinc-100"
                >
                  <div className="truncate pr-2">
                    <span className="font-bold text-zinc-900">{item.product.display_name}</span>
                    <span className="text-zinc-400 block text-[10px]">
                      {item.quantity} × {formatBRL(item.product.price)}
                    </span>
                  </div>
                  <span className="font-bold text-zinc-900 shrink-0">
                    {formatBRL(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="space-y-2 text-sm font-mono pt-2 border-t border-zinc-200">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900">{formatBRL(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Envío</span>
                <span className="font-bold text-zinc-900">{formatBRL(freight)}</span>
              </div>
              <div className="pt-2 border-t-2 border-zinc-900 flex justify-between text-base">
                <span className="font-black text-zinc-900 uppercase">Total a Pagar</span>
                <span className="font-black text-xl text-blue-700">{formatBRL(total)}</span>
              </div>
            </div>

            {/* Botón de Realizar Pedido */}
            <PixelButton
              type="submit"
              variant="accent"
              size="lg"
              className="w-full text-base py-3"
              disabled={isApiLoading}
            >
              <ShoppingBag className="w-5 h-5 text-zinc-900" />
              <span>REALIZAR PEDIDO</span>
            </PixelButton>
          </PixelCard>
        </div>
      </form>

      {/* Modal de Procesamiento de Pedido */}
      <TransactionProcessorModal
        isOpen={isProcessingModal}
        isProcessing={isApiLoading}
        error={transactionError}
        onSuccessDone={() => {
          setIsProcessingModal(false)
        }}
      />
    </div>
  )
}
