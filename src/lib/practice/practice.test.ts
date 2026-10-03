import { describe, expect, it } from 'vitest'
import { daysUntil, currentPlanDayId, interviewCountdownLabel } from './dates'
import { mulberry32, quickReviewOrder, shuffle } from './selection'
import { buildGrid, scoreGrid } from './grid'
import { formatMmSs, timeStatus } from './timer'
import { pickQuiz, scoreQuiz } from './quiz'
import { buildSimulation, summarizeSimulation } from './simulation'
import { checkOrder, REFLEX_NOTE, shuffledReflexes } from './reflex'
import type { Question } from '../../content/types'
import { friendModeInstructions, simulationIntro } from '../../content/practice/simulationIntro'

describe('practice pure helpers', () => {
  it('counts local calendar days and names the plan day', () => {
    expect(daysUntil('2026-10-07', new Date(2026, 9, 3, 23, 55))).toBe(4)
    expect(daysUntil('2026-10-03', new Date(2026, 9, 3, 0, 2))).toBe(0)
    expect(currentPlanDayId(8)).toBe('J-4'); expect(currentPlanDayId(0)).toBe('J-0'); expect(currentPlanDayId(-1)).toBeNull()
    expect(interviewCountdownLabel(2)).toBe('Dans 2 jours'); expect(interviewCountdownLabel(1)).toBe('Demain')
    expect(interviewCountdownLabel(0)).toBe("Aujourd'hui"); expect(interviewCountdownLabel(-1)).toBe('Passé')
  })
  it('groups review order and supports deterministic randomness', () => {
    const qs = [{ id: 'a', star: true }, { id: 'b', star: false }, { id: 'c', star: false }, { id: 'd', star: true }]
    const order = quickReviewOrder(qs, { b: 'a-revoir', c: 'maitrise', d: 'maitrise' }, mulberry32(12))
    expect(order.slice(0, 2).map((q) => q.id)).toEqual(['a', 'b'])
    expect(order.slice(2).map((q) => q.id).sort()).toEqual(['c', 'd'])
    expect(shuffle(qs, mulberry32(4))).toEqual(shuffle(qs, mulberry32(4)))
  })
  it('builds and scores evaluation rows, including an avoid hit as an error', () => {
    const q = { id: 'Q1', kind: 'top', star: true, theme: 'presentation', question: '', checks: '', ideas: [['Exemple']], example: [], avoid: ['Réciter ; parler trop vite'], targetSeconds: [1, 2] } as unknown as Question
    const items = buildGrid(q)
    expect(items[0].label).toBe('Exemple')
    expect(scoreGrid(items, { 'Q1-idea-1': true, 'Q1-avoid-1': true, 'Q1-general-1': true })).toEqual({ ideas: [1, 1], avoidsHit: 1, general: [1, 3] })
  })
  it('formats stopwatch ranges and quiz scores', () => {
    expect(timeStatus(10, [15, 30])).toBe('trop-court'); expect(timeStatus(20, [15, 30])).toBe('bien'); expect(timeStatus(31, [15, 30])).toBe('trop-long')
    expect(formatMmSs(125.9)).toBe('02:05')
    const items = [{ id: '1', category: 'ratp', answer: 1 }, { id: '2', category: 'ratp', answer: 0 }, { id: '3', category: 'regles', answer: 0 }]
    expect(scoreQuiz(items, { '1': 1, '2': 2 })).toEqual({ correct: 1, total: 3, byCategory: { ratp: { correct: 1, total: 2 }, regles: { correct: 0, total: 1 } } })
    expect(pickQuiz(items, 2, mulberry32(3))).toHaveLength(2)
  })
  it('keeps Q1 first in simulations and scores by official criterion', () => {
    const steps = buildSimulation({ length: 'complete', statuses: { Q2: 'a-revoir' }, rng: mulberry32(5) })
    expect(steps[0]).toEqual({ kind: 'question', questionId: 'Q1' })
    expect(steps.at(-1)).toEqual({ kind: 'recruteur' })
    const summary = summarizeSimulation(steps, { 0: 1, 1: 2 })
    expect(summary.revisit).toEqual([steps[0]])
    expect(summary.averages['motivations']).toBeDefined()
  })
  it('shuffles and checks the reflex sequence', () => {
    expect(shuffledReflexes(mulberry32(1))).toHaveLength(5)
    expect(checkOrder(['Sécuriser', 'Alerter', 'Informer', 'Appliquer la consigne', 'Rendre compte'])).toEqual({ correct: true, positions: [true, true, true, true, true] })
    expect(REFLEX_NOTE).toContain('ne mettre personne en danger')
  })
  it('builds a fixed eight-step short simulation across seeds', () => {
    for (const seed of [1, 7, 42, 2026]) {
      const steps = buildSimulation({ length: 'courte', statuses: { Q3: 'a-revoir', Q13: 'a-revoir' }, rng: mulberry32(seed) })
      expect(steps).toHaveLength(8)
      expect(steps[0]).toEqual({ kind: 'question', questionId: 'Q1' })
      expect(steps.at(-1)).toEqual({ kind: 'recruteur' })
      expect(steps.filter((step) => step.kind === 'situation')).toHaveLength(1)
      const finalOralIds = steps.filter((step) => step.kind === 'question' && ['Q9', 'Q13'].includes(step.questionId)).map((step) => step.kind === 'question' ? step.questionId : '')
      expect(finalOralIds).toHaveLength(1)
    }
  })
  it('uses friend perspective labels and personalized intros with empty-name fallback', () => {
    const q = { id: 'Q1', kind: 'top', star: true, theme: 'presentation', question: '', checks: '', ideas: [['Exemple']], example: [], avoid: ['Réciter'], targetSeconds: [1, 2] } as unknown as Question
    expect(buildGrid(q, 'ami').slice(-3).map((item) => item.label)).toEqual([
      'Il a donné un exemple vécu', 'Il a parlé calmement, sans réciter', 'Il a respecté la durée',
    ])
    expect(simulationIntro('')).toContain('Yahia, réponds')
    expect(friendModeInstructions('Lina')).toContain('Lina répond')
  })
})
