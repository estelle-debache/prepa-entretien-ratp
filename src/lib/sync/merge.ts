/** Sérialisation et fusion horodatée des données synchronisées. */
import { STORE_KEYS } from '../store/storage'
import type { SyncKeys, StoreKey } from '../store'
export interface SyncPayload { schema: 1; keys: SyncKeys }
export interface MergeResult { merged: SyncKeys; applyLocally: SyncKeys; localHasNewer: boolean }

export function buildPayload(keys: SyncKeys): SyncPayload { return { schema: 1, keys } }

export function parsePayload(raw: unknown): SyncPayload | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const value = raw as Record<string, unknown>
  if (value.schema !== 1 || !value.keys || typeof value.keys !== 'object' || Array.isArray(value.keys)) return null
  const keys: SyncKeys = {}
  const allowed = new Set<string>(STORE_KEYS)
  for (const [name, entry] of Object.entries(value.keys as Record<string, unknown>)) {
    if (!allowed.has(name) || !entry || typeof entry !== 'object' || Array.isArray(entry)) continue
    const item = entry as Record<string, unknown>
    if (typeof item.updatedAt !== 'number' || !Number.isFinite(item.updatedAt) || !Object.prototype.hasOwnProperty.call(item, 'value') || item.value === undefined) continue
    keys[name as StoreKey] = { value: item.value, updatedAt: item.updatedAt }
  }
  return { schema: 1, keys }
}

export function mergeKeys(local: SyncKeys, remote: SyncKeys): MergeResult {
  const merged: SyncKeys = {}
  const applyLocally: SyncKeys = {}
  let localHasNewer = false
  for (const key of STORE_KEYS) {
    const left = local[key]
    const right = remote[key]
    if (left && right) {
      if (right.updatedAt > left.updatedAt) { merged[key] = right; applyLocally[key] = right }
      else {
        merged[key] = left
        if (left.updatedAt > right.updatedAt) localHasNewer = true
      }
    } else if (left) { merged[key] = left; localHasNewer = true }
    else if (right) { merged[key] = right; applyLocally[key] = right }
  }
  return { merged, applyLocally, localHasNewer }
}
