import { formatMmSs, timeStatus } from '../lib/practice/timer'

const statusStyles = {
  'trop-court': 'bg-amber-50 text-amber-700',
  bien: 'bg-mint-50 text-mint-700',
  'trop-long': 'bg-coral-50 text-coral-700',
} as const
const statusLabels = {
  'trop-court': 'Encore un peu court',
  bien: 'Bonne durée',
  'trop-long': 'Un peu long',
} as const

/** Affichage du chrono + statut par rapport à une durée cible [min, max] en secondes. */
export function ChronoDisplay({ elapsedMs, target }: { elapsedMs: number; target: [number, number] }) {
  const seconds = elapsedMs / 1000
  const status = timeStatus(seconds, target)
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-navy-50 px-4 py-3">
      <span className="text-3xl font-extrabold tabular-nums text-navy-900">{formatMmSs(seconds)}</span>
      <span className={`shrink-0 rounded-full px-3 py-1 text-right text-xs font-bold leading-tight ${statusStyles[status]}`}>
        {statusLabels[status]}
        <br />
        vise {target[0]}–{target[1]}{'\u00a0'}s
      </span>
    </div>
  )
}
