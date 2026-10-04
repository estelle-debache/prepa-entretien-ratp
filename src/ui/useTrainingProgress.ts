import { useMemo } from 'react'
import { QUESTIONS, SITUATIONS } from '../content'
import { QUIZ } from '../content/quiz/quiz'
import {
  useAmiHistory, useOralHistory, useQuizState, useReflexState, useSimulationsHistory, useSituationsState, useStatutQuestions,
} from './hooks'
import { computeTrainingProgress, type TrainingProgressResult } from './trainingProgress'

/**
 * Hook partagé : lit les 7 stores d'entraînement (oral, ami, simulation, quiz, situations, réflexes,
 * révision) et calcule leur progression via `computeTrainingProgress` (voir `trainingProgress.ts`).
 * Utilisé par le hub `/entrainement` ET par l'accueil, pour ne construire les entrées qu'à un seul
 * endroit — évite que les deux pages dérivent si une règle de progression change.
 */
export function useTrainingProgress(): TrainingProgressResult {
  const [oralHistory] = useOralHistory()
  const [amiHistory] = useAmiHistory()
  const [simulations] = useSimulationsHistory()
  const [quiz] = useQuizState()
  const [situations] = useSituationsState()
  const [reflex] = useReflexState()
  const [statutQuestions] = useStatutQuestions()

  return useMemo(
    () => computeTrainingProgress({
      oralHistory, amiHistory, simulations, quiz, situations, reflex, statutQuestions,
      totals: { questions: QUESTIONS.length, situations: SITUATIONS.length, quiz: QUIZ.length },
    }),
    [oralHistory, amiHistory, simulations, quiz, situations, reflex, statutQuestions],
  )
}
