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
    <section className="bg-r0-bg pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="relative isolate overflow-hidden rounded-xl bg-r0-deep px-6 py-16 text-center sm:px-12 sm:py-20">
          <FlowLines tone="dark" className="-z-10 opacity-40" />

          <Logo on="dark" className="mx-auto h-[14px] opacity-90" />
          <h2 className="mx-auto mt-8 max-w-2xl font-display text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-balance text-white sm:text-4xl">
            {c.title1} {c.title2}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{c.text}</p>

          <div className="mt-9 flex flex-col items-center gap-5">
            <Link
              to="/contact"
              className="group inline-flex h-12 items-center gap-2 rounded-lg bg-white px-6 text-[15px] font-semibold text-r0-primary transition-colors hover:bg-r0-cream"
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
