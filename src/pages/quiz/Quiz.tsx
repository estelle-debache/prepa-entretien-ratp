import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { Check, RotateCcw, Zap, X } from 'lucide-react'
import { QUIZ } from '../../content/quiz/quiz'
import type { QuizItem } from '../../content/quiz/types'
import { pickQuiz, scoreQuiz, shuffleQuizOptions } from '../../lib/practice/quiz'
import { reportActivityDone } from '../../lib/practice/activity'
import { Button, Card, ProgressBar } from '../../ui/primitives'
import { useQuizState } from '../../ui/hooks'
import { frenchNbsp } from '../../ui/format'

type Stage = 'setup' | 'quiz' | 'result'

const CATEGORY_LABELS: Record<string, string> = {
  ratp: 'Groupe RATP', metier: 'Métier & formation', regles: 'Règles', lexique: 'Lexique', situation: 'Mises en situation',
}

export default function Quiz() {
  const [searchParams] = useSearchParams()
  const [quizState, setQuizState] = useQuizState()

  // Présélection depuis la barre de parcours (`?mode=serie|erreurs`) : démarrage direct, en un tap.
  const modeParam = searchParams.get('mode')
  const erreursPool = quizState.wrongIds.length > 0 ? QUIZ.filter((item) => quizState.wrongIds.includes(item.id)) : []
  const preset: { pool: QuizItem[]; n: number } | null =
    modeParam === 'erreurs' && erreursPool.length > 0 ? { pool: erreursPool, n: erreursPool.length }
    : modeParam === 'serie' ? { pool: QUIZ, n: 10 }
    : null

  const [stage, setStage] = useState<Stage>(preset ? 'quiz' : 'setup')
  const [items, setItems] = useState<QuizItem[]>(() => (preset ? pickQuiz(preset.pool, preset.n).map((item) => shuffleQuizOptions(item)) : []))
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const start = (n: number, pool: QuizItem[] = QUIZ) => {
    const picked = pickQuiz(pool, n).map((item) => shuffleQuizOptions(item))
    setItems(picked)
    setIndex(0)
    setAnswers({})
    setStage('quiz')
  }

  const current = items[index]
  const answered = current ? answers[current.id] !== undefined : false
  const isLast = index === items.length - 1

  const selectAnswer = (optionIndex: number) => {
    if (!current || answered) return
    setAnswers((prev) => ({ ...prev, [current.id]: optionIndex }))
  }

  const goNext = () => {
    if (isLast) {
      const result = scoreQuiz(items, answers)
      const wrongIds = items.filter((item) => answers[item.id] !== item.answer).map((item) => item.id)
      setQuizState({ wrongIds, lastScore: { correct: result.correct, total: result.total }, lastAt: Date.now() })
      reportActivityDone({ kind: 'quiz' })
      setStage('result')
    } else {
      setIndex((i) => i + 1)
    }
  }

  if (stage === 'setup') {
    const previousWrong = quizState.wrongIds.length > 0 ? QUIZ.filter((item) => quizState.wrongIds.includes(item.id)) : []
    return (
      <div className="space-y-5">
        <header className="animate-rise space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Quiz</h1>
          <p className="text-[15px] text-ink-600">Des questions rapides pour vérifier ce que tu sais déjà.</p>
        </header>
        <div className="animate-rise space-y-3">
          {previousWrong.length > 0 ? (
            <Button variant="secondary" onClick={() => start(previousWrong.length, previousWrong)} className="w-full">
              Reprendre mes erreurs ({previousWrong.length})
            </Button>
          ) : null}
          <Button variant="primary" onClick={() => start(10)} className="w-full">
            <Zap aria-hidden="true" className="size-4" /> Série de 10 questions
          </Button>
          <Button variant="ghost" onClick={() => start(QUIZ.length)} className="w-full">
            Tout faire ({QUIZ.length} questions)
          </Button>
        </div>
      </div>
    )
  }

  if (stage === 'quiz' && current) {
    return (
      <div className="animate-fade space-y-5">
        <div className="flex items-center justify-between text-sm font-bold text-navy-700">
          <span>Question {index + 1}/{items.length}</span>
          <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs">{CATEGORY_LABELS[current.category] ?? current.category}</span>
        </div>
        <ProgressBar value={index + (answered ? 1 : 0)} max={items.length} />

        <h1 className="text-xl font-extrabold leading-snug tracking-tight text-navy-900">{frenchNbsp(current.question)}</h1>

        <div className="space-y-2.5">
          {current.options.map((option, i) => {
            const isCorrect = i === current.answer
            const isSelected = answers[current.id] === i
            let tone = 'border-navy-100 bg-white text-ink-900'
            if (answered && isCorrect) tone = 'border-mint-500 bg-mint-50 text-mint-800'
            else if (answered && isSelected) tone = 'border-coral-500 bg-coral-50 text-coral-800'
            return (
              <button
                key={i}
                type="button"
                disabled={answered}
                onClick={() => selectAnswer(i)}
                className={`flex min-h-12 w-full items-center gap-2.5 rounded-2xl border-2 px-4 py-3 text-left text-[16px] font-medium transition-colors disabled:opacity-100 ${tone}`}
              >
                {answered && isCorrect ? <Check aria-hidden="true" className="size-4 shrink-0" /> : null}
                {answered && isSelected && !isCorrect ? <X aria-hidden="true" className="size-4 shrink-0" /> : null}
                {frenchNbsp(option)}
              </button>
            )
          })}
        </div>

        {answered && (
          <div className="animate-rise space-y-3">
            <Card className="!border-navy-100 !bg-navy-50 !p-3">
              <p className="text-sm leading-relaxed text-navy-800">{frenchNbsp(current.explanation)}</p>
            </Card>
            <Button variant="primary" onClick={goNext} className="w-full">{isLast ? 'Voir mon score' : 'Question suivante'}</Button>
          </div>
        )}
      </div>
    )
  }

  const result = scoreQuiz(items, answers)
  const wrongItems = items.filter((item) => answers[item.id] !== item.answer)

  return (
    <div className="animate-fade space-y-5">
      <header className="space-y-1 text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-mint-600">Résultat</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-navy-900">{result.correct}/{result.total}</h1>
      </header>

      <Card className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wide text-mint-600">Par thème</h2>
        {Object.entries(result.byCategory).map(([category, { correct, total }]) => (
          <div key={category} className="space-y-1">
            <div className="flex items-center justify-between text-sm font-semibold text-navy-700">
              <span>{CATEGORY_LABELS[category] ?? category}</span>
              <span>{correct}/{total}</span>
            </div>
            <ProgressBar value={correct} max={total} />
          </div>
        ))}
      </Card>

      <div className="space-y-2.5">
        <Button variant="primary" onClick={() => setStage('setup')} className="w-full">
          <RotateCcw aria-hidden="true" className="size-4" /> Refaire un quiz
        </Button>
        {wrongItems.length > 0 ? (
          <Button variant="ghost" onClick={() => start(wrongItems.length, wrongItems)} className="w-full">
            Recommencer avec mes erreurs ({wrongItems.length})
          </Button>
        ) : (
          <p className="text-center text-sm font-semibold text-mint-700">{frenchNbsp('Aucune erreur, bravo !')}</p>
        )}
      </div>
    </div>
  )
}
