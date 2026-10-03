import { useCallback, useEffect, useRef, useState } from 'react'

export type RecorderState = 'idle' | 'requesting' | 'recording' | 'stopped' | 'error'
export interface RecorderResult {
  state: RecorderState; start(): Promise<void>; stop(): void; reset(): void
  audioUrl: string | null; durationMs: number; error: string | null
}
const FALLBACK_ERROR = "Autorise le micro dans les réglages de Safari, ou enregistre-toi avec l'app Dictaphone."

function hasSecureContext(): boolean {
  return typeof window !== 'undefined' && (window.isSecureContext || ['localhost', '127.0.0.1'].includes(window.location.hostname))
}
export function isRecordingSupported(): boolean {
  return hasSecureContext() && typeof MediaRecorder !== 'undefined' && typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
}

export function pickMimeType(): string {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') return ''
  for (const type of ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm']) {
    try { if (MediaRecorder.isTypeSupported(type)) return type } catch { /* try next */ }
  }
  return ''
}

function errorMessage(error: unknown): string {
  if (error instanceof DOMException && error.name === 'NotAllowedError' || error instanceof Error && /permission|denied|notallowed/i.test(error.name + error.message)) return FALLBACK_ERROR
  if (error instanceof Error && /notsupported|unsupported/i.test(error.name + error.message)) return FALLBACK_ERROR
  return "L'enregistrement a échoué. Réessaie ou utilise l'app Dictaphone."
}

/** start() doit être déclenchée directement par un geste utilisateur. Les fichiers audio restent en mémoire. */
export function useRecorder(): RecorderResult {
  const [state, setState] = useState<RecorderState>('idle')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [durationMs, setDurationMs] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startAtRef = useRef(0)
  const urlRef = useRef<string | null>(null)
  const discardRef = useRef(false)
  const release = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    recorderRef.current = null
  }, [])
  const revoke = useCallback(() => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    urlRef.current = null
    setAudioUrl(null)
  }, [])
  const reset = useCallback(() => {
    discardRef.current = true
    try { if (recorderRef.current?.state === 'recording') recorderRef.current.stop() } catch { /* ignore */ }
    release(); revoke(); chunksRef.current = []; setDurationMs(0); setError(null); setState('idle')
  }, [release, revoke])
  const stop = useCallback(() => {
    const recorder = recorderRef.current
    if (!recorder) return
    try {
      if (recorder.state === 'recording') recorder.stop()
      else release()
    } catch { release(); setState('error'); setError("L'enregistrement a échoué. Réessaie ou utilise l'app Dictaphone.") }
  }, [release])
  const start = useCallback(async () => {
    reset()
    if (!isRecordingSupported()) { setState('error'); setError(FALLBACK_ERROR); return }
    discardRef.current = false
    setState('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const candidates = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', '']
      let recorder: MediaRecorder | null = null
      let lastError: unknown
      for (const mimeType of candidates) {
        if (mimeType) {
          try { if (!MediaRecorder.isTypeSupported(mimeType)) continue } catch { continue }
        }
        try {
          const candidate = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
          candidate.start()
          recorder = candidate
          break
        }
        catch (e) { lastError = e }
      }
      if (!recorder) throw lastError ?? new Error('NotSupportedError')
      recorderRef.current = recorder; chunksRef.current = []
      recorder.addEventListener('dataavailable', (event) => { if (event.data.size) chunksRef.current.push(event.data) })
      recorder.addEventListener('error', () => { release(); setState('error'); setError("L'enregistrement a échoué. Réessaie ou utilise l'app Dictaphone.") })
      recorder.addEventListener('stop', () => {
        if (discardRef.current) { release(); return }
        const end = typeof performance !== 'undefined' ? performance.now() : Date.now()
        setDurationMs(Math.max(0, end - startAtRef.current))
        try {
          const blob = new Blob(chunksRef.current, { type: recorder?.mimeType || 'audio/mp4' })
          revoke(); urlRef.current = URL.createObjectURL(blob); setAudioUrl(urlRef.current); setState('stopped')
        } catch { setState('error'); setError("L'enregistrement a échoué. Réessaie ou utilise l'app Dictaphone.") }
        release()
      })
      startAtRef.current = typeof performance !== 'undefined' ? performance.now() : Date.now()
      setState('recording')
    } catch (e) { release(); setState('error'); setError(errorMessage(e)) }
  }, [release, reset, revoke])
  useEffect(() => () => { discardRef.current = true; try { if (recorderRef.current?.state === 'recording') recorderRef.current.stop() } catch { /* ignore */ } release(); if (urlRef.current) URL.revokeObjectURL(urlRef.current) }, [release])
  return { state, start, stop, reset, audioUrl, durationMs, error }
}
