import { BriefcaseBusiness, CalendarDays, House, Truck, type LucideIcon } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from '../components/Reveal'
import { formatNumber } from '../lib/pcaf'
import { cn } from '../lib/cn'

/* Illustrative figures: monthly values add up to the scope totals. */
const TOTAL = 1284.6
const MONTHLY = [
  [44.1, 42.7, 47.9, 45.2, 46.8, 48.3, 45.6, 46.0, 46.2],
  [42.8, 41.5, 37.9, 31.2, 27.4, 25.1, 26.3, 30.1, 39.2],
  [52.4, 58.9, 71.2, 63.5, 55.1, 68.7, 62.0, 74.8, 63.7],
]
const AXIS_MAX = 160
const SCOPE_COLORS = ['var(--color-r0-primary-light)', 'var(--color-r0-accent)', 'var(--color-r0-accent-light)']

function RailTile({ icon: Icon, label, active }: { icon: LucideIcon; label: string; active?: boolean }) {
  return (
    <div
      className={cn(
        'flex size-[46px] flex-col items-center justify-center gap-0.5 rounded-lg border',
        active ? 'border-transparent bg-r0-accent text-white' : 'border-r0-border bg-white text-r0-text-secondary',
      )}
    >
      <Icon className="size-[17px]" strokeWidth={1.8} />
      <span className={cn('text-[7.5px] leading-none tracking-tight', active ? 'font-semibold' : 'font-medium')}>{label}</span>
    </div>
  )
}

/** One static slice of the platform: icon rail + the operational summary. */
function PlatformSlice({ className }: { className?: string }) {
  const { t, locale } = useLanguage()
  const m = t.mockup.operational
  const rail = t.mockup.rail

  return (
    <div
      aria-hidden
      className={cn(
        'flex overflow-hidden rounded-l-xl border border-r0-border bg-r0-bg shadow-sm',
        className,
      )}
    >
      <div className="flex w-[60px] shrink-0 flex-col items-center border-r border-r0-border bg-gray-100">
        <div className="flex w-full justify-center py-2.5">
          <img src="/brand/logo-apilado.png" alt="" className="h-auto w-[42px]" />
        </div>
        <div className="w-full border-t border-r0-border" />
        <div className="flex flex-col items-center gap-1.5 py-2.5">
          <RailTile icon={House} label={rail.inicio} />
          <RailTile icon={Truck} label={rail.operativo} active />
          <RailTile icon={BriefcaseBusiness} label={rail.pcaf} />
          <RailTile icon={CalendarDays} label={rail.eventos} />
        </div>
      </div>

      <div className="min-w-0 flex-1 p-5 sm:p-6 lg:pr-10">
        <div className="flex items-baseline justify-between gap-4">
          <p className="truncate text-[12px] font-bold uppercase tracking-wide text-[#9b9b9b]">{m.heading}</p>
          <p className="shrink-0 text-[11.5px] text-r0-text-secondary">{m.period}</p>
        </div>

        <div className="mt-5">
          <p className="text-[10.5px] font-medium uppercase tracking-wide text-r0-text-secondary">{m.total}</p>
          <p className="mt-1 font-mono text-[26px] font-semibold leading-none text-r0-text sm:text-[28px]">
            {formatNumber(TOTAL, locale)}
            <span className="ml-1.5 font-sans text-[11px] font-normal text-r0-text-muted">{t.mockup.unit}</span>
          </p>
        </div>

        <div className="mt-5 rounded-lg border border-r0-border bg-white p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <p className="text-[12px] font-semibold text-gray-800">{m.chartTitle}</p>
            <div className="flex gap-3">
              {m.scopes.map((s, i) => (
                <span key={s} className="flex items-center gap-1.5 whitespace-nowrap text-[10px] text-r0-text-secondary">
                  <span className="size-2 rounded-[2px]" style={{ backgroundColor: SCOPE_COLORS[i] }} />
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pl-6">
            <div className="relative h-[150px]">
              {[0, 80, 160].map((tick) => (
                <div
                  key={tick}
                  className="absolute inset-x-0 border-t border-dashed border-gray-100"
                  style={{ bottom: `${(tick / AXIS_MAX) * 100}%` }}
                >
                  <span className="absolute -left-6 w-5 -translate-y-1/2 text-right font-mono text-[9px] text-r0-text-muted">{tick}</span>
                </div>
              ))}
              <div className="relative flex h-full items-end gap-2 sm:gap-3 lg:gap-4">
                {m.months.map((month, mi) => (
                  <div
                    key={month}
                    className="flex flex-1 flex-col-reverse overflow-hidden rounded-t-[3px]"
                    style={{ height: `${((MONTHLY[0][mi] + MONTHLY[1][mi] + MONTHLY[2][mi]) / AXIS_MAX) * 100}%` }}
                  >
                    {MONTHLY.map((series, si) => (
                      <div key={si} style={{ flexGrow: series[mi], backgroundColor: SCOPE_COLORS[si] }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-1.5 flex gap-2 sm:gap-3 lg:gap-4">
              {m.months.map((month) => (
                <span key={month} className="flex-1 text-center text-[9px] leading-3 text-r0-text-muted">
                  {month}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductView() {
  const { t } = useLanguage()
  const p = t.productView

  return (
    <section id="plataforma" className="overflow-hidden bg-white pb-16 sm:pb-24">
      <Reveal className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-x-12 lg:px-8">
        <div className="border-t border-r0-border pt-8 lg:col-span-4 lg:pt-10">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-r0-primary-medium">{p.eyebrow}</p>
          <p className="mt-4 max-w-sm text-[17px] leading-relaxed text-r0-text-secondary text-pretty">{p.text}</p>
        </div>

        <figure className="min-w-0 lg:col-span-8 lg:border-t lg:border-r0-border lg:pt-10">
          {/* Runs past the container to the page edge so the surface reads as continuing. */}
          <PlatformSlice className="w-[calc(100%+1rem)] sm:w-[calc(100%+1.5rem)] lg:w-[calc(100%_+_max(3rem,_(100vw_-_80rem)_/_2_+_3rem))]" />
          <figcaption className="mt-3 text-[12.5px] text-r0-text-muted">{p.caption}</figcaption>
        </figure>
      </Reveal>
    </section>
  )
}
