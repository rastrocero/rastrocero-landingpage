import { useEffect, useState, type CSSProperties } from 'react'
import {
  BriefcaseBusiness,
  Building,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Globe,
  House,
  Info,
  Landmark,
  LayoutDashboard,
  LayoutGrid,
  Lock,
  Table2,
  Truck,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useInView } from '../hooks/useInView'
import { PCAF_ICONS, formatNumber } from '../lib/pcaf'
import { cn } from '../lib/cn'
import { FlowLines } from './FlowLines'

/*
 * A faithful, static replica of the R0 platform shell (icon rail → tool
 * sidebar → top bar + outlet). Figures are illustrative and internally
 * consistent: monthly values add up to the scope totals, and categories add up
 * to the overall total.
 */

type View = 'inicio' | 'operativo' | 'pcaf'

/* Same order as the platform's rail: the shell opens on Inicio. */
const NEXT_VIEW: Record<View, View> = { inicio: 'operativo', operativo: 'pcaf', pcaf: 'inicio' }

const SCOPE_TOTALS = [412.8, 301.5, 570.3]
const TOTAL = 1284.6
const MONTHLY = [
  [44.1, 42.7, 47.9, 45.2, 46.8, 48.3, 45.6, 46.0, 46.2],
  [42.8, 41.5, 37.9, 31.2, 27.4, 25.1, 26.3, 30.1, 39.2],
  [52.4, 58.9, 71.2, 63.5, 55.1, 68.7, 62.0, 74.8, 63.7],
]
const AXIS_MAX = 160
const CATEGORY_VALUES = [481.9, 232.4, 214.7, 355.6]
/* Top three branches only, so they need not add up to the total */
const BRANCH_VALUES = [512.3, 298.7, 204.1]

/* Chart palette, as in the platform's DashboardConfig */
const SCOPE_COLORS = ['var(--color-r0-primary-light)', 'var(--color-r0-accent)', 'var(--color-r0-accent-light)']
const CATEGORY_COLORS = ['var(--color-r0-sun)', 'var(--color-r0-primary-light)', 'var(--color-r0-accent)', 'var(--color-r0-accent-light)']

/* Time on each tab while the shell plays by itself; a click pauses the cycle for a while. */
const VIEW_MS: Record<View, number> = { inicio: 3200, operativo: 4200, pcaf: 4000 }
const RESUME_MS = 12000

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/* ─── Shell pieces ──────────────────────────────────────────────────── */

function WindowChrome({ url }: { url: string }) {
  return (
    <div className="flex h-9 items-center gap-3 border-b border-r0-border bg-[#f3f4f6] px-3.5">
      <div className="flex gap-1.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-[#e5e7eb] ring-1 ring-black/5" />
        <span className="size-2.5 rounded-full bg-[#e5e7eb] ring-1 ring-black/5" />
        <span className="size-2.5 rounded-full bg-[#e5e7eb] ring-1 ring-black/5" />
      </div>
      <div className="mx-auto flex h-6 w-full max-w-xs items-center justify-center gap-1.5 rounded-md bg-white px-3 text-[11px] text-r0-text-secondary ring-1 ring-r0-border">
        <Lock className="size-3 text-r0-primary-medium" strokeWidth={2.2} />
        <span className="truncate">{url}</span>
      </div>
      <div className="w-[46px]" aria-hidden />
    </div>
  )
}

interface RailTileProps {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick?: () => void
  /** While autoplaying, the active tile shows how long until the next tab. */
  progressMs?: number
}

