import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePersisted, type QuestionStatus, type Reglages } from '../lib/store'
import { DEFAULT_INTERVIEW_DATE, type Profile } from '../content/types'
import { PROFILE_FIELDS } from '../content/profileFields'
import { isTtsSupported, primeVoices, speak, stopSpeaking } from '../lib/speech/tts'
import { INITIAL_PARCOURS, normalizeParcours, type ParcoursState, type ResolveContext } from '../lib/practice/parcours'
import type { OneOffId } from '../content/oneOff'

/** Fiche personnelle persistée. */
export function useProfile() {
  return usePersisted<Profile>('profil', { prenom: 'Yahia' })
}

export function useReglages() {
  return usePersisted<Reglages>('reglages', { interviewDate: DEFAULT_INTERVIEW_DATE, tts: true })
}

export function useStatutQuestions() {
  return usePersisted<Record<string, QuestionStatus>>('statutQuestions', {})
}

export function useParcours(): [ParcoursState, (value: ParcoursState | ((previous: ParcoursState) => ParcoursState)) => void] {
  const [stored, setStored] = usePersisted<ParcoursState>('parcours', INITIAL_PARCOURS)
  const [statuses] = useStatutQuestions()
  const [quiz] = useQuizState()
  const value = useMemo(() => normalizeParcours(stored, { statuses, quizWrongCount: quiz.wrongIds.length }), [stored, statuses, quiz.wrongIds.length])
  const setValue = useCallback((next: ParcoursState | ((previous: ParcoursState) => ParcoursState)) => {
    setStored(previous => normalizeParcours(typeof next === 'function' ? next(normalizeParcours(previous)) : next))
  }, [setStored])
  return [value, setValue]
}

export function useUneFois() {
  return usePersisted<Partial<Record<OneOffId, boolean>>>('unefois', {})
}

export function useParcoursContext(): ResolveContext {
  const [statuses] = useStatutQuestions()
  const [quiz] = useQuizState()
  return useMemo(() => ({ statuses, quizWrongCount: quiz.wrongIds.length }), [statuses, quiz.wrongIds.length])
}

export function useChecklistState() {
  return usePersisted<Record<string, boolean>>('checklist', {})
}

/* ------------------------------------------------------------------ */
/* Stores d'entraînement (V2)                                          */
/* ------------------------------------------------------------------ */

export interface PracticeAttempt { score: number; at: number }
export type PracticeHistory = Record<string, PracticeAttempt>

/** Dernier score d'entraînement oral (solo), par question. */
export function useOralHistory() {
  return usePersisted<PracticeHistory>('entrainement', {})
}

/** Dernier score du mode ami, par question. */
export function useAmiHistory() {
  return usePersisted<PracticeHistory>('ami', {})
}

export interface QuizState { wrongIds: string[]; lastScore?: { correct: number; total: number }; lastAt?: number }

export function useQuizState() {
  return usePersisted<QuizState>('quiz', { wrongIds: [] })
}

export interface SituationProgress { done: boolean; score?: [number, number] }
export type SituationsState = Record<string, SituationProgress>

export function useSituationsState() {
  return usePersisted<SituationsState>('situations', {})
}

export interface SimulationRecord {
  at: number
  length: 'courte' | 'complete'
  mode: 'seul' | 'ami'
  averages: Record<string, number>
  revisitCount: number
}

export function useSimulationsHistory() {
  return usePersisted<SimulationRecord[]>('simulations', [])
}

/** Pourcentage de champs de la fiche renseignés (0–100). */
export function profileCompletion(profile: Profile): number {
  const total = PROFILE_FIELDS.length
  if (total === 0) return 0
  const filled = PROFILE_FIELDS.filter((field) => Boolean(profile[field.id]?.trim())).length
  return Math.round((filled / total) * 100)
}

/** Déclenche une valeur « vrai » pendant `durationMs`, pratique pour un indicateur « Enregistré ». */
export function useFlash(durationMs = 1500): [boolean, () => void] {
  const [flashing, setFlashing] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current) }, [])
  const trigger = () => {
    setFlashing(true)
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setFlashing(false), durationMs)
  }
  return [flashing, trigger]
}

/** Position de défilement : remonte en haut à chaque changement de route. */
export function useScrollToTopOn(key: string) {
  useEffect(() => { window.scrollTo(0, 0) }, [key])
}

/**
 * Lecture vocale respectant le réglage `reglages.tts` et le support du navigateur.
 * Toujours déclencher `speakNow` directement depuis un geste utilisateur (Safari l'exige).
 */
export function useSpeakable() {
  const [reglages] = useReglages()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const available = isTtsSupported() && reglages.tts
  const speakNow = useCallback((text: string, rate?: number) => {
    if (!available) return
    setIsSpeaking(true)
    speak(text, { rate, onEnd: () => setIsSpeaking(false) })
  }, [available])
  const stop = useCallback(() => { stopSpeaking(); setIsSpeaking(false) }, [])
  useEffect(() => { if (available) primeVoices() }, [available])
  useEffect(() => () => stopSpeaking(), [])
  return { available, isSpeaking, speak: speakNow, stop }
}
