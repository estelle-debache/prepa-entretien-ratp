import { useEffect, useRef, useState } from 'react'
import { usePersisted, type QuestionStatus, type Reglages } from '../lib/store'
import { DEFAULT_INTERVIEW_DATE, type Profile } from '../content/types'
import { PROFILE_FIELDS } from '../content/profileFields'

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

export function usePlan() {
  return usePersisted<Record<string, boolean>>('plan', {})
}

export function useChecklistState() {
  return usePersisted<Record<string, boolean>>('checklist', {})
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
