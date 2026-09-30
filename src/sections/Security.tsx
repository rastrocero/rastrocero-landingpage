import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

/* Syntax colours for the snapshot block */
const K = 'text-r0-accent-light'
const S = 'text-r0-cream'
const N = 'text-r0-sun'
const P = 'text-white/40'

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
          <dt className="text-r0-text-secondary">{r.replacesLabel}</dt>
          <dd className="flex items-center gap-2 text-r0-text-muted">
            <span className="font-mono line-through">{r.replacesId}</span>
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold">{r.voided}</span>
          </dd>
        </div>
      </dl>

      <div className="mx-5 mb-5 mt-2 overflow-hidden rounded-lg bg-r0-deep">
        <p className="border-b border-white/10 px-4 py-2 font-mono text-[10.5px] text-white/50">applied_factor_snapshot</p>
        <pre className="whitespace-pre-wrap break-words px-4 py-3 font-mono text-[11.5px] leading-[1.7]">
          <code>
            <span className={P}>{'{'}</span>{'\n'}
            {'  '}<span className={K}>"name"</span><span className={P}>: </span><span className={S}>"{r.factorName}"</span><span className={P}>,</span>{'\n'}
            {'  '}<span className={K}>"value"</span><span className={P}>: </span><span className={N}>2.51</span><span className={P}>,</span>{'\n'}
            {'  '}<span className={K}>"unit"</span><span className={P}>: </span><span className={S}>"kgCO2e / L"</span><span className={P}>,</span>{'\n'}
            {'  '}<span className={K}>"metadata"</span><span className={P}>: {'{'}</span>{'\n'}
            {'    '}<span className={K}>"fuel_group"</span><span className={P}>: </span><span className={S}>"Diesel"</span><span className={P}>,</span>{'\n'}
            {'    '}<span className={K}>"component"</span><span className={P}>: </span><span className={S}>"direct"</span>{'\n'}
            {'  '}<span className={P}>{'}'}</span>{'\n'}
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
