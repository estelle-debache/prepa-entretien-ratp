import { useCallback, useRef, useSyncExternalStore } from 'react'
import { DEFAULT_INTERVIEW_DATE, type Profile } from '../../content/types'
import { clearStorage, exportStorage, importStorage, readValue, storageKey, writeValue, type Reglages, type StoreKey, type StorageLike } from './storage'
export type { QuestionStatus, Reglages, StoreKey } from './storage'
export { STORAGE_PREFIX } from './storage'

const defaults: Partial<Record<StoreKey, unknown>> = {
  profil: { prenom: 'Yahia' } satisfies Profile,
  statutQuestions: {}, plan: {}, checklist: {},
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
    writeValue(storage(), key, resolved); notify(key)
  }, [key])
  return [value, setValue]
}

export function exportAll(): string { return exportStorage(storage()) }
export function importAll(json: string): { ok: boolean; error?: string } {
  const result = importStorage(storage(), json)
  if (result.ok) notify()
  return result
}
export function clearAll(): void { clearStorage(storage()); notify() }
export { storageKey }
