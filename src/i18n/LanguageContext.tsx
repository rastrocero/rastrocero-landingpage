import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { translations, type Dict, type Locale } from './translations'

interface LanguageContextType {
  locale: Locale
  t: Dict
  toggle: () => void
}

const LanguageContext = createContext<LanguageContextType | null>(null)

const STORAGE_KEY = 'r0-locale'

function readStoredLocale(): Locale | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'es' || stored === 'en' ? stored : null
  } catch {
    return null
  }
}

/** `?lang=en` wins over the stored choice, so shared links open in the intended language. */
function getInitialLocale(): Locale {
  const lang = new URLSearchParams(window.location.search).get('lang')
  if (lang === 'es' || lang === 'en') return lang
  return readStoredLocale() ?? 'es'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale)
  const t = translations[locale]

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = t.meta.title
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      /* storage unavailable (private mode) — the choice just won't persist */
    }
  }, [locale, t])

  const toggle = () => setLocale((prev) => (prev === 'es' ? 'en' : 'es'))

  return (
    <LanguageContext.Provider value={{ locale, t, toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
