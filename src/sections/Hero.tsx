import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from '../components/Reveal'
import { HeroArtLayers } from '../components/HeroArtLayers'


/**
 * The platform's calmest moment, as the site's opening: the leaf landscape
 * rising from the bottom-right, a short headline on the left, one call to
 * action. The hero always fills the first screen; the art is sized from the
 * viewport height on desktop and tucks under the copy on portrait screens.
 *
 * On a phone the copy and the art have to share one screen (about 390 x 660
 * visible): the headline is sized from the viewport width so "emisiones
 * financiadas" (10.82em wide) always fits on one line and the title takes
 * three lines, the two actions sit in a row, and the padding under the copy
 * reserves the lower half of the art. `short-phone` tightens it further.
 */
export function Hero() {
  const { t } = useLanguage()
  const h = t.hero

  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-white">
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pt-24 pb-[50vw] short-phone:pt-20 short-phone:pb-[38vw] sm:px-6 sm:pt-28 sm:pb-[52vw] md:pb-[44vw] lg:px-8 lg:pt-16 lg:pb-32">
        <Reveal className="max-w-[44rem] lg:max-w-[48rem] xl:max-w-[52rem] 2xl:max-w-[60rem]">
          <p className="text-sm font-medium text-r0-primary-medium">{h.eyebrow}</p>
          <h1 className="mt-4 font-display text-[clamp(1.5rem,calc(9vw-3px),2.15rem)] font-medium leading-[1.12] tracking-[-0.02em] text-balance text-r0-primary sm:mt-5 sm:text-5xl lg:text-[3rem] xl:text-[3.35rem] 2xl:text-[3.9rem]">
            {h.title1}
            <br className="hidden sm:block" /> {h.title2}
          </h1>
          <p className="mt-5 max-w-[44rem] text-base leading-[1.55] text-r0-text-secondary text-pretty short-phone:mt-4 short-phone:text-[15px] sm:mt-6 sm:text-lg sm:leading-relaxed 2xl:max-w-[48rem] 2xl:text-xl">{h.sub}</p>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 short-phone:mt-5 sm:mt-9 sm:gap-x-8">
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

      {/* Art frame: anchored bottom-right with a small bleed so the drift never
          uncovers the section edge. Desktop: full section height, capped so the
          faint left part of the crop stays clear of the copy. Portrait: wider
          than the screen, the white upper-left of the crop falls off-screen.
          The frame holds the size and the fade masks; the art component fills it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-4 -bottom-3 -z-10 aspect-[2382/1868] w-[112vw] max-w-none select-none [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_92%,transparent),linear-gradient(to_right,transparent,black_18%)] sm:w-[108vw] md:w-[100vw] lg:h-[calc(100%+12px)] lg:w-[min(78vw,127.5svh)] lg:[mask-image:linear-gradient(to_bottom,transparent,black_14%,black_90%,transparent),linear-gradient(to_right,transparent,black_26%)]"
      >
        <HeroArtLayers />
      </div>
    </section>
  )
}
