import { useLanguage } from '../i18n/LanguageContext'
import { useInView } from '../hooks/useInView'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

/* 700 dots = 35 columns × 20 rows. */
const COLS = 35
const ROWS = 20

function RatioViz() {
  const { t } = useLanguage()
  const c = t.challenge
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35 })
  const dot = (color: string) => `radial-gradient(circle at center, ${color} 0 40%, transparent 45%)`

  return (
    <div ref={ref} className="rounded-xl border border-r0-border bg-white p-6 sm:p-10">
      {/* One shared cell size so the single operational dot matches each financed dot exactly. */}
      <div className="flex items-end justify-center gap-6 [--cell:6px] sm:gap-10 sm:[--cell:10px] lg:[--cell:9px] xl:[--cell:12px]">
        <div className="flex w-16 shrink-0 flex-col items-center sm:w-20">
          <span className="font-mono text-xs font-semibold text-r0-primary">1×</span>
          <span
            aria-hidden
            className="my-3 block"
            style={{ width: 'var(--cell)', height: 'var(--cell)', backgroundImage: dot('var(--color-r0-primary)') }}
          />
          <span className="text-center text-[11px] leading-tight text-r0-text-secondary">{c.vizOperational}</span>
        </div>

        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-[11px] leading-tight text-r0-text-secondary">{c.vizFinanced}</span>
            <span className="font-mono text-xs font-semibold text-r0-primary-medium">700×</span>
          </div>
          <div
            aria-hidden
            className="transition-[clip-path] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: `calc(var(--cell) * ${COLS})`,
              height: `calc(var(--cell) * ${ROWS})`,
              backgroundImage: dot('var(--color-r0-accent)'),
              backgroundSize: 'var(--cell) var(--cell)',
              clipPath: inView ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
            }}
          />
        </div>
      </div>

      <div className="mt-8 border-t border-r0-border pt-6">
        <p className="font-display text-5xl font-semibold tracking-tight text-r0-primary-light">{c.statValue}</p>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-r0-text">{c.statText}</p>
        <p className="mt-2 text-xs text-r0-text-muted">{c.statSource}</p>
      </div>
    </div>
  )
}

export function Challenge() {
  const { t } = useLanguage()
  const c = t.challenge

  return (
    <section className="bg-r0-bg py-16 sm:py-24">
      <Reveal className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={c.eyebrow} title1={c.title1} title2={c.title2} />
          <p className="mt-6 text-base leading-relaxed text-r0-text-secondary sm:text-lg">{c.intro}</p>

          <dl className="mt-10 border-b border-r0-border">
            {c.items.map((item) => (
              <div key={item.title} className="border-t border-r0-border py-5">
                <dt className="text-[15px] font-semibold text-r0-text">{item.title}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-r0-text-secondary">{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-7">
          <RatioViz />
        </div>
      </Reveal>
    </section>
  )
}
