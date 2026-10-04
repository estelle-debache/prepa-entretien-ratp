import { describe, expect, it } from 'vitest'
import { clearStorage, exportStorage, importStorage, readValue, STORAGE_PREFIX, writeValue, type StorageLike } from './storage'

class MemoryStorage implements StorageLike {
  values = new Map<string, string>()
  get length() { return this.values.size }
  key(i: number) { return [...this.values.keys()][i] ?? null }
  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.values.set(key, value) }
  removeItem(key: string) { this.values.delete(key) }
}

describe('stockage persistant', () => {
  it('lit et écrit sous le préfixe versionné et retourne le défaut en cas de données invalides', () => {
    const store = new MemoryStorage()
    expect(readValue(store, 'profil', { prenom: 'Yahia' })).toEqual({ prenom: 'Yahia' })
    expect(writeValue(store, 'profil', { prenom: 'Léa' })).toBe(true)
    expect(store.getItem(`${STORAGE_PREFIX}profil`)).toBe('{"prenom":"Léa"}')
    store.setItem(`${STORAGE_PREFIX}profil`, '{')
    expect(readValue(store, 'profil', { prenom: 'Yahia' })).toEqual({ prenom: 'Yahia' })
  })
  it('tolère les erreurs de stockage', () => {
    class BrokenStorage extends MemoryStorage {
      override setItem() { throw Error('quota') }
      override getItem(): string | null { throw Error('blocked') }
    }
    const broken = new BrokenStorage()
    expect(readValue(broken, 'plan', {})).toEqual({})
    expect(writeValue(broken, 'plan', { task: true })).toBe(false)
  })
  it('exporte/import les clés connues et efface seulement le préfixe applicatif', () => {
    const source = new MemoryStorage()
    writeValue(source, 'plan', { 'J-4-1': true })
    writeValue(source, 'parcours', { tour: 2 })
    writeValue(source, 'unefois', { cfa: true })
    source.setItem('other-app', 'keep')
    const backup = exportStorage(source)
    const target = new MemoryStorage()
    target.setItem('other-app', 'keep')
    expect(importStorage(target, backup)).toEqual({ ok: true })
    expect(readValue(target, 'plan', {})).toEqual({ 'J-4-1': true })
    expect(readValue(target, 'parcours', {})).toEqual({ tour: 2 })
    expect(readValue(target, 'unefois', {})).toEqual({ cfa: true })
    expect(importStorage(target, 'nope')).toMatchObject({ ok: false })
    clearStorage(target)
    expect(target.getItem('other-app')).toBe('keep')
    expect(target.length).toBe(1)
  })
})
