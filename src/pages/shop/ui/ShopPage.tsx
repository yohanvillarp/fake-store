import React, { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { api, type ApiProduct } from '@/shared/api'
import { useCart } from '@/entities/cart'
import { ProductCard } from '@/entities/product'
import { getCategoryLabelEs } from '@/shared/lib'
import { PixelButton, PixelLoader } from '@/shared/ui'

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'stock'>('featured')

  const selectedCategory = searchParams.get('category') || 'all'
  const searchTerm = searchParams.get('search') || ''

  const setSelectedCategory = (cat: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (cat === 'all') next.delete('category')
      else next.set('category', cat)
      return next
    })
  }

  const setSearchTerm = (term: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (!term) next.delete('search')
      else next.set('search', term)
      return next
    })
  }

  useEffect(() => {
    let ignore = false
    api
      .getProducts()
      .then((data) => {
        if (!ignore) setProducts(data)
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  const categories = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => set.add(p.category_name))
    return ['all', ...Array.from(set)]
  }, [products])

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'all' || p.category_name === selectedCategory
        const term = searchTerm.toLowerCase().trim()
        const matchesSearch =
          !term ||
          p.display_name.toLowerCase().includes(term) ||
          getCategoryLabelEs(p.category_name).toLowerCase().includes(term) ||
          p.category_name.toLowerCase().includes(term)
        return matchesCategory && matchesSearch
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price
        if (sortBy === 'price-desc') return b.price - a.price
        if (sortBy === 'stock') return b.stock - a.stock
        return 0
      })
  }, [products, selectedCategory, searchTerm, sortBy])

  return (
    <div className="space-y-8 py-8">
      {/* Banner Comercial */}
      <div className="bg-white border-3 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-mono font-black text-3xl text-zinc-900 uppercase">
            Nuestra Colección
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-1">
            Explora objetos con diseño retro y estilo pixel-art para tu día a día.
          </p>
        </div>

        <div className="text-xs font-mono text-zinc-600 bg-zinc-50 border border-zinc-200 px-3 py-1.5 self-start md:self-auto flex items-center gap-2">
          {loading ? (
            <PixelLoader variant="inline" message="Cargando catálogo..." />
          ) : (
            <span>{products.length} productos disponibles</span>
          )}
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Caja de Búsqueda */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Buscar por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pixel-input pl-9 text-xs"
            />
          </div>

          {/* Selector de Orden */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-zinc-600" />
            <span className="text-xs font-bold font-mono text-zinc-700 uppercase">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="pixel-input text-xs font-bold py-2 bg-white cursor-pointer"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="stock">Mayor stock disponible</option>
            </select>
          </div>
        </div>

        {/* Pestañas de Categoría con nombres amigables */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <span className="text-xs font-bold font-mono text-zinc-500 uppercase mr-1 shrink-0">
            Categoría:
          </span>
          {categories.map((cat) => {
            const isAll = cat === 'all'
            const label = isAll ? 'Todas' : getCategoryLabelEs(cat)
            const isSelected = selectedCategory === cat

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border-2 transition-transform cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-[2px_2px_0px_0px_rgba(37,99,235,1)] translate-y-[-1px]'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:border-zinc-900'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid de Productos */}
      {loading ? (
        <PixelLoader
          variant="skeleton-grid"
          count={8}
          message="Cargando productos de la colección..."
        />
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] space-y-3 max-w-lg mx-auto">
          <p className="font-mono text-sm text-zinc-600">
            No encontramos productos con los filtros seleccionados.
          </p>
          <PixelButton
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
            }}
          >
            Limpiar filtros
          </PixelButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              onAddToCart={(p) => addToCart(p, 1)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
