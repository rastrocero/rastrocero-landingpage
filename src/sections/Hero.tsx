import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { AppMockup } from '../components/AppMockup'
import { FlowLines } from '../components/FlowLines'

export function Hero() {
  const { t } = useLanguage()
  const h = t.hero

  return (
    <section className="relative isolate overflow-hidden bg-white pt-28 sm:pt-36">
      <FlowLines className="-z-10 opacity-70 [mask-image:linear-gradient(to_right,black,transparent_32%,transparent_68%,black)]" />

      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-r0-mint bg-white/80 py-1.5 pl-2 pr-3.5 text-xs font-medium text-r0-primary-light shadow-sm backdrop-blur sm:text-[13px]">
          <img src="/brand/hoja.png" alt="" className="h-3 w-auto" />
          {h.eyebrow}
        </p>

        <h1 className="mt-7 font-display text-[2.35rem] font-semibold leading-[1.06] tracking-[-0.035em] text-balance text-r0-text sm:text-[3.4rem] lg:text-[3.9rem]">
          <span className="block">{h.title1}</span>
          <span className="block bg-gradient-to-r from-r0-primary-light via-r0-primary-medium to-r0-accent bg-clip-text pb-1 text-transparent">
            {h.title2}
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-r0-text-secondary text-pretty sm:text-lg">{h.sub}</p>

        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            to="/contact"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-r0-primary-light px-6 text-[15px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(27,67,50,0.8)] transition-colors hover:bg-r0-primary"
          >
            {h.ctaPrimary}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/#plataforma"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-r0-border bg-white/80 px-6 text-[15px] font-semibold text-r0-text backdrop-blur transition-colors hover:border-r0-accent/60"
          >
            {h.ctaSecondary}
          </Link>
        </div>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {h.badges.map((b) => (
            <li key={b} className="flex items-center gap-1.5 text-sm font-medium text-r0-text-secondary">
              <CheckCircle2 className="size-4 text-r0-accent" />
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mx-auto mt-14 max-w-6xl px-4 pb-20 sm:mt-16 sm:px-6 sm:pb-24 lg:px-8">
        {/* Platform backdrop: the leaf landscape sits behind the product and frames it */}
        <div aria-hidden className="absolute bottom-0 left-1/2 top-[22%] -z-10 w-screen -translate-x-1/2">
          <picture>
            <source media="(max-width: 767px)" srcSet="/brand/hero-bg-sm.webp" />
            <img
              src="/brand/hero-bg.webp"
              alt=""
              className="size-full object-cover object-[50%_100%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_35%)]"
              fetchPriority="high"
            />
          </picture>
        </div>
        <AppMockup />
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-b from-transparent to-r0-bg" />
    </section>
  )
}
