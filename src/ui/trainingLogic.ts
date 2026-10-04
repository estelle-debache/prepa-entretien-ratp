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

