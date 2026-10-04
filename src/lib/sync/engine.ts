/** File sérialisée de synchronisation entre appareils. */
import { useSyncExternalStore } from 'react'
import { isSyncConfigured } from './config'
import { generateCode, normalizeCode } from './code'
import { SyncError, type SyncErrorKind, pullSave, pushSave, deleteSave } from './client'
import { buildPayload, mergeKeys, type SyncPayload } from './merge'
import { applyRemoteKeys, readInternal, readSyncKeys, stampAllKeys, subscribeCleared, subscribeLocalWrites, writeInternal, type StoreKey, type SyncKeys } from '../store'

export type SyncState =
  | { status: 'disabled' }
  | { status: 'synced'; lastSyncAt: number; code: string }
  | { status: 'pending'; lastSyncAt?: number; code: string; reason?: 'creating' | 'sending' }
  | { status: 'error'; lastSyncAt?: number; code: string; error: SyncErrorKind; message: string; reason?: 'creating' | 'sending' }
export type JoinResult = { ok: true } | { ok: false; reason: 'invalid-code' | 'unknown-code' | SyncErrorKind; message: string }
type PersistedSync = { code: string; lastSyncAt?: number }
type TimerHandle = ReturnType<typeof setTimeout>
export interface SyncEngineDependencies {
  configured: () => boolean
  client: { pullSave(code: string, opts?: { timeoutMs?: number }): Promise<SyncPayload | null>; pushSave(code: string, payload: SyncPayload, opts?: { keepalive?: boolean; timeoutMs?: number }): Promise<string>; deleteSave(code: string): Promise<void> }
  store: {
    readSyncKeys(): SyncKeys
    applyRemoteKeys(keys: SyncKeys): unknown
    stampAllKeys(now?: number): void
    subscribeLocalWrites(listener: (key: StoreKey) => void): () => void
    subscribeCleared(listener: () => void): () => void
    readInternal<T>(name: '__sync', fallback: T): T
    writeInternal(name: '__sync', value: unknown): void
  }
  clock: () => number
  timers: { setTimeout(callback: () => void, delay: number): TimerHandle; clearTimeout(handle: TimerHandle): void }
  target?: { addEventListener(type: string, listener: () => void): void; removeEventListener(type: string, listener: () => void): void; readonly visibilityState?: string }
  random?: (n: number) => Uint8Array
}
const RETRIES = [5_000, 15_000, 60_000, 120_000]
const unknownMessage = 'Code introuvable. Vérifie le code, ou attends que ton autre appareil affiche « Synchronisé ». '
const simpleMessage = (error: SyncErrorKind) => error === 'offline' ? 'Pas de connexion. Tes données restent sur cet appareil.' : error === 'timeout' ? 'Le serveur met trop de temps à répondre. Nouvel essai programmé.' : 'La synchronisation a échoué. Nouvel essai programmé.'
const asErrorKind = (error: unknown): SyncErrorKind => error instanceof SyncError ? error.kind : error instanceof TypeError ? 'offline' : 'server'

