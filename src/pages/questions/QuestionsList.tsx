import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ChevronRight, Star } from 'lucide-react'
import { BANK_QUESTIONS, THEMES, TOP_QUESTIONS } from '../../content'
import type { Question, ThemeId } from '../../content/types'
import { Card, Chip, StatusBadge } from '../../ui/primitives'
import { useStatutQuestions } from '../../ui/hooks'

type StatusFilter = 'all' | 'nouvelle' | 'a-revoir' | 'maitrise'

function statusOf(id: string, statut: Record<string, string>): 'nouvelle' | 'a-revoir' | 'maitrise' {
  const value = statut[id]
  return value === 'maitrise' || value === 'a-revoir' ? value : 'nouvelle'
}

function QuestionRow({ question, index, status }: { question: Question; index: number; status: 'nouvelle' | 'a-revoir' | 'maitrise' }) {
  return (
    <Link
      to={`/questions/${question.id}`}
      className="animate-rise flex min-h-16 items-center gap-3 border-b border-navy-50 px-4 py-3 last:border-b-0 hover:bg-navy-50/60"
      style={{ animationDelay: `${Math.min(index, 10) * 35}ms` }}
    >
      {question.kind === 'top' && question.star ? (
        <Star aria-hidden="true" className="size-4 shrink-0 fill-amber-500 text-amber-500" />
      ) : (
        <span className="w-4 shrink-0" />
      )}
      <span className="flex-1">
        <span className="line-clamp-2 text-[15px] font-semibold leading-snug text-navy-900">{question.question}</span>
        <span className="mt-0.5 block text-xs font-medium text-ink-400">{question.id}</span>
      </span>
      <StatusBadge status={status} />
      <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-navy-300" />
    </Link>
  )
}

export default function QuestionsList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const starOnly = searchParams.get('star') === '1'
  const [theme, setTheme] = useState<ThemeId | 'all'>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [statutQuestions] = useStatutQuestions()

  const toggleStar = () => {
    const next = new URLSearchParams(searchParams)
    if (starOnly) next.delete('star')
    else next.set('star', '1')
    setSearchParams(next, { replace: true })
  }

  const filteredTop = useMemo(
    () => TOP_QUESTIONS.filter((q) => {
      if (starOnly && !q.star) return false
      if (theme !== 'all' && q.theme !== theme) return false
      if (status !== 'all' && statusOf(q.id, statutQuestions) !== status) return false
      return true
    }),
    [starOnly, theme, status, statutQuestions],
  )
  const filteredBank = useMemo(
    () => starOnly ? [] : BANK_QUESTIONS.filter((q) => {
      if (theme !== 'all' && q.theme !== theme) return false
      if (status !== 'all' && statusOf(q.id, statutQuestions) !== status) return false
      return true
    }),
    [starOnly, theme, status, statutQuestions],
  )
  const total = filteredTop.length + filteredBank.length

  return (
    <div className="space-y-5">
      <header className="animate-rise space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Questions</h1>
        <p className="text-[15px] text-ink-600">15 questions clés + 30 de la banque. Entraîne-toi question par question.</p>
      </header>

      <div className="animate-rise flex flex-wrap gap-2" style={{ animationDelay: '40ms' }}>
        <Chip active={starOnly} onClick={toggleStar} icon={<Star aria-hidden="true" className="size-3.5" fill={starOnly ? 'currentColor' : 'none'} />}>
          Prioritaires
        </Chip>
        <Chip active={status === 'a-revoir'} onClick={() => setStatus((s) => (s === 'a-revoir' ? 'all' : 'a-revoir'))}>À revoir</Chip>
        <Chip active={status === 'maitrise'} onClick={() => setStatus((s) => (s === 'maitrise' ? 'all' : 'maitrise'))}>Maîtrisées</Chip>
        <Chip active={status === 'nouvelle'} onClick={() => setStatus((s) => (s === 'nouvelle' ? 'all' : 'nouvelle'))}>Nouvelles</Chip>
      </div>

      <div className="animate-rise -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" style={{ animationDelay: '70ms' }}>
        <Chip active={theme === 'all'} onClick={() => setTheme('all')}>Tous les thèmes</Chip>
        {THEMES.map((t) => (
          <Chip key={t.id} active={theme === t.id} onClick={() => setTheme((v) => (v === t.id ? 'all' : t.id))}>{t.label}</Chip>
        ))}
      </div>

      <p className="animate-rise text-sm font-semibold text-ink-400" style={{ animationDelay: '90ms' }}>{total} question{total === 1 ? '' : 's'} sur {BANK_QUESTIONS.length + TOP_QUESTIONS.length}</p>

      {filteredTop.length > 0 && (
        <section className="animate-rise space-y-2" style={{ animationDelay: '110ms' }}>
          <h2 className="px-1 text-xs font-bold uppercase tracking-wide text-mint-600">Questions clés</h2>
          <Card className="!p-0 divide-y divide-navy-50 overflow-hidden">
            {filteredTop.map((q, i) => <QuestionRow key={q.id} question={q} index={i} status={statusOf(q.id, statutQuestions)} />)}
          </Card>
        </section>
      )}

      {filteredBank.length > 0 && (
        <section className="animate-rise space-y-3" style={{ animationDelay: '140ms' }}>
          <h2 className="px-1 text-xs font-bold uppercase tracking-wide text-mint-600">Questions de la banque</h2>
          {THEMES.map((t) => {
            const group = filteredBank.filter((q) => q.theme === t.id)
            if (group.length === 0) return null
            return (
              <div key={t.id} className="space-y-2">
                <h3 className="px-1 text-sm font-bold text-navy-700">{t.label}</h3>
                <Card className="!p-0 divide-y divide-navy-50 overflow-hidden">
                  {group.map((q, i) => <QuestionRow key={q.id} question={q} index={i} status={statusOf(q.id, statutQuestions)} />)}
                </Card>
              </div>
            )
          })}
        </section>
      )}

      {total === 0 && (
        <p className="rounded-2xl border border-dashed border-navy-100 p-6 text-center text-[15px] text-ink-400">
          Aucune question ne correspond à ces filtres.
        </p>
      )}
    </div>
  )
}
