import React from 'react'
import {
  Lamp,
  Coffee,
  Keyboard,
  Bed,
  Luggage,
  Headphones,
  Palette,
  Watch,
  Package,
} from 'lucide-react'

export function getCategoryIcon(categoryName: string, className = 'w-10 h-10'): React.ReactNode {
  switch (categoryName) {
    case 'furniture_decor':
      return <Lamp className={className} />
    case 'housewares':
      return <Coffee className={className} />
    case 'computers_accessories':
      return <Keyboard className={className} />
    case 'bed_bath_table':
      return <Bed className={className} />
    case 'luggage_accessories':
      return <Luggage className={className} />
    case 'telephony':
      return <Headphones className={className} />
    case 'art':
      return <Palette className={className} />
    case 'watches_gifts':
      return <Watch className={className} />
    default:
      return <Package className={className} />
  }
}

export function getCategoryBadgeColor(categoryName: string): string {
  switch (categoryName) {
    case 'furniture_decor':
      return 'bg-amber-100 text-amber-900 border-amber-800'
    case 'housewares':
      return 'bg-emerald-100 text-emerald-900 border-emerald-800'
    case 'computers_accessories':
      return 'bg-cyan-100 text-cyan-900 border-cyan-800'
    case 'bed_bath_table':
      return 'bg-indigo-100 text-indigo-900 border-indigo-800'
    case 'luggage_accessories':
      return 'bg-orange-100 text-orange-900 border-orange-800'
    case 'telephony':
      return 'bg-purple-100 text-purple-900 border-purple-800'
    case 'art':
      return 'bg-rose-100 text-rose-900 border-rose-800'
    case 'watches_gifts':
      return 'bg-yellow-100 text-yellow-900 border-yellow-800'
    default:
      return 'bg-zinc-100 text-zinc-900 border-zinc-800'
  }
}
