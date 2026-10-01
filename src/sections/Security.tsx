import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { dqsColor } from '../lib/pcaf'

/* Syntax colours for the snapshot block */
const K = 'text-r0-accent-light'
const S = 'text-r0-cream'
const N = 'text-r0-sun'
const P = 'text-white/40'

/* One JSON line: key, value and whether the value is a string. */
function Line({ k, v, str, last }: { k: string; v: string; str?: boolean; last?: boolean }) {
  return (
    <>
      {'  '}
      <span className={K}>"{k}"</span>
      <span className={P}>: </span>
      <span className={str ? S : N}>{str ? `"${v}"` : v}</span>
      {!last && <span className={P}>,</span>}
      {'\n'}
    </>
  )
}

/*
 * A financed exposure as the platform stores it: the inputs, the PCAF option
 * and score, and the immutable calculation snapshot. Business loan to an
 * unlisted company: 2.4 M / (equity + debt 18 M) = 13.33 % of 4,520 tCO2e.
 */
function RecordCard() {
  const { t } = useLanguage()
  const r = t.security.record

  return (
    <div className="overflow-hidden rounded-xl border border-r0-border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-r0-border px-5 py-3.5">
        <p className="text-sm font-semibold text-r0-text">{r.title}</p>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-r0-cream px-2 py-0.5 text-[11px] font-semibold text-r0-primary-light">
          <span className="size-1.5 rounded-full bg-r0-accent" />
          {r.status}
        </span>
      </div>

      <dl className="divide-y divide-r0-border px-5">
        {r.rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 py-2.5 text-[13px]">
            <dt className="text-r0-text-secondary">{label}</dt>
            <dd className="text-right font-medium text-r0-text">{value}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 py-2.5 text-[13px]">
          <dt className="text-r0-text-secondary">{r.optionLabel}</dt>
          <dd className="flex items-center gap-2 font-medium text-r0-text">
            {r.optionValue}
            <span className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: dqsColor(2) }}>
              {t.mockup.registry.score} 2
            </span>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-2.5 text-[13px]">
          <dt className="text-r0-text-secondary">{r.staleLabel}</dt>
          <dd className="flex items-center gap-2 text-r0-text-muted">
            <span className="font-mono line-through">C-0412</span>
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold">{r.staleTag}</span>
          </dd>
        </div>
      </dl>

      <div className="mx-5 mb-5 mt-2 overflow-hidden rounded-lg bg-r0-deep">
        <p className="border-b border-white/10 px-4 py-2 font-mono text-[10.5px] text-white/50">calculation_snapshot</p>
        <pre className="whitespace-pre-wrap break-words px-4 py-3 font-mono text-[11.5px] leading-[1.7]">
          <code>
            <span className={P}>{'{'}</span>{'\n'}
            <Line k="asset_class" v="business_loans" str />
            <Line k="pcaf_option" v="1b" str />
            <Line k="data_quality_score" v="2" />
            <Line k="outstanding_amount" v="2400000" />
            <Line k="equity_plus_debt" v="18000000" />
            <Line k="attribution_factor" v="0.1333" />
            <Line k="borrower_emissions_tco2e" v="4520" />
            <Line k="engine_version" v="v2" str />
            <Line k="input_fingerprint" v="sha256:9f2c…41ab" str last />
            <span className={P}>{'}'}</span>
          </code>
        </pre>
      </div>

      <div className="flex items-center justify-between border-t border-r0-border bg-r0-bg px-5 py-4">
        <span className="text-sm text-r0-text-secondary">{r.result}</span>
        <span className="font-display text-2xl font-semibold tabular-nums tracking-tight text-r0-primary">
          {r.resultValue} <span className="font-sans text-sm font-normal text-r0-text-muted">tCO₂e</span>
        </span>
      </div>
    </div>
  )
}

export function Security() {
  const { t } = useLanguage()
  const s = t.security

  return (
    <section id="seguridad" className="bg-r0-bg py-16 sm:py-24">
      <Reveal className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-7">
          <SectionHeading eyebrow={s.eyebrow} title1={s.title1} title2={s.title2} />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-r0-text-secondary sm:text-lg">{s.text}</p>

          <dl className="mt-10 grid gap-x-10 sm:grid-cols-2">
            {s.features.map((f) => (
              <div key={f.title} className="border-t border-r0-border py-5">
                <dt className="text-[15px] font-semibold text-r0-text">{f.title}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-r0-text-secondary">{f.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:sticky lg:top-24 lg:col-span-5">
          <RecordCard />
        </div>
      </Reveal>
    </section>
  )
}
