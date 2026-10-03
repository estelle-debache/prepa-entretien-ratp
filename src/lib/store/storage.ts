export const STORAGE_PREFIX = 'prepa-ratp:v1:'
export const STORE_KEYS = ['profil', 'statutQuestions', 'plan', 'checklist', 'reglages', 'quiz', 'situations', 'simulations', 'entrainement', 'ami'] as const
export type StoreKey = typeof STORE_KEYS[number]

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
  key(index: number): string | null
  readonly length: number
}

export type QuestionStatus = 'maitrise' | 'a-revoir'
export interface Reglages { interviewDate: string; tts: boolean }

export function storageKey(key: StoreKey): string { return `${STORAGE_PREFIX}${key}` }

export function readValue<T>(storage: StorageLike | undefined, key: StoreKey, fallback: T): T {
  try {
    const value = storage?.getItem(storageKey(key))
    return value === null || value === undefined ? fallback : JSON.parse(value) as T
  } catch { return fallback }
}

export function writeValue<T>(storage: StorageLike | undefined, key: StoreKey, value: T): boolean {
  try { storage?.setItem(storageKey(key), JSON.stringify(value)); return Boolean(storage) }
  catch { return false }
}

export function exportStorage(storage: StorageLike | undefined): string {
  const values: Record<string, unknown> = {}
  try {
    if (storage) for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key?.startsWith(STORAGE_PREFIX)) {
        const raw = storage.getItem(key)
        if (raw !== null) { try { values[key] = JSON.parse(raw) } catch { /* ignore invalid saved value */ } }
      }
    }
  } catch { /* inaccessible storage exports an empty backup */ }
  return JSON.stringify(values)
}

export function importStorage(storage: StorageLike | undefined, json: string): { ok: boolean; error?: string } {
  let parsed: unknown
  try { parsed = JSON.parse(json) } catch { return { ok: false, error: 'Fichier JSON invalide.' } }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { ok: false, error: 'Format de sauvegarde invalide.' }
  if (!storage) return { ok: false, error: 'Le stockage local est indisponible.' }
  try {
    for (const [key, value] of Object.entries(parsed)) {
      if (!key.startsWith(STORAGE_PREFIX)) continue
      if (!(STORE_KEYS as readonly string[]).some((known) => key === storageKey(known as StoreKey))) continue
      storage.setItem(key, JSON.stringify(value))
    }
    return { ok: true }
  } catch { return { ok: false, error: 'Impossible d’enregistrer la sauvegarde.' } }
}

export function clearStorage(storage: StorageLike | undefined): void {
  if (!storage) return
  try {
    for (let i = storage.length - 1; i >= 0; i--) {
      const key = storage.key(i)
      if (key?.startsWith(STORAGE_PREFIX)) storage.removeItem(key)
    }
  } catch { /* best effort */ }
}
