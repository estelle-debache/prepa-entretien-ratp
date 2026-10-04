import { useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ArrowRight, Pause, Play, RotateCcw, Users } from 'lucide-react'
import { getQuestion, RECRUITER_QUESTIONS, SITUATIONS } from '../../content'
import type { Profile } from '../../content/types'
import { simulationIntro } from '../../content/practice/simulationIntro'
import {
  buildSimulation, criterionForTheme, OFFICIAL_CRITERIA, summarizeSimulation, type OfficialCriterion, type SimulationStep,
} from '../../lib/practice/simulation'
import { reportActivityDone } from '../../lib/practice/activity'
import { useStopwatch } from '../../lib/practice/timer'
import { useRecorder } from '../../lib/speech/recorder'
import { stopSpeaking } from '../../lib/speech/tts'
import { useProfile, useSimulationsHistory, useStatutQuestions } from '../../ui/hooks'
import { QuotedRichText } from '../../ui/RichText'
import { ChronoDisplay } from '../../ui/ChronoDisplay'
import { RecorderPanel } from '../../ui/RecorderPanel'
import { Button, Card, Chip, Disclosure } from '../../ui/primitives'
import { capitalizeFirst, frenchNbsp } from '../../ui/format'

type Length = 'courte' | 'complete'
type Mode = 'seul' | 'ami'
type Stage = 'setup' | 'running' | 'summary'
const SITUATION_TARGET: [number, number] = [30, 45]
const RECRUTEUR_TARGET: [number, number] = [30, 60]

