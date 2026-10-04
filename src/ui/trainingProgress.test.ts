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
    expect(computeOralProgress({}, 51)).toEqual({ started: false, done: false, progress: 0, detail: '0 / 51 questions travaillées' })
  })
  it('partiel : 12 / 51', () => {
    const history = Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`Q${i}`, { score: 2, at: 1 }]))
    const result = computeOralProgress(history, 51)
    expect(result.started).toBe(true)
    expect(result.done).toBe(true)
    expect(result.progress).toBeCloseTo(12 / 51)
    expect(result.detail).toBe('12 / 51 questions travaillées')
  })
  it('complet : 51 / 51 → progress 1', () => {
    const history = Object.fromEntries(Array.from({ length: 51 }, (_, i) => [`Q${i}`, { score: 3, at: 1 }]))
    expect(computeOralProgress(history, 51).progress).toBe(1)
  })
  it('ami : une question travaillée', () => {
    expect(computeAmiProgress({ Q1: { score: 1, at: 1 } }, 51).detail).toBe('1 / 51 questions')
  })
})

describe('computeSimulationProgress', () => {
  it('vide', () => {
    expect(computeSimulationProgress([])).toEqual({ started: false, done: false, progress: 0, detail: 'Aucune simulation pour le moment' })
  })
  it('une courte seulement → 50 %', () => {
    const at = new Date(2026, 9, 4).getTime()
    const result = computeSimulationProgress([{ at, length: 'courte', mode: 'seul', averages: {}, revisitCount: 0 }])
    expect(result.started).toBe(true)
    expect(result.done).toBe(true)
    expect(result.progress).toBe(0.5)
    expect(result.detail).toBe('1 simulation, dernière le 4 oct.')
  })
  it('au moins une complète → 100 %', () => {
    const at1 = new Date(2026, 9, 1).getTime()
    const at2 = new Date(2026, 9, 4).getTime()
    const result = computeSimulationProgress([
      { at: at1, length: 'courte', mode: 'seul', averages: {}, revisitCount: 0 },
      { at: at2, length: 'complete', mode: 'ami', averages: {}, revisitCount: 1 },
    ])
    expect(result.progress).toBe(1)
    expect(result.detail).toBe('2 simulations, dernière le 4 oct.')
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
    expect(result.detail).toBe('30 / 132 questions réussies · dernier score 8/10 · 3 erreurs à revoir')
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
    expect(computeSituationsProgress({}, 13)).toEqual({ started: false, done: false, progress: 0, detail: '0 / 13 situations' })
  })
  it('partiel', () => {
    const situations = { S1: { done: true }, S2: { done: true }, S3: { done: false } }
    const result = computeSituationsProgress(situations, 13)
    expect(result.started).toBe(true)
    expect(result.progress).toBeCloseTo(2 / 13)
    expect(result.detail).toBe('2 / 13 situations')
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
    expect(result.progress).toBeCloseTo(20 / 51)
    expect(result.detail).toBe('20 maîtrisées · 6 à revoir')
  })
})

describe('computeTrainingProgress (agrégation)', () => {
  it('cas vide : 0 % partout, aucun mode commencé', () => {
    const result = computeTrainingProgress(EMPTY_INPUTS)
    expect(result.modes).toHaveLength(7)
    expect(result.modes.every((m) => !m.started && !m.done && m.progress === 0)).toBe(true)
    expect(result.global).toEqual({ progress: 0, startedCount: 0, totalModes: 7, label: 'Aucun mode commencé sur 7' })
  })

  it('cas partiel : quelques modes commencés, moyenne cohérente', () => {
    const result = computeTrainingProgress({
      ...EMPTY_INPUTS,
      oralHistory: { Q1: { score: 2, at: 1 } },
      situations: { S1: { done: true } },
      reflex: { attempts: 2, successes: 1 },
    })
    expect(result.global.startedCount).toBe(3)
    expect(result.global.label).toBe('3 modes sur 7 commencés')
    const byMode = Object.fromEntries(result.modes.map((m) => [m.modeId, m]))
    expect(byMode.oral.started).toBe(true)
    expect(byMode.situations.started).toBe(true)
    expect(byMode.reflex.done).toBe(true)
    expect(byMode.ami.started).toBe(false)
    const expectedAverage = (1 / 51 + 0 + 0 + 0 + 1 / 13 + 1 + 0) / 7
    expect(result.global.progress).toBeCloseTo(expectedAverage)
  })

  it('cas complet : tous les modes au maximum → moyenne 100 %', () => {
    const fullHistory = Object.fromEntries(Array.from({ length: 51 }, (_, i) => [`Q${i}`, { score: 3, at: 1 }]))
    const fullSituations = Object.fromEntries(Array.from({ length: 13 }, (_, i) => [`S${i}`, { done: true }]))
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
    expect(result.global.startedCount).toBe(7)
    expect(result.global.progress).toBeCloseTo(1)
    expect(result.global.label).toBe('7 modes sur 7 commencés')
  })
})
