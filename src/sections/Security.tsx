import { Camera, Container, History, Palette, Shield, UsersRound } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

const FEATURE_ICONS = [Camera, History, UsersRound, Shield, Container, Palette]

/* Syntax colours for the snapshot block */
const K = 'text-r0-accent-light'
const S = 'text-r0-cream'
const N = 'text-r0-sun'
const P = 'text-white/40'

function RecordCard() {
  const { t } = useLanguage()
  const r = t.security.record

  return (
    <div className="relative">
      {/* The voided original, peeking behind its replacement */}
      <div
        aria-hidden
        className="absolute inset-x-5 -top-9 h-24 rotate-[-1.2deg] rounded-xl border border-r0-border bg-white/80 px-5 pt-2.5 shadow-sm sm:inset-x-7"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-r0-text-muted line-through">{r.title}</span>
          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-r0-text-muted">{r.voided}</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-r0-border bg-white shadow-[0_30px_60px_-35px_rgba(15,36,25,0.45)]">
        <div className="flex items-center justify-between border-b border-r0-border px-5 py-3.5">
          <p className="text-sm font-semibold text-r0-text">{r.title}</p>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-r0-cream px-2 py-0.5 text-[11px] font-semibold text-r0-primary-light">
            <span className="anim-pulse-dot size-1.5 rounded-full bg-r0-accent" />
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
    </div>
  )
}

export function Security() {
  const { t } = useLanguage()
  const s = t.security

  return (
    <section id="seguridad" className="bg-r0-bg py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-start gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-7">
          <Reveal>
            <SectionHeading eyebrow={s.eyebrow} title1={s.title1} title2={s.title2} />
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-r0-text-secondary sm:text-lg">{s.text}</p>
          </Reveal>

          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-r0-border bg-r0-border sm:grid-cols-2">
            {s.features.map((f, i) => {
              const Icon = FEATURE_ICONS[i]
              return (
                <Reveal key={f.title} delay={i * 50} className="bg-white p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-r0-primary/[0.07] text-r0-primary-light">
                      <Icon className="size-4" strokeWidth={1.9} />
                    </span>
                    <h3 className="text-[15px] font-semibold text-r0-text">{f.title}</h3>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-r0-text-secondary">{f.text}</p>
                </Reveal>
              )
            })}
          </div>
        </div>

        <Reveal delay={120} className="pt-10 lg:sticky lg:top-28 lg:col-span-5 lg:pt-14">
          <RecordCard />
        </Reveal>
      </div>
    </section>
  )
}
