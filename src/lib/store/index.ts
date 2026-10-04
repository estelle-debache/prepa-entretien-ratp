import { useCallback, useRef, useSyncExternalStore } from 'react'
import { DEFAULT_INTERVIEW_DATE, type Profile } from '../../content/types'
import {
  applySyncKeysTo, clearStorage, exportStorage, importStorage, readInternalFrom, readSyncKeysFrom, readValue, stampKeys, storageKey,
  writeInternalTo, writeValue, type InternalName, type Reglages, type StoreKey, type StorageLike, type SyncKeys,
} from './storage'
export type { QuestionStatus, Reglages, StoreKey } from './storage'
export { STORAGE_PREFIX } from './storage'

const defaults: Partial<Record<StoreKey, unknown>> = {
  profil: { prenom: 'Yahia' } satisfies Profile,
  statutQuestions: {}, checklist: {},
  reglages: { interviewDate: DEFAULT_INTERVIEW_DATE, tts: true } satisfies Reglages,
}
const listeners = new Map<StoreKey, Set<() => void>>()
const snapshots = new Map<StoreKey, { raw: string | null; value: unknown }>()
const fallbackStorage = new Map<string, string>()
const memoryStorage = {
  get length() { return fallbackStorage.size },
  key: (i: number) => [...fallbackStorage.keys()][i] ?? null,
  getItem: (key: string) => fallbackStorage.get(key) ?? null,
  setItem: (key: string, value: string) => { fallbackStorage.set(key, value) },
  removeItem: (key: string) => { fallbackStorage.delete(key) },
}
function storage() { try { return typeof localStorage === 'undefined' ? memoryStorage : localStorage } catch { return memoryStorage } }
function notify(key?: StoreKey) {
  if (key) snapshots.delete(key)
  else snapshots.clear()
  if (key) listeners.get(key)?.forEach((listener) => listener())
  else listeners.forEach((set) => set.forEach((listener) => listener()))
}
if (typeof window !== 'undefined') window.addEventListener('storage', (event) => {
  if (event.key === null) notify()
  else if (event.key.startsWith('prepa-ratp:v1:')) notify(event.key.slice('prepa-ratp:v1:'.length) as StoreKey)
})

export function usePersisted<T>(key: StoreKey, defaultValue: T): [T, (value: T | ((previous: T) => T)) => void] {
  // Le défaut est figé au premier rendu : un défaut passé « inline » (ex. `{}`) ne doit pas
  // changer l'identité du snapshot à chaque rendu.
  const fallbackRef = useRef<T>((defaults[key] as T | undefined) ?? defaultValue)
  const subscribe = useCallback((listener: () => void) => {
    const set = listeners.get(key) ?? new Set<() => void>()
    set.add(listener); listeners.set(key, set)
    return () => { set.delete(listener); if (!set.size) listeners.delete(key) }
  }, [key])
  const getSnapshot = useCallback(() => {
    const currentStorage = storage() as unknown as StorageLike
    let raw: string | null = null
    try { raw = currentStorage.getItem(storageKey(key)) } catch { /* use default */ }
    const cached = snapshots.get(key)
    if (cached && cached.raw === raw) return cached.value as T
    const value = readValue(currentStorage, key, fallbackRef.current)
    snapshots.set(key, { raw, value })
    return value
  }, [key])
  const getServerSnapshot = useCallback(() => fallbackRef.current, [])
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const setValue = useCallback((next: T | ((previous: T) => T)) => {
    const resolved = typeof next === 'function' ? (next as (previous: T) => T)(readValue(storage(), key, fallbackRef.current)) : next
    if (writeValue(storage(), key, resolved)) stampKeys(storage(), [key])
    notify(key)
    emitLocalWrite(key)
  }, [key])
  return [value, setValue]
}

export function exportAll(): string { return exportStorage(storage()) }
export function importAll(json: string): { ok: boolean; error?: string } {
  const { imported = [], ...result } = importStorage(storage(), json)
  if (result.ok) {
    stampKeys(storage(), imported)
    notify()
    imported.forEach(emitLocalWrite)
  }
  return result
}
export function clearAll(): void { clearStorage(storage()); notify(); emitCleared() }
export { storageKey }

/* ------------------------------------------------------------------ */
/* Synchronisation entre appareils (contrat : travail/sync-contrat.md §1) */
/* ------------------------------------------------------------------ */

export type { SyncEntry, SyncKeys } from './storage'

const localWriteListeners = new Set<(key: StoreKey) => void>()
const clearedListeners = new Set<() => void>()
function emitLocalWrite(key: StoreKey) { localWriteListeners.forEach((listener) => { try { listener(key) } catch { /* ignore */ } }) }
function emitCleared() { clearedListeners.forEach((listener) => { try { listener() } catch { /* ignore */ } }) }

/** Appelé après chaque écriture faite par l'utilisateur (pas après une écriture venue de la synchro). */
export function subscribeLocalWrites(listener: (key: StoreKey) => void): () => void {
  localWriteListeners.add(listener)
  return () => { localWriteListeners.delete(listener) }
}

/** Appelé après « Tout effacer » (la synchro de cet appareil est alors désactivée). */
export function subscribeCleared(listener: () => void): () => void {
  clearedListeners.add(listener)
  return () => { clearedListeners.delete(listener) }
}

/** Toutes les clés présentes en local, avec leur horodatage (0 = jamais horodatée). */
export function readSyncKeys(): SyncKeys { return readSyncKeysFrom(storage()) }

/** Écrit des entrées venues d'un autre appareil et rafraîchit les écrans concernés (sans déclencher d'envoi). */
export function applyRemoteKeys(keys: SyncKeys): StoreKey[] {
  const written = applySyncKeysTo(storage(), keys)
  written.forEach((key) => notify(key))
  return written
}

/** Horodate toutes les clés présentes (création d'un code : cet appareil fait référence). */
export function stampAllKeys(now: number = Date.now()): void {
  stampKeys(storage(), Object.keys(readSyncKeysFrom(storage())) as StoreKey[], now)
}

export function readInternal<T>(name: InternalName, fallback: T): T { return readInternalFrom(storage(), name, fallback) }
export function writeInternal(name: InternalName, value: unknown): void { writeInternalTo(storage(), name, value) }
