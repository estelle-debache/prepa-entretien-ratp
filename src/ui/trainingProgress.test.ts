import { describe, expect, it } from 'vitest'
import {
  computeAmiProgress, computeOralProgress, computeQuizProgress, computeReflexProgress,
  computeRevisionProgress, computeSimulationProgress, computeSituationsProgress, computeTrainingProgress,
} from './trainingProgress'

const TOTALS = { questions: 51, situations: 13, quiz: 132 }

const EMPTY_INPUTS = {
  oralHistory: {},
  amiHistory: {},
  simulations: [],
  quiz: { wrongIds: [] },
  situations: {},
  reflex: { attempts: 0, successes: 0 },
  statutQuestions: {},
  totals: TOTALS,
}

describe('computeOralProgress / computeAmiProgress', () => {
  it('vide : pas commencé', () => {
    expect(computeOralProgress({}, 51)).toEqual({ started: false, done: false, progress: 0, detail: '0 / 51 questions réussies' })
  })
  it('seules les questions réussies (score ≥ 80) comptent', () => {
    const history: Record<string, { score: number; at: number }> = {}
    for (let i = 0; i < 12; i++) history[`OK${i}`] = { score: 85, at: 1 }
    for (let i = 0; i < 5; i++) history[`KO${i}`] = { score: 50, at: 1 }
    const result = computeOralProgress(history, 51)
    expect(result.started).toBe(true)
    expect(result.done).toBe(false)
    expect(result.progress).toBeCloseTo(12 / 51)
    expect(result.detail).toBe('12 / 51 questions réussies')
  })
  it('commencé sans réussite : 0 %', () => {
    const result = computeAmiProgress({ Q1: { score: 40, at: 1 } }, 51)
    expect(result.started).toBe(true)
    expect(result.progress).toBe(0)
    expect(result.detail).toBe('0 / 51 questions réussies')
  })
  it('fait seulement quand toutes les questions sont réussies', () => {
    const history = Object.fromEntries(Array.from({ length: 51 }, (_, i) => [`Q${i}`, { score: 100, at: 1 }]))
    const result = computeOralProgress(history, 51)
    expect(result.done).toBe(true)
    expect(result.progress).toBe(1)
  })
})

describe('computeSimulationProgress', () => {
  it('vide', () => {
    expect(computeSimulationProgress([])).toEqual({ started: false, done: false, progress: 0, detail: 'Aucune simulation pour le moment' })
  })
  it('terminée avec des « À revoir » : 0 %, pas fait', () => {
    const at = new Date(2026, 9, 4).getTime()
    const result = computeSimulationProgress([{ at, length: 'complete', mode: 'seul', averages: {}, revisitCount: 2 }])
    expect(result.started).toBe(true)
    expect(result.done).toBe(false)
    expect(result.progress).toBe(0)
    expect(result.detail).toBe('1 simulation, dernière le 4 oct. · pas encore sans « À revoir »')
  })
  it('une courte réussie seulement → 50 %, pas fait', () => {
    const result = computeSimulationProgress([{ at: 1, length: 'courte', mode: 'seul', averages: {}, revisitCount: 0 }])
    expect(result.done).toBe(false)
    expect(result.progress).toBe(0.5)
  })
  it('une complète réussie → 100 %, fait', () => {
    const at1 = new Date(2026, 9, 1).getTime()
    const at2 = new Date(2026, 9, 4).getTime()
    const result = computeSimulationProgress([
      { at: at1, length: 'courte', mode: 'seul', averages: {}, revisitCount: 1 },
      { at: at2, length: 'complete', mode: 'ami', averages: {}, revisitCount: 0 },
    ])
    expect(result.done).toBe(true)
    expect(result.progress).toBe(1)
    expect(result.detail).toBe('Complète réussie · 2 simulations, dernière le 4 oct.')
  })
})

describe('computeQuizProgress', () => {
  it('vide', () => {
    expect(computeQuizProgress({ wrongIds: [] }, 132)).toEqual({ started: false, done: false, progress: 0, detail: 'Aucun quiz fait pour le moment' })
  })
  it('partiel : progression = questions réussies, pas encore « fait »', () => {
    const seenIds = Array.from({ length: 40 }, (_, i) => `QZ${i}`)
    const correctIds = Array.from({ length: 30 }, (_, i) => `QZ${i}`)
    const result = computeQuizProgress({ wrongIds: ['QZ31', 'QZ32', 'QZ33'], seenIds, correctIds, lastScore: { correct: 8, total: 10 } }, 132)
    expect(result.started).toBe(true)
    expect(result.done).toBe(false)
    expect(result.progress).toBeCloseTo(30 / 132)
    expect(result.detail).toBe('30 / 132 questions réussies · 3 erreurs à revoir')
  })
  it('un quiz fait avec des erreurs ne compte pas comme « fait »', () => {
    const result = computeQuizProgress({ wrongIds: ['QZ1'], lastScore: { correct: 9, total: 10 } }, 132)
    expect(result.started).toBe(true)
    expect(result.done).toBe(false)
    expect(result.progress).toBe(0)
  })
  it('« fait » seulement à 100 % de questions réussies', () => {
    const correctIds = Array.from({ length: 132 }, (_, i) => `QZ${i}`)
    const result = computeQuizProgress({ wrongIds: [], correctIds, lastScore: { correct: 10, total: 10 } }, 132)
    expect(result.done).toBe(true)
    expect(result.progress).toBe(1)
    const presque = computeQuizProgress({ wrongIds: [], correctIds: correctIds.slice(1), lastScore: { correct: 10, total: 10 } }, 132)
    expect(presque.done).toBe(false)
  })
})

