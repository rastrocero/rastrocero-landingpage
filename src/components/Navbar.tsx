import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { cn } from '../lib/cn'
import { Logo } from './Logo'

const SECTION_IDS = ['plataforma', 'pcaf', 'proceso', 'seguridad'] as const

/** Highlights the nav link of the section currently crossing the middle of the viewport. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [enabled])

  return enabled ? active : null
}

export function Navbar() {
  const { t, locale, toggle } = useLanguage()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(pathname === '/')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const links = [
    { id: 'plataforma', label: t.nav.platform },
    { id: 'pcaf', label: t.nav.pcaf },
    { id: 'proceso', label: t.nav.process },
    { id: 'seguridad', label: t.nav.security },
  ]

  const solid = scrolled || open || pathname !== '/'

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300',
        solid
          ? 'border-b border-r0-border bg-white'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0 py-2" onClick={() => setOpen(false)} aria-label="RastroCero">
          <Logo className="h-[15px] sm:h-[17px]" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.id}
              to={`/#${l.id}`}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active === l.id ? 'bg-r0-primary/[0.07] text-r0-primary' : 'text-r0-text-secondary hover:text-r0-text',
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={t.nav.switchLang}
            title={t.nav.switchLang}
            className="hidden h-9 items-center px-2 text-xs font-semibold tracking-wide text-r0-text-secondary transition-colors hover:text-r0-text sm:inline-flex"
          >
            {locale === 'es' ? 'EN' : 'ES'}
          </button>
          <Link
            to="/contact"
            className="hidden h-9 items-center rounded-lg border border-r0-border bg-white px-4 text-sm font-semibold text-r0-text transition-colors hover:border-r0-primary-light hover:text-r0-primary md:inline-flex"
          >
            {t.nav.demo}
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg text-r0-text md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-r0-border bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            {links.map((l) => (
              <Link
                key={l.id}
                to={`/#${l.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium text-r0-text hover:bg-r0-bg"
              >
                {l.label}
                <ArrowRight className="size-4 text-r0-text-muted" />
              </Link>
            ))}
            <div className="mt-3 flex items-center gap-2 border-t border-r0-border pt-4">
              <button
                type="button"
                onClick={toggle}
                className="inline-flex h-11 items-center rounded-lg border border-r0-border px-4 text-sm font-semibold text-r0-text-secondary"
              >
                {locale === 'es' ? 'English' : 'Español'}
              </button>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-r0-primary-light px-4 text-sm font-semibold text-white"
              >
                {t.nav.demo}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
