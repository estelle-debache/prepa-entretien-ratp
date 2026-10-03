import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowRight, Eye, Pause, Play, RotateCcw, Users } from 'lucide-react'
import { getQuestion, QUESTIONS } from '../../content'
import { friendModeInstructions } from '../../content/practice/simulationIntro'
import { buildGrid, scoreGrid } from '../../lib/practice/grid'
import { useStopwatch } from '../../lib/practice/timer'
import { quickReviewOrder } from '../../lib/practice/selection'
import { computeOverallScore } from '../../ui/trainingLogic'
import { useAmiHistory, useProfile, useStatutQuestions } from '../../ui/hooks'
import { RichText, QuotedRichText } from '../../ui/RichText'
import { ChronoDisplay } from '../../ui/ChronoDisplay'
import { EvalGrid } from '../../ui/EvalGrid'
import { Button, Card } from '../../ui/primitives'
import { frenchNbsp } from '../../ui/format'

type Stage = 'grade' | 'reveal'

/** Remonte à chaque question : réinitialise le chrono et la grille. */
export default function Ami() {
  const { id = '' } = useParams()
  return <AmiInner key={id} id={id} />
}

function AmiInner({ id }: { id: string }) {
  const navigate = useNavigate()
  const [profile] = useProfile()
  const [statutQuestions, setStatutQuestions] = useStatutQuestions()
  const [, setAmiHistory] = useAmiHistory()
  const question = getQuestion(id)
  const stopwatch = useStopwatch()
  const [stage, setStage] = useState<Stage>('grade')
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [showExample, setShowExample] = useState(false)

  const prenom = profile.prenom?.trim() || 'Yahia'
  const grid = useMemo(() => (question ? buildGrid(question, 'ami') : []), [question])
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

  const toggleCheck = (itemId: string) => setChecked((prev) => ({ ...prev, [itemId]: !prev[itemId] }))
  const scored = scoreGrid(grid, checked)
  const example = question.kind === 'top' ? question.example : question.hook

  const seeBilan = () => {
    if (stopwatch.running) stopwatch.stop()
    setAmiHistory((prev) => ({ ...prev, [id]: { score: computeOverallScore(scored), at: Date.now() } }))
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

  return (
    <div className="animate-fade space-y-5">
      <span className="flex w-fit items-center gap-1.5 rounded-full bg-navy-50 px-2.5 py-1 text-xs font-bold text-navy-600">
        <Users aria-hidden="true" className="size-3.5" /> Mode ami · {question.id}
      </span>

      <Card className="!border-mint-100 !bg-mint-50 !p-3">
        <p className="text-[14px] font-medium text-mint-900">{frenchNbsp(friendModeInstructions(prenom))}</p>
      </Card>

      <h1 className="text-[28px] font-extrabold leading-snug tracking-tight text-navy-900">{frenchNbsp(question.question)}</h1>

      {stage === 'grade' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <ChronoDisplay elapsedMs={stopwatch.elapsedMs} target={question.targetSeconds} />
            <button
              type="button"
              onClick={() => (stopwatch.running ? stopwatch.stop() : stopwatch.start())}
              aria-label={stopwatch.running ? 'Arrêter le chrono' : 'Démarrer le chrono'}
              className={`flex size-14 shrink-0 items-center justify-center rounded-full text-white ${stopwatch.running ? 'bg-coral-500' : 'bg-mint-500'}`}
            >
              {stopwatch.running ? <Pause aria-hidden="true" className="size-6" fill="currentColor" /> : <Play aria-hidden="true" className="size-6" fill="currentColor" />}
            </button>
          </div>
          <p className="text-sm font-semibold text-ink-600">{frenchNbsp(`Coche à mesure que ${prenom} parle.`)}</p>
          <EvalGrid items={grid} checked={checked} onToggle={toggleCheck} big />
          <Button variant="primary" onClick={seeBilan} className="w-full">Voir le bilan</Button>
        </div>
      )}

      {stage === 'reveal' && (
        <div className="animate-rise space-y-5">
          <Card className="flex items-center justify-around !p-4 text-center">
            <ScoreStat label="Idées" value={`${scored.ideas[0]}/${scored.ideas[1]}`} />
            <ScoreStat label="Erreurs" value={String(scored.avoidsHit)} tone={scored.avoidsHit ? 'coral' : 'mint'} />
            <ScoreStat label="Critères" value={`${scored.general[0]}/${scored.general[1]}`} />
          </Card>

          {!showExample ? (
            <Button variant="ghost" onClick={() => setShowExample(true)} className="w-full">
              <Eye aria-hidden="true" className="size-4" /> {frenchNbsp(`Montrer la réponse type à ${prenom}`)}
            </Button>
          ) : (
            <div className="animate-rise space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wide text-mint-600">Réponse type</h2>
              <QuotedRichText text={example} profile={profile} />
              {question.kind === 'top' ? (
                <p className="text-[15px] leading-relaxed text-coral-700"><RichText text={question.avoid} profile={profile} /></p>
              ) : null}
            </div>
          )}

          <div className="flex gap-2">
            <Button variant={statutQuestions[id] === 'maitrise' ? 'secondary' : 'ghost'} onClick={() => setMastery('maitrise')} className="flex-1">Je maîtrise</Button>
            <Button variant={statutQuestions[id] === 'a-revoir' ? 'primary' : 'ghost'} onClick={() => setMastery('a-revoir')} className="flex-1">À revoir</Button>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => { stopwatch.reset(); setChecked({}); setShowExample(false); setStage('grade') }} className="flex-1">
              <RotateCcw aria-hidden="true" className="size-4" /> Recommencer
            </Button>
            {nextId ? (
              <Button variant="primary" onClick={() => navigate(`/entrainement/ami/${nextId}`)} className="flex-1">
                Suivante <ArrowRight aria-hidden="true" className="size-4" />
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
