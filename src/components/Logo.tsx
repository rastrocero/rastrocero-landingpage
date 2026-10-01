import { cn } from '../lib/cn'

/**
 * Corporate logo rules: gray wordmark + green leaf on light backgrounds, white
 * wordmark + green leaf on dark backgrounds, all-white on the brand green.
 */
const SOURCES = {
  light: '/brand/logo-gris.png',
  dark: '/brand/logo-blanco-hoja.png',
  green: '/brand/logo-blanco.png',
} as const

interface LogoProps {
  on?: keyof typeof SOURCES
  className?: string
}

export function Logo({ on = 'light', className }: LogoProps) {
  return (
    <img
      src={SOURCES[on]}
      alt="RastroCero"
      width={1400}
      height={120}
      className={cn('h-4 w-auto select-none', className)}
      draggable={false}
    />
  )
}
