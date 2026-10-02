import type { ReactNode } from 'react'
import { FileSpreadsheet } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from '../components/Reveal'
import { AppMockup } from '../components/AppMockup'
import { SectionHeading } from '../components/SectionHeading'
import { PCAF_ICONS, dqsColor } from '../lib/pcaf'

/*
 * The measurement platform a bank can try today, in one section: the product
 * shell, four panels with the same anatomy (mono label, title, one sentence,
 * one visual) and the working flow. Everything here is present tense; the
 * bankers of the vision live in their own sections.
 */

interface PanelProps {
  label: string
  title: string
  text: string
  children: ReactNode
}

function Panel({ label, title, text, children }: PanelProps) {
  return (
    <article className="flex flex-col rounded-xl border border-r0-border bg-white p-6 sm:p-8">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-r0-primary-medium">{label}</p>
      <h3 className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight text-balance text-r0-text">{title}</h3>
      <p className="mt-2.5 text-[15px] leading-relaxed text-r0-text-secondary">{text}</p>
      {/* Visuals sit at the bottom so they line up across a row whatever the copy length. */}
      <div className="mt-auto pt-8">{children}</div>
    </article>
  )
}

function AssetClasses() {
  const { t } = useLanguage()

  return (
    <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-r0-border bg-r0-border sm:grid-cols-2 xl:grid-cols-3">
      {t.platform.assetClasses.map((c) => {
        const Icon = PCAF_ICONS[c.code]
        return (
          <li key={c.code} className="flex items-center gap-2.5 bg-white px-3.5 py-3">
            <Icon className="size-4 shrink-0 text-r0-primary" strokeWidth={1.7} />
            <span className="text-[13px] font-medium leading-tight text-r0-text">{c.name}</span>
          </li>
        )
      })}
    </ul>
  )
}

function Upload() {
  const { t } = useLanguage()
  const u = t.platform.upload

  return (
    <div className="rounded-lg border border-r0-border bg-r0-bg/60 p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-r0-primary-light ring-1 ring-r0-border">
          <FileSpreadsheet className="size-[18px]" strokeWidth={1.8} />
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-r0-text">{u.file}</span>
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-r0-border">
        <span className="block h-full w-full rounded-full bg-r0-accent" />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-white px-3 py-2.5 ring-1 ring-r0-border">
          <dt className="text-[11px] text-r0-text-secondary">{u.created}</dt>
          <dd className="font-mono text-lg font-semibold text-r0-text">128</dd>
        </div>
        <div className="rounded-md bg-white px-3 py-2.5 ring-1 ring-r0-border">
          <dt className="text-[11px] text-r0-text-secondary">{u.updated}</dt>
          <dd className="font-mono text-lg font-semibold text-r0-text">14</dd>
        </div>
      </dl>
    </div>
  )
}

function Formula() {
  const { t } = useLanguage()
  const a = t.platform.attribution
  const term = 'rounded-md bg-r0-bg px-2.5 py-1.5 text-center text-[13px] font-medium leading-snug text-r0-text ring-1 ring-r0-border'

  return (
    <div>
      {/* Reads left to right: (outstanding ÷ value) × client emissions, then = result. */}
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="flex flex-col items-stretch gap-1.5 sm:items-center">
          <span className={term}>{a.numerator}</span>
          <span aria-hidden className="h-px w-full bg-r0-text/70" />
          <span className={term}>{a.denominator}</span>
        </span>
        <span className="text-center font-mono text-sm text-r0-text-muted">×</span>
        <span className={term}>{a.emissions}</span>
      </div>
      <div className="mt-3 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="text-center font-mono text-sm text-r0-text-muted">=</span>
        <span className="rounded-md bg-r0-primary px-2.5 py-1.5 text-center text-[13px] font-semibold text-white">{a.result}</span>
      </div>
      <p className="mt-4 text-[12.5px] leading-relaxed text-r0-text-muted">{a.note}</p>
    </div>
  )
}

function DqsScale() {
  const { t } = useLanguage()
  const d = t.platform.dqs

  return (
    <div>
      <p className="mb-3 text-right text-xs text-r0-text-muted">{d.hint}</p>
      <ol className="flex flex-col gap-3 sm:flex-row sm:gap-2.5">
        {d.levels.map((label, i) => (
          <li key={label} className="flex min-w-0 items-center gap-3 sm:flex-1 sm:flex-col sm:items-stretch sm:gap-0">
            <span aria-hidden className="h-2.5 w-10 shrink-0 rounded-[3px] sm:w-auto" style={{ backgroundColor: dqsColor(i + 1) }} />
            <span className="flex min-w-0 gap-2 sm:mt-3 sm:block">
              <span className="font-mono text-xs font-semibold text-r0-text">{i + 1}</span>
              <span className="block text-[13px] leading-snug text-r0-text-secondary sm:mt-1">{label}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function Platform() {
  const { t } = useLanguage()
  const p = t.platform

  return (
    <section id="plataforma" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading title={p.title} lead={p.lead} className="max-w-3xl" />
        </Reveal>

        <Reveal as="figure" className="mt-10 sm:mt-12">
          <AppMockup />
          <figcaption className="mt-3 text-xs text-r0-text-muted">{p.exampleNote}</figcaption>
        </Reveal>

        {/* Old anchor, kept so existing links to #emissions-banker still land on the feature panels. */}
        <span id="emissions-banker" aria-hidden className="block scroll-mt-24" />

        <Reveal className="mt-14 grid gap-6 lg:mt-16 lg:grid-cols-2">
          <Panel label={p.classes.label} title={p.classes.title} text={p.classes.text}>
            <AssetClasses />
          </Panel>
          <Panel label={p.upload.label} title={p.upload.title} text={p.upload.text}>
            <Upload />
          </Panel>
          <Panel label={p.attribution.label} title={p.attribution.title} text={p.attribution.text}>
            <Formula />
          </Panel>
          <Panel label={p.dqs.label} title={p.dqs.title} text={p.dqs.text}>
            <DqsScale />
          </Panel>
        </Reveal>

        <Reveal>
          <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {p.steps.map((step, i) => (
              <li key={step.title} className="border-t border-r0-text/80 pt-5">
                <span className="font-mono text-xs text-r0-primary-medium">0{i + 1}</span>
                <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-r0-text">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-r0-text-secondary">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-xs text-r0-text-muted">{p.footnote}</p>
        </Reveal>
      </div>
    </section>
  )
}
