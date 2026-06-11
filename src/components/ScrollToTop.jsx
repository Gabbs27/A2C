import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Restaura el scroll en cada navegación. Con hash, espera a que la ruta lazy
// monte Y a que el layout se estabilice (hero/skeletons expandiendo) antes de
// saltar al ancla — scrollear apenas existe el elemento aterriza en una
// posición obsoleta.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      let cancelled = false
      const startedAt = performance.now()
      let lastTop = null
      let stableChecks = 0

      const tick = () => {
        if (cancelled) return
        const el = document.getElementById(id)
        const elapsed = performance.now() - startedAt
        if (el) {
          const top = Math.round(el.getBoundingClientRect().top + window.scrollY)
          stableChecks = top === lastTop ? stableChecks + 1 : 0
          lastTop = top
          // Dos lecturas idénticas seguidas = layout asentado (o timeout)
          if (stableChecks >= 2 || elapsed > 2500) {
            el.scrollIntoView({ behavior: 'instant', block: 'start' })
            return
          }
        }
        if (elapsed < 2500) setTimeout(tick, 100)
      }
      tick()
      return () => {
        cancelled = true
      }
    }
    window.scrollTo(0, 0)
    return undefined
  }, [pathname, hash])

  return null
}
