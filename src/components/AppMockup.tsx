import { useEffect, useState, type CSSProperties } from 'react'
import {
  BriefcaseBusiness,
  Building2,
  Globe,
  House,
  Info,
  Landmark,
  LayoutGrid,
  Lock,
  Table2,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useInView } from '../hooks/useInView'
import { PCAF_ICONS, dqsColor, formatNumber } from '../lib/pcaf'
import { cn } from '../lib/cn'
import { FlowLines } from './FlowLines'

/*
 * A faithful, static replica of the R0 platform shell (icon rail → tool
 * sidebar → top bar + outlet), limited to what the pilot sells: Inicio and the
 * financed-emissions (PCAF) module. Figures are illustrative and consistent:
 * the register rows add up to the portfolio total.
 */

type View = 'inicio' | 'pcaf' | 'registro'

/* Same order as the platform: home, the PCAF product picker, then one product's register. */
const NEXT_VIEW: Record<View, View> = { inicio: 'pcaf', pcaf: 'registro', registro: 'inicio' }

/* Time on each screen while the shell plays by itself; a click pauses the cycle for a while. */
const VIEW_MS: Record<View, number> = { inicio: 3200, pcaf: 3800, registro: 4800 }
const RESUME_MS = 12000

/* Business-loan register (illustrative). */
const REGISTER = [
  { id: 'PC-0142', currency: 'USD', amount: 2_400_000, tco2e: 602.7, dqs: 2 },
  { id: 'PC-0157', currency: 'USD', amount: 5_100_000, tco2e: 1318.4, dqs: 3 },
  { id: 'PC-0163', currency: 'PYG', amount: 9_800_000_000, tco2e: 214.9, dqs: 4 },
  { id: 'PC-0171', currency: 'USD', amount: 1_250_000, tco2e: 96.3, dqs: 5 },
  { id: 'PC-0188', currency: 'USD', amount: 3_700_000, tco2e: 41.8, dqs: 2 },
  { id: 'PC-0192', currency: 'USD', amount: 7_900_000, tco2e: 2106.5, dqs: 1 },
]
const REGISTER_TOTAL = 4380.6
/* Financed emissions per score (sums of the rows above), for the mobile summary. */
const BY_SCORE = [2106.5, 644.5, 1318.4, 214.9, 96.3]

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function ScoreBadge({ score, label }: { score: number; label: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
      style={{ backgroundColor: dqsColor(score) }}
    >
      {label} {score}
    </span>
  )
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
  /** While autoplaying, the active tile shows how long until the next screen. */
  progressMs?: number
  /** Restarts the progress bar when the screen changes under the same tile. */
  progressKey?: string
}

function RailTile({ icon: Icon, label, active, onClick, progressMs, progressKey }: RailTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'relative flex size-[58px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg border px-0.5 transition-all duration-200',
        active
          ? 'border-transparent bg-r0-accent text-white shadow-[0_6px_16px_-8px_rgba(0,0,0,0.5)]'
          : 'cursor-pointer border-r0-border bg-r0-surface text-r0-text-secondary hover:border-r0-accent/60 hover:text-r0-text hover:shadow-sm',
      )}
    >
      <Icon className="size-[22px]" strokeWidth={1.8} />
      <span className={cn('w-full text-center text-[8.5px] leading-[1.1] tracking-tight', active ? 'font-semibold' : 'font-medium')}>
        {label}
      </span>
      {active && progressMs ? (
        <span aria-hidden className="absolute inset-x-2 bottom-1 h-[2px] overflow-hidden rounded-full bg-white/30">
          <span key={progressKey} className="anim-progress block h-full origin-left bg-white" style={{ animationDuration: `${progressMs}ms` }} />
        </span>
      ) : null}
    </button>
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

