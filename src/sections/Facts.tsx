import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from '../components/Reveal'

export function Facts() {
  const { t } = useLanguage()

  return (
    <section className="bg-r0-bg py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-r0-border bg-r0-border lg:grid-cols-4">
          {t.facts.map((f) => (
            <div key={f.label} className="bg-white px-5 py-6 sm:px-7 sm:py-8">
              <p className="font-display text-3xl font-semibold tracking-tight text-r0-primary-light sm:text-4xl">{f.value}</p>
              <p className="mt-2 text-sm font-semibold text-r0-text">{f.label}</p>
              <p className="mt-1 text-[13px] leading-snug text-r0-text-secondary">{f.sub}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
