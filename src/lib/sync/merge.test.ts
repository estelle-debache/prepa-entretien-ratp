import { describe, expect, it } from 'vitest'
import { buildPayload, mergeKeys, parsePayload } from './merge'
import type { SyncKeys } from '../store'

describe('sérialisation et fusion sync', () => {
  it('un deuxième appareil vide récupère toutes les clés', () => {
    const remote: SyncKeys = { profil: { value: { prenom: 'A' }, updatedAt: 4 }, quiz: { value: { n: 1 }, updatedAt: 5 } }
    expect(mergeKeys({}, remote)).toMatchObject({ merged: remote, applyLocally: remote, localHasNewer: false })
  })
  it('fusionne les clés distinctes de chaque appareil', () => {
    const left: SyncKeys = { profil: { value: 'left', updatedAt: 1 } }
    const right: SyncKeys = { quiz: { value: 'right', updatedAt: 2 } }
    expect(mergeKeys(left, right).merged).toEqual({ ...left, ...right })
  })
  it('choisit strictement la version la plus récente dans les deux sens et garde le local à égalité', () => {
    const local: SyncKeys = { profil: { value: 'local', updatedAt: 5 } }
    const newerRemote: SyncKeys = { profil: { value: 'remote', updatedAt: 6 } }
    expect(mergeKeys(local, newerRemote).applyLocally).toEqual(newerRemote)
    expect(mergeKeys(newerRemote, local).localHasNewer).toBe(true)
    expect(mergeKeys(local, { profil: { value: 'same', updatedAt: 5 } })).toMatchObject({ merged: local, applyLocally: {}, localHasNewer: false })
  })
  it('construit et relit le payload ; filtre les entrées invalides et clés inconnues', () => {
    const payload = buildPayload({ profil: { value: { prenom: 'X' }, updatedAt: 12 } })
    expect(parsePayload(JSON.parse(JSON.stringify(payload)))).toEqual(payload)
    expect(parsePayload({ schema: 1, keys: { nope: { value: 1, updatedAt: 2 }, profil: { value: 1, updatedAt: Infinity }, quiz: { updatedAt: 3 } } })).toEqual({ schema: 1, keys: {} })
    expect(parsePayload({ schema: 2, keys: {} })).toBeNull()
    expect(parsePayload('bad')).toBeNull()
  })
})
