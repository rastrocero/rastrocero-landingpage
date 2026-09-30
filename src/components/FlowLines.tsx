import { useId } from 'react'
import { cn } from '../lib/cn'

/**
 * The drifting dashed lines from the platform's ShellBackdrop, reused as the
 * site's signature motif. `tone` picks the stroke for light or dark surfaces.
 */
export function FlowLines({ className, tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  const gradientId = useId()
  const stop = tone === 'light' ? 'var(--color-r0-primary-light)' : 'var(--color-r0-accent-light)'

  return (
    <svg
      aria-hidden
      preserveAspectRatio="none"
      viewBox="0 0 500 1200"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: stop }} stopOpacity="1" />
          <stop offset="100%" style={{ stopColor: stop }} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M340,0 Q355,400 330,800 T345,1200" fill="none" stroke={`url(#${gradientId})`} strokeWidth="0.4" opacity="0.30" className="flow-line--slow" />
      <path d="M150,0 Q170,350 140,700 T160,1200" fill="none" stroke={`url(#${gradientId})`} strokeWidth="0.7" opacity="0.25" className="flow-line--fast" />
      <path d="M50,0 Q80,250 40,500 T70,1200" fill="none" stroke={`url(#${gradientId})`} strokeWidth="0.5" opacity="0.15" className="flow-line--normal" />
      <path d="M440,0 Q420,300 455,650 T430,1200" fill="none" stroke={`url(#${gradientId})`} strokeWidth="0.5" opacity="0.2" className="flow-line--normal" />
    </svg>
  )
}
