import React from 'react'

export interface PixelLoaderProps {
  message?: string
  submessage?: string
  variant?: 'page' | 'card' | 'skeleton-grid' | 'inline' | 'fullscreen'
  count?: number
  className?: string
}

/**
 * Custom retro 8-bit animated Pixel Shopping Bag / Box Sprite
 */
const PixelBagSprite: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const pixelSizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${pixelSizes[size]} ${className}`}
      style={{ shapeRendering: 'crispEdges' }}
      aria-hidden="true"
    >
      {/* Handles */}
      <rect x="8" y="3" width="2" height="4" fill="#18181b" />
      <rect x="14" y="3" width="2" height="4" fill="#18181b" />
      <rect x="10" y="2" width="4" height="2" fill="#18181b" />

      {/* Bag Body Outer Border */}
      <rect x="5" y="7" width="14" height="15" fill="#18181b" />

      {/* Bag Body Fill (Blue Retro) */}
      <rect x="6" y="8" width="12" height="13" fill="#2563eb" />

      {/* Bag Highlights & Texture */}
      <rect x="7" y="9" width="2" height="11" fill="#60a5fa" />
      <rect x="7" y="9" width="9" height="2" fill="#60a5fa" />

      {/* Pixel Art Logo on Bag (Golden Star / Heart) */}
      <rect x="11" y="13" width="2" height="4" fill="#fbbf24" />
      <rect x="10" y="14" width="4" height="2" fill="#fbbf24" />
      <rect x="11" y="14" width="2" height="2" fill="#ffffff" />

      {/* Bottom Shadow */}
      <rect x="6" y="20" width="12" height="1" fill="#1e40af" />
    </svg>
  )
}

/**
 * 5-Segment Retro Loading Bar with sequential animation
 */
const PixelProgressBar: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      {[0, 1, 2, 3, 4].map((idx) => (
        <span
          key={idx}
          className="w-4 h-3 bg-blue-600 border border-zinc-900 inline-block animate-pulse"
          style={{
            animationDelay: `${idx * 160}ms`,
            animationDuration: '900ms',
          }}
        />
      ))}
    </div>
  )
}

export const PixelLoader: React.FC<PixelLoaderProps> = ({
  message = 'CARGANDO...',
  submessage = 'Conectando con el inventario...',
  variant = 'page',
  count = 8,
  className = '',
}) => {
  // 1. Inline Variant: For buttons or small badges
  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-2 font-mono text-xs ${className}`}>
        <PixelBagSprite size="sm" className="animate-bounce" />
        <span className="font-bold uppercase tracking-wider">{message}</span>
      </div>
    )
  }

  // 2. Card Variant: For Hero section or card slots
  if (variant === 'card') {
    return (
      <div
        className={`bg-white border-2 border-zinc-900 shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] p-8 flex flex-col items-center justify-center text-center relative pixel-grid-pattern min-h-[360px] space-y-4 ${className}`}
      >
        <div className="absolute top-4 left-4">
          <span className="pixel-badge bg-blue-600 text-white border-zinc-900 text-[10px] animate-pulse">
            CARGANDO
          </span>
        </div>

        <div className="p-4 bg-slate-50 border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]">
          <PixelBagSprite size="lg" className="animate-bounce" />
        </div>

        <div className="space-y-1">
          <h4 className="font-mono font-black text-base text-zinc-900 uppercase tracking-wide">
            {message}
          </h4>
          {submessage && (
            <p className="font-mono text-xs text-zinc-500 max-w-xs">{submessage}</p>
          )}
        </div>

        <PixelProgressBar className="pt-2" />
      </div>
    )
  }

  // 3. Skeleton Grid Variant: For Shop & Featured grids
  if (variant === 'skeleton-grid') {
    return (
      <div className="space-y-6">
        {/* Subtle status banner */}
        <div className="bg-amber-50 border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] p-3 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PixelBagSprite size="sm" className="animate-bounce shrink-0" />
            <span className="font-mono text-xs font-bold text-zinc-900 uppercase">
              {message}
            </span>
          </div>
          <PixelProgressBar />
        </div>

        {/* Skeleton Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="bg-white border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] flex flex-col justify-between overflow-hidden animate-pulse"
              style={{ animationDelay: `${(i % 4) * 120}ms` }}
            >
              {/* Product Frame Placeholder */}
              <div className="p-6 bg-slate-100 border-b-2 border-zinc-900 flex flex-col items-center justify-center relative min-h-[170px] pixel-grid-pattern">
                <div className="w-16 h-16 bg-zinc-200 border-2 border-zinc-400 border-dashed flex items-center justify-center text-zinc-400">
                  <PixelBagSprite size="sm" className="opacity-40" />
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <div className="w-14 h-4 bg-zinc-200 border border-zinc-400" />
                </div>
              </div>

              {/* Information Placeholder */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="w-20 h-4 bg-zinc-200 border border-zinc-300" />
                <div className="w-full h-5 bg-zinc-300 border border-zinc-400" />
                <div className="flex items-center justify-between pt-1">
                  <div className="w-24 h-6 bg-zinc-200 border border-zinc-300" />
                  <div className="w-12 h-4 bg-zinc-100 border border-zinc-300" />
                </div>
              </div>

              {/* Buttons Placeholder */}
              <div className="p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2">
                <div className="h-8 sm:h-9 bg-zinc-200 border-2 border-zinc-400" />
                <div className="h-8 sm:h-9 bg-blue-100 border-2 border-blue-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 4. Page Variant (Default) & Fullscreen: For detail pages, checkout, orders
  const containerClass =
    variant === 'fullscreen'
      ? 'fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4'
      : 'py-16 px-4 max-w-md mx-auto text-center'

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="bg-white border-3 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] p-8 sm:p-10 space-y-6 relative overflow-hidden pixel-grid-pattern">
        {/* Retro Header Tag */}
        <div className="flex items-center justify-center gap-2">
          <span className="pixel-badge bg-blue-600 text-white border-zinc-900 text-[11px] animate-pulse">
            SISTEMA EN LÍNEA
          </span>
          <span className="text-[11px] font-mono text-zinc-500 font-bold uppercase">
            Fake Store v1.0
          </span>
        </div>

        {/* Animated Pixel Graphic Box */}
        <div className="w-20 h-20 bg-slate-50 border-3 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] flex items-center justify-center mx-auto relative group">
          <PixelBagSprite size="md" className="animate-bounce" />
        </div>

        {/* Messages */}
        <div className="space-y-2">
          <h2 className="font-mono font-black text-2xl text-zinc-900 uppercase tracking-wide">
            {message}
          </h2>
          {submessage && (
            <p className="font-mono text-xs text-zinc-600 max-w-xs mx-auto leading-relaxed">
              {submessage}
            </p>
          )}
        </div>

        {/* Progress Bar & Indicators */}
        <div className="pt-2 border-t-2 border-zinc-200 space-y-3">
          <PixelProgressBar />
          <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
            Por favor, espera un momento...
          </p>
        </div>
      </div>
    </div>
  )
}
