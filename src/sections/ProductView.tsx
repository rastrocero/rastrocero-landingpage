import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from '../components/Reveal'
import { AppMockup } from '../components/AppMockup'

/** The product, shown as the platform shell cycling between its modules. */
export function ProductView() {
  const { t } = useLanguage()
  const p = t.productView

  return (
    <section id="plataforma" className="bg-r0-bg py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-r0-primary-medium">{p.eyebrow}</p>
          <p className="mt-4 text-lg leading-relaxed text-r0-text-secondary text-pretty sm:text-xl">{p.text}</p>
        </Reveal>
        <Reveal className="mt-10 sm:mt-12">
          <AppMockup />
        </Reveal>
      </div>
    </section>
  )
}
