import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { CONTACT_EMAIL } from '../i18n/translations'
import { Logo } from './Logo'

export function Footer() {
  const { t } = useLanguage()
  const f = t.footer

  return (
    <footer className="border-t border-r0-border bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-12 lg:px-8 lg:py-16">
        <div className="md:col-span-5">
          <Link to="/" aria-label="RastroCero" className="inline-block">
            <Logo className="h-[17px]" />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-r0-text-secondary">{f.tagline}</p>
        </div>

        <div className="md:col-span-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-r0-text">{f.linksTitle}</h3>
          <ul className="mt-4 space-y-2.5">
            {f.links.map((l) => (
              <li key={l.href}>
                <Link to={l.href} className="text-sm text-r0-text-secondary transition-colors hover:text-r0-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-r0-text">{f.contactTitle}</h3>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link to="/contact" className="inline-flex items-center gap-1 text-sm font-medium text-r0-primary-light hover:text-r0-primary">
                {f.demo}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 break-all text-sm text-r0-text-secondary hover:text-r0-primary">
                <Mail className="size-3.5 shrink-0" />
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-r0-border">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-r0-text-muted sm:px-6 lg:px-8">{f.copy}</p>
      </div>
    </footer>
  )
}
