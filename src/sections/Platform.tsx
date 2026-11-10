import type { ReactNode } from 'react'
import { Check, FileSpreadsheet } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from '../components/Reveal'
import { AppMockup } from '../components/AppMockup'
import { SectionHeading } from '../components/SectionHeading'
import { PCAF_ICONS, dqsColor, formatNumber } from '../lib/pcaf'

/*
 * What a bank can try today, in one section: the product shell, four panels
 * with the same anatomy (mono label, title, one sentence, one visual), the
 * asset classes and the working flow. The panels follow one portfolio through
 * the product — upload, classification, results, data quality — with the same
 * figures as the mockup above. Everything here is present tense; the bankers
 * still being built live in their own sections.
 */

/* Scope 1 + 2 of the example portfolio (tCO2e), as in the mockup. */
const RESULTS = { official: { operations: 389, tco2e: 18_642.7 }, estimate: { operations: 42, tco2e: 3_218.4 } }
const ROWS_READ = 486

interface PanelProps {
  label: string
  title: string
  text: string
  children: ReactNode
}

function Panel({ label, title, text, children }: PanelProps) {
  // min-w-0: without it the single column of a phone grows to the widest unbreakable
  // line inside any panel and every panel spills past the page gutter.
  return (
    <article className="flex min-w-0 flex-col rounded-xl border border-r0-border bg-white p-6 sm:p-8">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-r0-primary-medium">{label}</p>
      <h3 className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight text-balance text-r0-text">{title}</h3>
      <p className="mt-2.5 text-[15px] leading-relaxed text-r0-text-secondary">{text}</p>
      {/* Visuals sit at the bottom so they line up across a row whatever the copy length. */}
      <div className="mt-auto pt-8">{children}</div>
    </article>
  )
}

