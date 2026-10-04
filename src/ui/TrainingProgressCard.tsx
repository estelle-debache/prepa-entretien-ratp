import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { formatPercent } from './format'
import { ProgressBar } from './primitives'
import { TRAINING_MODE_ICONS } from './trainingModeIcons'
import type { GlobalProgress, ModeProgress } from './trainingProgress'

const PASTILLE_TONE = {
  done: 'border-mint-200 bg-mint-50 text-mint-700',
  started: 'border-amber-200 bg-amber-50 text-amber-700',
  idle: 'border-navy-100 bg-navy-50 text-navy-300',
}

/** Rangée compacte de 7 pastilles (une par mode) : décorative, le détail chiffré vit sur le hub. */
function ModePastilleRow({ modes }: { modes: ModeProgress[] }) {
  return (
    <div aria-hidden="true" className="mt-3 flex items-center gap-2">
      {modes.map((m) => {
        const Icon = TRAINING_MODE_ICONS[m.modeId]
        const tone = m.done ? PASTILLE_TONE.done : m.started ? PASTILLE_TONE.started : PASTILLE_TONE.idle
        return (
          <span key={m.modeId} className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${tone}`}>
            <Icon aria-hidden="true" className="size-4" />
          </span>
        )
      })}
    </div>
  )
}

/**
 * Carte « Ta progression » : résumé des 7 modes d'entraînement (moyenne des `progress` + libellé
 * « X modes sur 7 commencés »). Calcul fourni par `useTrainingProgress()` / `computeTrainingProgress`
 * (`trainingProgress.ts`) — ce composant ne fait que l'afficher, pour rester réutilisable tel quel sur
 * plusieurs pages (hub `/entrainement`, accueil).
 *
 * - Sans `to` : carte statique (usage sur le hub, où on est déjà sur la page de détail).
 * - Avec `to` : toute la carte devient un lien (usage sur l'accueil, vers `/entrainement`).
 * - Avec `modes` : ajoute une rangée compacte de pastilles par mode (icône + couleur d'état).
 */
export function TrainingProgressCard({
  global,
  modes,
  to,
  className = '',
  style,
}: { global: GlobalProgress; modes?: ModeProgress[]; to?: string; className?: string; style?: CSSProperties }) {
  const pct = Math.round(global.progress * 100)
  const baseAriaLabel = `Ta progression : ${formatPercent(pct)}, ${global.label}`
  const baseClassName = `rounded-2xl border border-navy-100 bg-white p-4 shadow-[var(--shadow-card)] ${className}`

  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-mint-600">Ta progression</p>
        <span className="flex items-center gap-1">
          <span className="text-lg font-extrabold text-navy-900">{formatPercent(pct)}</span>
          {to ? <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-navy-300" /> : null}
        </span>
      </div>
      <div className="mt-2.5">
        <ProgressBar value={pct} max={100} />
      </div>
      <p className="mt-1.5 text-sm text-ink-400">{global.label}</p>
      {modes ? <ModePastilleRow modes={modes} /> : null}
    </>
  )

  if (to) {
    return (
      <Link
        to={to}
        aria-label={`${baseAriaLabel}. Voir le détail de l'entraînement.`}
        className={`block transition-transform active:scale-[0.99] ${baseClassName}`}
        style={style}
      >
        {body}
      </Link>
    )
  }

  return (
    <section aria-label={baseAriaLabel} className={baseClassName} style={style}>
      {body}
    </section>
  )
}
