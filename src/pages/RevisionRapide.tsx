import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, PartyPopper, RotateCcw } from 'lucide-react'
import { QUESTIONS } from '../content'
import { quickReviewOrder } from '../lib/practice/selection'
import { reportActivityDone } from '../lib/practice/activity'
import { Button, Card } from '../ui/primitives'
import { QuotedRichText } from '../ui/RichText'
import { useProfile, useStatutQuestions } from '../ui/hooks'
import { frenchNbsp } from '../ui/format'

const BATCH_SIZE = 15

export default function RevisionRapide() {
  const [profile] = useProfile()
  const [statutQuestions, setStatutQuestions] = useStatutQuestions()
  const [order] = useState(() => quickReviewOrder(QUESTIONS, statutQuestions))
  const [batchStart, setBatchStart] = useState(0)
  const [posInBatch, setPosInBatch] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [masteredCount, setMasteredCount] = useState(0)

  const batchEnd = Math.min(batchStart + BATCH_SIZE, order.length)
  const batchLength = batchEnd - batchStart
  const hasMore = batchEnd < order.length
  const index = batchStart + posInBatch
  const seriesDone = posInBatch >= batchLength

  // Fin naturelle de la série : la carte « Série terminée » s'affiche.
  useEffect(() => {
    if (seriesDone) reportActivityDone({ kind: 'revision-rapide' })
  }, [seriesDone])

  const restart = () => {
    setBatchStart(0)
    setPosInBatch(0)
    setRevealed(false)
    setMasteredCount(0)
  }
  const continueNext = () => {
    setBatchStart(batchEnd)
    setPosInBatch(0)
    setRevealed(false)
  }

  if (seriesDone) {
    return (
      <div className="animate-fade flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <PartyPopper aria-hidden="true" className="size-12 text-mint-600" />
        <div className="space-y-1.5">
          <h1 className="text-xl font-extrabold tracking-tight text-navy-900">Série terminée</h1>
          <p className="text-[15px] text-ink-600">
            {frenchNbsp(`${batchLength} questions revues. ${masteredCount} marquée${masteredCount === 1 ? '' : 's'} « Je maîtrise ».`)}
          </p>
        </div>
        <div className="flex w-full gap-2">
          {hasMore ? (
            <>
              <Button variant="ghost" onClick={restart} className="flex-1"><RotateCcw aria-hidden="true" className="size-4" /> Recommencer</Button>
              <Button variant="primary" onClick={continueNext} className="flex-1">Continuer <ArrowRight aria-hidden="true" className="size-4" /></Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={restart} className="flex-1"><RotateCcw aria-hidden="true" className="size-4" /> Recommencer</Button>
              <Link to="/entrainement" className="flex flex-1 items-center justify-center rounded-full bg-navy-900 px-4 text-[15px] font-semibold text-white">Terminer</Link>
            </>
          )}
        </div>
      </div>
    )
  }

  const question = order[index]
  const example = question.kind === 'top' ? question.example : question.hook
  const status = statutQuestions[question.id]

  const setMastery = (value: 'maitrise' | 'a-revoir') => {
    if (value === 'maitrise' && status !== 'maitrise') setMasteredCount((c) => c + 1)
    setStatutQuestions((prev) => ({ ...prev, [question.id]: value }))
  }
  const next = () => { setPosInBatch((p) => p + 1); setRevealed(false) }

  return (
    <div className="animate-fade space-y-5">
      <p className="text-sm font-bold text-navy-700">Question {posInBatch + 1}/{batchLength}</p>
      <h1 className="text-2xl font-extrabold leading-snug tracking-tight text-navy-900">{frenchNbsp(question.question)}</h1>

      {!revealed ? (
        <Button variant="primary" onClick={() => setRevealed(true)} className="w-full">Je réfléchis, puis je révèle</Button>
      ) : (
        <div className="animate-rise space-y-4">
          <Card>
            <h2 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-mint-600">Réponse type</h2>
            <QuotedRichText text={example} profile={profile} />
          </Card>
          <div className="flex gap-2">
            <Button variant={status === 'maitrise' ? 'secondary' : 'ghost'} onClick={() => setMastery('maitrise')} className="flex-1">Je maîtrise</Button>
            <Button variant={status === 'a-revoir' ? 'primary' : 'ghost'} onClick={() => setMastery('a-revoir')} className="flex-1">À revoir</Button>
          </div>
          <Button variant="primary" onClick={next} className="w-full">Suivante <ArrowRight aria-hidden="true" className="size-4" /></Button>
        </div>
      )}
    </div>
  )
}
