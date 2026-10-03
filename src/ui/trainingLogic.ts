/** Résultat de `scoreGrid` (voir `lib/practice/grid`). */
export interface GridScoreResult { ideas: [number, number]; avoidsHit: number; general: [number, number] }

/**
 * Score global 0–100 à partir d'une grille d'auto-évaluation : 60 % idées placées, 40 % critères
 * généraux, moins une pénalité pour chaque erreur (« à éviter ») cochée.
 */
export function computeOverallScore(result: GridScoreResult): number {
  const ideaRatio = result.ideas[1] > 0 ? result.ideas[0] / result.ideas[1] : 0
  const generalRatio = result.general[1] > 0 ? result.general[0] / result.general[1] : 0
  const penalty = Math.min(40, result.avoidsHit * 15)
  const raw = (ideaRatio * 0.6 + generalRatio * 0.4) * 100 - penalty
  return Math.max(0, Math.min(100, Math.round(raw)))
}

export type TrainingModeId = 'oral' | 'ami' | 'simulation' | 'quiz' | 'situations' | 'reflex' | 'revision'

export interface ModeRecommendation { mode: TrainingModeId; reason: string }

/** Propose un mode d'entraînement à mettre en avant selon le jour du plan en cours. */
export function recommendedMode(planDayId: string | null): ModeRecommendation {
  switch (planDayId) {
    case 'J-4':
      return { mode: 'oral', reason: "Aujourd'hui : commence doucement, à l'oral seul, sur Q1 et Q2." }
    case 'J-3':
      return { mode: 'oral', reason: "Aujourd'hui : entraîne-toi à l'oral, puis enchaîne sur les mises en situation." }
    case 'J-2':
      return { mode: 'ami', reason: "Aujourd'hui : entraîne-toi avec un ami (jeux de rôle, simulation)." }
    case 'J-1':
      return { mode: 'revision', reason: 'Aujourd’hui, lève le pied : une révision rapide suffit.' }
    case 'J-0':
      return { mode: 'revision', reason: 'Jour J : juste une relecture rapide, pas d’entraînement lourd.' }
    default:
      return { mode: 'oral', reason: "Commence par l'oral seul, question par question." }
  }
}
