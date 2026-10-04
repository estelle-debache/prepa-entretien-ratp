import { describe, expect, it } from 'vitest'
import { INITIAL_PARCOURS, PARCOURS_LENGTH, completeCurrent, currentStep, isTourFinished, jumpTo, normalizeParcours, resolveStep, resolveTour, skipCurrent, startNextTour, stripParcours, withParcours, type ResolveContext } from './parcours'

const ctx: ResolveContext = { statuses: {}, quizWrongCount: 3 }
describe('parcours en boucle', () => {
  it('décrit les 15 étapes et les routes du premier tour', () => {
    const tour = resolveTour(INITIAL_PARCOURS, ctx)
    expect(PARCOURS_LENGTH).toBe(15)
    expect(tour).toHaveLength(15)
    expect(tour[4].route).toBe('/situations/S1')
    expect(tour[7].route).toBe('/situations/S2')
    expect(tour[9].route).toBe('/situations/S3')
    expect(tour[11].route).toBe('/jeux-de-role/JR1')
    expect(tour[2].route).toBe('/quiz?mode=serie')
  })
  it('fait tourner situations, rôle et quiz au tour suivant', () => {
    expect(resolveStep(4, 2, ctx).route).toBe('/situations/S4')
    expect(resolveStep(7, 2, ctx).route).toBe('/situations/S5')
    expect(resolveStep(9, 2, ctx).route).toBe('/situations/S6')
    expect(resolveStep(11, 2, ctx).route).toBe('/jeux-de-role/JR2')
    expect(resolveStep(2, 2, ctx).route).toBe('/quiz?mode=erreurs')
  })
  it('gèle la cible malgré les changements de contexte après jump et completion', () => {
    const jumped = jumpTo(INITIAL_PARCOURS, 12, ctx)
    const other: ResolveContext = { statuses: { Q3: 'maitrise' }, quizWrongCount: 0 }
    expect(currentStep(jumped, other).target).toBe(jumped.target)
    const moved = completeCurrent(jumped, ctx, { expectedIndex: 12, now: 123 })
    expect(currentStep(moved, other).target).toBe(moved.target)
  })
  it('ignore le double tap, saute sans compter, saute en avant puis poursuit', () => {
    expect(completeCurrent(INITIAL_PARCOURS, ctx, { expectedIndex: 1 })).toEqual(INITIAL_PARCOURS)
    const forward = jumpTo(INITIAL_PARCOURS, 4, ctx)
    const next = completeCurrent(forward, ctx, { expectedIndex: 4, now: 10 })
    expect(next.index).toBe(5)
    expect(next.totalDone).toBe(1)
    const backward = jumpTo(next, 1, ctx)
    expect(backward.visited).toEqual([4])
    expect(completeCurrent(backward, ctx, { expectedIndex: 1 }).index).toBe(2)
    const skipped = skipCurrent(INITIAL_PARCOURS, ctx, { expectedIndex: 0 })
    expect(skipped.totalDone).toBe(0)
    expect(skipped.visited).toContain(0)
  })
  it('termine explicitement un tour puis commence le suivant', () => {
    let state = INITIAL_PARCOURS
    for (let i = 0; i < PARCOURS_LENGTH; i++) state = completeCurrent(state, ctx, { expectedIndex: state.index })
    expect(isTourFinished(state)).toBe(true)
    expect(state.tour).toBe(1)
    const next = startNextTour(state, ctx)
    expect(next).toMatchObject({ tour: 2, index: 0, visited: [] })
    expect(next.target).toBe(resolveStep(0, 2, ctx).target)
  })
  it('normalise des données corrompues et filtre les visited', () => {
    expect(normalizeParcours({ tour: -4, index: 99, visited: [1, 1, -1, 15, 2], totalDone: 'x', target: 5, lastAt: -1 }, ctx)).toEqual({ tour: 1, index: 0, visited: [1, 2], totalDone: 0, target: undefined })
    expect(normalizeParcours(null)).toEqual(INITIAL_PARCOURS)
    expect(normalizeParcours({ index: 2 }, ctx).target).toBe(resolveStep(2, 1, ctx).target)
  })
  it('ajoute et retire parcours en préservant la query et en restant idempotent', () => {
    expect(withParcours('/quiz?mode=serie')).toBe('/quiz?mode=serie&parcours=1')
    expect(withParcours(withParcours('/memo'))).toBe('/memo?parcours=1')
    expect(stripParcours('?a=1&parcours=1&b=2')).toBe('?a=1&b=2')
    expect(stripParcours('?parcours=1')).toBe('')
  })
})
