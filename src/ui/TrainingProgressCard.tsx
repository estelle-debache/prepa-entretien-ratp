import type { CSSProperties } from 'react'
import { formatPercent } from './format'
import { ProgressBar } from './primitives'
import type { GlobalProgress } from './trainingProgress'

/**
 * Carte « Ta progression » : résumé des 7 modes d'entraînement (moyenne des `progress` + libellé
 * « X modes sur 7 commencés »). Calcul fourni par `computeTrainingProgress` (`trainingProgress.ts`) —
 * ce composant ne fait que l'afficher, pour rester réutilisable tel quel sur plusieurs pages
 * (hub `/entrainement`, puis accueil).
 */
export function TrainingProgressCard({
  global,
  className = '',
  style,
}: { global: GlobalProgress; className?: string; style?: CSSProperties }) {
  const pct = Math.round(global.progress * 100)
  return (
    <section
      aria-label={`Ta progression : ${formatPercent(pct)}, ${global.label}`}
      className={`rounded-2xl border border-navy-100 bg-white p-4 shadow-[var(--shadow-card)] ${className}`}
      style={style}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-mint-600">Ta progression</p>
        <p className="text-lg font-extrabold text-navy-900">{formatPercent(pct)}</p>
      </div>
      <div className="mt-2.5">
        <ProgressBar value={pct} max={100} />
      </div>
      <p className="mt-1.5 text-sm text-ink-400">{global.label}</p>
    </section>
  )
}
