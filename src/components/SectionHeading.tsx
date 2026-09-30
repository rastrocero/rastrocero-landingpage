import { cn } from '../lib/cn'

interface SectionHeadingProps {
  eyebrow: string
  title1: string
  title2: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  className?: string
}

/** Eyebrow echoes the platform's spaced, uppercase section labels; the title
 *  pairs a solid line with a softer second line. */
export function SectionHeading({ eyebrow, title1, title2, align = 'left', tone = 'light', className }: SectionHeadingProps) {
  const dark = tone === 'dark'
  return (
    <div className={cn(align === 'center' && 'mx-auto text-center', className)}>
      <p
        className={cn(
          'mb-4 inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.22em]',
          dark ? 'text-r0-accent-light' : 'text-r0-primary-medium',
        )}
      >
        <span className={cn('h-px w-6', dark ? 'bg-r0-accent-light/60' : 'bg-r0-primary-medium/50')} />
        {eyebrow}
      </p>
      <h2
        className={cn(
          'font-display text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.75rem]',
          dark ? 'text-white' : 'text-r0-text',
        )}
      >
        <span className="block">{title1}</span>
        <span className={cn('block', dark ? 'text-r0-mint' : 'text-r0-primary-medium')}>{title2}</span>
      </h2>
    </div>
  )
}
