import React from 'react'

interface PixelBadgeProps {
  variant?: 'default' | 'olist' | 'fake_store' | 'success' | 'warning' | 'info'
  className?: string
  children: React.ReactNode
}

export const PixelBadge: React.FC<PixelBadgeProps> = ({
  variant = 'default',
  className = '',
  children,
}) => {
  const variantStyles = {
    default: 'bg-zinc-100 text-zinc-900 border-zinc-900',
    olist: 'bg-indigo-100 text-indigo-900 border-indigo-900',
    fake_store: 'bg-emerald-100 text-emerald-900 border-emerald-900',
    success: 'bg-emerald-100 text-emerald-900 border-emerald-900',
    warning: 'bg-amber-100 text-amber-900 border-amber-900',
    info: 'bg-blue-100 text-blue-900 border-blue-900',
  }[variant]

  return (
    <span className={`pixel-badge ${variantStyles} ${className}`}>
      {children}
    </span>
  )
}
