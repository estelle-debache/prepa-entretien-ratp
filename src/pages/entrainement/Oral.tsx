import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowRight, Pause, Play, RotateCcw } from 'lucide-react'
import { getQuestion, QUESTIONS } from '../../content'
import { buildGrid, scoreGrid } from '../../lib/practice/grid'
import { useStopwatch } from '../../lib/practice/timer'
import { useRecorder } from '../../lib/speech/recorder'
import { stopSpeaking } from '../../lib/speech/tts'
import { quickReviewOrder } from '../../lib/practice/selection'
import { computeOverallScore } from '../../ui/trainingLogic'
import { useOralHistory, useProfile, useStatutQuestions } from '../../ui/hooks'
import { RichText, QuotedRichText } from '../../ui/RichText'
import { SpeakButton } from '../../ui/SpeakButton'
import { ChronoDisplay } from '../../ui/ChronoDisplay'
import { RecorderPanel } from '../../ui/RecorderPanel'
import { EvalGrid } from '../../ui/EvalGrid'
import { Button, Card } from '../../ui/primitives'
import { frenchNbsp } from '../../ui/format'

type Stage = 'prepare' | 'grid' | 'reveal'

/** Remonte à chaque question : réinitialise le chrono, l'enregistrement et la grille. */
export default function Oral() {
  const { id = '' } = useParams()
  return <OralInner key={id} id={id} />
}

function OralInner({ id }: { id: string }) {
  const navigate = useNavigate()
  const [profile] = useProfile()
  const [statutQuestions, setStatutQuestions] = useStatutQuestions()
  const [, setOralHistory] = useOralHistory()
  const question = getQuestion(id)
  const stopwatch = useStopwatch()
  const rec = useRecorder()
  const [stage, setStage] = useState<Stage>('prepare')
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const grid = useMemo(() => (question ? buildGrid(question) : []), [question])
  const nextId = useMemo(() => {
    const order = quickReviewOrder(QUESTIONS, statutQuestions)
    const idx = order.findIndex((q) => q.id === id)
    return order.length > 1 ? order[(idx + 1) % order.length]?.id : undefined
  }, [statutQuestions, id])

  if (!question) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-[17px] text-ink-600">Cette question n'existe pas.</p>
        <Link to="/entrainement" className="font-semibold text-mint-700 underline">Retour à l'entraînement</Link>
      </div>
    )
  }

  const startRecording = async () => { stopSpeaking(); stopwatch.reset(); await rec.start(); stopwatch.start() }
  const stopRecording = () => { rec.stop(); stopwatch.stop() }
  const goToGrid = () => {
    if (stopwatch.running) stopwatch.stop()
    if (rec.state === 'recording' || rec.state === 'requesting') rec.stop()
    setStage('grid')
  }
  const toggleCheck = (itemId: string) => setChecked((prev) => ({ ...prev, [itemId]: !prev[itemId] }))

  const scored = scoreGrid(grid, checked)
  const reveal = () => {
    setOralHistory((prev) => ({ ...prev, [id]: { score: computeOverallScore(scored), at: Date.now() } }))
    setStage('reveal')
  }

  const setMastery = (value: 'maitrise' | 'a-revoir') => {
    setStatutQuestions((prev) => {
      const next = { ...prev }
      if (prev[id] === value) delete next[id]
      else next[id] = value
      return next
    })
  }

  const example = question.kind === 'top' ? question.example : question.hook

  const restart = () => {
    stopwatch.reset()
    rec.reset()
    setChecked({})
    setStage('prepare')
  }

  return (
    <div className="animate-fade space-y-5">
      <span className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-bold text-navy-600">{question.id} · Entraînement oral</span>
      <h1 className="text-2xl font-extrabold leading-snug tracking-tight text-navy-900">{frenchNbsp(question.question)}</h1>
      <SpeakButton text={question.question} />

      {stage === 'prepare' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <ChronoDisplay elapsedMs={stopwatch.elapsedMs} target={question.targetSeconds} />
            <button
              type="button"
              onClick={() => (stopwatch.running ? stopwatch.stop() : stopwatch.start())}
              aria-label={stopwatch.running ? 'Arrêter le chrono' : 'Démarrer le chrono sans enregistrer'}
              className={`flex size-14 shrink-0 items-center justify-center rounded-full text-white ${stopwatch.running ? 'bg-coral-500' : 'bg-navy-200'}`}
            >
              {stopwatch.running ? <Pause aria-hidden="true" className="size-6" fill="currentColor" /> : <Play aria-hidden="true" className="size-6 text-navy-700" fill="currentColor" />}
            </button>
          </div>
          <RecorderPanel rec={rec} onStart={startRecording} onStop={stopRecording} />
          <Button variant="ghost" onClick={goToGrid} className="w-full">
            J'ai fini, je m'auto-évalue <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      )}

      {stage === 'grid' && (
        <div className="animate-rise space-y-4">
          {rec.audioUrl ? <audio controls src={rec.audioUrl} className="w-full" /> : null}
          <p className="text-sm font-semibold text-ink-600">Coche ce que tu as vraiment dit.</p>
          <EvalGrid items={grid} checked={checked} onToggle={toggleCheck} />
          <Button variant="primary" onClick={reveal} className="w-full">Voir la réponse type</Button>
        </div>
      )}

      {stage === 'reveal' && (
        <div className="animate-rise space-y-5">
          <Card className="flex items-center justify-around !p-4 text-center">
            <ScoreStat label="Idées" value={`${scored.ideas[0]}/${scored.ideas[1]}`} />
            <ScoreStat label="Erreurs" value={String(scored.avoidsHit)} tone={scored.avoidsHit ? 'coral' : 'mint'} />
            <ScoreStat label="Critères" value={`${scored.general[0]}/${scored.general[1]}`} />
          </Card>

          <div>
            <h2 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-mint-600">Réponse type</h2>
            <QuotedRichText text={example} profile={profile} />
          </div>

          {question.kind === 'top' ? (
            <div>
              <h2 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-mint-600">À éviter</h2>
              <p className="text-[16px] leading-relaxed text-coral-700"><RichText text={question.avoid} profile={profile} /></p>
            </div>
          ) : null}

          <div className="flex gap-2">
            <Button variant={statutQuestions[id] === 'maitrise' ? 'secondary' : 'ghost'} onClick={() => setMastery('maitrise')} className="flex-1">Je maîtrise</Button>
            <Button variant={statutQuestions[id] === 'a-revoir' ? 'primary' : 'ghost'} onClick={() => setMastery('a-revoir')} className="flex-1">À revoir</Button>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={restart} className="flex-1">
              <RotateCcw aria-hidden="true" className="size-4" /> Recommencer
            </Button>
            {nextId ? (
              <Button variant="primary" onClick={() => navigate(`/entrainement/oral/${nextId}`)} className="flex-1">
                Question suivante <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

function ScoreStat({ label, value, tone = 'navy' }: { label: string; value: string; tone?: 'navy' | 'mint' | 'coral' }) {
  const toneClass = tone === 'mint' ? 'text-mint-700' : tone === 'coral' ? 'text-coral-700' : 'text-navy-900'
  return (
    <div>
      <p className={`text-xl font-extrabold ${toneClass}`}>{value}</p>
      <p className="text-xs font-semibold text-ink-400">{label}</p>
    </div>
  )
}