export default function Simulation() {
  const [searchParams] = useSearchParams()
  const [profile] = useProfile()
  const prenom = profile.prenom?.trim() || 'Yahia'
  const [statutQuestions] = useStatutQuestions()
  const [, setHistory] = useSimulationsHistory()

  // Présélection depuis la barre de parcours (`?length=courte|complete`) : seulement la durée
  // choisie à l'avance, l'écran de réglages (durée, seul/avec un ami) reste affiché.
  const lengthParam = searchParams.get('length')
  const preset: Length | null = lengthParam === 'courte' || lengthParam === 'complete' ? lengthParam : null

  const [stage, setStage] = useState<Stage>('setup')
  const [length, setLength] = useState<Length>(preset ?? 'courte')
  const [mode, setMode] = useState<Mode>('seul')
  const [steps, setSteps] = useState<SimulationStep[]>([])
  const [index, setIndex] = useState(0)
  const [ratings, setRatings] = useState<Record<number, 1 | 2 | 3>>({})
  const [stepRevealed, setStepRevealed] = useState(false)

  const start = () => {
    const built = buildSimulation({ length, statuses: statutQuestions })
    setSteps(built)
    setIndex(0)
    setRatings({})
    setStepRevealed(false)
    setStage('running')
  }

  const rate = (value: 1 | 2 | 3) => { setRatings((prev) => ({ ...prev, [index]: value })); setStepRevealed(true) }

  const finish = (finalRatings: Record<number, 1 | 2 | 3>) => {
    const summary = summarizeSimulation(steps, finalRatings)
    const averages: Record<string, number> = {}
    for (const criterion of OFFICIAL_CRITERIA) if (summary.averages[criterion] !== undefined) averages[criterion] = summary.averages[criterion] as number
    setHistory((prev) => [{ at: Date.now(), length, mode, averages, revisitCount: summary.revisit.length }, ...prev].slice(0, 5))
    reportActivityDone({ kind: 'simulation' })
    setStage('summary')
  }

  const goNext = () => {
    if (index === steps.length - 1) { finish(ratings); return }
    setIndex((i) => i + 1)
    setStepRevealed(false)
  }

  if (stage === 'setup') {
    return (
      <div className="space-y-5">
        <header className="animate-rise space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Simulation d'entretien</h1>
          <p className="text-[15px] text-ink-600">{frenchNbsp(simulationIntro(prenom))}</p>
        </header>

        <Card className="animate-rise space-y-3">
          <h2 className="text-[15px] font-bold text-navy-900">Durée</h2>
          <div className="flex gap-2">
            <Chip active={length === 'courte'} onClick={() => setLength('courte')}>Courte (8 étapes)</Chip>
            <Chip active={length === 'complete'} onClick={() => setLength('complete')}>Complète</Chip>
          </div>
        </Card>

        <Card className="animate-rise space-y-3" style={{ animationDelay: '40ms' }}>
          <h2 className="text-[15px] font-bold text-navy-900">{frenchNbsp('Avec qui ?')}</h2>
          <div className="flex gap-2">
            <Chip active={mode === 'seul'} onClick={() => setMode('seul')}>Seul</Chip>
            <Chip active={mode === 'ami'} onClick={() => setMode('ami')} icon={<Users aria-hidden="true" className="size-3.5" />}>Avec un ami</Chip>
          </div>
          {mode === 'ami' ? <p className="text-sm text-ink-600">{frenchNbsp('Ton ami lit les questions et chronomètre ; toi, tu réponds.')}</p> : null}
        </Card>

        <Button variant="primary" onClick={start} className="w-full">Commencer la simulation</Button>
      </div>
    )
  }

  if (stage === 'running') {
    return (
      <SimulationStepView
        key={index}
        step={steps[index]}
        index={index}
        total={steps.length}
        revealed={stepRevealed}
        rating={ratings[index]}
        onRate={rate}
        onNext={goNext}
        profile={profile}
      />
    )
  }

  const summary = summarizeSimulation(steps, ratings)
  return (
    <div className="animate-fade space-y-5">
      <header className="space-y-1 text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-mint-600">Bilan de la simulation</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">{steps.length} étapes passées</h1>
      </header>

      <Card className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wide text-mint-600">Les 4 critères officiels</h2>
        {OFFICIAL_CRITERIA.map((criterion) => {
          const average = summary.averages[criterion]
          return (
            <div key={criterion} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex-1 text-navy-800">{capitalizeFirst(criterion)}</span>
              <span className="shrink-0 font-bold text-navy-900">{average !== undefined ? `${average.toFixed(1)}/3` : '—'}</span>
            </div>
          )
        })}
      </Card>

      {summary.revisit.length > 0 ? (
        <Card className="space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wide text-coral-600">À retravailler</h2>
          <ul className="space-y-2">
            {summary.revisit.map((step, i) => <RevisitRow key={i} step={step} />)}
          </ul>
        </Card>
      ) : (
        <p className="text-center text-sm font-semibold text-mint-700">{frenchNbsp('Rien à retravailler en priorité, bravo !')}</p>
      )}

      <Button variant="primary" onClick={() => setStage('setup')} className="w-full">
        <RotateCcw aria-hidden="true" className="size-4" /> Refaire une simulation
      </Button>
    </div>
  )
}

function RevisitRow({ step }: { step: SimulationStep }) {
  if (step.kind === 'question') {
    const q = getQuestion(step.questionId)
    if (!q) return null
    return (
      <li>
        <Link to={`/questions/${q.id}`} className="flex items-center justify-between gap-2 rounded-xl bg-coral-50 px-3.5 py-2.5 text-sm font-semibold text-coral-800">
          {frenchNbsp(q.question)} <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
        </Link>
      </li>
    )
  }
  if (step.kind === 'situation') {
    const s = SITUATIONS.find((s) => s.id === step.situationId)
    if (!s) return null
    return (
      <li>
        <Link to={`/situations/${s.id}`} className="flex items-center justify-between gap-2 rounded-xl bg-coral-50 px-3.5 py-2.5 text-sm font-semibold text-coral-800">
          {s.title} <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
        </Link>
      </li>
    )
  }
  return (
    <li>
      <Link to="/reviser/recruteur" className="flex items-center justify-between gap-2 rounded-xl bg-coral-50 px-3.5 py-2.5 text-sm font-semibold text-coral-800">
        Questions au recruteur <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
      </Link>
    </li>
  )
}

