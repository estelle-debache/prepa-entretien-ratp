import { useCallback, useEffect, useRef, useState } from 'react'

export function timeStatus(elapsedSec: number, [min, max]: [number, number]): 'trop-court' | 'bien' | 'trop-long' {
  return elapsedSec < min ? 'trop-court' : elapsedSec > max ? 'trop-long' : 'bien'
}
export function formatMmSs(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds))
  return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`
}

export function useStopwatch() {
  const [elapsedMs, setElapsedMs] = useState(0)
  const [running, setRunning] = useState(false)
  const startedAt = useRef(0)
  const accumulated = useRef(0)
  const start = useCallback(() => {
    if (startedAt.current) return
    startedAt.current = typeof performance !== 'undefined' ? performance.now() : Date.now()
    setRunning(true)
  }, [])
  const stop = useCallback(() => {
    if (!startedAt.current) return
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
    accumulated.current += now - startedAt.current
    startedAt.current = 0
    setElapsedMs(accumulated.current)
    setRunning(false)
  }, [])
  const reset = useCallback(() => {
    startedAt.current = 0
    accumulated.current = 0
    setElapsedMs(0)
    setRunning(false)
  }, [])
  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
      setElapsedMs(accumulated.current + now - startedAt.current)
    }, 250)
    return () => window.clearInterval(id)
  }, [running])
  return { elapsedMs, running, start, stop, reset }
}
