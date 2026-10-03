import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { useId, useState } from 'react'
import { ChevronDown, Star } from 'lucide-react'

/* ------------------------------------------------------------------ */
/* Bouton                                                              */
/* ------------------------------------------------------------------ */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-950 shadow-[var(--shadow-card)]',
  secondary: 'bg-mint-500 text-white hover:bg-mint-600 active:bg-mint-700 shadow-[var(--shadow-card)]',
  ghost: 'bg-white text-navy-900 border border-navy-100 hover:border-navy-200 active:bg-navy-50',
  danger: 'bg-coral-50 text-coral-700 border border-coral-100 hover:bg-coral-100 active:bg-coral-100',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${buttonVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Carte                                                                */
/* ------------------------------------------------------------------ */

export function Card({
  children,
  className = '',
  as: As = 'div',
  style,
}: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'article'; style?: CSSProperties }) {
  return <As className={`rounded-3xl border border-navy-100/70 bg-white p-5 shadow-[var(--shadow-card)] ${className}`} style={style}>{children}</As>
}

/* ------------------------------------------------------------------ */
/* Badges                                                               */
/* ------------------------------------------------------------------ */

export function StarMark({ filled = true, className = '' }: { filled?: boolean; className?: string }) {
  return <Star className={`${className}`} fill={filled ? 'currentColor' : 'none'} strokeWidth={filled ? 1.5 : 2} aria-hidden="true" />
}

const statusStyles: Record<'nouvelle' | 'a-revoir' | 'maitrise', string> = {
  nouvelle: 'bg-navy-50 text-navy-600 border-navy-100',
  'a-revoir': 'bg-amber-50 text-amber-700 border-amber-100',
  maitrise: 'bg-mint-50 text-mint-700 border-mint-100',
}
const statusLabels: Record<'nouvelle' | 'a-revoir' | 'maitrise', string> = {
  nouvelle: 'Nouvelle',
  'a-revoir': 'À revoir',
  maitrise: 'Maîtrisée',
}

export function StatusBadge({ status }: { status: 'nouvelle' | 'a-revoir' | 'maitrise' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  )
}

export function Chip({
  active,
  onClick,
  children,
  icon,
}: { active?: boolean; onClick?: () => void; children: ReactNode; icon?: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors ${
        active ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-100 bg-white text-navy-700 hover:border-navy-300'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Callout                                                              */
/* ------------------------------------------------------------------ */

type Tone = 'info' | 'warning' | 'success'
const calloutStyles: Record<Tone, string> = {
  info: 'border-navy-100 bg-navy-50 text-navy-900',
  warning: 'border-amber-100 bg-amber-50 text-amber-800',
  success: 'border-mint-100 bg-mint-50 text-mint-800',
}

export function Callout({ tone = 'info', title, children, className = '' }: { tone?: Tone; title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`memo-callout rounded-2xl border p-4 text-[15px] leading-relaxed ${calloutStyles[tone]} ${className}`} role="note">
      {title ? <p className="mb-1 font-bold">{title}</p> : null}
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Barre de progression                                                */
/* ------------------------------------------------------------------ */

export function ProgressBar({ value, max, colorClassName = 'bg-mint-500', trackClassName = 'bg-navy-50' }: { value: number; max: number; colorClassName?: string; trackClassName?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full ${trackClassName}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full transition-[width] duration-500 ease-out ${colorClassName}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Bascule Oui/Non et sélecteurs                                       */
/* ------------------------------------------------------------------ */

export function YesNoToggle({ value, onChange, name }: { value?: string; onChange: (v: string) => void; name: string }) {
  const isYes = value?.toLowerCase() === 'oui'
  const isNo = value?.toLowerCase() === 'non'
  return (
    <div className="flex gap-2" role="group" aria-label={name}>
      <button type="button" aria-pressed={isYes} onClick={() => onChange('Oui')}
        className={`min-h-11 flex-1 rounded-xl border-2 text-[15px] font-semibold transition-colors ${isYes ? 'border-mint-500 bg-mint-50 text-mint-700' : 'border-navy-100 bg-white text-navy-600'}`}>
        Oui
      </button>
      <button type="button" aria-pressed={isNo} onClick={() => onChange('Non')}
        className={`min-h-11 flex-1 rounded-xl border-2 text-[15px] font-semibold transition-colors ${isNo ? 'border-navy-900 bg-navy-50 text-navy-900' : 'border-navy-100 bg-white text-navy-600'}`}>
        Non
      </button>
    </div>
  )
}

export function SelectButtons({ options, value, onChange }: { options: string[]; value?: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="group">
      {options.map((option) => {
        const active = value === option
        return (
          <button key={option} type="button" aria-pressed={active} onClick={() => onChange(option)}
            className={`min-h-11 rounded-xl border-2 px-3.5 text-[15px] font-medium capitalize transition-colors ${active ? 'border-mint-500 bg-mint-50 text-mint-700' : 'border-navy-100 bg-white text-navy-600'}`}>
            {option}
          </button>
        )
      })}
    </div>
  )
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-8 w-14 min-h-0 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-mint-500' : 'bg-navy-100'}`}
      aria-label={label}
    >
      <span className={`inline-block h-6 w-6 translate-x-1 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Disclosure accessible (ouverture/fermeture animée)                   */
/* ------------------------------------------------------------------ */

export function Disclosure({
  title,
  subtitle,
  defaultOpen = false,
  children,
  tone = 'default',
}: { title: ReactNode; subtitle?: ReactNode; defaultOpen?: boolean; children: ReactNode; tone?: 'default' | 'card' }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <div className={tone === 'card' ? 'rounded-2xl border border-navy-100 bg-white' : 'border-b border-navy-100 last:border-b-0'}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <span>
          <span className="block text-[15px] font-bold text-navy-900">{title}</span>
          {subtitle ? <span className="mt-0.5 block text-sm text-ink-400">{subtitle}</span> : null}
        </span>
        <ChevronDown aria-hidden="true" className={`size-5 shrink-0 text-navy-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div id={id} className={`disclosure-body ${open ? 'is-open' : ''}`}>
        <div>
          <div className="px-4 pb-4">{children}</div>
        </div>
      </div>
    </div>
  )
}
