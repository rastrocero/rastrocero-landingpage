import type { CSSProperties, ReactNode } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

/*
 * Both modules share one visual idea: a segmented band with its labels
 * beneath. Operational splits it by scope (proportions follow the mockup's
 * totals, colours are the platform's chart palette); PCAF splits it into the
 * five Data Quality Score levels, on the green ramp that fades as quality drops.
 */
const SCOPE_BANDS = [
  { share: 32, color: 'var(--color-r0-primary-light)' },
  { share: 24, color: 'var(--color-r0-accent)' },
  { share: 44, color: 'var(--color-r0-accent-light)' },
]

const DQS_COLORS = [
  'var(--color-r0-primary)',
  'var(--color-r0-primary-light)',
  'var(--color-r0-primary-medium)',
  'var(--color-r0-accent)',
  'var(--color-r0-mint)',
]

interface PanelProps {
  id: string
  label: string
  tag?: string
  title: string
  text: string
  vizTitle: string
  vizHint: string
  footLabel: string
  footer: ReactNode
  children: ReactNode
}

function Panel({ id, label, tag, title, text, vizTitle, vizHint, footLabel, footer, children }: PanelProps) {
  return (
    /* From lg the panel is a subgrid, so header, band and footer line up across both panels whatever the copy length. */
    <article
      id={id}
      className="scroll-mt-4 rounded-xl border border-r0-border bg-white p-6 sm:p-8 lg:grid lg:row-span-3 lg:grid-rows-subgrid lg:p-10"
    >
      <div>
        <p className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase leading-5 tracking-[0.12em] text-r0-primary-medium">
          {label}
          {tag && <span className="rounded border border-r0-border px-1.5 leading-4 text-r0-text-secondary">{tag}</span>}
        </p>
        <h3 className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight text-balance text-r0-text sm:text-2xl">{title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-r0-text-secondary">{text}</p>
      </div>

      <div className="mt-8 sm:mt-10">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <p className="text-xs font-semibold text-r0-text">{vizTitle}</p>
          <p className="text-xs text-r0-text-muted">{vizHint}</p>
        </div>
        {children}
      </div>

      <div className="mt-8 border-t border-r0-border pt-5 sm:mt-10">
        <p className="text-xs font-semibold text-r0-text">{footLabel}</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-r0-text-secondary">{footer}</p>
      </div>
    </article>
  )
}

/* Band segment: a short pill beside its label on phones, the column's top rule from sm up. */
function Band({ color }: { color: string }) {
  return <span aria-hidden className="mt-1.5 h-2.5 w-10 shrink-0 rounded-[3px] sm:mt-0 sm:w-auto" style={{ backgroundColor: color }} />
}

function ScopeBands() {
  const { t } = useLanguage()
  const o = t.operational

  return (
    <ul className="flex flex-col gap-3 sm:flex-row sm:gap-3">
      {o.scopes.map((s, i) => (
        <li
          key={s.name}
          className="flex min-w-0 items-start gap-3 sm:flex-col sm:items-stretch sm:gap-0 sm:[flex:var(--share)_1_0%]"
          style={{ '--share': SCOPE_BANDS[i].share } as CSSProperties}
        >
          <Band color={SCOPE_BANDS[i].color} />
          <div className="min-w-0 sm:mt-3">
            <p className="text-xs font-semibold text-r0-text">{s.name}</p>
            <p className="mt-0.5 text-[13px] leading-snug text-r0-text-secondary sm:hidden">{s.sources.join(' · ')}</p>
            <ul className="mt-1 hidden space-y-0.5 text-[13px] leading-snug text-r0-text-secondary sm:block">
              {s.sources.map((src) => (
                <li key={src}>{src}</li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  )
}

function DqsBands() {
  const { t } = useLanguage()
  const p = t.pcaf

  return (
    <ol className="flex flex-col gap-3 sm:flex-row sm:gap-3">
      {p.dqs.map((label, i) => (
        <li key={label} className="flex min-w-0 items-start gap-3 sm:flex-1 sm:flex-col sm:items-stretch sm:gap-0">
          <Band color={DQS_COLORS[i]} />
          <div className="flex min-w-0 gap-2 sm:mt-3 sm:block">
            <p className="font-mono text-xs font-semibold text-r0-text">{i + 1}</p>
            <p className="text-[13px] leading-snug text-r0-text-secondary sm:mt-1">{label}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function Modules() {
  const { t } = useLanguage()
  const o = t.operational
  const p = t.pcaf

  return (
    <section className="bg-r0-bg py-16 sm:py-24">
      <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={o.section.eyebrow} title1={o.section.title1} title2={o.section.title2} className="max-w-2xl" />

        <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-y-0">
          <Panel
            id="operativo"
            label={o.label}
            title={o.title}
            text={o.text}
            vizTitle={o.vizTitle}
            vizHint={o.vizHint}
            footLabel={o.footLabel}
            footer={o.footText}
          >
            <ScopeBands />
          </Panel>

          <Panel
            id="pcaf"
            label={p.label}
            tag={p.tag}
            title={p.title}
            text={p.text}
            vizTitle={p.vizTitle}
            vizHint={p.vizHint}
            footLabel={p.classesLabel}
            footer={p.classes.map((c) => c.name).join(' · ')}
          >
            <DqsBands />
          </Panel>
        </div>
      </Reveal>
    </section>
  )
}
