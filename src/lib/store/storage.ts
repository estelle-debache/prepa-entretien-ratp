export const STORAGE_PREFIX = 'prepa-ratp:v1:'
export const STORE_KEYS = ['profil', 'statutQuestions', 'plan', 'parcours', 'unefois', 'checklist', 'reglages', 'quiz', 'situations', 'simulations', 'entrainement', 'ami'] as const
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

/* ------------------------------------------------------------------ */
/* Clés internes (jamais exportées dans la sauvegarde copier-coller)     */
/* ------------------------------------------------------------------ */

/** Préfixe des clés internes : `prepa-ratp:v1:__meta`, `prepa-ratp:v1:__sync`. */
export const INTERNAL_PREFIX = `${STORAGE_PREFIX}__`
export const META_KEY = `${INTERNAL_PREFIX}meta`
export type InternalName = '__sync'
export function internalKey(name: InternalName): string { return `${STORAGE_PREFIX}${name}` }

/** Entrée synchronisable : valeur + horodatage de la dernière écriture (ms). */
export interface SyncEntry { value: unknown; updatedAt: number }
export type SyncKeys = Partial<Record<StoreKey, SyncEntry>>

export function isStoreKey(key: string): key is StoreKey {
  return (STORE_KEYS as readonly string[]).includes(key)
}

/** Horodatages par clé (`__meta`). Valeurs invalides ignorées. */
export function readMeta(storage: StorageLike | undefined): Partial<Record<StoreKey, number>> {
  try {
    const raw = storage?.getItem(META_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const meta: Partial<Record<StoreKey, number>> = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (isStoreKey(key) && typeof value === 'number' && Number.isFinite(value) && value >= 0) meta[key] = value
    }
    return meta
  } catch { return {} }
}

export function writeMeta(storage: StorageLike | undefined, meta: Partial<Record<StoreKey, number>>): boolean {
  try { storage?.setItem(META_KEY, JSON.stringify(meta)); return Boolean(storage) } catch { return false }
}

/** Horodate des clés (par défaut : maintenant). */
export function stampKeys(storage: StorageLike | undefined, keys: readonly StoreKey[], now: number = Date.now()): void {
  if (!storage || keys.length === 0) return
  const meta = readMeta(storage)
  for (const key of keys) meta[key] = now
  writeMeta(storage, meta)
}

/** Toutes les clés applicatives présentes, avec leur horodatage (0 si jamais horodatée). */
export function readSyncKeysFrom(storage: StorageLike | undefined): SyncKeys {
  const result: SyncKeys = {}
  if (!storage) return result
  const meta = readMeta(storage)
  for (const key of STORE_KEYS) {
    try {
      const raw = storage.getItem(storageKey(key))
      if (raw === null) continue
      result[key] = { value: JSON.parse(raw) as unknown, updatedAt: meta[key] ?? 0 }
    } catch { /* valeur illisible : ignorée */ }
  }
  return result
}

/** Écrit des entrées venues d'un autre appareil (valeur + horodatage d'origine). Renvoie les clés écrites. */
export function applySyncKeysTo(storage: StorageLike | undefined, keys: SyncKeys): StoreKey[] {
  if (!storage) return []
  const meta = readMeta(storage)
  const written: StoreKey[] = []
  for (const [key, entry] of Object.entries(keys)) {
    if (!isStoreKey(key) || !entry || typeof entry !== 'object') continue
    if (typeof entry.updatedAt !== 'number' || !Number.isFinite(entry.updatedAt) || entry.value === undefined) continue
    try {
      storage.setItem(storageKey(key), JSON.stringify(entry.value))
      meta[key] = entry.updatedAt
      written.push(key)
    } catch { /* quota : on garde le local */ }
  }
  if (written.length) writeMeta(storage, meta)
  return written
}

export function readInternalFrom<T>(storage: StorageLike | undefined, name: InternalName, fallback: T): T {
  try {
    const raw = storage?.getItem(internalKey(name))
    return raw === null || raw === undefined ? fallback : JSON.parse(raw) as T
  } catch { return fallback }
}

export function writeInternalTo(storage: StorageLike | undefined, name: InternalName, value: unknown): void {
  try {
    if (value === null || value === undefined) storage?.removeItem(internalKey(name))
    else storage?.setItem(internalKey(name), JSON.stringify(value))
  } catch { /* best effort */ }
}

export function exportStorage(storage: StorageLike | undefined): string {
  const values: Record<string, unknown> = {}
  try {
    if (storage) for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key?.startsWith(STORAGE_PREFIX) && !key.startsWith(INTERNAL_PREFIX)) {
        const raw = storage.getItem(key)
        if (raw !== null) { try { values[key] = JSON.parse(raw) } catch { /* ignore invalid saved value */ } }
      }
    }
  } catch { /* inaccessible storage exports an empty backup */ }
  return JSON.stringify(values)
}

export function importStorage(storage: StorageLike | undefined, json: string): { ok: boolean; error?: string; imported?: StoreKey[] } {
  let parsed: unknown
  try { parsed = JSON.parse(json) } catch { return { ok: false, error: 'Fichier JSON invalide.' } }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { ok: false, error: 'Format de sauvegarde invalide.' }
  if (!storage) return { ok: false, error: 'Le stockage local est indisponible.' }
  const imported: StoreKey[] = []
  try {
    for (const [key, value] of Object.entries(parsed)) {
      if (!key.startsWith(STORAGE_PREFIX)) continue
      const name = key.slice(STORAGE_PREFIX.length)
      if (!isStoreKey(name)) continue
      storage.setItem(key, JSON.stringify(value))
      imported.push(name)
    }
    return { ok: true, imported }
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
