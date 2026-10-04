import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Check, ChevronLeft, ChevronRight, Drama, Mic, Pause, Play, Star, TriangleAlert, X } from 'lucide-react'
import { SITUATIONS } from '../../content'
import { QUIZ } from '../../content/quiz/quiz'
import type { QuizItem } from '../../content/quiz/types'
import { shuffleQuizOptions } from '../../lib/practice/quiz'
import { reportActivityDone } from '../../lib/practice/activity'
import { useRecorder } from '../../lib/speech/recorder'
import { useStopwatch } from '../../lib/practice/timer'
import { Button, Callout } from '../../ui/primitives'
import { RichText } from '../../ui/RichText'
import { ChronoDisplay } from '../../ui/ChronoDisplay'
import { RecorderPanel } from '../../ui/RecorderPanel'
import { useProfile, useSituationsState } from '../../ui/hooks'
import { useParcoursMode } from '../../ui/parcoursMode'
import { frenchNbsp } from '../../ui/format'

const SITUATION_TARGET: [number, number] = [30, 45]

/** Remonte à chaque situation : réinitialise le mini-quiz, la révélation et le chrono. */
export default function SituationDetail() {
  const { id = '' } = useParams()
  return <SituationDetailInner key={id} id={id} />
}

function SituationDetailInner({ id }: { id: string }) {
  const navigate = useNavigate()
  const parcoursMode = useParcoursMode()
  const [profile] = useProfile()
  const [situationsState, setSituationsState] = useSituationsState()
  const [quizItems] = useState<QuizItem[]>(() => QUIZ.filter((q) => q.category === 'situation' && q.sourceId === id).map((q) => shuffleQuizOptions(q)))
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [revealed, setRevealed] = useState(false)
  const [oralOpen, setOralOpen] = useState(false)
  const stopwatch = useStopwatch()
  const rec = useRecorder()

  const index = SITUATIONS.findIndex((s) => s.id === id)
  const situation = SITUATIONS[index]
  const prev = index > 0 ? SITUATIONS[index - 1] : undefined
  const next = index >= 0 && index < SITUATIONS.length - 1 ? SITUATIONS[index + 1] : undefined

  if (!situation) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-[17px] text-ink-600">Cette situation n'existe pas.</p>
        <Link to="/situations" className="font-semibold text-mint-700 underline">Retour aux situations</Link>
      </div>
    )
  }

  const allAnswered = quizItems.length > 0 && quizItems.every((item) => answers[item.id] !== undefined)
  const correctCount = quizItems.filter((item) => answers[item.id] === item.answer).length

  const reveal = () => {
    setRevealed(true)
    setSituationsState({ ...situationsState, [id]: { done: true, score: quizItems.length ? [correctCount, quizItems.length] : undefined } })
    reportActivityDone({ kind: 'situation', situationId: id })
  }

  const startOral = async () => { setOralOpen(true); stopwatch.reset(); await rec.start(); stopwatch.start() }
  const stopOral = () => { rec.stop(); stopwatch.stop() }

  return (
    <div className="animate-fade space-y-5">
      <span className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-bold text-navy-600">{situation.id} · {index + 1}/{SITUATIONS.length}</span>

      <h1 className="flex items-start gap-2 text-2xl font-extrabold leading-snug tracking-tight text-navy-900">
        {situation.star ? <Star aria-hidden="true" className="mt-1 size-5 shrink-0 fill-amber-500 text-amber-500" /> : null}
        {situation.title}
      </h1>

      {!revealed && (
        <div className="space-y-4">
          {quizItems.length > 0 ? (
            <>
              <p className="text-[15px] font-semibold text-navy-700">{frenchNbsp('Que fais-tu ? Choisis une réponse avant de voir la fiche.')}</p>
              {quizItems.map((item) => (
                <SituationQuizCard key={item.id} item={item} selected={answers[item.id]} onSelect={(i) => setAnswers((prev) => ({ ...prev, [item.id]: i }))} />
              ))}
            </>
          ) : (
            <p className="text-[15px] font-semibold text-navy-700">Réfléchis à ce que tu ferais, puis regarde la fiche.</p>
          )}
          <Button variant="primary" onClick={reveal} disabled={quizItems.length > 0 && !allAnswered} className="w-full">
            Voir ce qu'il faut faire
          </Button>
          {quizItems.length > 0 && !allAnswered ? (
            <button type="button" onClick={reveal} className="mx-auto block text-sm font-semibold text-ink-400 underline">
              Passer, je regarde directement
            </button>
          ) : null}
        </div>
      )}

      {revealed && (
        <div className="animate-rise space-y-5">
          <section className="space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wide text-mint-600">Ce que je fais</h2>
            <ol className="space-y-2.5">
              {situation.steps.map((step, i) => (
                <li key={i} className="flex gap-2.5 text-[17px] leading-relaxed text-ink-900">
                  <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">{i + 1}</span>
                  <span><RichText text={step} profile={profile} /></span>
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wide text-mint-600">Phrase clé</h2>
            <p className="rounded-2xl border-l-4 border-mint-500 bg-mint-50 px-4 py-3 text-[17px] italic leading-relaxed text-navy-900">
              {frenchNbsp(`« ${situation.keyPhrase} »`)}
            </p>
          </section>

          <Callout tone="warning">
            <p className="flex items-start gap-2 text-[15px] font-medium">
              <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span><strong>Piège{'\u00a0'}: </strong>{frenchNbsp(situation.trap)}</span>
            </p>
          </Callout>

          {situation.rolePlayId && !parcoursMode ? (
            <Link
              to={`/jeux-de-role/${situation.rolePlayId}`}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-mint-500 text-[15px] font-semibold text-white"
            >
              <Drama aria-hidden="true" className="size-4" /> Faire le jeu de rôle
            </Link>
          ) : null}

          {!oralOpen ? (
            <button
              type="button"
              onClick={() => setOralOpen(true)}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-mint-500 text-[15px] font-semibold text-mint-700"
            >
              <Mic aria-hidden="true" className="size-4" /> Répondre à l'oral
            </button>
          ) : (
            <div className="space-y-3 rounded-2xl border border-navy-100 p-4">
              <div className="flex items-center gap-3">
                <ChronoDisplay elapsedMs={stopwatch.elapsedMs} target={SITUATION_TARGET} />
                <button
                  type="button"
                  onClick={() => (stopwatch.running ? stopwatch.stop() : stopwatch.start())}
                  aria-label={stopwatch.running ? 'Arrêter le chrono' : 'Démarrer le chrono sans enregistrer'}
                  className={`flex size-14 shrink-0 items-center justify-center rounded-full text-white ${stopwatch.running ? 'bg-coral-500' : 'bg-navy-200'}`}
                >
                  {stopwatch.running ? <Pause aria-hidden="true" className="size-6" fill="currentColor" /> : <Play aria-hidden="true" className="size-6 text-navy-700" fill="currentColor" />}
                </button>
              </div>
              <RecorderPanel rec={rec} onStart={startOral} onStop={stopOral} />
            </div>
          )}
        </div>
      )}

      {!parcoursMode ? (
        <div className="flex items-center justify-between gap-2 border-t border-navy-100 pt-4">
          <Button variant="ghost" disabled={!prev} onClick={() => prev && navigate(`/situations/${prev.id}`)}>
            <ChevronLeft aria-hidden="true" className="size-4" /> Précédente
          </Button>
          <Button variant="ghost" disabled={!next} onClick={() => next && navigate(`/situations/${next.id}`)}>
            Suivante <ChevronRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function SituationQuizCard({ item, selected, onSelect }: { item: QuizItem; selected: number | undefined; onSelect: (index: number) => void }) {
  const answered = selected !== undefined
  return (
    <div className="space-y-2 rounded-2xl border border-navy-100 bg-white p-4">
      <p className="text-[16px] font-semibold text-navy-900">{frenchNbsp(item.question)}</p>
      <div className="space-y-2">
        {item.options.map((option, i) => {
          const isCorrect = i === item.answer
          const isSelected = selected === i
          let tone = 'border-navy-100 bg-white text-ink-900'
          if (answered && isCorrect) tone = 'border-mint-500 bg-mint-50 text-mint-800'
          else if (answered && isSelected) tone = 'border-coral-500 bg-coral-50 text-coral-800'
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => onSelect(i)}
              className={`flex min-h-11 w-full items-center gap-2 rounded-xl border-2 px-3.5 py-2 text-left text-[15px] transition-colors ${tone} disabled:opacity-100`}
            >
              {answered && isCorrect ? <Check aria-hidden="true" className="size-4 shrink-0" /> : null}
              {answered && isSelected && !isCorrect ? <X aria-hidden="true" className="size-4 shrink-0" /> : null}
              {frenchNbsp(option)}
            </button>
          )
        })}
      </div>
      {answered ? <p className="text-sm text-ink-600">{frenchNbsp(item.explanation)}</p> : null}
    </div>
  )
}
