import { useId } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from '../components/Reveal'

/** Pixel size of the hero art; the stream paths below are drawn in this space. */
const ART_W = 2382
const ART_H = 1868

/**
 * Three currents that follow the artwork's own shapes: the upper edge of the
 * pale wave, the thin double line that climbs past the leaves, and the crest
 * of the teal wave. Dashes travel from the bottom-left towards the top-right.
 */
const STREAMS = [
  {
    d: 'M 0 1821 C 250 1740 500 1690 700 1600 C 950 1490 1100 1400 1280 1255 C 1400 1150 1550 1030 1790 925 C 1950 855 2100 740 2200 640 C 2280 560 2330 500 2382 440',
    className: 'hero-stream hero-stream--a',
    tone: 'green',
  },
  {
    d: 'M 700 1800 C 850 1720 1050 1650 1250 1560 C 1330 1500 1330 1400 1400 1280 C 1450 1180 1520 1120 1650 1070 C 1800 1010 1950 960 2060 880 C 2150 800 2210 620 2260 500 C 2290 430 2320 380 2360 330',
    className: 'hero-stream hero-stream--b',
    tone: 'light',
  },
  {
    d: 'M 1290 1868 C 1420 1780 1560 1680 1700 1565 C 1860 1430 2050 1300 2212 1236 C 2280 1210 2340 1225 2382 1245',
    className: 'hero-stream hero-stream--c',
    tone: 'light',
  },
] as const

/**
 * The platform's calmest moment, as the site's opening: the leaf landscape
 * rising from the bottom-right, a short headline on the left, one call to
 * action. The hero always fills the first screen; the art is sized from the
 * viewport height on desktop and tucks under the copy on portrait screens.
 */
export function Hero() {
  const { t } = useLanguage()
  const h = t.hero
  const gradientId = useId()

  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-white">
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pt-28 pb-[62vw] sm:px-6 sm:pb-[52vw] md:pb-[44vw] lg:px-8 lg:pt-16 lg:pb-32">
        <Reveal className="max-w-[44rem] lg:max-w-[48rem] xl:max-w-[52rem] 2xl:max-w-[60rem]">
          <p className="text-sm font-medium text-r0-primary-medium">{h.eyebrow}</p>
          <h1 className="mt-5 font-display text-[2.15rem] font-medium leading-[1.12] tracking-[-0.02em] text-balance text-r0-primary sm:text-5xl lg:text-[3rem] xl:text-[3.35rem] 2xl:text-[3.9rem]">
            {h.title1}
            <br className="hidden sm:block" /> {h.title2}
          </h1>
          <p className="mt-6 max-w-[38rem] text-[17px] leading-relaxed text-r0-text-secondary text-pretty sm:text-lg 2xl:max-w-[42rem] 2xl:text-xl">{h.sub}</p>

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

      {/* Art frame: anchored bottom-right with a small bleed so the drift never
          uncovers the section edge. Desktop: full section height, capped so the
          faint left part of the crop stays clear of the copy. Portrait: wider
          than the screen, the white upper-left of the crop falls off-screen.
          The frame holds the masks; the two nested layers only move. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-4 -bottom-3 -z-10 aspect-[2382/1868] w-[120vw] max-w-none select-none [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_92%,transparent),linear-gradient(to_right,transparent,black_18%)] sm:w-[108vw] md:w-[100vw] lg:h-[calc(100%+12px)] lg:w-[min(78vw,127.5svh)] lg:[mask-image:linear-gradient(to_bottom,transparent,black_14%,black_90%,transparent),linear-gradient(to_right,transparent,black_26%)]"
      >
        <div className="hero-drift-x h-full w-full">
          <div className="hero-drift-y relative h-full w-full">
            <img
              src="/brand/hero/hero-stream.webp"
              srcSet="/brand/hero/hero-stream-sm.webp 1200w, /brand/hero/hero-stream.webp 2382w"
              sizes="(min-width: 1024px) 80vw, 120vw"
              alt=""
              width={ART_W}
              height={ART_H}
              fetchPriority="high"
              draggable={false}
              className="h-full w-full object-contain object-right-bottom"
            />
            <svg
              viewBox={`0 0 ${ART_W} ${ART_H}`}
              preserveAspectRatio="xMaxYMax meet"
              className="hero-streams absolute inset-0 h-full w-full"
            >
              <defs>
                {/* Light along the saturated shapes; a deeper green along the pale wave. */}
                <linearGradient id={`${gradientId}-light`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={ART_W} y2="0">
                  <stop offset="0" stopColor="#fff" stopOpacity="0" />
                  <stop offset="0.3" stopColor="#fff" stopOpacity="0.35" />
                  <stop offset="0.55" stopColor="#fff" stopOpacity="1" />
                  <stop offset="0.92" stopColor="#fff" stopOpacity="1" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id={`${gradientId}-green`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={ART_W} y2="0">
                  <stop offset="0" stopColor="var(--color-r0-accent)" stopOpacity="0" />
                  <stop offset="0.28" stopColor="var(--color-r0-accent)" stopOpacity="0.45" />
                  <stop offset="0.55" stopColor="var(--color-r0-accent)" stopOpacity="1" />
                  <stop offset="0.9" stopColor="var(--color-r0-accent)" stopOpacity="1" />
                  <stop offset="1" stopColor="var(--color-r0-accent)" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              {STREAMS.map((s) => (
                <path
                  key={s.className}
                  d={s.d}
                  fill="none"
                  stroke={`url(#${gradientId}-${s.tone})`}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  className={s.className}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
