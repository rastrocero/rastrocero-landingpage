import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { CONTACT_EMAIL } from '../i18n/translations'
import { Reveal } from '../components/Reveal'
import { FlowLines } from '../components/FlowLines'
import { Logo } from '../components/Logo'

export function CtaBand() {
  const { t } = useLanguage()
  const c = t.cta

  return (
    <section className="bg-r0-bg pb-20 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="relative isolate overflow-hidden rounded-3xl bg-r0-deep px-6 py-16 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-[url('/brand/hero-bg-sm.webp')] bg-cover bg-bottom opacity-25 mix-blend-luminosity [mask-image:linear-gradient(to_bottom,transparent,black)]"
          />
          <div aria-hidden className="absolute left-1/2 top-0 -z-10 h-72 w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-r0-accent/25 blur-[100px]" />
          <FlowLines tone="dark" className="-z-10 opacity-70" />

          <Logo on="dark" className="mx-auto h-[15px] opacity-90" />
          <h2 className="mx-auto mt-8 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-balance text-white sm:text-5xl">
            <span className="block">{c.title1}</span>
            <span className="block text-r0-mint">{c.title2}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{c.text}</p>

          <div className="mt-9 flex flex-col items-center gap-5">
            <Link
              to="/contact"
              className="group inline-flex h-12 items-center gap-2 rounded-lg bg-white px-6 text-[15px] font-semibold text-r0-primary shadow-lg transition-colors hover:bg-r0-cream"
            >
              {c.primary}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <p className="text-sm text-white/60">
              {c.emailLabel}{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-r0-mint underline-offset-4 hover:underline">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
