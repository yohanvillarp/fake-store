import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShoppingBag, Store, Menu, X, Search } from 'lucide-react'
import { useCart } from '@/entities/cart'

export const Header: React.FC = () => {
  const { unitsCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [badgeBouncing, setBadgeBouncing] = useState(false)

  // Bounce animation when cart-add event fires


  useEffect(() => {
    const handleCartBounce = () => {
      setBadgeBouncing(true)
      const timer = setTimeout(() => setBadgeBouncing(false), 300)
      return () => clearTimeout(timer)
    }

    window.addEventListener('fake-store:cart-bounce', handleCartBounce)
    return () => window.removeEventListener('fake-store:cart-bounce', handleCartBounce)
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-zinc-900 shadow-[0px_3px_0px_0px_rgba(24,24,27,1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 select-none group"
          title="Fake Store - Inicio"
        >
          <div className="w-9 h-9 bg-blue-600 border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] flex items-center justify-center text-white group-hover:bg-blue-700 transition-colors">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-zinc-900 block font-mono">
              FAKE STORE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wider">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors hover:text-blue-600 ${
                isActive
                  ? 'text-blue-600 underline underline-offset-8 decoration-2'
                  : 'text-zinc-800'
              }`
            }
          >
            Inicio
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `transition-colors hover:text-blue-600 ${
                isActive
                  ? 'text-blue-600 underline underline-offset-8 decoration-2'
                  : 'text-zinc-800'
              }`
            }
          >
            Tienda
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `transition-colors hover:text-blue-600 ${
                isActive
                  ? 'text-blue-600 underline underline-offset-8 decoration-2'
                  : 'text-zinc-800'
              }`
            }
          >
            Pedidos
          </NavLink>
        </nav>

        {/* Search, Cart Trigger & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <Link to="/shop" title="Buscar productos">
            <div className="pixel-button bg-white text-zinc-800 py-1.5 px-2.5 text-xs flex items-center gap-1.5 cursor-pointer hover:bg-zinc-50">
              <Search className="w-4 h-4 text-zinc-700" />
              <span className="hidden lg:inline">Buscar</span>
            </div>
          </Link>

          <Link to="/cart" title="Ver carrito de compras">
            <div className="pixel-button bg-white text-zinc-900 py-1.5 px-3 text-xs flex items-center gap-2 cursor-pointer hover:bg-zinc-50">
              <ShoppingBag className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Carrito</span>
              <span
                className={`w-5 h-5 bg-zinc-900 text-white font-mono text-xs flex items-center justify-center font-bold ${
                  badgeBouncing ? 'animate-cart-badge bg-blue-600' : ''
                }`}
              >
                {unitsCount}
              </span>
            </div>
          </Link>

          <button
            type="button"
            className="md:hidden p-2 border-2 border-zinc-900 bg-white shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] text-zinc-900 cursor-pointer"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-zinc-900 bg-white p-4 space-y-2 font-bold uppercase text-sm">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 hover:bg-zinc-100"
          >
            Inicio
          </NavLink>
          <NavLink
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 hover:bg-zinc-100"
          >
            Tienda
          </NavLink>
          <NavLink
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 hover:bg-zinc-100"
          >
            Pedidos
          </NavLink>
          <NavLink
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 hover:bg-zinc-100 text-blue-600"
          >
            Carrito ({unitsCount})
          </NavLink>
        </div>
      )}
    </header>
  )
}
