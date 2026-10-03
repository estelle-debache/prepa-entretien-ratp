import { describe, expect, it } from 'vitest'
import { computeOverallScore, recommendedMode } from './trainingLogic'

describe('computeOverallScore', () => {
  it('donne 100 pour un sans-faute', () => {
    expect(computeOverallScore({ ideas: [3, 3], avoidsHit: 0, general: [3, 3] })).toBe(100)
  })
  it('donne 0 si rien n’est coché', () => {
    expect(computeOverallScore({ ideas: [0, 3], avoidsHit: 0, general: [0, 3] })).toBe(0)
  })
  it('pénalise chaque erreur « à éviter » cochée', () => {
    const withoutError = computeOverallScore({ ideas: [3, 3], avoidsHit: 0, general: [3, 3] })
    const withError = computeOverallScore({ ideas: [3, 3], avoidsHit: 1, general: [3, 3] })
    expect(withError).toBe(withoutError - 15)
  })
  it('ne descend jamais sous 0 malgré de nombreuses erreurs', () => {
    expect(computeOverallScore({ ideas: [0, 3], avoidsHit: 5, general: [0, 3] })).toBe(0)
  })
  it('gère une grille sans items (division par zéro)', () => {
    expect(computeOverallScore({ ideas: [0, 0], avoidsHit: 0, general: [0, 0] })).toBe(0)
  })
})

describe('recommendedMode', () => {
  it('recommande l’oral seul en J-4 et J-3', () => {
    expect(recommendedMode('J-4').mode).toBe('oral')
    expect(recommendedMode('J-3').mode).toBe('oral')
  })
  it('recommande le mode ami en J-2', () => {
    expect(recommendedMode('J-2').mode).toBe('ami')
  })
  it('recommande la révision rapide en J-1 et J-0', () => {
    expect(recommendedMode('J-1').mode).toBe('revision')
    expect(recommendedMode('J-0').mode).toBe('revision')
  })
  it('retombe sur l’oral par défaut (avant J-4 ou après J-0)', () => {
    expect(recommendedMode(null).mode).toBe('oral')
  })
})
