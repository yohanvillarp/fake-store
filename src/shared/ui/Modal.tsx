import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: string
  resetScrollKey?: unknown
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl',
  resetScrollKey,
}) => {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Reset scroll position when modal opens or when switching internal panels/tabs
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [isOpen, resetScrollKey])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
      <div
        className={`w-full ${maxWidth} bg-white border-3 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] flex flex-col max-h-[90vh]`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-zinc-900 bg-zinc-100 shrink-0">
          <h3 className="font-bold text-lg uppercase tracking-wide text-zinc-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1 border border-zinc-900 bg-white hover:bg-zinc-200 transition-colors shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] cursor-pointer"
          >
            <X className="w-5 h-5 text-zinc-900" />
          </button>
        </div>

        {/* Content */}
        <div ref={contentRef} className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
