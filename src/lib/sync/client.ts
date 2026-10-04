/** Appels REST Supabase sans dépendance runtime. */
import { isSyncConfigured, SUPABASE_PUBLIC_KEY, SUPABASE_URL } from './config'
import { parsePayload, type SyncPayload } from './merge'
export type SyncErrorKind = 'not-configured' | 'offline' | 'timeout' | 'invalid-code' | 'too-large' | 'server'
export class SyncError extends Error {
  kind: SyncErrorKind
  constructor(kind: SyncErrorKind, message: string) { super(message); this.kind = kind; this.name = 'SyncError' }
}
type FetchLike = typeof fetch
let injectedFetch: FetchLike | undefined
export function setFetchForTests(value?: FetchLike): void { injectedFetch = value }

function fetcher(): FetchLike {
  const value = injectedFetch ?? globalThis.fetch
  if (!value) throw new SyncError('offline', 'Connexion indisponible.')
  return value
}
function errorMessage(kind: SyncErrorKind): string {
  switch (kind) {
    case 'not-configured': return 'La synchronisation n’est pas encore disponible.'
    case 'offline': return 'Connexion indisponible. Tes données restent sur cet appareil.'
    case 'timeout': return 'Le serveur met trop de temps à répondre. Réessaie dans un instant.'
    case 'invalid-code': return 'Ce code est invalide.'
    case 'too-large': return 'Les données à synchroniser sont trop volumineuses.'
    default: return 'La synchronisation a échoué. Réessaie dans un instant.'
  }
}
function makeError(kind: SyncErrorKind): SyncError { return new SyncError(kind, errorMessage(kind)) }
function configured(): void { if (!isSyncConfigured()) throw makeError('not-configured') }
function headers(): Record<string, string> {
  return { apikey: SUPABASE_PUBLIC_KEY, 'Content-Type': 'application/json', ...(SUPABASE_PUBLIC_KEY.startsWith('eyJ') ? { Authorization: `Bearer ${SUPABASE_PUBLIC_KEY}` } : {}) }
}
async function request(rpc: string, body: unknown, options: { timeoutMs?: number; keepalive?: boolean } = {}): Promise<Response> {
  configured()
  const serialized = JSON.stringify(body)
  const bytes = new TextEncoder().encode(serialized).byteLength
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 35_000)
  try {
    const response = await fetcher()(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/rpc/${rpc}`, {
      method: 'POST', headers: headers(), body: serialized,
      ...(options.keepalive && bytes < 60_000 ? { keepalive: true } : {}), signal: controller.signal,
    })
    if (!response.ok) {
      let serverMessage = ''
      try { const data = await response.clone().json() as { message?: unknown }; if (typeof data?.message === 'string') serverMessage = data.message } catch { /* non JSON response */ }
      let kind: SyncErrorKind = 'server'
      if (response.status === 400) {
        if (serverMessage === 'code_trop_court') kind = 'invalid-code'
        else if (serverMessage === 'donnees_trop_volumineuses') kind = 'too-large'
      }
      throw makeError(kind)
    }
    return response
  } catch (error) {
    if (error instanceof SyncError) throw error
    if ((error as { name?: string } | null)?.name === 'AbortError') throw makeError('timeout')
    if (typeof navigator !== 'undefined' && navigator.onLine === false || error instanceof TypeError) throw makeError('offline')
    throw makeError('server')
  } finally { clearTimeout(timeout) }
}

export async function pullSave(code: string, opts?: { timeoutMs?: number }): Promise<SyncPayload | null> {
  const response = await request('pull_save', { p_code: code }, opts)
  let raw: unknown
  try { raw = await response.json() } catch { throw makeError('server') }
  if (raw === null) return null
  const parsed = parsePayload(raw)
  if (!parsed) throw makeError('server')
  return parsed
}
export async function pushSave(code: string, payload: SyncPayload, opts?: { keepalive?: boolean; timeoutMs?: number }): Promise<string> {
  const response = await request('push_save', { p_code: code, p_data: payload }, opts)
  let raw: unknown
  try { raw = await response.json() } catch { throw makeError('server') }
  if (typeof raw !== 'string' || !Number.isFinite(Date.parse(raw))) throw makeError('server')
  return new Date(raw).toISOString()
}
export async function deleteSave(code: string): Promise<void> { await request('delete_save', { p_code: code }) }
