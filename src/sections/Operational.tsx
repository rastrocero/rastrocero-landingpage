import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { cn } from '../lib/cn'

/* Scope chips use the platform's scope chart colours. */
const SCOPE_CHIP: Record<number, string> = {
  1: 'bg-r0-primary-light text-white',
  2: 'bg-r0-accent text-white',
  3: 'bg-r0-cream text-r0-primary-light',
}

export function Operational() {
  const { t } = useLanguage()
  const o = t.operational

  return (
    <section id="operativo" className="bg-white py-16 sm:py-24">
      <Reveal className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={o.eyebrow} title1={o.title1} title2={o.title2} />
          <p className="mt-6 text-base leading-relaxed text-r0-text-secondary sm:text-lg">{o.text}</p>
          <ul className="mt-8 border-b border-r0-border text-[15px] text-r0-text">
            {o.bullets.map((b) => (
              <li key={b} className="border-t border-r0-border py-3.5">
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <div className="grid gap-px overflow-hidden rounded-xl border border-r0-border bg-r0-border sm:grid-cols-2">
            {o.groups.map((g) => (
              <div key={g.name} className="bg-white p-6">
                <p className="text-[15px] font-semibold text-r0-text">{g.name}</p>
                <p className="mt-1 text-[13px] leading-snug text-r0-text-secondary">{g.desc}</p>
                <ul className="mt-5 space-y-2">
                  {g.items.map((item) => (
                    <li key={item.name} className="flex items-center justify-between gap-3 border-t border-r0-border pt-2 text-sm text-r0-text">
                      {item.name}
                      <span className={cn('shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold', SCOPE_CHIP[item.scope])}>
                        {o.scope} {item.scope}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
