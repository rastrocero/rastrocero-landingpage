import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from '../components/Reveal'

/**
 * The platform's calmest moment, as the site's opening: the leaf landscape
 * rising from the bottom-right, a short headline on the left, one call to
 * action. The product itself is shown in the next section.
 */
export function Hero() {
  const { t } = useLanguage()
  const h = t.hero

  return (
    <section className="relative isolate overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-[44rem] pb-[360px] pt-32 sm:pb-[360px] sm:pt-40 lg:max-w-[48rem] lg:pb-64 lg:pt-48 xl:max-w-[52rem] xl:pb-72 xl:pt-52">
          <p className="text-sm font-medium text-r0-primary-medium">{h.eyebrow}</p>
          <h1 className="mt-5 font-display text-[2.15rem] font-medium leading-[1.12] tracking-[-0.02em] text-balance text-r0-primary sm:text-5xl lg:text-[3rem] xl:text-[3.35rem]">
            {h.title1}
            <br className="hidden sm:block" /> {h.title2}
          </h1>
          <p className="mt-6 max-w-[38rem] text-[17px] leading-relaxed text-r0-text-secondary text-pretty sm:text-lg">{h.sub}</p>

          <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
            <Link
              to="/contact"
              className="inline-flex h-12 items-center rounded-lg bg-r0-primary-light px-6 text-[15px] font-semibold text-white transition-colors hover:bg-r0-primary"
            >
              {h.ctaPrimary}
            </Link>
            <Link
              to="/#plataforma"
              className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-r0-primary transition-colors hover:text-r0-primary-medium"
            >
              {h.ctaSecondary}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>

      {/* The platform backdrop's right slope, mirrored so it rises toward the
          right and pre-muted the way ShellBackdrop washes it with white. */}
      <img
        src="/brand/b/hero-b.webp"
        srcSet="/brand/b/hero-b-sm.webp 1100w, /brand/b/hero-b.webp 2000w"
        sizes="(min-width: 1280px) 72vw, (min-width: 1024px) 78vw, (min-width: 768px) 95vw, (min-width: 640px) 120vw, 160vw"
        alt=""
        width={2000}
        height={1045}
        fetchPriority="high"
        draggable={false}
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 -z-10 h-auto w-[160%] max-w-none select-none [mask-image:linear-gradient(to_bottom,transparent,black_40%,black_84%,transparent)] sm:w-[120%] md:w-[95%] lg:w-[78%] xl:w-[72%]"
      />
    </section>
  )
}