function RailTile({ icon: Icon, label, active, onClick, progressMs }: RailTileProps) {
  const className = cn(
    'relative flex size-[58px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg border px-0.5 transition-all duration-200',
    active
      ? 'border-transparent bg-r0-accent text-white shadow-[0_6px_16px_-8px_rgba(0,0,0,0.5)]'
      : 'border-r0-border bg-r0-surface text-r0-text-secondary',
    onClick && !active && 'cursor-pointer hover:border-r0-accent/60 hover:text-r0-text hover:shadow-sm',
  )
  const content = (
    <>
      <Icon className="size-[22px]" strokeWidth={1.8} />
      <span className={cn('w-full text-center text-[8.5px] leading-[1.1] tracking-tight', active ? 'font-semibold' : 'font-medium')}>
        {label}
      </span>
      {active && progressMs ? (
        <span aria-hidden className="absolute inset-x-2 bottom-1 h-[2px] overflow-hidden rounded-full bg-white/30">
          <span className="anim-progress block h-full origin-left bg-white" style={{ animationDuration: `${progressMs}ms` }} />
        </span>
      ) : null}
    </>
  )
  return onClick ? (
    <button type="button" onClick={onClick} aria-pressed={active} className={className}>
      {content}
    </button>
  ) : (
    <div className={className} aria-hidden>
      {content}
    </div>
  )
}

interface Tool {
  icon: LucideIcon
  name: string
  active?: boolean
  disabled?: boolean
}

function Sidebar({ title, tools, swapKey }: { title: string; tools: Tool[]; swapKey: string }) {
  return (
    <aside className="hidden w-[196px] shrink-0 flex-col border-r border-r0-border bg-r0-surface lg:flex">
      <div className="flex h-12 shrink-0 items-center px-4">
        <p key={swapKey} className="anim-rail-in truncate text-[13px] font-semibold text-r0-text">
          {title}
        </p>
      </div>
      <div className="border-t border-r0-border" />
      <div key={swapKey} className="anim-rail-in flex flex-1 flex-col gap-1 px-2.5 pt-3">
        {tools.map(({ icon: Icon, name, active, disabled }) => (
          <div
            key={name}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12.5px] font-medium',
              disabled ? 'text-r0-text-muted' : active ? 'bg-r0-primary/10 text-r0-primary' : 'text-r0-text-secondary',
            )}
          >
            <Icon className="size-4 shrink-0" strokeWidth={1.8} />
            <span className="truncate">{name}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-r0-border px-4 py-3 text-center text-[10px] leading-relaxed text-r0-text-muted/70">
        <p>1.0.0</p>
        <p>©RASTROCERO 2026</p>
      </div>
    </aside>
  )
}

function TenantLogo({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-7 items-center justify-center rounded-md bg-r0-primary text-white">
        <Landmark className="size-4" strokeWidth={2} />
      </span>
      <span className="font-display text-[13px] font-semibold tracking-tight text-r0-text">{name}</span>
    </div>
  )
}

function TopBar({ bank }: { bank: string }) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-r0-border bg-r0-surface px-5">
      <TenantLogo name={bank} />
      <div className="flex items-center gap-2.5" aria-hidden>
        <span className="rounded-lg bg-r0-primary-light p-2 text-white">
          <UserCog className="size-4" strokeWidth={2} />
        </span>
        <span className="rounded-lg bg-r0-primary-medium p-2 text-white">
          <Info className="size-4" strokeWidth={2} />
        </span>
      </div>
    </header>
  )
}

/* ─── Views ─────────────────────────────────────────────────────────── */

