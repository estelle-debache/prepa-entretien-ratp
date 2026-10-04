/**
 * Calcul PUR de la progression des 7 modes d'entraînement affichés sur le hub (`/entrainement`).
 * Aucune dépendance à React ni au localStorage : on passe les valeurs déjà lues par les hooks de
 * `ui/hooks.ts`. Permet de tester chaque règle de progression indépendamment des stores.
 */
import type { QuestionStatus } from '../lib/store'
import type { PracticeHistory, QuizState, ReflexState, SimulationRecord, SituationsState } from './hooks'

export type ModeId = 'oral' | 'ami' | 'simulation' | 'quiz' | 'situations' | 'reflex' | 'revision'

export interface ModeProgress {
  modeId: ModeId
  /** Au moins une trace d'activité dans ce mode (même sans succès). */
  started: boolean
  /** Terminé ET réussi au sens du mode (voir règles ci-dessous) — toujours `false` si `started` est `false`. */
  done: boolean
  /** 0..1 — ne compte que ce qui est terminé avec les bonnes réponses (jamais ce qui est seulement commencé). */
  progress: number
  /** Ligne de détail chiffrée, prête à afficher. */
  detail: string
}

export interface GlobalProgress {
  /** 0..1, moyenne des 7 modes. */
  progress: number
  /** Modes terminés et réussis. */
  doneCount: number
  totalModes: number
  /** « 3 modes sur 7 terminés » */
  label: string
}

export interface TrainingProgressResult {
  modes: ModeProgress[]
  global: GlobalProgress
}

