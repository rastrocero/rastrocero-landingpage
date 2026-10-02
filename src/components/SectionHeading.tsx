import { cn } from '../lib/cn'

interface SectionHeadingProps {
  /** One or two words: "Plataforma", "Visión", "Seguridad"… */
  title: string
  /** A sentence that carries the section's claim, set in the display face. */
  statement?: string
  /** Plain supporting sentence. */
  lead?: string
  tone?: 'light' | 'dark'
  className?: string
}

export function SectionHeading({ title, statement, lead, tone = 'light', className }: SectionHeadingProps) {
  const dark = tone === 'dark'
  return (
    <div className={className}>
      <h2
        className={cn(
          'font-display text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-4xl',
          dark ? 'text-white' : 'text-r0-text',
        )}
      >
        {title}
      </h2>
      {statement && (
        <p
          className={cn(
            'mt-5 font-display text-xl font-medium leading-snug tracking-[-0.01em] text-balance sm:text-2xl',
            dark ? 'text-r0-mint' : 'text-r0-primary-light',
          )}
        >
          {statement}
        </p>
      )}
      {lead && (
        <p className={cn('mt-4 text-lg leading-relaxed text-pretty sm:text-xl', dark ? 'text-white/70' : 'text-r0-text-secondary')}>
          {lead}
        </p>
      )}
    </div>
  )
}