export function createSyncEngine(deps: SyncEngineDependencies) {
  let state: SyncState = { status: 'disabled' }
  const listeners = new Set<() => void>()
  let started = false
  let stopped = false
  let queue: Promise<unknown> = Promise.resolve()
  let debounce: TimerHandle | undefined
  let retryTimer: TimerHandle | undefined
  let retryIndex = 0
  let dirty = false
  let writeSeq = 0
  let generation = 0
  let cleanups: Array<() => void> = []
  const emit = (next: SyncState) => { state = next; listeners.forEach(listener => listener()) }
  const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener) } }
  const snapshot = () => state
  const persisted = (): PersistedSync | null => {
    const raw = deps.store.readInternal<unknown>('__sync', null)
    if (!raw || typeof raw !== 'object' || typeof (raw as PersistedSync).code !== 'string') return null
    const code = normalizeCode((raw as PersistedSync).code)
    if (!code) return null
    const last = (raw as PersistedSync).lastSyncAt
    return { code, ...(typeof last === 'number' && Number.isFinite(last) ? { lastSyncAt: last } : {}) }
  }
  const getCode = () => deps.configured() ? persisted()?.code ?? null : null
  const lastSyncAt = () => persisted()?.lastSyncAt
  const clearTimers = () => {
    if (debounce !== undefined) deps.timers.clearTimeout(debounce)
    if (retryTimer !== undefined) deps.timers.clearTimeout(retryTimer)
    debounce = undefined; retryTimer = undefined
  }
  const enqueue = <T,>(job: () => Promise<T>): Promise<T> => {
    const result = queue.then(job, job)
    queue = result.then(() => undefined, () => undefined)
    return result
  }
  const scheduleRetry = (code: string, error: unknown, gen = generation, reason?: 'creating' | 'sending') => {
    if (gen !== generation || persisted()?.code !== code) return
    const kind = asErrorKind(error)
    if (kind === 'not-configured') { emit({ status: 'disabled' }); return }
    const previous = lastSyncAt()
    emit({ status: 'error', code, ...(previous !== undefined ? { lastSyncAt: previous } : {}), error: kind, message: simpleMessage(kind), ...(reason ? { reason } : {}) })
    if (retryTimer !== undefined) deps.timers.clearTimeout(retryTimer)
    const wait = RETRIES[Math.min(retryIndex, RETRIES.length - 1)]
    retryIndex++
    retryTimer = deps.timers.setTimeout(() => { retryTimer = undefined; if (gen === generation && persisted()?.code === code) void runCycle().catch(() => {}); else if (!persisted()) emit({ status: 'disabled' }) }, wait)
  }
  const markSynced = (code: string, seqAtSnapshot: number, at = deps.clock()) => {
    writeInternalState({ code, lastSyncAt: at })
    dirty = writeSeq !== seqAtSnapshot; retryIndex = 0
    if (retryTimer !== undefined) deps.timers.clearTimeout(retryTimer)
    retryTimer = undefined
    emit({ status: 'synced', code, lastSyncAt: at })
  }
  const writeInternalState = (value: PersistedSync) => deps.store.writeInternal('__sync', value)
  const runCycle = (timeoutMs?: number, reason?: 'creating' | 'sending'): Promise<void> => enqueue(async () => {
    const gen = generation
    const record = persisted()
    if (!record) { emit({ status: 'disabled' }); return }
    if (!deps.configured()) { emit({ status: 'disabled' }); return }
    const valid = () => gen === generation && persisted()?.code === record.code
    emit({ status: 'pending', code: record.code, ...(record.lastSyncAt !== undefined ? { lastSyncAt: record.lastSyncAt } : {}), ...(reason ? { reason } : {}) })
    try {
      const remotePayload = await deps.client.pullSave(record.code, timeoutMs ? { timeoutMs } : undefined)
      if (!valid()) return
      const local = deps.store.readSyncKeys()
      const seqAtSnapshot = writeSeq
      const remote = remotePayload?.keys ?? {}
      const result = mergeKeys(local, remote)
      deps.store.applyRemoteKeys(result.applyLocally)
      if (remotePayload === null || Object.keys(remotePayload.keys).length === 0 || result.localHasNewer) {
        await deps.client.pushSave(record.code, buildPayload(result.merged), timeoutMs ? { timeoutMs } : undefined)
        if (!valid()) return
      }
      if (!valid()) return
      markSynced(record.code, seqAtSnapshot)
    } catch (error) { if (valid()) scheduleRetry(record.code, error, gen, reason) }
  })
  const directPush = (keepalive: boolean): Promise<void> => {
    if (keepalive) return pushDirect(keepalive)
    return enqueue(() => pushDirect(keepalive))
  }
  const pushDirect = async (keepalive: boolean) => {
    if (keepalive && !dirty) return
    const gen = generation
    const record = persisted()
    if (!record) { emit({ status: 'disabled' }); return }
    if (!deps.configured()) { emit({ status: 'disabled' }); return }
    const local = deps.store.readSyncKeys()
    const seqAtSnapshot = writeSeq
    const valid = () => gen === generation && persisted()?.code === record.code
    emit({ status: 'pending', code: record.code, ...(record.lastSyncAt !== undefined ? { lastSyncAt: record.lastSyncAt } : {}) })
    try { await deps.client.pushSave(record.code, buildPayload(local), { keepalive }); if (!valid()) return; markSynced(record.code, seqAtSnapshot) }
    catch (error) { if (valid()) scheduleRetry(record.code, error, gen) }
  }
  const localWrite = () => {
    if (!persisted() || !deps.configured()) return
    dirty = true
    writeSeq++
    const record = persisted()!
    emit({ status: 'pending', code: record.code, ...(record.lastSyncAt !== undefined ? { lastSyncAt: record.lastSyncAt } : {}) })
    if (debounce !== undefined) deps.timers.clearTimeout(debounce)
    debounce = deps.timers.setTimeout(() => { debounce = undefined; void runCycle().catch(() => {}) }, 2_000)
  }
  const clearDetected = () => { generation++; clearTimers(); dirty = false; deps.store.writeInternal('__sync', null); emit({ status: 'disabled' }) }
  const onVisibility = () => {
    if (deps.target?.visibilityState === 'hidden') { if (dirty) void directPush(true).catch(() => {}) }
    else if (deps.target?.visibilityState === 'visible') void runCycle().catch(() => {})
  }
  const onPageHide = () => { if (dirty) void directPush(true).catch(() => {}) }
  const onOnline = () => { void runCycle().catch(() => {}) }
  const start = (): (() => void) => {
    if (started) return stop
    started = true; stopped = false
    if (!deps.configured()) { emit({ status: 'disabled' }); return stop }
    const record = persisted()
    if (record) emit({ status: 'pending', code: record.code, ...(record.lastSyncAt !== undefined ? { lastSyncAt: record.lastSyncAt } : {}) })
    cleanups.push(deps.store.subscribeLocalWrites(localWrite), deps.store.subscribeCleared(clearDetected))
    if (deps.target) {
      deps.target.addEventListener('visibilitychange', onVisibility); deps.target.addEventListener('pagehide', onPageHide); deps.target.addEventListener('online', onOnline)
      cleanups.push(() => { deps.target?.removeEventListener('visibilitychange', onVisibility); deps.target?.removeEventListener('pagehide', onPageHide); deps.target?.removeEventListener('online', onOnline) })
    }
    if (record) void runCycle().catch(() => {})
    return stop
  }
  const stop = () => {
    if (!started || stopped) return
    stopped = true; started = false; clearTimers(); cleanups.forEach(cleanup => cleanup()); cleanups = []
  }
  const enable = async (): Promise<{ code: string }> => {
    if (!deps.configured()) throw new SyncError('not-configured', 'La synchronisation n’est pas encore disponible.')
    const code = generateCode(deps.random)
    deps.store.stampAllKeys(deps.clock())
    generation++
    writeInternalState({ code })
    dirty = true
    writeSeq++
    emit({ status: 'pending', code, reason: 'creating' })
    await runCycle(60_000, 'creating')
    return { code }
  }
  const join = async (input: string): Promise<JoinResult> => {
    if (!deps.configured()) return { ok: false, reason: 'not-configured', message: 'La synchronisation n’est pas encore disponible.' }
    const code = normalizeCode(input)
    if (!code) return { ok: false, reason: 'invalid-code', message: 'Le code doit contenir 16 caractères valides.' }
    return enqueue(async () => {
      const gen = generation
      try {
        const payload = await deps.client.pullSave(code, { timeoutMs: 60_000 })
        if (gen !== generation) return { ok: false, reason: 'server', message: 'La synchronisation a été interrompue.' }
        if (!payload) return { ok: false, reason: 'unknown-code', message: unknownMessage.trim() }
        const local = deps.store.readSyncKeys()
        const result = mergeKeys(local, payload.keys)
        deps.store.applyRemoteKeys(result.applyLocally)
        generation++
        writeInternalState({ code })
        dirty = false
        const joinGeneration = generation
        const seqAtSnapshot = writeSeq
        if (result.localHasNewer) {
          try { await deps.client.pushSave(code, buildPayload(result.merged), { timeoutMs: 60_000 }) }
          catch (error) { scheduleRetry(code, error, joinGeneration); return { ok: true } }
          if (joinGeneration !== generation || persisted()?.code !== code) return { ok: true }
        }
        if (joinGeneration === generation && persisted()?.code === code) markSynced(code, seqAtSnapshot)
        return { ok: true }
      } catch (error) {
        const kind = asErrorKind(error)
        return { ok: false, reason: kind, message: simpleMessage(kind) }
      }
    })
  }
  const disable = () => { generation++; clearTimers(); dirty = false; deps.store.writeInternal('__sync', null); emit({ status: 'disabled' }) }
  const deleteOnline = async (): Promise<{ ok: boolean; message?: string }> => {
    const code = getCode()
    if (!code) return { ok: false, message: 'Aucun code de synchronisation actif.' }
    try { await enqueue(() => deps.client.deleteSave(code)); disable(); return { ok: true } }
    catch (error) { return { ok: false, message: simpleMessage(asErrorKind(error)) } }
  }
  const syncNow = async () => { await runCycle() }
  const useStatus = () => useSyncExternalStore(subscribe, snapshot, snapshot)
  return { start, enable, join, disable, deleteOnline, syncNow, getCode, useStatus, subscribe, snapshot }
}

