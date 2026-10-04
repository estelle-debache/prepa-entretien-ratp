export function daysUntil(interviewDateISO: string, now = new Date()): number {
  const [year, month, day] = interviewDateISO.split('-').map(Number)
  const target = new Date(year, month - 1, day)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((target.getTime() - today.getTime()) / 86_400_000)
}

export function interviewCountdownLabel(days: number): string {
  if (days < 0) return 'Passé'
  if (days === 0) return "Aujourd'hui"
  if (days === 1) return 'Demain'
  return `Dans ${days} jours`
}

export const formatDaysUntil = interviewCountdownLabel
