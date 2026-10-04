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
  /** Complété au sens du mode (voir règles ci-dessous) — toujours `false` si `started` est `false`. */
  done: boolean
  /** 0..1 */
  progress: number
  /** Ligne de détail chiffrée, prête à afficher. */
  detail: string
}

export interface GlobalProgress {
  /** 0..1, moyenne des 7 modes. */
  progress: number
  startedCount: number
  totalModes: number
  /** « 3 modes sur 7 commencés » */
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
/* Oral seul / Avec un ami : nb de questions travaillées               */
/* ------------------------------------------------------------------ */

export function computeOralProgress(history: PracticeHistory, totalQuestions: number): Omit<ModeProgress, 'modeId'> {
  const workedCount = Object.keys(history).length
  const started = workedCount > 0
  return {
    started,
    done: started,
    progress: ratio(workedCount, totalQuestions),
    detail: `${workedCount} / ${totalQuestions} questions travaillées`,
  }
}

export function computeAmiProgress(history: PracticeHistory, totalQuestions: number): Omit<ModeProgress, 'modeId'> {
  const workedCount = Object.keys(history).length
  const started = workedCount > 0
  return {
    started,
    done: started,
    progress: ratio(workedCount, totalQuestions),
    detail: `${workedCount} / ${totalQuestions} questions`,
  }
}

/* ------------------------------------------------------------------ */
/* Simulation d'entretien                                              */
/* ------------------------------------------------------------------ */

export function computeSimulationProgress(simulations: SimulationRecord[]): Omit<ModeProgress, 'modeId'> {
  const count = simulations.length
  const started = count > 0
  if (!started) return { started: false, done: false, progress: 0, detail: 'Aucune simulation pour le moment' }
  const hasComplete = simulations.some((s) => s.length === 'complete')
  const progress = hasComplete ? 1 : 0.5
  const latest = simulations.reduce((max, s) => (s.at > max ? s.at : max), simulations[0].at)
  const detail = `${count} simulation${count > 1 ? 's' : ''}, dernière le ${formatShortDateFR(latest)}`
  return { started: true, done: true, progress, detail }
}

/* ------------------------------------------------------------------ */
/* Quiz                                                                 */
/* ------------------------------------------------------------------ */

export function computeQuizProgress(quiz: QuizState, totalQuiz: number): Omit<ModeProgress, 'modeId'> {
  const seenCount = quiz.seenIds?.length
  const wrongCount = quiz.wrongIds.length

  const started = seenCount !== undefined ? seenCount > 0 : Boolean(quiz.lastScore)
  if (!started) return { started: false, done: false, progress: 0, detail: 'Aucun quiz fait pour le moment' }

  const progress = seenCount !== undefined
    ? ratio(seenCount, totalQuiz)
    : quiz.lastScore
      ? ratio(quiz.lastScore.correct, quiz.lastScore.total)
      : 0

  const parts: string[] = []
  if (seenCount !== undefined) parts.push(`${seenCount} / ${totalQuiz} questions vues`)
  if (quiz.lastScore) parts.push(`dernier score ${quiz.lastScore.correct}/${quiz.lastScore.total}`)
  if (wrongCount > 0) parts.push(`${wrongCount} erreur${wrongCount > 1 ? 's' : ''} à revoir`)

  return { started: true, done: true, progress, detail: parts.join(' · ') }
}

/* ------------------------------------------------------------------ */
/* Mises en situation                                                   */
/* ------------------------------------------------------------------ */

export function computeSituationsProgress(situations: SituationsState, totalSituations: number): Omit<ModeProgress, 'modeId'> {
  const doneCount = Object.values(situations).filter((s) => s.done).length
  const started = doneCount > 0
  return {
    started,
    done: started,
    progress: ratio(doneCount, totalSituations),
    detail: `${doneCount} / ${totalSituations} situation${totalSituations > 1 ? 's' : ''}`,
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
    done: started,
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
  const startedCount = modes.filter((m) => m.started).length
  const progress = totalModes > 0 ? modes.reduce((sum, m) => sum + m.progress, 0) / totalModes : 0
  const label = startedCount === 0
    ? `Aucun mode commencé sur ${totalModes}`
    : `${startedCount} mode${startedCount > 1 ? 's' : ''} sur ${totalModes} commencé${startedCount > 1 ? 's' : ''}`

  return { modes, global: { progress, startedCount, totalModes, label } }
}
