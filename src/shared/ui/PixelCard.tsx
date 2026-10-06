import React from 'react'

interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'raised' | 'flat'
}

export const PixelCard: React.FC<PixelCardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const shadowClass =
    variant === 'raised'
      ? 'pixel-box-lg'
      : variant === 'flat'
        ? 'border-2 border-zinc-900'
        : 'pixel-box'

  return (
    <div className={`bg-white ${shadowClass} p-5 ${className}`} {...props}>
      {children}
    </div>
  )
}
