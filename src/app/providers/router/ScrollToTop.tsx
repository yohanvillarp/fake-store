import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const ScrollToTop = () => {
  const location = useLocation()

  useEffect(() => {
    // Disable browser automatic scroll restoration to avoid sticking to previous position
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    const resetScroll = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      const root = document.getElementById('root')
      if (root) root.scrollTop = 0
    }

    resetScroll()

    const frameId = requestAnimationFrame(resetScroll)
    const timeoutId = setTimeout(resetScroll, 50)

    return () => {
      cancelAnimationFrame(frameId)
      clearTimeout(timeoutId)
    }
  }, [location.pathname, location.search, location.key])

  return null
}

