import type { LucideIcon } from 'lucide-react'
import { Building2, Car, FileText, Globe, Home, Landmark, Scale, TrendingUp, Warehouse } from 'lucide-react'

/** Same icon per asset class as the platform's module registry. */
export const PCAF_ICONS: Record<string, LucideIcon> = {
  acciones: TrendingUp,
  bonos: FileText,
  prestamos: Building2,
  proyectos: Landmark,
  inmobiliaria: Warehouse,
  hipotecas: Home,
  vehiculos: Car,
  soberana: Globe,
  subsoberana: Scale,
}

/** Display-only number formatting (es: 1.284,6 · en: 1,284.6). */
export function formatNumber(value: number, locale: 'es' | 'en', decimals = 1) {
  const [int, dec] = value.toFixed(decimals).split('.')
  const [group, point] = locale === 'es' ? ['.', ','] : [',', '.']
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, group)
  return dec ? `${grouped}${point}${dec}` : grouped
}
