import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Check, CheckCircle2, Loader2, Mail, Send } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { CONTACT_EMAIL } from '../i18n/translations'
import { FlowLines } from '../components/FlowLines'

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || ''

type Status = 'idle' | 'sending' | 'success' | 'error'

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  role: '',
  company: '',
  website: '',
  companyType: '',
  country: '',
  email: '',
  message: '',
}

type FormState = typeof EMPTY_FORM

const inputClass =
  'block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-r0-text placeholder:text-r0-text-muted outline-none transition focus:border-r0-primary-light focus:ring-2 focus:ring-r0-primary-light/25'

function Field({ label, required, children, className }: { label: string; required?: boolean; children: ReactNode; className?: string }) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-medium text-r0-text">
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </span>
      {children}
    </label>
  )
}

export function Contact() {
  const { t } = useLanguage()
  const f = t.contactPage

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [botcheck, setBotcheck] = useState(false)
  const [status, setStatus] = useState<Status>('idle')

  const set = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (botcheck) return
    setStatus('sending')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `${f.subject}: ${form.firstName} ${form.lastName} — ${form.company}`,
          from_name: `${form.firstName} ${form.lastName}`,
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          role: form.role,
          company: form.company,
          website: form.website,
          company_type: form.companyType,
          country: form.country,
          message: form.message,
        }),
      })
      const data = (await res.json().catch(() => null)) as { success?: boolean } | null

      if (res.ok && data?.success !== false) {
        setStatus('success')
        setForm(EMPTY_FORM)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-r0-bg pb-20 pt-28 sm:pb-28 sm:pt-36">
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-[55%] bg-[url('/brand/hero-bg-sm.webp')] bg-cover bg-[50%_100%] opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black)] md:bg-[url('/brand/hero-bg.webp')]"
      />
      <FlowLines className="-z-10 opacity-60 [mask-image:linear-gradient(to_bottom,transparent_15%,black_75%)]" />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-5">
          <p className="inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.22em] text-r0-primary-medium">
            <span className="h-px w-6 bg-r0-primary-medium/50" />
            {f.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-r0-text sm:text-5xl">{f.title}</h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-r0-text-secondary sm:text-lg">{f.intro}</p>

          <div className="mt-10">
            <p className="text-sm font-semibold text-r0-text">{f.expectTitle}</p>
            <ul className="mt-4 space-y-3">
              {f.expect.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-snug text-r0-text-secondary">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-r0-cream text-r0-primary-light">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-10 flex max-w-sm items-center gap-4 rounded-xl border border-r0-border bg-white/80 p-4 backdrop-blur transition-colors hover:border-r0-accent/60"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-r0-primary/[0.07] text-r0-primary-light">
              <Mail className="size-5" strokeWidth={1.8} />
            </span>
            <span className="min-w-0">
              <span className="block text-xs text-r0-text-secondary">{f.emailTitle}</span>
              <span className="block truncate text-sm font-semibold text-r0-text">{CONTACT_EMAIL}</span>
            </span>
          </a>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-r0-border bg-white p-6 shadow-[0_30px_60px_-40px_rgba(15,36,25,0.4)] sm:p-8">
            {status === 'success' ? (
              <div className="flex flex-col items-center py-16 text-center" role="status">
                <span className="flex size-14 items-center justify-center rounded-full bg-r0-cream text-r0-primary-light">
                  <CheckCircle2 className="size-7" />
                </span>
                <h2 className="mt-5 font-display text-2xl font-semibold text-r0-text">{f.successTitle}</h2>
                <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-r0-text-secondary">{f.success}</p>
                <Link to="/" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-r0-primary-light hover:text-r0-primary">
                  <ArrowLeft className="size-4" />
                  {f.back}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <fieldset>
                  <legend className="text-base font-semibold text-r0-text">{f.basicInfo}</legend>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <Field label={f.firstName} required>
                      <input type="text" autoComplete="given-name" required value={form.firstName} onChange={set('firstName')} className={inputClass} />
                    </Field>
                    <Field label={f.lastName} required>
                      <input type="text" autoComplete="family-name" required value={form.lastName} onChange={set('lastName')} className={inputClass} />
                    </Field>
                    <Field label={f.email} required>
                      <input type="email" autoComplete="email" required value={form.email} onChange={set('email')} className={inputClass} />
                    </Field>
                    <Field label={f.role}>
                      <input type="text" autoComplete="organization-title" value={form.role} onChange={set('role')} className={inputClass} />
                    </Field>
                    <Field label={f.company} required>
                      <input type="text" autoComplete="organization" required value={form.company} onChange={set('company')} className={inputClass} />
                    </Field>
                    <Field label={f.companyType}>
                      <select value={form.companyType} onChange={set('companyType')} className={`${inputClass} cursor-pointer`}>
                        <option value="">{f.select}</option>
                        {f.companyTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label={f.country}>
                      <input type="text" autoComplete="country-name" value={form.country} onChange={set('country')} className={inputClass} />
                    </Field>
                    <Field label={f.website}>
                      <input type="url" autoComplete="url" placeholder="https://" value={form.website} onChange={set('website')} className={inputClass} />
                    </Field>
                  </div>
                </fieldset>

                <fieldset className="border-t border-r0-border pt-7">
                  <legend className="sr-only">{f.helpTitle}</legend>
                  <Field label={f.helpTitle} className="block">
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={set('message')}
                      placeholder={f.messagePlaceholder}
                      className={`${inputClass} resize-y`}
                    />
                  </Field>
                </fieldset>

                {/* Honeypot for Web3Forms */}
                <input
                  type="checkbox"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  checked={botcheck}
                  onChange={(e) => setBotcheck(e.target.checked)}
                />

                {status === 'error' && (
                  <div role="alert" className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <span>
                      {f.error}{' '}
                      <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline underline-offset-2">
                        {CONTACT_EMAIL}
                      </a>
                    </span>
                  </div>
                )}

                <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-r0-text-muted">
                    <span className="text-red-600">*</span> {f.required} · {f.privacy}
                  </p>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-r0-primary-light px-6 text-[15px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(27,67,50,0.8)] transition-colors hover:bg-r0-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'sending' ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    {status === 'sending' ? f.sending : f.submit}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
