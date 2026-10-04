import { afterEach, describe, expect, it, vi } from 'vitest'
const cfg = vi.hoisted(() => ({ url: 'https://unit.test', key: 'sb_publishable_example', configured: true }))
vi.mock('./config', () => ({ get SUPABASE_URL() { return cfg.url }, get SUPABASE_PUBLIC_KEY() { return cfg.key }, isSyncConfigured: () => cfg.configured }))
import { deleteSave, pullSave, pushSave, setFetchForTests, SyncError } from './client'
import type { SyncPayload } from './merge'

const payload: SyncPayload = { schema: 1, keys: {} }
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } })
afterEach(() => { setFetchForTests(undefined); vi.useRealTimers(); cfg.key = 'sb_publishable_example'; cfg.configured = true })

describe('client Supabase', () => {
  it('envoie la clé publishable en apikey seulement et le JWT également en Bearer', async () => {
    let init: RequestInit | undefined
    setFetchForTests(async (_input, options) => { init = options; return json(null) })
    await pullSave('ABCDEFGHJKMNPQRS')
    expect(new Headers(init?.headers).get('apikey')).toBe(cfg.key)
    expect(new Headers(init?.headers).get('authorization')).toBeNull()
    cfg.key = `eyJ${'x'.repeat(30)}`
    await pullSave('ABCDEFGHJKMNPQRS')
    expect(new Headers(init?.headers).get('authorization')).toBe(`Bearer ${cfg.key}`)
  })
  it('mappe les erreurs PostgREST de validation, autorisation et serveur', async () => {
    for (const [message, kind] of [['code_trop_court', 'invalid-code'], ['donnees_trop_volumineuses', 'too-large'], ['trop_de_sauvegardes', 'server']]) {
      setFetchForTests(async () => json({ message }, 400))
      await expect(pushSave('ABCDEFGHJKMNPQRS', payload)).rejects.toMatchObject({ kind })
    }
    for (const status of [401, 500]) {
      setFetchForTests(async () => json({ message: 'failure' }, status))
      await expect(pullSave('ABCDEFGHJKMNPQRS')).rejects.toMatchObject({ kind: 'server' })
    }
  })
  it('distingue réseau et délai dépassé', async () => {
    setFetchForTests(async () => { throw new TypeError('network') })
    await expect(pullSave('ABCDEFGHJKMNPQRS')).rejects.toMatchObject({ kind: 'offline' })
    vi.useFakeTimers()
    setFetchForTests((_input, init) => new Promise((_resolve, reject) => init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))))
    const pending = pullSave('ABCDEFGHJKMNPQRS', { timeoutMs: 2 })
    const rejection = expect(pending).rejects.toMatchObject({ kind: 'timeout' })
    await vi.advanceTimersByTimeAsync(2)
    await rejection
  })
  it('active keepalive seulement pour un corps de moins de 60 000 octets et ne parse pas delete', async () => {
    const observed: RequestInit[] = []
    setFetchForTests(async (_input, init) => { observed.push(init ?? {}); return json('2026-10-04T12:00:00Z') })
    await pushSave('ABCDEFGHJKMNPQRS', payload, { keepalive: true })
    const large: SyncPayload = { schema: 1, keys: { profil: { value: 'x'.repeat(61_000), updatedAt: 1 } } }
    await pushSave('ABCDEFGHJKMNPQRS', large, { keepalive: true })
    expect(observed[0].keepalive).toBe(true)
    expect(observed[1].keepalive).toBeUndefined()
    setFetchForTests(async () => new Response(null, { status: 204 }))
    await expect(deleteSave('ABCDEFGHJKMNPQRS')).resolves.toBeUndefined()
  })
  it('rejette clairement une configuration absente', async () => {
    cfg.configured = false
    await expect(pullSave('ABCDEFGHJKMNPQRS')).rejects.toBeInstanceOf(SyncError)
  })
})
