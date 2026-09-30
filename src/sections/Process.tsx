import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

export function Process() {
  const { t } = useLanguage()
  const p = t.process

  return (
    <section id="proceso" className="bg-white py-16 sm:py-24">
      <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={p.eyebrow} title1={p.title1} title2={p.title2} className="max-w-2xl" />

        <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {p.steps.map((step, i) => (
            <li key={step.title} className="border-t border-r0-text/80 pt-5">
              <span className="font-mono text-xs text-r0-primary-medium">0{i + 1}</span>
              <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-r0-text">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-r0-text-secondary">{step.text}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  )
}