/** One workbook read into the classes the platform proposes, plus what stays out of scope. */
function Upload() {
  const { t, locale } = useLanguage()
  const u = t.platform.upload

  return (
    <div className="rounded-lg border border-r0-border bg-r0-bg/60 p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-r0-primary-light ring-1 ring-r0-border">
          <FileSpreadsheet className="size-[18px]" strokeWidth={1.8} />
        </span>
        {/* On a phone the count sits under the file name, so neither is cut. */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
          <span className="min-w-0 truncate font-mono text-[13px] text-r0-text sm:flex-1">{u.file}</span>
          <span className="shrink-0 text-[13px] text-r0-text-secondary">
            <span className="font-mono font-semibold text-r0-text">{formatNumber(ROWS_READ, locale, 0)}</span> {u.rows}
          </span>
        </div>
      </div>
      <ul className="mt-4 divide-y divide-r0-border overflow-hidden rounded-md bg-white ring-1 ring-r0-border">
        {u.classes.map((c) => {
          const Icon = PCAF_ICONS[c.code]
          return (
            <li key={c.code} className="flex items-center gap-2.5 px-3.5 py-2.5">
              <Icon className="size-4 shrink-0 text-r0-primary" strokeWidth={1.7} />
              <span className="min-w-0 flex-1 text-[13px] font-medium text-r0-text max-sm:leading-snug">{c.name}</span>
              <span className="font-mono text-[13px] text-r0-text">{c.count}</span>
            </li>
          )
        })}
        <li className="flex items-center gap-2.5 px-3.5 py-2.5">
          <span aria-hidden className="flex size-4 shrink-0 items-center justify-center">
            <span className="h-px w-3 bg-r0-text-muted" />
          </span>
          <span className="min-w-0 flex-1 text-[13px] text-r0-text-secondary max-sm:leading-snug">{u.excluded.name}</span>
          <span className="font-mono text-[13px] text-r0-text-secondary">{u.excluded.count}</span>
        </li>
      </ul>
    </div>
  )
}

/** One doubt, asked once for every operation that shares the text; the answer becomes a rule. */
function Question() {
  const { t } = useLanguage()
  const q = t.platform.questions

  return (
    <div className="rounded-lg border border-r0-border bg-r0-bg/60 p-4">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[13px] font-semibold text-r0-text">{q.quote}</span>
        <span className="shrink-0 text-[13px] text-r0-text-secondary">{q.count}</span>
      </div>
      <ul className="mt-4 space-y-2">
        {q.options.map((option, i) => (
          <li
            key={option}
            className={
              i === 0
                ? 'flex items-center gap-2.5 rounded-md bg-white px-3.5 py-2.5 text-[13px] font-medium text-r0-text ring-1 ring-r0-primary-light'
                : 'flex items-center gap-2.5 rounded-md bg-white px-3.5 py-2.5 text-[13px] text-r0-text-secondary ring-1 ring-r0-border'
            }
          >
            <span
              aria-hidden
              className={
                i === 0
                  ? 'flex size-4 shrink-0 items-center justify-center rounded-full bg-r0-primary-light text-white'
                  : 'size-4 shrink-0 rounded-full ring-1 ring-inset ring-r0-border'
              }
            >
              {i === 0 && <Check className="size-2.5" strokeWidth={3.5} />}
            </span>
            {option}
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-center gap-2 text-[12.5px] text-r0-text-secondary">
        <span aria-hidden className="size-1.5 rounded-full bg-r0-accent" />
        {q.rule}
      </p>
    </div>
  )
}

/** The two totals that are never added together, and a scope without data. */
function Basis() {
  const { t, locale } = useLanguage()
  const b = t.platform.basis
  const head = 'pb-2.5 text-[11px] font-medium text-r0-text-secondary'
  const cell = 'border-t border-r0-border py-3'
  const tons = (value: number) => (
    <>
      {formatNumber(value, locale, 2)} <span className="font-sans text-[11px] font-normal text-r0-text-muted">{t.mockup.unit}</span>
    </>
  )

  return (
    <table className="w-full text-[13px]">
      <thead>
        <tr>
          <th scope="col" className={`${head} text-left`}>
            <span className="sr-only">{b.label}</span>
          </th>
          <th scope="col" className={`${head} text-right`}>
            {b.operations}
          </th>
          <th scope="col" className={`${head} text-right`}>
            {b.scope}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" className={`${cell} text-left font-normal`}>
            <span className="inline-flex items-center rounded-full border border-r0-mint bg-r0-cream px-2.5 py-0.5 text-xs font-medium text-r0-primary">
              {b.official}
            </span>
          </th>
          <td className={`${cell} text-right font-mono text-r0-text`}>{RESULTS.official.operations}</td>
          <td className={`${cell} text-right font-mono font-semibold text-r0-text`}>{tons(RESULTS.official.tco2e)}</td>
        </tr>
        <tr>
          <th scope="row" className={`${cell} text-left font-normal`}>
            <span className="inline-flex items-center rounded-full border border-dashed border-r0-border bg-white px-2.5 py-0.5 text-xs font-medium text-r0-text-secondary">
              {b.estimate}
            </span>
          </th>
          <td className={`${cell} text-right font-mono text-r0-text`}>{RESULTS.estimate.operations}</td>
          <td className={`${cell} text-right font-mono text-r0-text`}>{tons(RESULTS.estimate.tco2e)}</td>
        </tr>
        <tr>
          <th scope="row" className={`${cell} text-left font-normal text-r0-text-secondary`}>
            {b.scope3}
          </th>
          <td className={cell} />
          <td className={`${cell} text-right text-r0-text-secondary`}>{b.notReported}</td>
        </tr>
      </tbody>
    </table>
  )
}

/** The 1–5 score each result carries, and what is still waiting — with its owner. */
function Quality() {
  const { t } = useLanguage()
  const q = t.platform.quality

  return (
    <div>
      <p className="mb-3 text-right text-xs text-r0-text-muted">{q.hint}</p>
      <ol className="flex flex-col gap-3 sm:flex-row sm:gap-2.5">
        {q.levels.map((label, i) => (
          <li key={label} className="flex min-w-0 items-center gap-3 sm:flex-1 sm:flex-col sm:items-stretch sm:gap-0">
            <span aria-hidden className="h-2.5 w-10 shrink-0 rounded-[3px] sm:w-auto" style={{ backgroundColor: dqsColor(i + 1) }} />
            <span className="flex min-w-0 gap-2 sm:mt-3 sm:block">
              <span className="font-mono text-xs font-semibold text-r0-text">{i + 1}</span>
              <span className="block text-[13px] leading-snug text-r0-text-secondary sm:mt-1">{label}</span>
            </span>
          </li>
        ))}
      </ol>
      <dl className="mt-6 divide-y divide-r0-border border-t border-r0-border">
        {q.waiting.map((w) => (
          <div key={w.text} className="flex items-center justify-between gap-4 py-2.5 text-[13px]">
            <dt className="text-r0-text-secondary">{w.text}</dt>
            <dd className="font-mono text-r0-text">{w.count}</dd>
          </div>
        ))}
      </dl>
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
          <Panel label={p.upload.label} title={p.upload.title} text={p.upload.text}>
            <Upload />
          </Panel>
          <Panel label={p.questions.label} title={p.questions.title} text={p.questions.text}>
            <Question />
          </Panel>
          <Panel label={p.basis.label} title={p.basis.title} text={p.basis.text}>
            <Basis />
          </Panel>
          <Panel label={p.quality.label} title={p.quality.title} text={p.quality.text}>
            <Quality />
          </Panel>
        </Reveal>

        <Reveal className="mt-6 rounded-xl border border-r0-border bg-white p-6 sm:p-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-r0-primary-medium">{p.classesLabel}</p>
          <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {p.assetClasses.map((c) => {
              const Icon = PCAF_ICONS[c.code]
              return (
                <li key={c.code} className="flex items-center gap-2.5">
                  <Icon className="size-4 shrink-0 text-r0-primary" strokeWidth={1.7} />
                  <span className="text-[14px] font-medium leading-tight text-r0-text">{c.name}</span>
                </li>
              )
            })}
          </ul>
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