describe('computeSituationsProgress', () => {
  it('vide', () => {
    expect(computeSituationsProgress({}, 13)).toEqual({ started: false, done: false, progress: 0, detail: '0 / 13 situations réussies' })
  })
  it('seules les situations terminées avec le mini-quiz tout juste comptent', () => {
    const situations = {
      S1: { done: true, score: [2, 2] as [number, number] },
      S2: { done: true, score: [1, 2] as [number, number] },
      S3: { done: true },
      S4: { done: false },
    }
    const result = computeSituationsProgress(situations, 13)
    expect(result.started).toBe(true)
    expect(result.done).toBe(false)
    expect(result.progress).toBeCloseTo(2 / 13)
    expect(result.detail).toBe('2 / 13 situations réussies')
  })
})

describe('computeReflexProgress', () => {
  it('jamais essayé', () => {
    expect(computeReflexProgress({ attempts: 0, successes: 0 })).toEqual({ started: false, done: false, progress: 0, detail: 'Pas encore essayé' })
  })
  it('essayé mais pas encore réussi : started sans done', () => {
    const result = computeReflexProgress({ attempts: 3, successes: 0 })
    expect(result.started).toBe(true)
    expect(result.done).toBe(false)
    expect(result.progress).toBe(0)
    expect(result.detail).toBe('Réussi 0 fois sur 3 essais')
  })
  it('réussi au moins une fois', () => {
    const result = computeReflexProgress({ attempts: 3, successes: 2 })
    expect(result.done).toBe(true)
    expect(result.progress).toBe(1)
    expect(result.detail).toBe('Réussi 2 fois sur 3 essais')
  })
})

describe('computeRevisionProgress', () => {
  it('vide', () => {
    expect(computeRevisionProgress({}, 51)).toEqual({ started: false, done: false, progress: 0, detail: '0 maîtrisée · 0 à revoir' })
  })
  it('20 maîtrisées, 6 à revoir', () => {
    const statuts: Record<string, 'maitrise' | 'a-revoir'> = {}
    for (let i = 0; i < 20; i++) statuts[`M${i}`] = 'maitrise'
    for (let i = 0; i < 6; i++) statuts[`R${i}`] = 'a-revoir'
    const result = computeRevisionProgress(statuts, 51)
    expect(result.started).toBe(true)
    expect(result.done).toBe(false)
    expect(result.progress).toBeCloseTo(20 / 51)
    expect(result.detail).toBe('20 maîtrisées · 6 à revoir')
  })
})

describe('computeTrainingProgress (agrégation)', () => {
  it('cas vide : 0 % partout, aucun mode terminé', () => {
    const result = computeTrainingProgress(EMPTY_INPUTS)
    expect(result.modes).toHaveLength(7)
    expect(result.modes.every((m) => !m.started && !m.done && m.progress === 0)).toBe(true)
    expect(result.global).toEqual({ progress: 0, doneCount: 0, totalModes: 7, label: 'Aucun mode terminé sur 7' })
  })

  it('cas partiel : seuls les modes terminés et réussis comptent', () => {
    const result = computeTrainingProgress({
      ...EMPTY_INPUTS,
      oralHistory: { Q1: { score: 90, at: 1 }, Q2: { score: 30, at: 1 } },
      situations: { S1: { done: true, score: [1, 1] }, S2: { done: true, score: [0, 1] } },
      reflex: { attempts: 2, successes: 1 },
    })
    expect(result.global.doneCount).toBe(1)
    expect(result.global.label).toBe('1 mode sur 7 terminé')
    const byMode = Object.fromEntries(result.modes.map((m) => [m.modeId, m]))
    expect(byMode.oral.started).toBe(true)
    expect(byMode.oral.done).toBe(false)
    expect(byMode.situations.done).toBe(false)
    expect(byMode.reflex.done).toBe(true)
    const expectedAverage = (1 / 51 + 0 + 0 + 0 + 1 / 13 + 1 + 0) / 7
    expect(result.global.progress).toBeCloseTo(expectedAverage)
  })

  it('cas complet : tout terminé et réussi → 100 %, 7 modes sur 7', () => {
    const fullHistory = Object.fromEntries(Array.from({ length: 51 }, (_, i) => [`Q${i}`, { score: 100, at: 1 }]))
    const fullSituations = Object.fromEntries(Array.from({ length: 13 }, (_, i) => [`S${i}`, { done: true, score: [2, 2] as [number, number] }]))
    const fullStatuts = Object.fromEntries(Array.from({ length: 51 }, (_, i) => [`Q${i}`, 'maitrise' as const]))
    const result = computeTrainingProgress({
      oralHistory: fullHistory,
      amiHistory: fullHistory,
      simulations: [{ at: 1, length: 'complete', mode: 'seul', averages: {}, revisitCount: 0 }],
      quiz: { wrongIds: [], seenIds: Array.from({ length: 132 }, (_, i) => `QZ${i}`), correctIds: Array.from({ length: 132 }, (_, i) => `QZ${i}`) },
      situations: fullSituations,
      reflex: { attempts: 1, successes: 1 },
      statutQuestions: fullStatuts,
      totals: TOTALS,
    })
    expect(result.global.doneCount).toBe(7)
    expect(result.global.progress).toBeCloseTo(1)
    expect(result.global.label).toBe('7 modes sur 7 terminés')
  })
})