/** The platform's ShellBackdrop: the leaf landscape masked in from the top. */
function Backdrop({ position }: { position: string }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        backgroundImage: "url('/brand/hero-bg-sm.webp')",
        backgroundSize: 'cover',
        backgroundPosition: position,
        opacity: 0.55,
        maskImage: 'linear-gradient(to bottom, transparent 10%, black 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 10%, black 100%)',
      }}
    />
  )
}

/* ─── Views ─────────────────────────────────────────────────────────── */

function InicioView() {
  const { t } = useLanguage()
  const i = t.mockup.inicio

  return (
    <div className="relative h-full overflow-hidden">
      <Backdrop position="15% 100%" />
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

function ProductsView() {
  const { t } = useLanguage()

  return (
    <div className="relative h-full overflow-hidden">
      <Backdrop position="80% 100%" />
      <FlowLines className="translate-x-1/3" />
      <div className="anim-rail-in relative z-[1] px-5 py-4">
        <p className="mb-2.5 text-[12px] font-medium text-r0-text-secondary">{t.mockup.financed.heading}</p>
        <div className="grid auto-rows-fr grid-cols-3 gap-px overflow-hidden rounded-lg border border-r0-border bg-r0-border">
          {t.product.assetClasses.map((c) => {
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

function RegisterView() {
  const { t, locale } = useLanguage()
  const r = t.mockup.registry
  const th = 'px-3 py-2.5 text-[9.5px] font-semibold uppercase tracking-wider text-r0-text-secondary'

  return (
    <div className="anim-rail-in flex h-full flex-col overflow-hidden bg-r0-bg px-5 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-r0-primary-light">{r.eyebrow}</p>
      <h3 className="mt-0.5 text-xl font-bold text-r0-text">{r.heading}</h3>

      <div className="mt-3 overflow-hidden rounded-lg border border-r0-border bg-white">
        <table className="w-full text-[11px]">
          <thead className="border-b border-r0-border bg-r0-bg/60">
            <tr>
              <th className={cn('hidden text-left xl:table-cell', th)}>{r.columns[0]}</th>
              <th className={cn('text-left', th)}>{r.columns[1]}</th>
              <th className={cn('hidden text-left lg:table-cell', th)}>{r.columns[2]}</th>
              <th className={cn('text-right', th)}>{r.columns[4]}</th>
              <th className={cn('text-right', th)}>{r.columns[5]}</th>
              <th className={cn('text-center', th)}>{r.columns[6]}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-r0-border">
            {REGISTER.map((row, i) => (
              <tr key={row.id}>
                <td className="hidden px-3 py-2 text-r0-text-secondary xl:table-cell">{r.date}</td>
                <td className="px-3 py-2 font-medium text-r0-text">{r.clients[i]}</td>
                <td className="hidden px-3 py-2 font-mono text-[10px] text-r0-text-secondary lg:table-cell">{row.id}</td>
                <td className="px-3 py-2 text-right font-mono text-[10.5px] text-r0-text">
                  <span className="mr-1 text-r0-text-muted">{row.currency}</span>
                  {formatNumber(row.amount, locale, 0)}
                </td>
                <td className="px-3 py-2 text-right font-mono text-[10.5px] text-r0-text">
                  {formatNumber(row.tco2e, locale)} <span className="font-sans text-[9px] text-r0-text-muted">{t.mockup.unit}</span>
                </td>
                <td className="px-3 py-2 text-center">
                  <ScoreBadge score={row.dqs} label={r.score} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-r0-border bg-r0-bg/60">
            <tr>
              <td className="hidden xl:table-cell" />
              <td className="px-3 py-2.5 text-[10.5px] font-semibold text-r0-text">{r.total}</td>
              <td className="hidden lg:table-cell" />
              <td />
              <td className="px-3 py-2.5 text-right font-mono text-[11px] font-semibold text-r0-text">
                {formatNumber(REGISTER_TOTAL, locale)} <span className="font-sans text-[9px] font-normal text-r0-text-muted">{t.mockup.unit}</span>
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

/* ─── Mobile shell (the platform renders a header + module list under lg) ── */

function MobileShell() {
  const { t, locale } = useLanguage()
  const m = t.mockup.mobile

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
          <p className="text-[10px] font-medium uppercase tracking-wide text-r0-text-secondary">{m.total}</p>
          <p className="mt-1 font-mono text-xl font-semibold text-r0-text">
            {formatNumber(REGISTER_TOTAL, locale)} <span className="font-sans text-xs font-normal text-r0-text-muted">{t.mockup.unit}</span>
          </p>
          <p className="mt-3 text-[10px] text-r0-text-secondary">{m.byScore}</p>
          <div className="mt-1.5 flex h-2 overflow-hidden rounded-full">
            {BY_SCORE.map((v, i) => (
              <span key={i} style={{ flexGrow: v, backgroundColor: dqsColor(i + 1) }} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-r0-text-secondary">
            {BY_SCORE.map((_, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="size-1.5 rounded-full" style={{ backgroundColor: dqsColor(i + 1) }} />
                {i + 1}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-r0-border bg-r0-surface px-4 py-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-r0-primary/10">
            <BriefcaseBusiness className="size-5 text-r0-primary-light" strokeWidth={1.8} />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-r0-text">{m.module.name}</span>
            <span className="block truncate text-xs text-r0-text-secondary">{m.module.desc}</span>
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-r0-border bg-white">
          <p className="border-b border-r0-border px-4 py-2.5 text-[11px] font-medium text-r0-text-secondary">{m.classesTitle}</p>
          {t.product.assetClasses.slice(2, 7).map((c) => {
            const Icon = PCAF_ICONS[c.code]
            return (
              <div key={c.code} className="flex items-center justify-between gap-3 border-b border-r0-border px-4 py-2.5 last:border-b-0">
                <span className="text-[13px] font-medium text-r0-text">{c.name}</span>
                <Icon className="size-4 shrink-0 text-r0-primary" strokeWidth={1.7} />
              </div>
            )
          })}
        </div>
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

  const onPcaf = view !== 'inicio'
  const fin = t.mockup.financed
  const reg = t.mockup.registry
  const sidebar: { title: string; tools: Tool[] } =
    view === 'inicio'
      ? { title: t.mockup.inicio.title, tools: [{ icon: LayoutGrid, name: t.mockup.inicio.tool, active: true }] }
      : view === 'pcaf'
        ? { title: fin.title, tools: [Users, Building2, Globe].map((icon, i) => ({ icon, name: fin.tools[i], disabled: true })) }
        : { title: fin.title, tools: [{ icon: Building2, name: reg.tools[0] }, { icon: Table2, name: reg.tools[1], active: true }] }

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
            <RailTile
              icon={House}
              label={t.mockup.rail.inicio}
              active={view === 'inicio'}
              onClick={() => pick('inicio')}
              progressMs={playing && view === 'inicio' ? VIEW_MS.inicio : undefined}
              progressKey={view}
            />
            <RailTile
              icon={BriefcaseBusiness}
              label={t.mockup.rail.pcaf}
              active={onPcaf}
              onClick={() => pick('pcaf')}
              progressMs={playing && onPcaf ? VIEW_MS[view] : undefined}
              progressKey={view}
            />
          </div>
          <div className="flex w-full justify-center border-t border-r0-border py-3">
            <span className="size-7 rounded-full bg-gradient-to-br from-r0-mint to-r0-accent ring-2 ring-black/10" />
          </div>
        </nav>

        <Sidebar title={sidebar.title} tools={sidebar.tools} swapKey={view} />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar bank={t.mockup.bank} />
          <div className="relative min-h-0 flex-1" key={view}>
            {view === 'inicio' ? <InicioView /> : view === 'pcaf' ? <ProductsView /> : <RegisterView />}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <MobileShell />
      </div>
    </div>
  )
}