const browserTarget = typeof window !== 'undefined' && typeof document !== 'undefined' ? {
  get visibilityState() { return document.visibilityState },
  addEventListener: window.addEventListener.bind(window),
  removeEventListener: window.removeEventListener.bind(window),
} : undefined
const engine = createSyncEngine({
  configured: isSyncConfigured,
  client: { pullSave, pushSave, deleteSave },
  store: { readSyncKeys, applyRemoteKeys, stampAllKeys, subscribeLocalWrites, subscribeCleared, readInternal, writeInternal },
  clock: Date.now,
  // Fonctions enveloppées : appelées comme méthodes de cet objet, les fonctions natives du
  // navigateur lèvent « Illegal invocation » (this ≠ window).
  timers: { setTimeout: (callback, delay) => setTimeout(callback, delay), clearTimeout: (handle) => clearTimeout(handle) },
  target: browserTarget,
})

export const startSyncEngine = () => engine.start()
export const enableNewSync = () => engine.enable()
export const joinSync = (input: string): Promise<JoinResult> => engine.join(input)
export const disableSync = () => engine.disable()
export const deleteOnlineSave = () => engine.deleteOnline()
export const syncNow = () => engine.syncNow()
export const getSyncCode = () => engine.getCode()
export function useSyncStatus(): SyncState & { code?: string } { return engine.useStatus() }
