export type QuestionStatus = 'maitrise' | 'a-revoir' | undefined
export function mulberry32(seed: number): () => number {
  return () => {
    let t = seed += 0x6D2B79F5
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(arr: readonly T[], rng: () => number = Math.random): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function quickReviewOrder<T extends { id: string; star?: boolean }>(
  questions: readonly T[], statuses: Record<string, QuestionStatus>, rng: () => number = Math.random,
): T[] {
  const groups: T[][] = [[], [], [], []]
  for (const q of questions) {
    const status = statuses[q.id]
    const index = q.star && status !== 'maitrise' ? 0 : status === 'a-revoir' ? 1 : status === undefined ? 2 : 3
    groups[index].push(q)
  }
  return groups.flatMap((group) => shuffle(group, rng))
}
