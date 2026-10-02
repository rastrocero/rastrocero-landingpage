import type { ReactNode } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { FlowLines } from '../components/FlowLines'

/*
 * The vision chapter: Visión, Bankers and Proceso share one dark band so they
 * read as a single, separate story from the platform above. Everything is
 * written in the future tense, and nothing here is a card or a button — these
 * roles are not products a bank can use yet.
 */

/** Short title on the left, content on the right. */
function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
      <SectionHeading title={title} tone="dark" className="lg:col-span-3" />
      <div className="lg:col-span-9">{children}</div>
    </Reveal>
  )
}

export function Vision() {
  const { t } = useLanguage()
  const v = t.vision

  return (
    <section id="vision" className="relative isolate overflow-hidden bg-r0-primary pb-14 pt-16 text-white sm:pb-16 sm:pt-24">
      <FlowLines tone="dark" className="-z-10 opacity-30" />
      <Row title={v.title}>
        <p className="font-display text-2xl font-medium leading-[1.25] tracking-[-0.01em] text-balance sm:text-3xl lg:text-[2.1rem]">{v.claim}</p>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70">{v.text}</p>
      </Row>
    </section>
  )
}

export function Bankers() {
  const { t } = useLanguage()
  const b = t.bankers

  return (
    <section id="bankers" className="bg-r0-primary pb-14 text-white sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-white/15" />
      </div>
      <div className="pt-14 sm:pt-16">
        <Row title={b.title}>
          <dl>
            {b.items.map((item) => (
              <div
                key={item.name}
                className="grid gap-x-10 gap-y-1.5 border-t border-white/15 py-5 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[13rem_1fr]"
              >
                <dt className="font-display text-[17px] font-semibold text-white">{item.name}</dt>
                <dd className="text-[15px] leading-relaxed text-white/70">{item.text}</dd>
              </div>
            ))}
          </dl>
        </Row>
      </div>
    </section>
  )
}

/** How the bankers will hand a case to one another — an illustration of the vision, not today's flow. */
export function BankersProcess() {
  const { t } = useLanguage()
  const p = t.process

  return (
    <section id="proceso" className="bg-r0-primary pb-16 text-white sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-white/15" />
      </div>
      <div className="pt-14 sm:pt-16">
        <Row title={p.title}>
          <p className="max-w-3xl text-lg leading-relaxed text-white/70">{p.lead}</p>
          <ol className="mt-10 grid gap-x-6 gap-y-9 sm:grid-cols-2 xl:grid-cols-5">
            {p.steps.map((step, i) => (
              <li key={step.title} className="border-t border-white/30 pt-4">
                <span className="font-mono text-xs text-r0-accent-light">0{i + 1}</span>
                <h3 className="mt-2.5 font-display text-base font-semibold leading-snug text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{step.text}</p>
              </li>
            ))}
          </ol>
        </Row>
      </div>
    </section>
  )
}
