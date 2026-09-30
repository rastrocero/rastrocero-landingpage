import { useEffect, useRef, useState } from 'react'

/**
 * Flips to `true` the first time the element scrolls into view and stays there.
 * Per-element state (rather than a document-wide classList sweep) survives
 * language switches and elements that mount after the first paint.
 */
export function useInView<T extends Element>(options: IntersectionObserverInit = { threshold: 0.15 }) {
  const ref = useRef<T>(null)
  // Without IntersectionObserver there is nothing to wait for: render visible.
  const [inView, setInView] = useState(() => !('IntersectionObserver' in window))
  const { threshold, rootMargin } = options

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [inView, threshold, rootMargin])

  return { ref, inView }
}
