import type { Question, ThemeId } from '../../content/types'
import { BANK_QUESTIONS, TOP_QUESTIONS } from '../../content/questions'
import { SITUATIONS } from '../../content/situations'
import { shuffle } from './selection'

export type SimulationStep = { kind: 'question'; questionId: string } | { kind: 'situation'; situationId: string } | { kind: 'recruteur' }
export const OFFICIAL_CRITERIA = [
  'connaissance de l’entreprise et du métier', 'capacité à exercer ce métier', 'motivations', 'adaptation à la culture de l’entreprise',
] as const
export type OfficialCriterion = typeof OFFICIAL_CRITERIA[number]
const criterionByTheme: Record<ThemeId, OfficialCriterion> = {
  ratp: OFFICIAL_CRITERIA[0], metier: OFFICIAL_CRITERIA[0], securite: OFFICIAL_CRITERIA[1], contraintes: OFFICIAL_CRITERIA[1],
  presentation: OFFICIAL_CRITERIA[2], culture: OFFICIAL_CRITERIA[3], pieges: OFFICIAL_CRITERIA[3],
}
export function criterionForTheme(theme: ThemeId | 'situations'): OfficialCriterion {
  return theme === 'situations' ? OFFICIAL_CRITERIA[1] : criterionByTheme[theme]
}
function prioritize<T extends { id: string }>(items: T[], statuses: Record<string, 'maitrise' | 'a-revoir' | undefined>, rng: () => number): T[] {
  return shuffle(items, rng).sort((a, b) => {
    const rank = (id: string) => statuses[id] === 'a-revoir' ? 0 : statuses[id] === undefined ? 1 : 2
    return rank(a.id) - rank(b.id)
  })
}

export function buildSimulation({ length, statuses = {}, rng = Math.random }: {
  length: 'courte' | 'complete'; statuses?: Record<string, 'maitrise' | 'a-revoir' | undefined>; rng?: () => number
}): SimulationStep[] {
  const tops = TOP_QUESTIONS
  const banks = BANK_QUESTIONS
  const top = (id: string) => tops.find((q) => q.id === id)
  const pick = (ids: string[]) => ids.map(top).filter((q): q is NonNullable<typeof q> => !!q)
  const choose = (candidates: Question[], count: number) => prioritize(candidates, statuses, rng).slice(0, count).map((q) => ({ kind: 'question' as const, questionId: q.id }))
  const bankPick = (themes: ThemeId[], count: number) => choose(banks.filter((q) => themes.includes(q.theme)), count)
  const situationPool = prioritize(SITUATIONS, statuses, rng).sort((a, b) => Number(!['S1', 'S2', 'S3'].includes(a.id)) - Number(!['S1', 'S2', 'S3'].includes(b.id)))
  const situationCount = length === 'courte' ? 1 : 2
  const steps: SimulationStep[] = [
    { kind: 'question', questionId: 'Q1' },
    ...choose(pick(['Q2', 'Q3']), 2),
    ...choose(pick(['Q4', 'Q8']), 1), ...choose(pick(['Q5']), 1),
    ...choose(pick(['Q6', 'Q7']), 2), ...choose(pick(['Q9', 'Q13']), 1),
    ...bankPick(['metier', 'securite', 'contraintes'], length === 'courte' ? 1 : 2),
    ...situationPool.slice(0, situationCount).map((s) => ({ kind: 'situation' as const, situationId: s.id })),
    ...choose(pick(['Q12']), 1), ...bankPick(['culture', 'pieges'], length === 'courte' ? 0 : 1),
    ...choose(pick(['Q14', 'Q15']), 2), { kind: 'recruteur' },
  ]
  return steps
}

export function summarizeSimulation(steps: SimulationStep[], selfRatings: Record<number, 1 | 2 | 3>): {
  averages: Partial<Record<OfficialCriterion, number>>; byCriterion: Partial<Record<OfficialCriterion, number>>; revisit: SimulationStep[]
} {
  const scoreGroups = new Map<OfficialCriterion, number[]>()
  const revisit: SimulationStep[] = []
  steps.forEach((step, index) => {
    const rating = selfRatings[index]
    if (rating === undefined) return
    if (rating === 1) revisit.push(step)
    let criterion: OfficialCriterion | null = null
    if (step.kind === 'situation') criterion = OFFICIAL_CRITERIA[1]
    if (step.kind === 'question') {
      const q = [...TOP_QUESTIONS, ...BANK_QUESTIONS].find((item) => item.id === step.questionId)
      if (q) criterion = criterionForTheme(q.theme)
    }
    if (!criterion) return
    const group = scoreGroups.get(criterion) ?? []
    group.push(rating); scoreGroups.set(criterion, group)
  })
  const averages: Partial<Record<OfficialCriterion, number>> = {}
  scoreGroups.forEach((values, criterion) => { averages[criterion] = Math.round(values.reduce((sum, n) => sum + n, 0) / values.length * 100) / 100 })
  return { averages, byCriterion: averages, revisit }
}
