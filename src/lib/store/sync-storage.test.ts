import { describe, expect, it } from 'vitest'
import {
  META_KEY, STORAGE_PREFIX, applySyncKeysTo, exportStorage, importStorage, internalKey, readInternalFrom, readMeta,
  readSyncKeysFrom, stampKeys, writeInternalTo, writeValue, type StorageLike,
} from './storage'

class MemoryStorage implements StorageLike {
  values = new Map<string, string>()
  get length() { return this.values.size }
  key(i: number) { return [...this.values.keys()][i] ?? null }
  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.values.set(key, value) }
  removeItem(key: string) { this.values.delete(key) }
}

describe('stockage : synchronisation', () => {
  it('lit les clés présentes avec un horodatage 0 par défaut', () => {
    const s = new MemoryStorage()
    writeValue(s, 'profil', { prenom: 'Yahia' })
    writeValue(s, 'quiz', { wrongIds: [] })
    stampKeys(s, ['quiz'], 1234)
    expect(readSyncKeysFrom(s)).toEqual({
      profil: { value: { prenom: 'Yahia' }, updatedAt: 0 },
      quiz: { value: { wrongIds: [] }, updatedAt: 1234 },
    })
  })
  it('applique des entrées distantes avec leur horodatage et ignore les clés inconnues ou mal formées', () => {
    const s = new MemoryStorage()
    const written = applySyncKeysTo(s, {
      profil: { value: { prenom: 'A' }, updatedAt: 50 },
      // @ts-expect-error clé inconnue
      inconnue: { value: 1, updatedAt: 1 },
      quiz: { value: { wrongIds: [] }, updatedAt: Number.NaN },
    })
    expect(written).toEqual(['profil'])
    expect(readSyncKeysFrom(s)).toEqual({ profil: { value: { prenom: 'A' }, updatedAt: 50 } })
    expect(readMeta(s)).toEqual({ profil: 50 })
  })
  it('tolère un __meta corrompu', () => {
    const s = new MemoryStorage()
    s.setItem(META_KEY, '{')
    expect(readMeta(s)).toEqual({})
    s.setItem(META_KEY, JSON.stringify({ profil: 'x', quiz: -1, inconnu: 3, ami: 7 }))
    expect(readMeta(s)).toEqual({ ami: 7 })
  })
  it("n'exporte jamais les clés internes (code de synchro, horodatages)", () => {
    const s = new MemoryStorage()
    writeValue(s, 'profil', { prenom: 'Yahia' })
    stampKeys(s, ['profil'], 1)
    writeInternalTo(s, '__sync', { code: 'ABCDEFGHJKMNPQRS' })
    const backup = exportStorage(s)
    expect(backup).not.toContain('__sync')
    expect(backup).not.toContain('__meta')
    expect(backup).not.toContain('ABCDEFGHJKMNPQRS')
    expect(JSON.parse(backup)).toEqual({ [`${STORAGE_PREFIX}profil`]: { prenom: 'Yahia' } })
  })
  it("l'import renvoie les clés importées et ignore les clés internes", () => {
    const s = new MemoryStorage()
    const result = importStorage(s, JSON.stringify({
      [`${STORAGE_PREFIX}profil`]: { prenom: 'B' },
      [`${STORAGE_PREFIX}__sync`]: { code: 'X' },
      [`${STORAGE_PREFIX}__meta`]: { profil: 9 },
    }))
    expect(result).toEqual({ ok: true, imported: ['profil'] })
    expect(s.getItem(internalKey('__sync'))).toBeNull()
    expect(s.getItem(META_KEY)).toBeNull()
  })
  it('lit, écrit et supprime une clé interne', () => {
    const s = new MemoryStorage()
    expect(readInternalFrom(s, '__sync', null)).toBeNull()
    writeInternalTo(s, '__sync', { code: 'C' })
    expect(readInternalFrom(s, '__sync', null)).toEqual({ code: 'C' })
    writeInternalTo(s, '__sync', null)
    expect(readInternalFrom(s, '__sync', null)).toBeNull()
  })
})
