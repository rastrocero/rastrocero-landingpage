import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import {
  Archive,
  ArrowRight,
  ArrowUp,
  Brain,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  FileSpreadsheet,
  House,
  Inbox,
  LayoutDashboard,
  Lock,
  Menu,
  PanelLeftClose,
  Paperclip,
  Search,
  Settings,
  SquarePen,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useInView } from '../hooks/useInView'
import { formatNumber } from '../lib/pcaf'
import { cn } from '../lib/cn'

/*
 * A static replica of the R0 platform as a bank uses it today: the icon rail,
 * the Emissions Banker sidebar and three screens — a conversation that takes a
 * portfolio workbook from upload to result, the Dashboard of the bank's
 * official portfolio, and the inbox where another person approves the work.
 * Figures are illustrative and consistent across the three screens and with
 * the panels of the Platform section: 486 rows = 431 calculated + 24 + 12
 * waiting + 19 out of scope; the sector bars add up to the official total.
 */

type View = 'chat' | 'dashboard' | 'inbox'

/* The order a piece of work follows: conversation → portfolio → approval. */
const NEXT_VIEW: Record<View, View> = { chat: 'dashboard', dashboard: 'inbox', inbox: 'chat' }

/*
 * The conversation plays message by message. Each entry is the time spent on a
 * step before the next one arrives; the last is how long the finished
 * conversation stays on screen.
 * 0 file sent · 1 reading · 2 summary and questions · 3 the person's answer ·
 * 4 calculating · 5 result.
 */
const CHAT_STEP_MS = [900, 1500, 3600, 1500, 1400, 4400]
const LAST_STEP = CHAT_STEP_MS.length - 1

/* Time on the other two screens while the shell plays by itself; a click pauses the cycle for a while. */
const VIEW_MS: Record<Exclude<View, 'chat'>, number> = { dashboard: 5400, inbox: 4800 }
const RESUME_MS = 12000

/* Official portfolio, scope 1 + 2 (tCO2e). The sectors add up to the total. */
const OFFICIAL = 18_642.7
const ESTIMATE = 3_218.4
const SECTORS = [7845.2, 4310.6, 2905.3, 1842.9, 1118.5, 620.2]
/* One bar per month: the newest cut-off of each (a stock, not a sum). */
const SERIES = [17_420.3, 17_895.1, 18_310.6, OFFICIAL]
const OPERATIONS = { official: 389, total: 467 }

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** `**text**` → bold, as in the agent's Markdown. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, i) =>
        i % 2 ? (
          <strong key={i} className="font-semibold">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
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

function RailButton({ icon: Icon, label, active, onClick }: { icon: LucideIcon; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={cn(
        'relative flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors',
        active ? 'bg-r0-subtle text-r0-text' : 'text-r0-text-secondary hover:bg-r0-subtle hover:text-r0-text',
      )}
    >
      {active && <span aria-hidden className="absolute -left-2 bottom-2.5 top-2.5 w-0.5 rounded-r-full bg-r0-accent" />}
      <Icon className="size-5" strokeWidth={1.75} />
    </button>
  )
}

/** The agent's mark: the RastroCero leaf on the primary green. */
function AgentAvatar() {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-r0-primary" aria-hidden>
      <img src="/brand/hoja.png" alt="" className="w-3.5 brightness-0 invert" />
    </span>
  )
}

const NAV_ROW = 'flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-[12.5px] text-r0-text transition-colors'

