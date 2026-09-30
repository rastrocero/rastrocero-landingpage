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

function DqsCard() {
  const { t } = useLanguage()
  const p = t.pcaf

  return (
    <div className="rounded-xl border border-r0-border bg-white p-6">
      <p className="text-[15px] font-semibold text-r0-text">{p.dqsTitle}</p>
      <p className="mt-4 text-[11px] font-medium uppercase tracking-wide text-r0-primary-medium">{p.dqsBest}</p>
      <ol className="mt-3 space-y-3">
        {p.dqs.map((label, i) => (
          <li key={label} className="flex items-center gap-3">
            <span className={cn('flex size-6 shrink-0 items-center justify-center rounded font-mono text-[11px] font-bold', DQS_STYLES[i])}>
              {i + 1}
            </span>
            <span className="text-[13px] leading-snug text-r0-text">{label}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-r0-text-muted">{p.dqsWorst}</p>
    </div>
  )
}

export function Pcaf() {
  const { t } = useLanguage()
  const p = t.pcaf

  return (
    <section id="pcaf" className="bg-r0-bg py-16 sm:py-24">
      <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
          <SectionHeading eyebrow={p.eyebrow} title1={p.title1} title2={p.title2} className="lg:col-span-6" />
          <p className="text-base leading-relaxed text-r0-text-secondary sm:text-lg lg:col-span-6">{p.text}</p>
        </div>

        <div className="mt-12 grid gap-8 lg:mt-14 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h3 className="mb-3 text-sm font-medium text-r0-text-secondary">{p.gridTitle}</h3>
            {/* Same hairline grid as the platform's PCAF product picker */}
            <div className="grid auto-rows-fr grid-cols-1 gap-px overflow-hidden rounded-lg border border-r0-border bg-r0-border sm:grid-cols-2 xl:grid-cols-3">
              {p.classes.map((c) => {
                const Icon = PCAF_ICONS[c.code]
                return (
                  <div key={c.code} className="flex flex-col gap-2 bg-r0-surface px-5 py-4 sm:min-h-32 sm:gap-3 sm:p-6">
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-r0-text">{c.name}</span>
                      <Icon className="size-5 shrink-0 text-r0-primary" strokeWidth={1.7} />
                    </span>
                    <span className="text-xs leading-relaxed text-r0-text-secondary">{c.desc}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-4 lg:pt-8">
            <DqsCard />
            <ul className="border-b border-r0-border text-sm leading-relaxed text-r0-text">
              {p.bullets.map((b) => (
                <li key={b} className="border-t border-r0-border py-3">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
