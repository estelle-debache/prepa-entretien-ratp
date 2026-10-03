import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ChevronLeft, ChevronRight, Clock, Mic, PencilLine, Star, X } from 'lucide-react'
import { getQuestion, QUESTIONS } from '../../content'
import type { Profile, RichText as RichTextValue, Question } from '../../content/types'
import { missingFields } from '../../lib/content/personalize'
import { Button, Card } from '../../ui/primitives'
import { RichText, QuotedRichText } from '../../ui/RichText'
import { useProfile, useStatutQuestions } from '../../ui/hooks'
import { formatTargetSeconds } from '../../ui/format'

type Stage = { key: string; label: string }

export default function QuestionDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [profile] = useProfile()
  const [statutQuestions, setStatutQuestions] = useStatutQuestions()
  const [revealed, setRevealed] = useState(0)

  const question = getQuestion(id)
  const index = QUESTIONS.findIndex((q) => q.id === id)
  const prevQuestion = index > 0 ? QUESTIONS[index - 1] : undefined
  const nextQuestion = index >= 0 && index < QUESTIONS.length - 1 ? QUESTIONS[index + 1] : undefined

  if (!question) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-[17px] text-ink-600">Cette question n'existe pas (ou plus).</p>
        <Link to="/questions" className="font-semibold text-mint-700 underline">Retour aux questions</Link>
      </div>
    )
  }

  const stages: Stage[] = question.kind === 'top'
    ? [
        { key: 'checks', label: 'Ce qu\u2019ils vérifient' },
        { key: 'ideas', label: '3 idées à placer' },
        { key: 'example', label: 'Exemple (à dire avec tes mots)' },
        { key: 'avoid', label: 'À éviter' },
      ]
    : [
        { key: 'ideas', label: 'Idées à placer' },
        { key: 'hook', label: 'Une accroche possible' },
      ]

  const texts: RichTextValue[] = question.kind === 'top'
    ? [...question.ideas, question.example, question.avoid]
    : [...question.ideas, question.hook]
  const missing = missingFields(texts, profile)

  const status = statutQuestions[id] === 'maitrise' || statutQuestions[id] === 'a-revoir' ? statutQuestions[id] : undefined
  const setStatus = (value: 'maitrise' | 'a-revoir') => {
    setStatutQuestions((prev) => {
      const next = { ...prev }
      if (prev[id] === value) delete next[id]
      else next[id] = value
      return next
    })
  }

  return (
    <div className="animate-fade space-y-5">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-bold text-navy-600">
          {question.id} · {index + 1}/{QUESTIONS.length}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-navy-50 px-2.5 py-1 text-xs font-bold text-navy-600">
          <Clock aria-hidden="true" className="size-3.5" />
          Vise {formatTargetSeconds(question.targetSeconds)}
        </span>
      </div>

      <h1 className="flex items-start gap-2 text-2xl font-extrabold leading-snug tracking-tight text-navy-900">
        {question.kind === 'top' && question.star ? <Star aria-hidden="true" className="mt-1 size-5 shrink-0 fill-amber-500 text-amber-500" /> : null}
        {question.question}
      </h1>

      {missing.length > 0 && (
        <Card className="!border-amber-100 !bg-amber-50 !p-4">
          <p className="flex items-center gap-1.5 text-sm font-bold text-amber-800"><PencilLine aria-hidden="true" className="size-4" /> Complète ta fiche pour personnaliser</p>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-sm text-amber-800">
            {missing.map((field) => <li key={field}>{field}</li>)}
          </ul>
          <Link to="/fiche" className="mt-2 inline-block text-sm font-bold text-amber-800 underline">Aller à ma fiche</Link>
        </Card>
      )}

      <div className="flex gap-2">
        <Button
          variant={status === 'maitrise' ? 'secondary' : 'ghost'}
          onClick={() => setStatus('maitrise')}
          aria-pressed={status === 'maitrise'}
          className="flex-1"
        >
          Je maîtrise
        </Button>
        <Button
          variant={status === 'a-revoir' ? 'primary' : 'ghost'}
          onClick={() => setStatus('a-revoir')}
          aria-pressed={status === 'a-revoir'}
          className="flex-1"
        >
          À revoir
        </Button>
      </div>

      <div className="space-y-4">
        {stages.slice(0, revealed).map((stage) => (
          <section key={stage.key} className="animate-rise space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wide text-mint-600">{stage.label}</h2>
            <StageContent question={question} stageKey={stage.key} profile={profile} />
          </section>
        ))}
      </div>

      {revealed < stages.length ? (
        <Button variant="primary" onClick={() => setRevealed((r) => r + 1)} className="w-full">
          {revealed === 0 ? 'Je réfléchis, puis je révèle' : `Révéler : ${stages[revealed].label}`}
        </Button>
      ) : (
        <Button variant="ghost" onClick={() => setRevealed(0)} className="w-full">
          <X aria-hidden="true" className="size-4" /> Recommencer la révélation
        </Button>
      )}

      <Link
        to={`/entrainement/oral/${question.id}`}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-mint-300 text-[15px] font-semibold text-mint-700"
      >
        <Mic aria-hidden="true" className="size-4" /> M'entraîner à l'oral
      </Link>

      <div className="flex items-center justify-between gap-2 border-t border-navy-100 pt-4">
        <button
          type="button"
          disabled={!prevQuestion}
          onClick={() => prevQuestion && navigate(`/questions/${prevQuestion.id}`)}
          className="flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-semibold text-navy-700 disabled:opacity-30"
        >
          <ChevronLeft aria-hidden="true" className="size-4" /> Précédente
        </button>
        <button
          type="button"
          disabled={!nextQuestion}
          onClick={() => nextQuestion && navigate(`/questions/${nextQuestion.id}`)}
          className="flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-semibold text-navy-700 disabled:opacity-30"
        >
          Suivante <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  )
}

function StageContent({ question, stageKey, profile }: { question: Question; stageKey: string; profile: Profile }) {
  if (stageKey === 'checks' && question.kind === 'top') {
    return <p className="text-[17px] leading-relaxed text-ink-900">{question.checks}</p>
  }
  if (stageKey === 'ideas') {
    return (
      <ul className="space-y-2">
        {question.ideas.map((idea, i) => (
          <li key={i} className="flex gap-2.5 text-[17px] leading-relaxed text-ink-900">
            <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">{i + 1}</span>
            <span><RichText text={idea} profile={profile} /></span>
          </li>
        ))}
      </ul>
    )
  }
  if (stageKey === 'example' && question.kind === 'top') {
    return <QuotedRichText text={question.example} profile={profile} />
  }
  if (stageKey === 'avoid' && question.kind === 'top') {
    return <p className="text-[17px] leading-relaxed text-coral-700"><RichText text={question.avoid} profile={profile} /></p>
  }
  if (stageKey === 'hook' && question.kind === 'bank') {
    return <QuotedRichText text={question.hook} profile={profile} />
  }
  return null
}
