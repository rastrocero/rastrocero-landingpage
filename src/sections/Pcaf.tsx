import { Check, Clock3 } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { PCAF_ICONS } from '../lib/pcaf'
import { cn } from '../lib/cn'

/* DQS 1 (best) → 5: the green ramp fades as data quality drops. */
const DQS_STYLES = [
  'bg-r0-primary text-white',
  'bg-r0-primary-light text-white',
  'bg-r0-primary-medium text-white',
  'bg-r0-accent text-white',
  'bg-r0-mint text-r0-primary',
]
const DQS_BAR = ['bg-r0-primary', 'bg-r0-primary-light', 'bg-r0-primary-medium', 'bg-r0-accent', 'bg-r0-mint']

function DqsCard() {
  const { t } = useLanguage()
  const p = t.pcaf

  return (
    <div className="rounded-xl border border-r0-border bg-white p-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[15px] font-semibold text-r0-text">{p.dqsTitle}</p>
        <p className="font-mono text-[11px] text-r0-text-muted">PCAF</p>
      </div>
      <p className="mt-4 text-[11px] font-medium uppercase tracking-wide text-r0-primary-medium">↑ {p.dqsBest}</p>
      <ol className="mt-2.5 space-y-2.5">
        {p.dqs.map((label, i) => (
          <li key={label} className="flex items-center gap-3">
            <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold', DQS_STYLES[i])}>
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] leading-snug text-r0-text">{label}</span>
              <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-gray-100">
                <span className={cn('block h-full rounded-full', DQS_BAR[i])} style={{ width: `${100 - i * 18}%` }} />
              </span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-2.5 text-[11px] font-medium uppercase tracking-wide text-r0-text-muted">↓ {p.dqsWorst}</p>
    </div>
  )
}

export function Pcaf() {
  const { t } = useLanguage()
  const p = t.pcaf

  return (
    <section id="pcaf" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
          <SectionHeading eyebrow={p.eyebrow} title1={p.title1} title2={p.title2} className="lg:col-span-6" />
          <p className="text-base leading-relaxed text-r0-text-secondary sm:text-lg lg:col-span-6">{p.text}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-8">
            <h3 className="mb-3 text-sm font-medium text-r0-text-secondary">{p.gridTitle}</h3>
            {/* Same hairline grid as the platform's PCAF product picker */}
            <div className="grid auto-rows-fr grid-cols-1 gap-px overflow-hidden rounded-lg border border-r0-border bg-r0-border sm:grid-cols-2 xl:grid-cols-3">
              {p.classes.map((c) => {
                const Icon = PCAF_ICONS[c.code]
                return (
                  <div key={c.code} className="group flex flex-col gap-2 bg-r0-surface px-5 py-4 transition-colors duration-150 hover:bg-r0-bg sm:min-h-32 sm:gap-3 sm:p-6">
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-r0-text">{c.name}</span>
                      <Icon className="size-5 shrink-0 text-r0-primary transition-transform duration-200 group-hover:scale-110" strokeWidth={1.7} />
                    </span>
                    <span className="text-xs leading-relaxed text-r0-text-secondary">{c.desc}</span>
                  </div>
                )
              })}
            </div>
          </Reveal>

          <Reveal delay={120} className="flex flex-col gap-6 lg:col-span-4 lg:pt-8">
            <DqsCard />
            <ul className="space-y-3.5 px-1">
              {p.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm leading-relaxed text-r0-text">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-r0-cream text-r0-primary-light">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-r0-border bg-r0-bg px-5 py-4">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
            <Clock3 className="size-3.5" />
            {p.upcomingLabel}
          </span>
          {p.upcoming.map((u) => (
            <span key={u} className="text-sm font-medium text-r0-text-secondary">
              {u}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