export interface TrainingProgressInputs {
  oralHistory: PracticeHistory
  amiHistory: PracticeHistory
  simulations: SimulationRecord[]
  quiz: QuizState
  situations: SituationsState
  reflex: ReflexState
  statutQuestions: Record<string, QuestionStatus>
  totals: { questions: number; situations: number; quiz: number }
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

function ratio(count: number, total: number): number {
  return total > 0 ? clamp01(count / total) : 0
}

const MONTHS_FR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

/** « 4 oct. » — formatage volontairement indépendant d'Intl pour des tests déterministes. */
function formatShortDateFR(at: number): string {
  const date = new Date(at)
  return `${date.getDate()} ${MONTHS_FR[date.getMonth()]}`
}

/* ------------------------------------------------------------------ */
/* Oral seul / Avec un ami : nb de questions RÉUSSIES                  */
/* ------------------------------------------------------------------ */

/** Score de grille (0–100, `computeOverallScore`) à partir duquel une question orale compte comme réussie. */
export const ORAL_SUCCESS_SCORE = 80

function computePracticeProgress(history: PracticeHistory, totalQuestions: number): Omit<ModeProgress, 'modeId'> {
  const attempts = Object.values(history)
  const started = attempts.length > 0
  const successCount = Math.min(attempts.filter((a) => a.score >= ORAL_SUCCESS_SCORE).length, totalQuestions)
  return {
    started,
    done: totalQuestions > 0 && successCount >= totalQuestions,
    progress: ratio(successCount, totalQuestions),
    detail: `${successCount} / ${totalQuestions} questions réussies`,
  }
}

export function computeOralProgress(history: PracticeHistory, totalQuestions: number): Omit<ModeProgress, 'modeId'> {
  return computePracticeProgress(history, totalQuestions)
}

export function computeAmiProgress(history: PracticeHistory, totalQuestions: number): Omit<ModeProgress, 'modeId'> {
  return computePracticeProgress(history, totalQuestions)
}

/* ------------------------------------------------------------------ */
/* Simulation d'entretien                                              */
/* ------------------------------------------------------------------ */

export function computeSimulationProgress(simulations: SimulationRecord[]): Omit<ModeProgress, 'modeId'> {
  const count = simulations.length
  const started = count > 0
  if (!started) return { started: false, done: false, progress: 0, detail: 'Aucune simulation pour le moment' }
  // Réussie = terminée sans aucune étape notée « À revoir ». Fait = une complète réussie.
  const cleanComplete = simulations.some((s) => s.length === 'complete' && s.revisitCount === 0)
  const cleanShort = simulations.some((s) => s.length === 'courte' && s.revisitCount === 0)
  const progress = cleanComplete ? 1 : cleanShort ? 0.5 : 0
  const latest = simulations.reduce((max, s) => (s.at > max ? s.at : max), simulations[0].at)
  const base = `${count} simulation${count > 1 ? 's' : ''}, dernière le ${formatShortDateFR(latest)}`
  const detail = cleanComplete ? `Complète réussie · ${base}`
    : cleanShort ? `Courte réussie · reste une complète sans « À revoir »`
      : `${base} · pas encore sans « À revoir »`
  return { started: true, done: cleanComplete, progress, detail }
}

/* ------------------------------------------------------------------ */
/* Quiz                                                                 */
/* ------------------------------------------------------------------ */

export function computeQuizProgress(quiz: QuizState, totalQuiz: number): Omit<ModeProgress, 'modeId'> {
  const seenCount = quiz.seenIds?.length
  const wrongCount = quiz.wrongIds.length

  const started = seenCount !== undefined ? seenCount > 0 : Boolean(quiz.lastScore)
  if (!started) return { started: false, done: false, progress: 0, detail: 'Aucun quiz fait pour le moment' }

  // « Fait » uniquement à 100 % : toutes les questions de la banque réussies (dernière réponse juste).
  const correctCount = Math.min(quiz.correctIds?.length ?? 0, totalQuiz)
  const progress = ratio(correctCount, totalQuiz)
  const done = totalQuiz > 0 && correctCount >= totalQuiz

  const parts: string[] = [`${correctCount} / ${totalQuiz} questions réussies`]
  if (wrongCount > 0) parts.push(`${wrongCount} erreur${wrongCount > 1 ? 's' : ''} à revoir`)

  return { started: true, done, progress, detail: parts.join(' · ') }
}

/* ------------------------------------------------------------------ */
/* Mises en situation                                                   */
/* ------------------------------------------------------------------ */

export function computeSituationsProgress(situations: SituationsState, totalSituations: number): Omit<ModeProgress, 'modeId'> {
  const values = Object.values(situations).filter((s) => s.done)
  const started = values.length > 0
  // Réussie = terminée avec toutes les réponses justes à son mini-quiz.
  const successCount = Math.min(values.filter((s) => !s.score || s.score[0] >= s.score[1]).length, totalSituations)
  return {
    started,
    done: totalSituations > 0 && successCount >= totalSituations,
    progress: ratio(successCount, totalSituations),
    detail: `${successCount} / ${totalSituations} situations réussies`,
  }
}

/* ------------------------------------------------------------------ */
/* Exercice des réflexes                                                */
/* ------------------------------------------------------------------ */

export function computeReflexProgress(reflex: ReflexState): Omit<ModeProgress, 'modeId'> {
  const { attempts, successes } = reflex
  const started = attempts > 0
  const done = successes >= 1
  if (!started) return { started: false, done: false, progress: 0, detail: 'Pas encore essayé' }
  return {
    started: true,
    done,
    progress: done ? 1 : 0,
    detail: `Réussi ${successes} fois sur ${attempts} essai${attempts > 1 ? 's' : ''}`,
  }
}

/* ------------------------------------------------------------------ */
/* Révision rapide                                                      */
/* ------------------------------------------------------------------ */

export function computeRevisionProgress(statutQuestions: Record<string, QuestionStatus>, totalQuestions: number): Omit<ModeProgress, 'modeId'> {
  const values = Object.values(statutQuestions)
  const maitriseCount = values.filter((v) => v === 'maitrise').length
  const aRevoirCount = values.filter((v) => v === 'a-revoir').length
  const started = values.length > 0
  return {
    started,
    done: totalQuestions > 0 && maitriseCount >= totalQuestions,
    progress: ratio(maitriseCount, totalQuestions),
    detail: `${maitriseCount} maîtrisée${maitriseCount > 1 ? 's' : ''} · ${aRevoirCount} à revoir`,
  }
}

/* ------------------------------------------------------------------ */
/* Agrégation                                                           */
/* ------------------------------------------------------------------ */

export function computeTrainingProgress(inputs: TrainingProgressInputs): TrainingProgressResult {
  const { totals } = inputs
  const modes: ModeProgress[] = [
    { modeId: 'oral', ...computeOralProgress(inputs.oralHistory, totals.questions) },
    { modeId: 'ami', ...computeAmiProgress(inputs.amiHistory, totals.questions) },
    { modeId: 'simulation', ...computeSimulationProgress(inputs.simulations) },
    { modeId: 'quiz', ...computeQuizProgress(inputs.quiz, totals.quiz) },
    { modeId: 'situations', ...computeSituationsProgress(inputs.situations, totals.situations) },
    { modeId: 'reflex', ...computeReflexProgress(inputs.reflex) },
    { modeId: 'revision', ...computeRevisionProgress(inputs.statutQuestions, totals.questions) },
  ]

  const totalModes = modes.length
  const doneCount = modes.filter((m) => m.done).length
  const progress = totalModes > 0 ? modes.reduce((sum, m) => sum + m.progress, 0) / totalModes : 0
  const label = doneCount === 0
    ? `Aucun mode terminé sur ${totalModes}`
    : `${doneCount} mode${doneCount > 1 ? 's' : ''} sur ${totalModes} terminé${doneCount > 1 ? 's' : ''}`

  return { modes, global: { progress, doneCount, totalModes, label } }
}
