import { BarChart3, Calculator, Gauge, Upload } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { FlowLines } from '../components/FlowLines'

const STEP_ICONS = [Upload, Calculator, Gauge, BarChart3]

export function Process() {
  const { t } = useLanguage()
  const p = t.process

  return (
    <section id="proceso" className="relative isolate overflow-hidden bg-r0-primary py-20 text-white sm:py-28">
      <FlowLines tone="dark" className="-z-10 opacity-60" />
      <div aria-hidden className="absolute -right-40 -top-40 -z-10 size-[520px] rounded-full bg-r0-accent/20 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow={p.eyebrow} title1={p.title1} title2={p.title2} tone="dark" className="max-w-2xl" />
        </Reveal>

        <div className="relative mt-14 lg:mt-16">
          {/* Dashed connector, animated with the platform's flow keyframes */}
          <svg aria-hidden className="absolute left-0 right-0 top-[22px] hidden h-px w-full lg:block" preserveAspectRatio="none">
            <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="var(--color-r0-accent-light)" strokeOpacity="0.45" strokeWidth="1" className="flow-line--slow" />
          </svg>

          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {p.steps.map((step, i) => {
              const Icon = STEP_ICONS[i]
              return (
                <Reveal as="li" key={step.title} delay={i * 90} className="relative">
                  <div className="flex items-center gap-3">
                    <span className="relative flex size-11 items-center justify-center rounded-xl border border-white/15 bg-r0-primary-light text-r0-mint shadow-[0_0_0_6px_var(--color-r0-primary)]">
                      <Icon className="size-5" strokeWidth={1.8} />
                    </span>
                    <span className="bg-r0-primary px-2 font-mono text-xs text-r0-accent-light">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/70">{step.text}</p>
                </Reveal>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