/** The financed module's sidebar: Emissions Banker, its two destinations and the conversations. */
function BankerSidebar({ view, onPick }: { view: View; onPick: (view: View) => void }) {
  const { t } = useLanguage()
  const s = t.mockup.sidebar

  return (
    <aside className="hidden w-[212px] shrink-0 flex-col border-r border-r0-border bg-r0-surface lg:flex">
      <div className="flex h-12 shrink-0 items-center justify-between pl-4 pr-2">
        <p className="truncate text-[13px] font-semibold text-r0-text">{s.agent}</p>
        <span className="flex size-8 items-center justify-center text-r0-text-secondary" aria-hidden>
          <PanelLeftClose className="size-4" strokeWidth={1.75} />
        </span>
      </div>

      <div className="space-y-px px-2">
        <button type="button" onClick={() => onPick('chat')} className={cn(NAV_ROW, 'cursor-pointer hover:bg-r0-subtle')}>
          <SquarePen className="size-4 shrink-0 text-r0-text-secondary" strokeWidth={1.75} />
          {s.newChat}
        </button>
        <button
          type="button"
          onClick={() => onPick('dashboard')}
          aria-pressed={view === 'dashboard'}
          className={cn(NAV_ROW, 'cursor-pointer hover:bg-r0-subtle', view === 'dashboard' && 'bg-r0-subtle font-medium')}
        >
          <LayoutDashboard className="size-4 shrink-0 text-r0-text-secondary" strokeWidth={1.75} />
          {s.dashboard}
        </button>
      </div>

      <div className="px-2 pt-3">
        <div className="flex h-8 items-center gap-2 rounded-md border border-r0-border bg-r0-bg px-2 text-[12.5px] text-r0-text-secondary">
          <Search className="size-3.5 shrink-0" strokeWidth={1.75} />
          {s.search}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-2 pt-4">
        <p className="px-2 pb-1.5 text-[11px] text-r0-text-secondary">{s.recents}</p>
        <ul className="space-y-px">
          {s.chats.map((title, i) => (
            <li key={title}>
              {i === 0 ? (
                <button
                  type="button"
                  onClick={() => onPick('chat')}
                  aria-pressed={view === 'chat'}
                  className={cn(NAV_ROW, 'cursor-pointer hover:bg-r0-subtle', view === 'chat' && 'bg-r0-subtle font-medium')}
                >
                  <span className="truncate">{title}</span>
                </button>
              ) : (
                <span className={NAV_ROW}>
                  <span className="truncate">{title}</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex shrink-0 items-center gap-1 border-t border-r0-border p-2 text-r0-text-secondary" aria-hidden>
        {[Brain, Archive, Trash2].map((Icon, i) => (
          <span key={i} className="flex size-8 items-center justify-center">
            <Icon className="size-4" strokeWidth={1.75} />
          </span>
        ))}
      </div>
    </aside>
  )
}

/** The home module's sidebar: one tool, the inbox. */
function HomeSidebar() {
  const { t } = useLanguage()

  return (
    <aside className="hidden w-[212px] shrink-0 flex-col border-r border-r0-border bg-r0-surface lg:flex">
      <div className="flex h-12 shrink-0 items-center px-4">
        <p className="truncate text-[13px] font-semibold text-r0-text">{t.mockup.rail.home}</p>
      </div>
      <div className="px-2">
        <span className={cn(NAV_ROW, 'bg-r0-subtle font-medium')}>
          <Inbox className="size-4 shrink-0 text-r0-text-secondary" strokeWidth={1.75} />
          {t.mockup.inbox.title}
        </span>
      </div>
    </aside>
  )
}

function TopBar({ bank }: { bank: string }) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-r0-border bg-r0-surface px-5">
      <span className="truncate text-[13.5px] font-semibold text-r0-text">{bank}</span>
      <span className="flex size-8 items-center justify-center text-r0-text-secondary" aria-hidden>
        <Settings className="size-[17px]" strokeWidth={1.75} />
      </span>
    </header>
  )
}

/* ─── Conversation ──────────────────────────────────────────────────── */

function AgentRow({ children }: { children: ReactNode }) {
  return (
    <div className="anim-msg-in flex items-start gap-3">
      <AgentAvatar />
      <div className="min-w-0 flex-1 space-y-2 pt-0.5 text-[12.5px] leading-[1.6] text-r0-text">{children}</div>
    </div>
  )
}

function Processing({ text }: { text: string }) {
  return <p className="text-r0-text-secondary motion-safe:animate-pulse">{text}</p>
}

function UserFile({ name }: { name: string }) {
  return (
    <div className="anim-msg-in flex justify-end">
      <span className="inline-flex max-w-[85%] items-center gap-2 rounded-xl border border-r0-border bg-r0-surface px-3 py-2 text-[12.5px] text-r0-text">
        <FileSpreadsheet className="size-4 shrink-0 text-r0-primary-medium" strokeWidth={1.75} />
        <span className="truncate">{name}</span>
      </span>
    </div>
  )
}

function UserText({ text }: { text: string }) {
  return (
    <div className="anim-msg-in flex justify-end">
      <span className="max-w-[85%] rounded-xl bg-r0-border/60 px-3.5 py-2 text-[12.5px] leading-[1.5] text-r0-text">{text}</span>
    </div>
  )
}

/** The messages up to `step`, as the thread shows them. */
function Thread({ step }: { step: number }) {
  const { t } = useLanguage()
  const c = t.mockup.chat

  return (
    <>
      <UserFile name={c.file} />
      {step === 1 && (
        <AgentRow>
          <Processing text={c.reading} />
        </AgentRow>
      )}
      {step >= 2 && (
        <AgentRow>
          <p>
            <Rich text={c.read} />
          </p>
          <ol className="list-decimal space-y-1 pl-4">
            {c.questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>
        </AgentRow>
      )}
      {step >= 3 && <UserText text={c.reply} />}
      {step === 4 && (
        <AgentRow>
          <Processing text={c.calculating} />
        </AgentRow>
      )}
      {step >= 5 && (
        <AgentRow>
          <p>
            <Rich text={c.result} />
          </p>
        </AgentRow>
      )}
    </>
  )
}

function Composer({ step }: { step: number }) {
  const { t } = useLanguage()
  const c = t.mockup.chat

  return (
    <div className="space-y-2">
      {step >= LAST_STEP && (
        <div className="anim-msg-in flex justify-end">
          <span className="rounded-lg border border-r0-border bg-r0-surface px-3 py-1.5 text-[12px] font-medium text-r0-text">{c.promote}</span>
        </div>
      )}
      <div className="flex h-11 items-center gap-2.5 rounded-xl border border-r0-border bg-r0-surface pl-3 pr-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <Paperclip className="size-4 shrink-0 text-r0-text-secondary" strokeWidth={1.75} />
        <span className="flex-1 text-[12.5px] text-r0-text-muted">{c.composer}</span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-r0-primary-light/40 text-white" aria-hidden>
          <ArrowUp className="size-4" strokeWidth={2} />
        </span>
      </div>
    </div>
  )
}

function ChatView({ step }: { step: number }) {
  const { locale } = useLanguage()
  const scroller = useRef<HTMLDivElement>(null)

  // Like the product: the thread stays scrolled to its newest message.
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [step, locale])

  return (
    <div className="flex h-full flex-col bg-r0-bg">
      <div ref={scroller} className="min-h-0 flex-1 overflow-hidden px-6">
        <div className="mx-auto flex w-full max-w-[560px] flex-col gap-3.5 py-5">
          <Thread step={step} />
        </div>
      </div>
      <div className="shrink-0 px-6 pb-4 pt-1">
        <div className="mx-auto w-full max-w-[560px]">
          <Composer step={step} />
        </div>
      </div>
    </div>
  )
}

/* ─── Dashboard ─────────────────────────────────────────────────────── */

function Segments({ items, active = 0 }: { items: string[]; active?: number }) {
  return (
    <div className="inline-flex divide-x divide-gray-300 overflow-hidden rounded-lg border border-gray-300 bg-white">
      {items.map((item, i) => (
        <span
          key={item}
          className={cn('whitespace-nowrap px-2.5 py-1.5 text-[11px]', i === active ? 'bg-r0-primary font-medium text-white' : 'text-gray-600')}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function Metric({ label, accent, children, note }: { label: string; accent?: string; children: ReactNode; note?: string }) {
  return (
    <div className={cn('min-w-0 rounded-lg border border-r0-border bg-r0-surface p-3', accent && `border-l-[3px] ${accent}`)}>
      <p className={cn('truncate text-[10.5px] font-medium text-r0-text-secondary', accent && 'text-right')}>{label}</p>
      <p className="mt-1.5 truncate text-[19px] font-semibold leading-6 tabular-nums text-r0-text">{children}</p>
      {note && <p className="mt-1 truncate text-[10.5px] text-r0-text-secondary">{note}</p>}
    </div>
  )
}

function ChartHeader({ title, tag }: { title: string; tag: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h4 className="truncate text-[12px] font-semibold text-r0-text">{title}</h4>
      <span className="inline-flex h-[18px] shrink-0 items-center whitespace-nowrap rounded border border-r0-border px-1.5 text-[9.5px] text-r0-text-secondary">
        {tag}
      </span>
    </div>
  )
}

function DashboardView() {
  const { t, locale } = useLanguage()
  const d = t.mockup.dashboard
  const unit = <span className="ml-1 text-[11px] font-normal text-r0-text-secondary">{t.mockup.unit}</span>
  const percent = (value: number) => `${formatNumber(value, locale, 2)}${locale === 'es' ? ' %' : '%'}`
  const peak = Math.max(...SERIES)

  return (
    <div className="anim-rail-in flex h-full flex-col overflow-hidden bg-r0-bg px-5 py-4">
      <p className="text-[10.5px] font-medium text-r0-text-secondary">{d.eyebrow}</p>
      <h3 className="mt-0.5 text-[19px] font-semibold tracking-tight text-r0-text">{d.title}</h3>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Segments items={d.views} />
        <Segments items={d.scopes} />
        <span className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-[11px] font-medium text-r0-text">
          {d.year}
          <ChevronDown className="size-3" />
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-r0-text">
          {d.operations}
          <ArrowRight className="size-3" />
        </span>
      </div>

      <div className="mt-3.5 grid grid-cols-3 gap-3">
        <Metric label={d.emissions} note={`${d.emissionsNote}: ${formatNumber(ESTIMATE, locale, 2)} ${t.mockup.unit}`}>
          {formatNumber(OFFICIAL, locale, 2)}
          {unit}
        </Metric>
        <Metric label={d.operations} accent="border-l-r0-primary-light">
          {OPERATIONS.official}
          <span className="text-[11px] font-normal text-r0-text-muted"> / {OPERATIONS.total}</span>
        </Metric>
        <Metric label={d.quality} accent="border-l-r0-accent">
          2 · 4 · 5<span className="ml-1 text-[11px] font-normal text-r0-text-secondary">PCAF</span>
        </Metric>
      </div>

      <div className="mt-3 grid min-h-0 flex-1 grid-cols-5 grid-rows-1 gap-3">
        <div className="col-span-3 flex min-h-0 flex-col rounded-lg border border-r0-border bg-r0-surface p-3.5">
          <ChartHeader title={d.seriesTitle} tag={d.seriesTag} />
          <div className="flex min-h-0 flex-1 items-end gap-4 border-b border-r0-border px-2">
            {SERIES.map((value, i) => (
              <span
                key={d.months[i]}
                className="anim-bar flex-1 rounded-t-[3px] bg-r0-sun"
                style={{ height: `${(value / peak) * 92}%`, animationDelay: `${i * 70}ms` }}
              />
            ))}
          </div>
          <div className="flex gap-4 px-2 pt-1.5 text-center text-[9.5px] text-r0-text-secondary">
            {d.months.map((month) => (
              <span key={month} className="flex-1">
                {month}
              </span>
            ))}
          </div>
        </div>

        <div className="col-span-2 flex min-h-0 flex-col overflow-hidden rounded-lg border border-r0-border bg-r0-surface p-3.5">
          <ChartHeader title={d.sectorTitle} tag={t.mockup.unit} />
          <ul className="flex min-h-0 flex-1 flex-col justify-between gap-1">
            {SECTORS.map((value, i) => (
              <li key={d.sectors[i]}>
                <span className="flex items-baseline justify-between gap-2 text-[10px] leading-tight">
                  <span className="truncate text-r0-text-secondary">{d.sectors[i]}</span>
                  <span className="shrink-0 tabular-nums text-r0-text-secondary">{percent((value / OFFICIAL) * 100)}</span>
                </span>
                <span className="mt-1 block h-[5px] rounded-full bg-r0-subtle">
                  <span
                    className="anim-bar-x block h-full rounded-full bg-r0-primary-light"
                    style={{ width: `${(value / SECTORS[0]) * 100}%`, animationDelay: `${i * 60}ms` }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ─── Inbox ─────────────────────────────────────────────────────────── */

function InboxSection({ title, total, children }: { title: string; total: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-r0-border bg-r0-surface">
      <header className="flex items-center justify-between gap-3 border-b border-r0-border px-4 py-3">
        <h4 className="text-[12.5px] font-semibold text-r0-text">{title}</h4>
        <span className="text-[12.5px] font-semibold tabular-nums text-r0-text">{total}</span>
      </header>
      {children}
    </section>
  )
}

function InboxView() {
  const { t, locale } = useLanguage()
  const b = t.mockup.inbox
  const tons = (value: number) => `${formatNumber(value, locale, 2)} ${t.mockup.unit}`

  return (
    <div className="anim-rail-in h-full overflow-hidden bg-r0-bg px-5 py-5">
      <div className="mx-auto max-w-[620px] space-y-4">
        <h3 className="text-[19px] font-semibold tracking-tight text-r0-text">{b.title}</h3>

        <InboxSection title={b.proposals} total="1">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 px-4 py-3">
            <span className="min-w-0 text-[12px] text-r0-text">
              <span className="font-medium">{b.proposer}</span>
              <span className="text-r0-text-muted"> · {b.proposalMeta}</span>
              <span className="mt-1 block font-mono text-[10px] leading-relaxed text-r0-text-secondary">
                {b.official} {tons(OFFICIAL)} · {b.estimate} {tons(ESTIMATE)} · {b.scope3} {b.notReported}
              </span>
            </span>
            <span className="flex gap-2">
              <span className="rounded-lg border border-r0-border px-3 py-1.5 text-[12px] text-r0-text-secondary">{b.reject}</span>
              <span className="rounded-lg bg-r0-primary-light px-3 py-1.5 text-[12px] font-medium text-white">{b.approve}</span>
            </span>
          </div>
        </InboxSection>

        <InboxSection title={b.evidence} total="2">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
            <span className="min-w-0 text-[12px] text-r0-text">
              <span className="font-medium">{b.evidenceOwner}</span>
              <span className="text-r0-text-muted"> · {b.evidenceMeta}</span>
            </span>
            <span className="inline-flex items-center gap-0.5 text-[12px] font-medium text-r0-primary-light">
              {b.review}
              <ChevronRight className="size-3.5" strokeWidth={1.75} />
            </span>
          </div>
        </InboxSection>
      </div>
    </div>
  )
}

/* ─── Mobile shell (under md the platform shows the conversation full width) ── */

function MobileShell() {
  const { t } = useLanguage()

  return (
    <div className="bg-r0-bg font-display">
      <div className="flex h-12 items-center justify-between border-b border-r0-border bg-r0-surface px-3">
        <div className="flex items-center gap-2.5">
          <Menu className="size-5 text-r0-text-secondary" strokeWidth={1.75} aria-hidden />
          <span className="text-[13.5px] font-semibold text-r0-text">{t.mockup.sidebar.agent}</span>
        </div>
        <span className="truncate pl-3 text-[12px] text-r0-text-secondary">{t.mockup.bank}</span>
      </div>
      <div className="flex flex-col gap-3.5 px-4 pb-3 pt-5">
        <Thread step={LAST_STEP} />
      </div>
      <div className="px-4 pb-4">
        <Composer step={LAST_STEP} />
      </div>
    </div>
  )
}

/* ─── Frame ─────────────────────────────────────────────────────────── */

export function AppMockup({ className, style }: { className?: string; style?: CSSProperties }) {
  const { t } = useLanguage()
  const [view, setView] = useState<View>('chat')
  const [step, setStep] = useState(0)
  // 0 while playing; otherwise the time of the last manual pick.
  const [pausedAt, setPausedAt] = useState(0)
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 })
  const reducedMotion = prefersReducedMotion()
  const moving = inView && !reducedMotion

  // The conversation always plays to its end, also after a manual pick.
  useEffect(() => {
    if (!moving || view !== 'chat' || step >= LAST_STEP) return
    const timer = setTimeout(() => setStep((s) => s + 1), CHAT_STEP_MS[step])
    return () => clearTimeout(timer)
  }, [moving, view, step])

  // The screens rotate by themselves until someone picks one.
  useEffect(() => {
    if (!moving) return
    if (pausedAt) {
      const timer = setTimeout(() => setPausedAt(0), RESUME_MS)
      return () => clearTimeout(timer)
    }
    if (view === 'chat' && step < LAST_STEP) return
    const timer = setTimeout(
      () => {
        const next = NEXT_VIEW[view]
        setView(next)
        if (next === 'chat') setStep(0)
      },
      view === 'chat' ? CHAT_STEP_MS[LAST_STEP] : VIEW_MS[view],
    )
    return () => clearTimeout(timer)
  }, [moving, pausedAt, view, step])

  const pick = (next: View) => {
    setPausedAt(Date.now())
    setView(next)
    if (next === 'chat') setStep(0)
  }

  // Without motion there is nothing to play: the finished conversation.
  const shownStep = reducedMotion ? LAST_STEP : step

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

      {/* The platform is set in Montserrat throughout. */}
      <div className="hidden h-[500px] font-display md:flex lg:h-[540px]">
        <nav className="flex w-14 shrink-0 flex-col items-center border-r border-r0-border bg-r0-surface" aria-label="RastroCero">
          <div className="flex h-12 shrink-0 items-center justify-center">
            <img src="/apple-touch-icon.png" alt="" className="size-8 rounded-lg" />
          </div>
          <div className="flex flex-1 flex-col items-center gap-1 pt-2">
            <RailButton icon={House} label={t.mockup.rail.home} active={view === 'inbox'} onClick={() => pick('inbox')} />
            <RailButton icon={BriefcaseBusiness} label={t.mockup.rail.financed} active={view !== 'inbox'} onClick={() => pick('chat')} />
          </div>
          <div className="flex shrink-0 justify-center py-3">
            <span className="size-7 rounded-full bg-gradient-to-br from-r0-mint to-r0-accent ring-1 ring-r0-border" />
          </div>
        </nav>

        {view === 'inbox' ? <HomeSidebar /> : <BankerSidebar view={view} onPick={pick} />}

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar bank={t.mockup.bank} />
          <div className="relative min-h-0 flex-1">
            {view === 'chat' ? <ChatView step={shownStep} /> : view === 'dashboard' ? <DashboardView /> : <InboxView />}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <MobileShell />
      </div>
    </div>
  )
}
