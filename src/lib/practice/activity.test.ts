import { describe, expect, it } from 'vitest'
import { matchesStep, reportActivityDone, subscribeActivity, type ActivityDone } from './activity'
import type { ResolvedStep } from './parcours'

const step = (kind: ResolvedStep['kind'], target?: string, route = '/memo'): ResolvedStep => ({ index: 0, key: 'x', title: 'X', why: 'Y', minutes: 1, kind, route, target })
describe('événements d’activité', () => {
  it('associe les évènements aux étapes attendues', () => {
    expect(matchesStep({ kind: 'read', route: '/memo?parcours=1' }, step('read', undefined, '/memo'))).toBe(true)
    expect(matchesStep({ kind: 'oral', questionId: 'Q4' }, step('oral', 'Q4'))).toBe(true)
    expect(matchesStep({ kind: 'ami', questionId: 'Q4' }, step('oral', 'Q4'))).toBe(true)
    expect(matchesStep({ kind: 'situation', situationId: 'S2' }, step('situation', 'S2'))).toBe(true)
    expect(matchesStep({ kind: 'roleplay', rolePlayId: 'JR2' }, step('roleplay', 'JR2'))).toBe(true)
    for (const kind of ['quiz', 'reflex', 'simulation'] as const) expect(matchesStep({ kind }, step(kind))).toBe(true)
    expect(matchesStep({ kind: 'revision-rapide' }, step('oral', 'Q4'))).toBe(false)
    expect(matchesStep({ kind: 'read', route: '/memo' }, step('read', undefined, '/fiche'))).toBe(false)
  })
  it('diffuse les évènements et permet de se désabonner', () => {
    const seen: ActivityDone[] = []
    const unsubscribe = subscribeActivity(event => seen.push(event))
    const event: ActivityDone = { kind: 'quiz' }
    reportActivityDone(event)
    unsubscribe()
    reportActivityDone({ kind: 'reflex' })
    expect(seen).toEqual([event])
  })
})
