export interface ScorableQuizItem { id: string; category: string; answer: number }
export function scoreQuiz<T extends ScorableQuizItem>(items: readonly T[], answers: Record<string, number>): {
  correct: number; total: number; byCategory: Record<string, { correct: number; total: number }>
} {
  const byCategory: Record<string, { correct: number; total: number }> = {}
  let correct = 0
  for (const item of items) {
    const group = byCategory[item.category] ??= { correct: 0, total: 0 }
    group.total++
    if (answers[item.id] === item.answer) { group.correct++; correct++ }
  }
  return { correct, total: items.length, byCategory }
}
/**
 * Mélange les options d'un QCM et recalcule l'index de la bonne réponse.
 * À appeler pour CHAQUE question affichée : dans la banque, la bonne réponse est toujours en position 0.
 */
export function shuffleQuizOptions<T extends { options: string[]; answer: number }>(item: T, rng: () => number = Math.random): T {
  const order = item.options.map((_, i) => i)
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [order[i], order[j]] = [order[j], order[i]] }
  return { ...item, options: order.map((i) => item.options[i]), answer: order.indexOf(item.answer) }
}
export function pickQuiz<T>(items: readonly T[], n: number, rng: () => number = Math.random): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [result[i], result[j]] = [result[j], result[i]] }
  return result.slice(0, Math.max(0, n))
}
