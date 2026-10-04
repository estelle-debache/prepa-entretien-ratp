import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSyncEngine, type SyncEngineDependencies } from './engine'
import type { SyncKeys } from '../store'
import type { SyncPayload } from './merge'

const validCode = 'ABCDEFGHJKMNPQRS'
function fixture() {
  vi.useFakeTimers()
  const local: SyncKeys = {}
  let internal: unknown = null
  let localListener: ((key: 'profil') => void) | undefined
  let clearedListener: (() => void) | undefined
  const applied: SyncKeys[] = []
  const targetListeners = new Map<string, () => void>()
  const target = {
    addEventListener: (type: string, fn: () => void) => { targetListeners.set(type, fn) },
    removeEventListener: (type: string) => { targetListeners.delete(type) },
    visibilityState: 'visible' as string,
    setVisibility(value: string) { target.visibilityState = value },
  }
  const pull = vi.fn(async () => null as SyncPayload | null)
  const push = vi.fn(async () => new Date(1000).toISOString())
  const remove = vi.fn(async () => {})
  const deps: SyncEngineDependencies = {
    configured: () => true,
    client: { pullSave: pull, pushSave: push, deleteSave: remove },
    store: {
      readSyncKeys: () => structuredClone(local),
      applyRemoteKeys: keys => { applied.push(structuredClone(keys)); Object.assign(local, keys) },
      stampAllKeys: now => { for (const entry of Object.values(local)) if (entry) entry.updatedAt = now ?? 100 },
      subscribeLocalWrites: listener => { localListener = listener; return () => { localListener = undefined } },
      subscribeCleared: listener => { clearedListener = listener; return () => { clearedListener = undefined } },
      readInternal: <T>(_name: '__sync', fallback: T) => (internal ?? fallback) as T,
      writeInternal: (_name, value) => { internal = value },
    },
    clock: () => 50_000,
    timers: { setTimeout: (fn, ms) => setTimeout(fn, ms), clearTimeout: handle => clearTimeout(handle) },
    target,
    random: n => Uint8Array.from({ length: n }, (_, index) => index % 31),
  }
  return { engine: createSyncEngine(deps), local, applied, pull, push, remove, target, targetListeners, emitLocal: () => localListener?.('profil'), clear: () => clearedListener?.(), getInternal: () => internal }
}
afterEach(() => vi.useRealTimers())

describe('moteur de synchronisation', () => {
  it('active un nouveau code et envoie le snapshot', async () => {
    const f = fixture(); f.local.profil = { value: { prenom: 'A' }, updatedAt: 1 }
    const result = await f.engine.enable()
    expect(result.code).toHaveLength(16)
    expect(f.getInternal()).toMatchObject({ code: result.code })
    expect(f.pull).toHaveBeenCalledOnce()
    expect(f.push).toHaveBeenCalledOnce()
    expect(f.engine.snapshot().status).toBe('synced')
  })
  it('refuse un code inconnu sans activer la synchro ; rejoint et pousse les données locales plus récentes', async () => {
    const f = fixture()
    expect(await f.engine.join(validCode)).toMatchObject({ ok: false, reason: 'unknown-code' })
    expect(f.getInternal()).toBeNull()
    f.local.profil = { value: 'local', updatedAt: 10 }
    f.pull.mockResolvedValue({ schema: 1, keys: { profil: { value: 'remote', updatedAt: 2 } } })
    expect(await f.engine.join(validCode)).toEqual({ ok: true })
    expect(f.getInternal()).toMatchObject({ code: validCode })
    expect(f.push).toHaveBeenCalledOnce()
  })
  it('regroupe les écritures locales avec un debounce de deux secondes', async () => {
    const f = fixture(); f.engine.start(); await f.engine.enable(); f.pull.mockClear(); f.push.mockClear()
    f.emitLocal(); vi.advanceTimersByTime(1_000); f.emitLocal()
    await vi.advanceTimersByTimeAsync(1_999)
    expect(f.pull).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(f.pull).toHaveBeenCalledOnce()
  })
  it('signale une erreur réseau puis réussit au nouvel essai', async () => {
    const f = fixture(); await f.engine.enable(); f.pull.mockReset().mockRejectedValueOnce(new TypeError('offline')).mockResolvedValue(null)
    await f.engine.syncNow()
    expect(f.engine.snapshot()).toMatchObject({ status: 'error', error: 'offline' })
    await vi.advanceTimersByTimeAsync(5_000)
    expect(f.engine.snapshot().status).toBe('synced')
  })
  it('pousse en keepalive en arrière-plan, désactive au clear et ne boucle pas sur les données reçues', async () => {
    const f = fixture(); f.engine.start(); await f.engine.enable(); f.push.mockClear()
    f.local.profil = { value: 'old', updatedAt: 1 }
    f.emitLocal(); f.target?.setVisibility('hidden'); f.targetListeners.get('visibilitychange')?.()
    await vi.advanceTimersByTimeAsync(0)
    expect(f.push).toHaveBeenCalledWith(validCode, expect.anything(), { keepalive: true })
    f.push.mockClear()
    f.pull.mockResolvedValue({ schema: 1, keys: { profil: { value: 'new', updatedAt: 99_999 } } })
    await f.engine.syncNow()
    expect(f.applied.at(-1)).toEqual({ profil: { value: 'new', updatedAt: 99_999 } })
    expect(f.push).not.toHaveBeenCalled()
    f.clear()
    expect(f.engine.snapshot()).toEqual({ status: 'disabled' })
    expect(f.getInternal()).toBeNull()
  })
  it.each(['disable', 'clear'] as const)('abandonne le pull en vol après %s sans restaurer les données', async action => {
    const f = fixture(); f.engine.start(); await f.engine.enable(); f.applied.length = 0
    let resolvePull!: (payload: SyncPayload | null) => void
    f.pull.mockImplementationOnce(() => new Promise(resolve => { resolvePull = resolve }))
    const cycle = f.engine.syncNow()
    await Promise.resolve(); await Promise.resolve()
    if (action === 'disable') f.engine.disable()
    else f.clear()
    resolvePull({ schema: 1, keys: { profil: { value: 'restored', updatedAt: 99 } } })
    await cycle
    expect(f.applied).toEqual([])
    expect(f.getInternal()).toBeNull()
    expect(f.engine.snapshot()).toEqual({ status: 'disabled' })
  })
  it('n’essaie pas à nouveau après désactivation pendant une erreur réseau', async () => {
    const f = fixture(); await f.engine.enable(); f.pull.mockClear()
    let rejectPull!: (error: Error) => void
    f.pull.mockImplementationOnce(() => new Promise((_resolve, reject) => { rejectPull = reject }))
    const cycle = f.engine.syncNow()
    await Promise.resolve(); await Promise.resolve()
    f.engine.disable()
    rejectPull(new TypeError('offline'))
    await cycle
    await vi.advanceTimersByTimeAsync(10_000)
    expect(f.pull).toHaveBeenCalledTimes(1)
    expect(f.engine.snapshot()).toEqual({ status: 'disabled' })
  })
})
