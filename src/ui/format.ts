/** Aides de formatage (dates, durées, pourcentages) pour l'interface. */

/** Lit une date ISO « YYYY-MM-DD » comme un minuit local, pour éviter les décalages de fuseau. */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date()
  date.setFullYear(y, (m ?? 1) - 1, d ?? 1)
  date.setHours(0, 0, 0, 0)
  return date
}

function startOfDay(date: Date): Date {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

/** Nombre de jours (entier, peut être négatif) entre aujourd'hui et la date cible. */
export function daysUntil(targetIso: string, now: Date = new Date()): number {
  const target = parseISODate(targetIso)
  const today = startOfDay(now)
  return Math.round((target.getTime() - today.getTime()) / 86_400_000)
}

const longDateFormatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
const weekdayFormatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' })

/** « mercredi 7 octobre » */
export function formatLongDateFR(iso: string): string {
  return longDateFormatter.format(parseISODate(iso))
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** Jour de la semaine (capitalisé) de la date d'entretien décalée de `offset` jours. */
export function weekdayForOffset(interviewIso: string, offset: number): string {
  const date = parseISODate(interviewIso)
  date.setDate(date.getDate() + offset)
  return capitalize(weekdayFormatter.format(date))
}

/**
 * Transforme un titre de jour du plan (« J-4 — Découvrir ») en titre lisible avec le vrai jour
 * de la semaine (« Samedi — Découvrir »), calculé depuis la date d'entretien.
 */
export function planDayLabel(title: string, interviewIso: string, offset: number): string {
  const theme = title.replace(/^J-\d+\s*[—-]\s*/, '')
  return `${weekdayForOffset(interviewIso, offset)} — ${theme}`
}

/** Phrase de compte à rebours prête à afficher. */
export function countdownLabel(interviewIso: string, now: Date = new Date()): { days: number; label: string } {
  const days = daysUntil(interviewIso, now)
  const date = formatLongDateFR(interviewIso)
  if (days > 1) return { days, label: `Entretien dans ${days} jours — ${date}` }
  if (days === 1) return { days, label: `Entretien demain — ${date}` }
  if (days === 0) return { days, label: `Entretien aujourd'hui — ${date}` }
  return { days, label: `Entretien passé le ${date}` }
}

/** Formatte une plage de secondes cible : « 30–45 s ». */
export function formatTargetSeconds([min, max]: [number, number]): string {
  return `${min}–${max} s`
}

export function formatPercent(value: number): string {
  return `${Math.round(value)} %`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
