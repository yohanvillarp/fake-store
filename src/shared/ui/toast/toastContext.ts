import { createContext } from 'react'

export interface ToastItem {
  id: string
  message: string
  productName?: string
  actionLabel?: string
  actionUrl?: string
}

export interface ToastContextType {
  showToast: (options: {
    message: string
    productName?: string
    actionLabel?: string
    actionUrl?: string
    duration?: number
  }) => void
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)
