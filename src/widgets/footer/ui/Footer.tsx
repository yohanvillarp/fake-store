import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Store, RotateCcw } from 'lucide-react'
import { ResetDemoModal } from '@/features/reset-demo'

export const Footer: React.FC = () => {
  const [resetModalOpen, setResetModalOpen] = useState(false)

  return (
    <>
      <footer className="bg-zinc-900 text-white border-t-4 border-zinc-900 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Col 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 border border-white flex items-center justify-center text-white">
                  <Store className="w-4 h-4" />
                </div>
                <span className="font-mono font-black text-xl tracking-tight">FAKE STORE</span>
              </div>
              <p className="text-zinc-400 text-sm font-mono max-w-sm">
                Pequeños detalles. Grandes espacios. Objetos sencillos para hacer tu espacio un poco más tuyo.
              </p>
              <div className="pt-2">
                <a
                  href="https://github.com/yohanvillarp/fake-store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 rounded transition-colors"
                >
                  <img src="/github.svg" alt="GitHub" className="w-4 h-4 invert" />
                  <span>Ver código en GitHub</span>
                </a>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-zinc-400 mb-3">
                Navegación
              </h4>
              <ul className="space-y-2 text-sm font-medium">
                <li>
                  <Link to="/" className="text-zinc-300 hover:text-white transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="text-zinc-300 hover:text-white transition-colors">
                    Tienda
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="text-zinc-300 hover:text-white transition-colors">
                    Pedidos
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="text-zinc-300 hover:text-white transition-colors">
                    Carrito
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Practical Info */}
            <div className="space-y-3">
              <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-zinc-400 mb-3">
                Información de Tienda
              </h4>
              <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                Moneda oficial de referencia: <strong>Real brasileño (R$)</strong>. Entregas simuladas en territorio brasileño.
              </p>

              {/* Discreet Demo Reset Tool */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalOpen(true)}
                  className="text-[11px] font-mono text-zinc-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reiniciar datos de demostración</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Attribution & Olist Note */}
          <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-mono gap-3">
            <div className="flex items-center gap-1.5">
              <span>© 2026 FAKE STORE. Creado por</span>
              <a
                href="https://github.com/yohanvillarp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-white underline font-medium transition-colors"
              >
                Yohan Villar
              </a>
            </div>
            <p className="text-[11px] text-zinc-500 text-center sm:text-right">
              Proyecto demostrativo y educativo basado en el Brazilian E-Commerce Public Dataset by Olist.
            </p>
          </div>
        </div>
      </footer>

      <ResetDemoModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
      />
    </>
  )
}