function SimulationStepView({
  step, index, total, revealed, rating, onRate, onNext, profile,
}: {
  step: SimulationStep
  index: number
  total: number
  revealed: boolean
  rating: 1 | 2 | 3 | undefined
  onRate: (value: 1 | 2 | 3) => void
  onNext: () => void
  profile: Profile
}) {
  const stopwatch = useStopwatch()
  const rec = useRecorder()

  let prompt = ''
  let target: [number, number] = [30, 45]
  let criterionLabel: OfficialCriterion | null = null
  let reveal: ReactNode = null

  if (step.kind === 'question') {
    const q = getQuestion(step.questionId)
    if (q) {
      prompt = q.question
      target = q.targetSeconds
      criterionLabel = criterionForTheme(q.theme)
      const example = q.kind === 'top' ? q.example : q.hook
      reveal = <QuotedRichText text={example} profile={profile} />
    }
  } else if (step.kind === 'situation') {
    const s = SITUATIONS.find((x) => x.id === step.situationId)
    if (s) {
      prompt = `Mise en situation : ${s.title}`
      target = SITUATION_TARGET
      criterionLabel = criterionForTheme('situations')
      reveal = (
        <div className="space-y-2">
          <p className="text-[16px] italic leading-relaxed text-navy-900">« {frenchNbsp(s.keyPhrase)} »</p>
          <Link to={`/situations/${s.id}`} className="text-sm font-semibold text-mint-700 underline">Voir le détail de la situation</Link>
        </div>
      )
    }
  } else {
    prompt = 'Avez-vous des questions à nous poser ?'
    target = RECRUTEUR_TARGET
    reveal = (
      <div className="space-y-2">
        <ul className="space-y-1.5 text-[15px] text-ink-900">
          {RECRUITER_QUESTIONS.slice(0, 3).map((r) => <li key={r.id}>• {frenchNbsp(r.text)}</li>)}
        </ul>
        <Link to="/reviser/recruteur" className="text-sm font-semibold text-mint-700 underline">Voir toutes les questions possibles</Link>
      </div>
    )
  }

  const startRec = async () => { stopSpeaking(); stopwatch.reset(); await rec.start(); stopwatch.start() }
  const stopRec = () => { rec.stop(); stopwatch.stop() }

  return (
    <div key={index} className="animate-fade space-y-5">
      <div className="flex items-center justify-between text-sm font-bold text-navy-700">
        <span>Étape {index + 1}/{total}</span>
        {criterionLabel ? <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs">{capitalizeFirst(criterionLabel)}</span> : null}
      </div>

      <h1 className="text-xl font-extrabold leading-snug tracking-tight text-navy-900">{frenchNbsp(prompt)}</h1>

      <ChronoDisplay elapsedMs={stopwatch.elapsedMs} target={target} />
      <button
        type="button"
        onClick={() => (stopwatch.running ? stopwatch.stop() : stopwatch.start())}
        className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white ${stopwatch.running ? 'bg-coral-500' : 'bg-navy-900'}`}
      >
        {stopwatch.running ? <Pause aria-hidden="true" className="size-4" fill="currentColor" /> : <Play aria-hidden="true" className="size-4" fill="currentColor" />}
        {stopwatch.running ? 'Arrêter le chrono' : 'Démarrer le chrono'}
      </button>

      <Disclosure title="Enregistrer ma voix (optionnel)" tone="card">
        <RecorderPanel rec={rec} onStart={startRec} onStop={stopRec} />
      </Disclosure>

      {!revealed ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-ink-600">{frenchNbsp('Note ta réponse une fois terminée :')}</p>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onRate(1)} className="flex-1">1 · À revoir</Button>
            <Button variant="ghost" onClick={() => onRate(2)} className="flex-1">2 · Correct</Button>
            <Button variant="ghost" onClick={() => onRate(3)} className="flex-1">3 · Très bien</Button>
          </div>
        </div>
      ) : (
        <div className="animate-rise space-y-4">
          <div>
            <h2 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-mint-600">Pour comparer</h2>
            {reveal}
          </div>
          <p className="text-sm font-semibold text-navy-700">Ta note : {rating} / 3</p>
          <Button variant="primary" onClick={onNext} className="w-full">
            {index === total - 1 ? 'Voir le bilan' : 'Étape suivante'} <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