function OperationalView() {
  const { t, locale } = useLanguage()
  const m = t.mockup.operational
  const unit = t.mockup.unit

  return (
    <div className="anim-rail-in flex h-full flex-col gap-3 overflow-hidden bg-r0-bg p-4 lg:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-sans text-[15px] font-bold uppercase tracking-wide text-[#9b9b9b]">{m.heading}</h3>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-lg border border-gray-300 bg-white py-1.5 pl-2.5 pr-2 text-[11px] text-gray-700 xl:flex">
            {m.period}
            <ChevronDown className="size-3 text-gray-400" />
          </span>
          <span className="flex rounded-lg bg-gray-200 p-0.5 text-[11px]">
            <span className="rounded-md bg-white px-2.5 py-1 font-medium text-r0-text shadow-sm">{m.toggle[0]}</span>
            <span className="px-2.5 py-1 font-medium text-r0-text-secondary">{m.toggle[1]}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {[{ label: m.total, value: TOTAL, color: 'var(--color-r0-primary)' }, ...m.scopes.map((label, i) => ({ label, value: SCOPE_TOTALS[i], color: SCOPE_COLORS[i] }))].map(
          (kpi) => (
            <div key={kpi.label} className="rounded-lg border border-r0-border bg-white px-3 py-2.5">
              <p className="flex items-center gap-1.5 truncate text-[10px] font-medium uppercase tracking-wide text-r0-text-secondary">
                <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: kpi.color }} />
                {kpi.label}
              </p>
              <p className="mt-1 font-mono text-[15px] font-semibold text-r0-text lg:text-base">
                {formatNumber(kpi.value, locale)}
                <span className="ml-1 font-sans text-[10px] font-normal text-r0-text-muted">{unit}</span>
              </p>
            </div>
          ),
        )}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-5 gap-2.5">
        <div className="col-span-3 flex min-h-0 flex-col rounded-lg border border-r0-border bg-white p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[12px] font-semibold text-gray-800">{m.chartTitle}</p>
            <div className="flex gap-2.5">
              {m.scopes.map((s, i) => (
                <span key={s} className="flex items-center gap-1 text-[10px] text-r0-text-secondary">
                  <span className="size-2 rounded-[2px]" style={{ backgroundColor: SCOPE_COLORS[i] }} />
                  <span className="hidden xl:inline">{s}</span>
                  <span className="xl:hidden">{s.slice(0, 1)}{i + 1}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col pl-7 pt-1.5">
            <div className="relative min-h-0 flex-1">
              {[0, 40, 80, 120, 160].map((tick) => (
                <div
                  key={tick}
                  className="absolute inset-x-0 border-t border-dashed border-gray-100"
                  style={{ bottom: `${(tick / AXIS_MAX) * 100}%` }}
                >
                  <span className="absolute -left-7 w-6 -translate-y-1/2 text-right font-mono text-[9px] text-r0-text-muted">{tick}</span>
                </div>
              ))}
              <div className="relative flex h-full items-end gap-2">
                {m.months.map((month, mi) => (
                  <div
                    key={month}
                    className="anim-bar flex flex-1 flex-col-reverse overflow-hidden rounded-t-[3px]"
                    style={{
                      height: `${((MONTHLY[0][mi] + MONTHLY[1][mi] + MONTHLY[2][mi]) / AXIS_MAX) * 100}%`,
                      animationDelay: `${mi * 45}ms`,
                    }}
                  >
                    {MONTHLY.map((series, si) => (
                      <div key={si} style={{ flexGrow: series[mi], backgroundColor: SCOPE_COLORS[si] }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              {m.months.map((month) => (
                <span key={month} className="flex-1 text-center text-[9px] leading-3 text-r0-text-muted">
                  {month}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-2 flex min-h-0 flex-col rounded-lg border border-r0-border bg-white p-3.5">
          <p className="mb-3 text-[12px] font-semibold text-gray-800">{m.breakdownTitle}</p>
          <div className="flex flex-col gap-2.5">
            {m.categories.map((label, i) => (
              <div key={label}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="truncate text-[11.5px] font-semibold text-gray-800">{label}</span>
                  <span className="shrink-0 font-mono text-[10px] text-gray-700">{formatNumber(CATEGORY_VALUES[i], locale)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-[width] duration-700"
                    style={{ width: `${(CATEGORY_VALUES[i] / TOTAL) * 100}%`, backgroundColor: CATEGORY_COLORS[i] }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto border-t border-r0-border pt-3">
            <p className="mb-2 text-[12px] font-semibold text-gray-800">{m.branchesTitle}</p>
            <ol className="space-y-1.5">
              {m.branches.map((name, i) => (
                <li key={name} className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="flex size-4 shrink-0 items-center justify-center rounded bg-gray-100 font-mono text-[9px] font-semibold text-gray-500">
                      {i + 1}
                    </span>
                    <span className="truncate text-gray-600">{name}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-gray-700">{formatNumber(BRANCH_VALUES[i], locale)}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

function InicioView() {
  const { t } = useLanguage()
  const i = t.mockup.inicio

  return (
    <div className="relative h-full overflow-hidden">
      {/* ShellBackdrop, parked left as on the platform's home screen */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/brand/hero-bg-sm.webp')",
          backgroundSize: 'cover',
          backgroundPosition: '15% 100%',
          opacity: 0.6,
          maskImage: 'linear-gradient(to bottom, transparent 10%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 10%, black 100%)',
        }}
      />
      <FlowLines />
      <div className="anim-rail-in relative z-[1] flex h-full items-center justify-center px-8">
        <div className="w-full max-w-md rounded-3xl border border-r0-border bg-r0-surface/85 px-10 py-12 text-center shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-r0-primary-medium">{i.kicker}</p>
          <div className="mt-4 flex items-center justify-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-r0-primary text-white">
              <Landmark className="size-5" strokeWidth={2} />
            </span>
            <span className="font-display text-3xl font-semibold tracking-tight text-r0-primary">{t.mockup.bank}</span>
          </div>
          <p className="mt-3 text-[12px] text-r0-text-secondary">{i.sub}</p>
        </div>
      </div>
    </div>
  )
}

function FinancedView() {
  const { t } = useLanguage()

  return (
    <div className="relative h-full overflow-hidden">
      {/* ShellBackdrop, parked right as on /m/financed */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/brand/hero-bg-sm.webp')",
          backgroundSize: 'cover',
          backgroundPosition: '80% 100%',
          opacity: 0.55,
          maskImage: 'linear-gradient(to bottom, transparent 10%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 10%, black 100%)',
        }}
      />
      <FlowLines className="translate-x-1/3" />
      <div className="anim-rail-in relative z-[1] px-5 py-4">
        <p className="mb-2.5 text-[12px] font-medium text-r0-text-secondary">{t.mockup.financed.heading}</p>
        <div className="grid auto-rows-fr grid-cols-3 gap-px overflow-hidden rounded-lg border border-r0-border bg-r0-border">
          {t.pcaf.classes.map((c) => {
            const Icon = PCAF_ICONS[c.code]
            return (
              <div key={c.code} className="flex min-h-[84px] flex-col gap-1.5 bg-r0-surface p-3.5">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[11.5px] font-semibold leading-tight text-r0-text">{c.name}</span>
                  <Icon className="size-4 shrink-0 text-r0-primary" strokeWidth={1.7} />
                </span>
                <span className="text-[10.5px] leading-snug text-r0-text-secondary">{c.desc}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ─── Mobile shell (the platform renders a header + module list under lg) ── */

function MobileShell() {
  const { t, locale } = useLanguage()
  const icons = [Truck, BriefcaseBusiness, CalendarDays]

  return (
    <div className="bg-r0-bg">
      <div className="flex items-center justify-between border-b border-r0-border bg-r0-surface px-4 py-3">
        <div className="flex items-center gap-3">
          <img src="/brand/logo-apilado.png" alt="" className="h-7 w-auto brightness-0" />
          <span className="text-xs text-r0-text-secondary">{t.mockup.rail.inicio}</span>
        </div>
        <span className="size-7 rounded-full bg-gradient-to-br from-r0-mint to-r0-accent ring-2 ring-black/10" />
      </div>
      <div className="flex flex-col gap-2.5 px-4 py-5">
        <div className="rounded-xl border border-r0-border bg-white p-4">
          <p className="text-[10px] font-medium uppercase tracking-wide text-r0-text-secondary">{t.mockup.operational.total}</p>
          <p className="mt-1 font-mono text-xl font-semibold text-r0-text">
            {formatNumber(TOTAL, locale)} <span className="font-sans text-xs font-normal text-r0-text-muted">{t.mockup.unit}</span>
          </p>
          <div className="mt-3 flex h-2 overflow-hidden rounded-full">
            {SCOPE_TOTALS.map((v, i) => (
              <span key={i} style={{ flexGrow: v, backgroundColor: SCOPE_COLORS[i] }} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-r0-text-secondary">
            {t.mockup.operational.scopes.map((s, i) => (
              <span key={s} className="flex items-center gap-1">
                <span className="size-1.5 rounded-full" style={{ backgroundColor: SCOPE_COLORS[i] }} />
                {s}
              </span>
            ))}
          </div>
        </div>
        {t.mockup.mobileModules.map((mod, i) => {
          const Icon = icons[i]
          return (
            <div key={mod.name} className="flex items-center gap-4 rounded-xl border border-r0-border bg-r0-surface px-4 py-3.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-r0-primary/10">
                <Icon className="size-5 text-r0-primary-light" strokeWidth={1.8} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-r0-text">{mod.name}</span>
                <span className="block truncate text-xs text-r0-text-secondary">{mod.desc}</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Frame ─────────────────────────────────────────────────────────── */

export function AppMockup({ className, style }: { className?: string; style?: CSSProperties }) {
  const { t } = useLanguage()
  const [view, setView] = useState<View>('inicio')
  // 0 while playing; otherwise the time of the last manual pick.
  const [pausedAt, setPausedAt] = useState(0)
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 })
  const reducedMotion = prefersReducedMotion()
  const playing = inView && !reducedMotion && pausedAt === 0

  useEffect(() => {
    if (!inView || reducedMotion) return
    const timer = pausedAt
      ? setTimeout(() => setPausedAt(0), RESUME_MS)
      : setTimeout(() => setView((v) => NEXT_VIEW[v]), VIEW_MS[view])
    return () => clearTimeout(timer)
  }, [inView, reducedMotion, pausedAt, view])

  const pick = (next: View) => {
    setPausedAt(Date.now())
    setView(next)
  }
  const progress = (v: View) => (playing && view === v ? VIEW_MS[v] : undefined)

  const op = t.mockup.operational
  const fin = t.mockup.financed
  const tools: Tool[] =
    view === 'inicio'
      ? [{ icon: LayoutGrid, name: t.mockup.inicio.tool, active: true }]
      : view === 'operativo'
        ? [LayoutDashboard, Table2, ClipboardList, Building].map((icon, i) => ({ icon, name: op.tools[i], active: i === 0 }))
        : [Users, Building2, Globe].map((icon, i) => ({ icon, name: fin.tools[i], disabled: true }))
  const title = view === 'inicio' ? t.mockup.inicio.title : view === 'operativo' ? op.title : fin.title

  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden rounded-xl border border-r0-border bg-white shadow-[0_40px_80px_-40px_rgba(15,36,25,0.45),0_12px_24px_-12px_rgba(15,36,25,0.18)] sm:rounded-2xl',
        className,
      )}
      style={style}
    >
      <WindowChrome url={t.mockup.url} />

      <div className="hidden h-[500px] md:flex lg:h-[540px]">
        <nav className="flex w-[76px] shrink-0 flex-col items-center border-r border-r0-border bg-gray-100" aria-label="RastroCero">
          <div className="flex w-full justify-center py-2.5">
            <img src="/brand/logo-apilado.png" alt="" className="h-auto w-[56px]" />
          </div>
          <div className="w-full border-t border-r0-border" />
          <div className="flex flex-1 flex-col items-center gap-1.5 py-2.5">
            <RailTile icon={House} label={t.mockup.rail.inicio} active={view === 'inicio'} onClick={() => pick('inicio')} progressMs={progress('inicio')} />
            <RailTile icon={Truck} label={t.mockup.rail.operativo} active={view === 'operativo'} onClick={() => pick('operativo')} progressMs={progress('operativo')} />
            <RailTile icon={BriefcaseBusiness} label={t.mockup.rail.pcaf} active={view === 'pcaf'} onClick={() => pick('pcaf')} progressMs={progress('pcaf')} />
            <RailTile icon={CalendarDays} label={t.mockup.rail.eventos} />
          </div>
          <div className="flex w-full justify-center border-t border-r0-border py-3">
            <span className="size-7 rounded-full bg-gradient-to-br from-r0-mint to-r0-accent ring-2 ring-black/10" />
          </div>
        </nav>

        <Sidebar title={title} tools={tools} swapKey={view} />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar bank={t.mockup.bank} />
          <div className="relative min-h-0 flex-1" key={view}>
            {view === 'inicio' ? <InicioView /> : view === 'operativo' ? <OperationalView /> : <FinancedView />}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <MobileShell />
      </div>
    </div>
  )
}
