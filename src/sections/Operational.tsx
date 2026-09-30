import { Bus, Check, Flame, Package, Plane, Truck, Wrench, Zap, type LucideIcon } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { cn } from '../lib/cn'

/* Scope chips use the platform's scope chart colours. */
const SCOPE_CHIP: Record<number, string> = {
  1: 'bg-r0-primary-light text-white',
  2: 'bg-r0-accent text-white',
  3: 'bg-r0-cream text-r0-primary-light ring-1 ring-inset ring-r0-mint',
}

const ITEM_ICONS: LucideIcon[][] = [[Flame, Zap], [Truck], [Plane, Bus], [Package, Wrench]]

export function Operational() {
  const { t } = useLanguage()
  const o = t.operational

  return (
    <section id="plataforma" className="relative bg-r0-bg py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <Reveal className="lg:col-span-5 lg:pt-4">
          <SectionHeading eyebrow={o.eyebrow} title1={o.title1} title2={o.title2} />
          <p className="mt-6 text-base leading-relaxed text-r0-text-secondary sm:text-lg">{o.text}</p>
          <ul className="mt-8 space-y-3.5">
            {o.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-[15px] leading-snug text-r0-text">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-r0-cream text-r0-primary-light">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100} className="lg:col-span-7">
          <div className="grid gap-px overflow-hidden rounded-xl border border-r0-border bg-r0-border sm:grid-cols-2">
            {o.groups.map((g, gi) => (
              <div key={g.name} className="flex flex-col bg-white p-6">
                <p className="text-[15px] font-semibold text-r0-text">{g.name}</p>
                <p className="mt-1 text-[13px] leading-snug text-r0-text-secondary">{g.desc}</p>
                <ul className="mt-5 space-y-2">
                  {g.items.map((item, ii) => {
                    const Icon = ITEM_ICONS[gi][ii]
                    return (
                      <li
                        key={item.name}
                        className="flex items-center justify-between gap-3 rounded-lg border border-r0-border bg-r0-bg/60 px-3 py-2.5"
                      >
                        <span className="flex items-center gap-2.5 text-sm font-medium text-r0-text">
                          <Icon className="size-4 text-r0-primary-medium" strokeWidth={1.8} />
                          {item.name}
                        </span>
                        <span className={cn('shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold', SCOPE_CHIP[item.scope])}>
                          {o.scope} {item.scope}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
