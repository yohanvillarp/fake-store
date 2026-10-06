import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShoppingBag,
  Eye,
  Check,
  Truck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { api, type ApiProduct } from '@/shared/api'
import { useCart } from '@/entities/cart'
import { ProductCard } from '@/entities/product'
import { ProductPixelArt } from '@/shared/assets'
import { formatBRL, getCategoryLabelEs, getStockStatus } from '@/shared/lib'
import { PixelBadge, PixelButton, PixelLoader, useToast } from '@/shared/ui'

export const HomePage: React.FC = () => {
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [heroAdded, setHeroAdded] = useState(false)

  useEffect(() => {
    let ignore = false
    api
      .getProducts()
      .then((data) => {
        if (!ignore) setProducts(data)
      })
      .catch((err) => {
        console.error('Failed to load products on Home:', err)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  // Featured hero product: Pixel Desk Lamp (or first available)
  const heroProduct =
    products.find((p) => p.product_id === '1e9e8ef04dbcff4541ed26657ea517e5') ||
    products[0] ||
    null

  const heroStock = heroProduct ? getStockStatus(heroProduct.stock) : null

  // 4 Featured products (excluding hero if desired, or top 4)
  const featuredProducts = products.slice(0, 4)

  const handleHeroAdd = () => {
    if (!heroProduct || heroProduct.stock <= 0) return
    const success = addToCart(heroProduct, 1)

    if (success) {
      setHeroAdded(true)
      setTimeout(() => setHeroAdded(false), 1600)

      showToast({
        message: 'Producto añadido al carrito (máx. 5 por persona)',
        productName: heroProduct.display_name,
        actionLabel: 'Ver carrito',
        actionUrl: '/cart',
      })

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('fake-store:cart-bounce'))
      }
    } else {
      showToast({
        message: 'Límite alcanzado: máximo 5 unidades por persona para este artículo',
        actionLabel: 'Ver carrito',
        actionUrl: '/cart',
      })
    }
  }


  const categoryHighlights = [
    { id: 'furniture_decor', name: 'Decoración' },
    { id: 'housewares', name: 'Hogar' },
    { id: 'computers_accessories', name: 'Tecnología' },
    { id: 'bed_bath_table', name: 'Dormitorio' },
    { id: 'luggage_accessories', name: 'Accesorios' },
    { id: 'telephony', name: 'Audio y Telefonía' },
    { id: 'art', name: 'Arte y Cuadros' },
    { id: 'watches_gifts', name: 'Relojes' },
  ]

  return (
    <div className="space-y-16 py-8">
      {/* 1. Hero Comercial con Producto Destacado */}
      <section className="bg-white border-3 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] p-8 sm:p-12 relative overflow-hidden pixel-grid-pattern">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Columna Izquierda: Branding y Copy Comercial */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <PixelBadge variant="fake_store">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>NUEVA COLECCIÓN</span>
              </PixelBadge>
              <span className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-wider">
                Edición Limitada Pixel
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-zinc-900 uppercase leading-none">
                PEQUEÑOS DETALLES. <br />
                <span className="text-blue-600">GRANDES ESPACIOS.</span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-600 font-mono max-w-lg pt-2 leading-relaxed">
                Descubre objetos sencillos con estética retro para hacer tu rincón un poco más tuyo.
              </p>
            </div>

            <div className="pt-2">
              <Link to="/shop">
                <PixelButton variant="primary" size="lg" className="text-sm px-6 py-3">
                  <ShoppingBag className="w-4 h-4" />
                  <span>VER COLECCIÓN</span>
                  <ArrowRight className="w-4 h-4" />
                </PixelButton>
              </Link>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta Grande de Producto Destacado */}
          <div className="lg:col-span-5">
            {heroProduct ? (
              <div className="bg-white border-2 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] p-6 flex flex-col items-center justify-between text-center relative group">
                {/* Badge flotante destacado */}
                <div className="absolute top-4 left-4">
                  <span className="pixel-badge bg-blue-600 text-white border-zinc-900 text-[10px]">
                    DESTACADO
                  </span>
                </div>

                {/* Stock badge */}
                {heroStock && (
                  <div className="absolute top-4 right-4">
                    <span className={`pixel-badge ${heroStock.badgeClass}`}>
                      {heroStock.label}
                    </span>
                  </div>
                )}

                {/* Gran Ilustración Pixel Art */}
                <Link
                  to={`/product/${heroProduct.product_id}`}
                  className="py-4 my-2 flex items-center justify-center transition-transform hover:scale-105 duration-150"
                  title={heroProduct.display_name}
                >
                  <ProductPixelArt
                    productId={heroProduct.product_id}
                    categoryName={heroProduct.category_name}
                    size="lg"
                  />
                </Link>

                {/* Datos del producto */}
                <div className="space-y-1 w-full pt-2 border-t-2 border-zinc-200">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 block">
                    {getCategoryLabelEs(heroProduct.category_name)}
                  </span>
                  <h3 className="font-mono font-black text-xl text-zinc-900">
                    <Link
                      to={`/product/${heroProduct.product_id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {heroProduct.display_name}
                    </Link>
                  </h3>
                  <div className="font-mono font-black text-2xl text-zinc-900 py-1">
                    {formatBRL(heroProduct.price)}
                  </div>
                </div>

                {/* Botones de acción del Hero */}
                <div className="grid grid-cols-2 gap-2 w-full pt-4">
                  <Link to={`/product/${heroProduct.product_id}`} className="w-full">
                    <PixelButton variant="outline" size="sm" className="w-full text-xs">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver producto</span>
                    </PixelButton>
                  </Link>

                  <PixelButton
                    variant={heroAdded ? 'accent' : 'primary'}
                    size="sm"
                    className="w-full text-xs"
                    disabled={heroProduct.stock <= 0}
                    onClick={handleHeroAdd}
                  >
                    {heroAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-zinc-900" />
                        <span className="font-black text-zinc-900">¡Añadido!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Añadir</span>
                      </>
                    )}
                  </PixelButton>
                </div>
              </div>
            ) : (
              <PixelLoader
                variant="card"
                message="Cargando producto destacado..."
                submessage="Sincronizando inventario en tiempo real..."
              />
            )}
          </div>
        </div>
      </section>

      {/* 2. Sección: Productos Destacados */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b-2 border-zinc-900">
          <div>
            <h2 className="font-mono font-black text-2xl text-zinc-900 uppercase tracking-tight">
              Productos destacados
            </h2>
            <p className="text-xs font-mono text-zinc-500">
              Una pequeña selección de nuestros favoritos para empezar.
            </p>
          </div>

          <Link to="/shop">
            <PixelButton variant="outline" size="sm">
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </PixelButton>
          </Link>
        </div>

        {loading ? (
          <PixelLoader
            variant="skeleton-grid"
            count={4}
            message="Preparando selección destacada..."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
                onAddToCart={(p) => addToCart(p, 1)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. Sección: Comprar por Categoría */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b-2 border-zinc-900">
          <div>
            <h2 className="font-mono font-black text-2xl text-zinc-900 uppercase tracking-tight">
              Comprar por categoría
            </h2>
            <p className="text-xs font-mono text-zinc-500">
              Encuentra lo que necesitas organizado por colecciones.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categoryHighlights.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="p-5 bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] hover:-translate-y-1 transition-all flex flex-col justify-between group cursor-pointer hover:shadow-[5px_5px_0px_0px_rgba(37,99,235,1)]"
            >
              <div>
                <span className="text-[10px] font-mono text-zinc-400 block mb-1 uppercase font-bold">
                  Colección
                </span>
                <h4 className="font-mono font-bold text-sm text-zinc-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h4>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-mono text-blue-600 font-bold">
                <span>Explorar</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Sección de Beneficios Comerciales */}
      <section className="bg-zinc-50 border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-1 mb-8">
            <h3 className="font-mono font-black text-xl text-zinc-900 uppercase">
              La Experiencia Fake Store
            </h3>
            <p className="text-xs font-mono text-zinc-500">
              Diseño cuidado y procesos transparentes en cada detalle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-5 bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] space-y-2">
              <div className="w-9 h-9 bg-blue-100 border-2 border-zinc-900 text-blue-700 flex items-center justify-center font-bold text-sm">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-zinc-900 uppercase">Entrega Organizada</h4>
              <p className="text-zinc-600 leading-relaxed">
                Cálculo de fletes y logística estructurada según destinos y dimensiones de cada artículo.
              </p>
            </div>

            <div className="p-5 bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] space-y-2">
              <div className="w-9 h-9 bg-amber-100 border-2 border-zinc-900 text-amber-800 flex items-center justify-center font-bold text-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-zinc-900 uppercase">Compra Sencilla</h4>
              <p className="text-zinc-600 leading-relaxed">
                Proceso de compra sin fricción con control riguroso de inventario en tiempo real.
              </p>
            </div>

            <div className="p-5 bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] space-y-2">
              <div className="w-9 h-9 bg-emerald-100 border-2 border-zinc-900 text-emerald-800 flex items-center justify-center font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-zinc-900 uppercase">Pagos Simulados</h4>
              <p className="text-zinc-600 leading-relaxed">
                Entorno de demostración seguro que admite tarjetas, cuotas y métodos brasileños comunes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
