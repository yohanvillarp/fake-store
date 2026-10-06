import React from 'react'

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-zinc-800 text-white hover:bg-zinc-900',
    accent: 'bg-amber-400 text-zinc-900 hover:bg-amber-500',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    outline: 'bg-white text-zinc-900 hover:bg-zinc-50',
  }[variant]

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  }[size]

  return (
    <button
      className={`pixel-button ${variantStyles} ${sizeStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
