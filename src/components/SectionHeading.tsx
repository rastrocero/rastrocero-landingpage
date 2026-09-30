import { cn } from '../lib/cn'

interface SectionHeadingProps {
  eyebrow: string
  title1: string
  title2: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  className?: string
}

/** Uppercase eyebrow as in the platform's tool headers, then a single-colour title. */
export function SectionHeading({ eyebrow, title1, title2, align = 'left', tone = 'light', className }: SectionHeadingProps) {
  const dark = tone === 'dark'
  return (
    <div className={cn(align === 'center' && 'mx-auto text-center', className)}>
      <p
        className={cn(
          'mb-4 font-display text-xs font-semibold uppercase tracking-[0.2em]',
          dark ? 'text-r0-accent-light' : 'text-r0-primary-medium',
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          'font-display text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-balance sm:text-4xl',
          dark ? 'text-white' : 'text-r0-text',
        )}
      >
        {title1} {title2}
      </h2>
    </div>
  )
}
