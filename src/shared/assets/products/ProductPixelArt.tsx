import React from 'react'

interface ProductPixelArtProps {
  productId?: string
  categoryName?: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'hero'
}

/**
 * High-definition retro pixel-art SVG sprites.
 * Designed with crispEdges, dark pixel contours, subtle highlights and retro palettes.
 */
export const ProductPixelArt: React.FC<ProductPixelArtProps> = ({
  productId,
  categoryName,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    hero: 'w-56 h-56 sm:w-72 sm:h-72',
  }[size]

  const appliedClass = `${sizeClasses} ${className} shrink-0 select-none inline-block`

  // Match by product_id first, then fallback to category_name
  if (productId === '1e9e8ef04dbcff4541ed26657ea517e5' || categoryName === 'furniture_decor') {
    // 1. Pixel Desk Lamp - Articulated retro orange/black desk lamp with warm glow
    return (
      <svg
        viewBox="0 0 32 32"
        className={appliedClass}
        shapeRendering="crispEdges"
        aria-label="Pixel Desk Lamp"
      >
        {/* Glow halo */}
        <rect x="2" y="14" width="10" height="2" fill="#fef08a" opacity="0.6" />
        <rect x="4" y="16" width="6" height="2" fill="#fef08a" opacity="0.4" />

        {/* Lamp Base */}
        <rect x="18" y="27" width="10" height="3" fill="#18181b" />
        <rect x="20" y="25" width="6" height="2" fill="#3f3f46" />
        <rect x="22" y="24" width="2" height="2" fill="#f59e0b" />

        {/* Lower Arm */}
        <rect x="21" y="18" width="2" height="6" fill="#18181b" />
        <rect x="20" y="17" width="4" height="2" fill="#f59e0b" />

        {/* Upper Arm angled */}
        <rect x="17" y="13" width="4" height="2" fill="#18181b" />
        <rect x="14" y="11" width="4" height="2" fill="#18181b" />
        <rect x="11" y="9" width="4" height="2" fill="#18181b" />

        {/* Shade Joint */}
        <rect x="9" y="8" width="3" height="3" fill="#f59e0b" />

        {/* Lamp Cone / Shade */}
        <rect x="6" y="9" width="6" height="2" fill="#dc2626" />
        <rect x="4" y="11" width="8" height="2" fill="#ef4444" />
        <rect x="3" y="13" width="9" height="2" fill="#b91c1c" />

        {/* Bulb & Light Source */}
        <rect x="5" y="14" width="5" height="1" fill="#fef08a" />
        <rect x="6" y="15" width="3" height="1" fill="#ffffff" />

        {/* Highlights */}
        <rect x="5" y="11" width="3" height="1" fill="#fca5a5" />
        <rect x="19" y="27" width="2" height="1" fill="#71717a" />
      </svg>
    )
  }

  if (productId === 'a4597b830d1f855d045d949b29e06180' || categoryName === 'housewares') {
    // 2. Minimalist Ceramic Mug - Warm teal ceramic mug with steaming pixel particles
    return (
      <svg
        viewBox="0 0 32 32"
        className={appliedClass}
        shapeRendering="crispEdges"
        aria-label="Minimalist Ceramic Mug"
      >
        {/* Steam */}
        <rect x="11" y="5" width="2" height="2" fill="#cbd5e1" opacity="0.7" />
        <rect x="10" y="3" width="2" height="2" fill="#cbd5e1" opacity="0.4" />
        <rect x="16" y="6" width="2" height="2" fill="#cbd5e1" opacity="0.7" />
        <rect x="17" y="4" width="2" height="2" fill="#cbd5e1" opacity="0.5" />

        {/* Saucer / Plate */}
        <rect x="4" y="27" width="22" height="2" fill="#18181b" />
        <rect x="6" y="26" width="18" height="1" fill="#94a3b8" />

        {/* Mug Body Dark Outline */}
        <rect x="7" y="12" width="14" height="14" fill="#18181b" />

        {/* Mug Body Ceramic Teal */}
        <rect x="8" y="13" width="12" height="12" fill="#0d9488" />
        <rect x="8" y="13" width="2" height="11" fill="#14b8a6" />
        <rect x="10" y="14" width="1" height="9" fill="#5eead4" />

        {/* Coffee surface */}
        <rect x="9" y="13" width="10" height="2" fill="#451a03" />

        {/* Handle */}
        <rect x="21" y="15" width="5" height="8" fill="#18181b" />
        <rect x="21" y="17" width="3" height="4" fill="#f8fafc" />
        <rect x="22" y="16" width="2" height="6" fill="#0f766e" />

        {/* Mug Base highlight */}
        <rect x="9" y="24" width="10" height="1" fill="#0f766e" />
      </svg>
    )
  }

  if (productId === '368c6c730842d78016ad823897a372db' || categoryName === 'computers_accessories') {
    // 3. Retro Mechanical Keyboard - 60% compact keyboard with colored pixel keycaps
    return (
      <svg
        viewBox="0 0 32 32"
        className={appliedClass}
        shapeRendering="crispEdges"
        aria-label="Retro Mechanical Keyboard"
      >
        {/* Keyboard Chassis Outline */}
        <rect x="2" y="10" width="28" height="15" fill="#18181b" />

        {/* Chassis Top Surface (Warm Retro Grey) */}
        <rect x="3" y="11" width="26" height="13" fill="#e2e8f0" />
        <rect x="3" y="11" width="26" height="1" fill="#f8fafc" />

        {/* Cable */}
        <rect x="14" y="6" width="4" height="4" fill="#18181b" />
        <rect x="15" y="7" width="2" height="3" fill="#3b82f6" />

        {/* Row 1 Keys */}
        <rect x="5" y="13" width="3" height="2" fill="#ef4444" /> {/* ESC key */}
        <rect x="9" y="13" width="2" height="2" fill="#64748b" />
        <rect x="12" y="13" width="2" height="2" fill="#64748b" />
        <rect x="15" y="13" width="2" height="2" fill="#64748b" />
        <rect x="18" y="13" width="2" height="2" fill="#64748b" />
        <rect x="21" y="13" width="2" height="2" fill="#64748b" />
        <rect x="24" y="13" width="3" height="2" fill="#334155" />

        {/* Row 2 Keys */}
        <rect x="5" y="16" width="3" height="2" fill="#94a3b8" />
        <rect x="9" y="16" width="2" height="2" fill="#f1f5f9" />
        <rect x="12" y="16" width="2" height="2" fill="#f1f5f9" />
        <rect x="15" y="16" width="2" height="2" fill="#f1f5f9" />
        <rect x="18" y="16" width="2" height="2" fill="#f1f5f9" />
        <rect x="21" y="16" width="2" height="2" fill="#f1f5f9" />
        <rect x="24" y="16" width="3" height="3" fill="#2563eb" /> {/* Enter key */}

        {/* Row 3 Keys (Spacebar row) */}
        <rect x="5" y="19" width="3" height="2" fill="#94a3b8" />
        <rect x="9" y="19" width="2" height="2" fill="#f59e0b" />
        <rect x="12" y="19" width="9" height="2" fill="#f8fafc" /> {/* Spacebar */}
        <rect x="22" y="20" width="2" height="2" fill="#f59e0b" />

        {/* Feet / Shadow */}
        <rect x="4" y="24" width="24" height="2" fill="#0f172a" />
      </svg>
    )
  }

  if (productId === 'e0d64dc22b6482d0430d9716b1464877' || categoryName === 'bed_bath_table') {
    // 4. Cozy Cotton Bed Sheets - Folded neat soft linens with fluffy pillows
    return (
      <svg
        viewBox="0 0 32 32"
        className={appliedClass}
        shapeRendering="crispEdges"
        aria-label="Cozy Cotton Bed Sheets"
      >
        {/* Base Stack Outline */}
        <rect x="5" y="18" width="22" height="9" fill="#18181b" />

        {/* Bottom Folded Sheet (Dark Indigo) */}
        <rect x="6" y="22" width="20" height="4" fill="#3730a3" />
        <rect x="6" y="22" width="20" height="1" fill="#4f46e5" />

        {/* Middle Sheet (Lavender Soft) */}
        <rect x="6" y="19" width="20" height="3" fill="#818cf8" />
        <rect x="7" y="19" width="18" height="1" fill="#c7d2fe" />

        {/* Top Pillow Outline */}
        <rect x="7" y="10" width="18" height="9" fill="#18181b" />

        {/* Pillow Fluff (Warm Ivory / Soft Cream) */}
        <rect x="8" y="11" width="16" height="7" fill="#fef3c7" />
        <rect x="9" y="12" width="14" height="2" fill="#ffffff" />
        <rect x="10" y="15" width="12" height="2" fill="#fde68a" />

        {/* Pillow fold button detail */}
        <rect x="15" y="14" width="2" height="2" fill="#d97706" />

        {/* Ribbon / Wrap Band */}
        <rect x="14" y="10" width="3" height="16" fill="#18181b" />
        <rect x="14" y="10" width="2" height="16" fill="#ea580c" />
      </svg>
    )
  }

  if (productId === '53b36df63ebb7c41585e8d54d6772e08' || categoryName === 'luggage_accessories') {
    // 5. Vintage Leather Backpack - Classic buckle rucksack in rich brown with brass buckles
    return (
      <svg
        viewBox="0 0 32 32"
        className={appliedClass}
        shapeRendering="crispEdges"
        aria-label="Vintage Leather Backpack"
      >
        {/* Top Handle */}
        <rect x="13" y="4" width="6" height="3" fill="#18181b" />
        <rect x="14" y="5" width="4" height="2" fill="#f8fafc" />

        {/* Main Body Outline */}
        <rect x="6" y="7" width="20" height="20" fill="#18181b" />

        {/* Main Leather Body */}
        <rect x="7" y="8" width="18" height="18" fill="#78350f" />
        <rect x="7" y="8" width="2" height="17" fill="#92400e" />

        {/* Flap Cover */}
        <rect x="6" y="7" width="20" height="7" fill="#18181b" />
        <rect x="7" y="8" width="18" height="5" fill="#b45309" />
        <rect x="8" y="9" width="16" height="1" fill="#d97706" />

        {/* Front Pocket */}
        <rect x="9" y="17" width="14" height="8" fill="#18181b" />
        <rect x="10" y="18" width="12" height="6" fill="#92400e" />

        {/* Vertical Straps & Brass Buckles */}
        <rect x="10" y="8" width="2" height="17" fill="#451a03" />
        <rect x="20" y="8" width="2" height="17" fill="#451a03" />
        <rect x="10" y="14" width="2" height="2" fill="#facc15" /> {/* Left Buckle */}
        <rect x="20" y="14" width="2" height="2" fill="#facc15" /> {/* Right Buckle */}

        {/* Pocket Buckle */}
        <rect x="15" y="19" width="2" height="2" fill="#facc15" />

        {/* Bottom reinforced patch */}
        <rect x="7" y="24" width="18" height="2" fill="#451a03" />
      </svg>
    )
  }

  if (productId === '87285b34884572b646c7b8e364c1b070' || categoryName === 'telephony') {
    // 6. Smart Audio Earbuds - Wireless case with status LED & dual earbuds
    return (
      <svg
        viewBox="0 0 32 32"
        className={appliedClass}
        shapeRendering="crispEdges"
        aria-label="Smart Audio Earbuds"
      >
        {/* Charging Case Outline */}
        <rect x="7" y="13" width="18" height="15" fill="#18181b" />

        {/* Charging Case Body (Sleek Matte Black & Dark Purple) */}
        <rect x="8" y="14" width="16" height="13" fill="#1e1b4b" />
        <rect x="9" y="15" width="14" height="2" fill="#312e81" />

        {/* Case Lid Split Line */}
        <rect x="7" y="18" width="18" height="1" fill="#18181b" />

        {/* Glowing Status LED */}
        <rect x="15" y="21" width="2" height="2" fill="#10b981" />
        <rect x="15" y="21" width="1" height="1" fill="#6ee7b7" />

        {/* Left Earbud */}
        <rect x="5" y="5" width="7" height="6" fill="#18181b" />
        <rect x="6" y="6" width="5" height="4" fill="#6366f1" />
        <rect x="6" y="6" width="2" height="2" fill="#a5b4fc" />
        <rect x="7" y="11" width="2" height="4" fill="#18181b" />
        <rect x="7" y="11" width="1" height="3" fill="#4338ca" />

        {/* Right Earbud */}
        <rect x="20" y="5" width="7" height="6" fill="#18181b" />
        <rect x="21" y="6" width="5" height="4" fill="#6366f1" />
        <rect x="23" y="6" width="2" height="2" fill="#a5b4fc" />
        <rect x="23" y="11" width="2" height="4" fill="#18181b" />
        <rect x="23" y="11" width="1" height="3" fill="#4338ca" />

        {/* Shadow */}
        <rect x="9" y="27" width="14" height="1" fill="#0f172a" />
      </svg>
    )
  }

  if (productId === 'b532349141c7b339dd82a04e5ec67d79' || categoryName === 'art') {
    // 7. Canvas Wall Art Print - Pixel landscape in elegant wood frame
    return (
      <svg
        viewBox="0 0 32 32"
        className={appliedClass}
        shapeRendering="crispEdges"
        aria-label="Canvas Wall Art Print"
      >
        {/* Frame Outline */}
        <rect x="4" y="4" width="24" height="24" fill="#18181b" />

        {/* Wooden Frame Edge */}
        <rect x="5" y="5" width="22" height="22" fill="#78350f" />
        <rect x="6" y="6" width="20" height="20" fill="#18181b" />

        {/* Sky Background */}
        <rect x="7" y="7" width="18" height="18" fill="#fdba74" />
        <rect x="7" y="7" width="18" height="4" fill="#fb923c" />

        {/* Pixel Sun */}
        <rect x="18" y="9" width="4" height="4" fill="#fef08a" />
        <rect x="19" y="10" width="2" height="2" fill="#ffffff" />

        {/* Distant Mountain (Purple/Indigo) */}
        <rect x="9" y="15" width="3" height="3" fill="#4338ca" />
        <rect x="12" y="13" width="4" height="5" fill="#4338ca" />
        <rect x="16" y="15" width="3" height="3" fill="#4338ca" />

        {/* Foreground Pine Mountains (Dark Emerald) */}
        <rect x="7" y="18" width="18" height="7" fill="#065f46" />
        <rect x="8" y="17" width="4" height="2" fill="#047857" />
        <rect x="15" y="16" width="5" height="3" fill="#047857" />

        {/* River / Lake */}
        <rect x="7" y="22" width="18" height="3" fill="#0284c7" />
        <rect x="9" y="23" width="7" height="1" fill="#7dd3fc" />
      </svg>
    )
  }

  if (productId === '4244733e06e7ecb49c540845c447469f' || categoryName === 'watches_gifts') {
    // 8. Analog Precision Watch - Round golden bezel with leather strap and watch hands
    return (
      <svg
        viewBox="0 0 32 32"
        className={appliedClass}
        shapeRendering="crispEdges"
        aria-label="Analog Precision Watch"
      >
        {/* Leather Strap Top */}
        <rect x="12" y="2" width="8" height="7" fill="#18181b" />
        <rect x="13" y="2" width="6" height="7" fill="#78350f" />
        <rect x="14" y="3" width="4" height="2" fill="#b45309" />

        {/* Leather Strap Bottom */}
        <rect x="12" y="23" width="8" height="7" fill="#18181b" />
        <rect x="13" y="23" width="6" height="7" fill="#78350f" />
        <rect x="15" y="27" width="2" height="1" fill="#451a03" />

        {/* Bezel Outer Outline */}
        <rect x="8" y="8" width="16" height="16" fill="#18181b" />

        {/* Gold Bezel Ring */}
        <rect x="9" y="9" width="14" height="14" fill="#eab308" />
        <rect x="10" y="10" width="12" height="12" fill="#ca8a04" />

        {/* Watch Face / Dial (Enamel White) */}
        <rect x="11" y="11" width="10" height="10" fill="#f8fafc" />

        {/* Hour Indices (12, 3, 6, 9) */}
        <rect x="15" y="12" width="2" height="1" fill="#18181b" /> {/* 12 */}
        <rect x="19" y="15" width="1" height="2" fill="#18181b" /> {/* 3 */}
        <rect x="15" y="19" width="2" height="1" fill="#18181b" /> {/* 6 */}
        <rect x="12" y="15" width="1" height="2" fill="#18181b" /> {/* 9 */}

        {/* Watch Hands */}
        <rect x="15" y="15" width="2" height="2" fill="#dc2626" /> {/* Center pin */}
        <rect x="16" y="13" width="1" height="3" fill="#18181b" /> {/* Hour hand */}
        <rect x="16" y="15" width="3" height="1" fill="#18181b" /> {/* Minute hand */}

        {/* Crown Winder */}
        <rect x="24" y="15" width="2" height="2" fill="#18181b" />
        <rect x="24" y="15" width="1" height="2" fill="#facc15" />
      </svg>
    )
  }

  // Fallback Retro Pixel Box
  return (
    <svg
      viewBox="0 0 32 32"
      className={appliedClass}
      shapeRendering="crispEdges"
      aria-label="Pixel Product"
    >
      <rect x="6" y="8" width="20" height="16" fill="#18181b" />
      <rect x="7" y="9" width="18" height="14" fill="#3b82f6" />
      <rect x="8" y="10" width="16" height="2" fill="#60a5fa" />
      <rect x="14" y="9" width="4" height="14" fill="#fbbf24" />
      <rect x="15" y="10" width="2" height="12" fill="#f59e0b" />
    </svg>
  )
}
