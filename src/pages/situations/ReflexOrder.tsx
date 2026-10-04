import { useState } from 'react'
import { Check, RotateCcw, Undo2, X } from 'lucide-react'
import { REFLEX_STEPS } from '../../content'
import { checkOrder, REFLEX_NOTE, shuffledReflexes } from '../../lib/practice/reflex'
import { reportActivityDone } from '../../lib/practice/activity'
import { Button, Card } from '../../ui/primitives'
import { frenchNbsp } from '../../ui/format'
import { useReflexState } from '../../ui/hooks'

export default function ReflexOrder() {
  const [pool, setPool] = useState<string[]>(() => shuffledReflexes())
  const [selected, setSelected] = useState<string[]>([])
  const [result, setResult] = useState<{ correct: boolean; positions: boolean[] } | null>(null)
  const [, setReflexState] = useReflexState()

  const pick = (step: string) => {
    if (result) return
    setSelected((s) => [...s, step])
    setPool((p) => p.filter((x) => x !== step))
  }
  const undoLast = () => {
    if (result || selected.length === 0) return
    const last = selected[selected.length - 1]
    setSelected((s) => s.slice(0, -1))
    setPool((p) => [...p, last])
  }
  const verify = () => {
    const outcome = checkOrder(selected)
    setResult(outcome)
    setReflexState((previous) => ({
      attempts: previous.attempts + 1,
      successes: previous.successes + (outcome.correct ? 1 : 0),
      lastAt: Date.now(),
    }))
    reportActivityDone({ kind: 'reflex' })
  }
  const restart = () => {
    setPool(shuffledReflexes())
    setSelected([])
    setResult(null)
  }

  return (
    <div className="space-y-5">
      <header className="animate-rise space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Exercice des réflexes</h1>
        <p className="text-[15px] text-ink-600">{frenchNbsp("Touche les étapes dans l'ordre : du premier réflexe au dernier.")}</p>
      </header>

      <Card className="animate-rise">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-mint-600">Ton ordre</h2>
        {selected.length === 0 ? (
          <p className="text-sm text-ink-400">Touche une étape ci-dessous pour commencer.</p>
        ) : (
          <ol className="space-y-2">
            {selected.map((step, i) => {
              const status = result ? (result.positions[i] ? 'ok' : 'ko') : null
              return (
                <li
                  key={step}
                  className={`flex items-center gap-3 rounded-xl border-2 px-3.5 py-2.5 text-[15px] font-semibold ${
                    status === 'ok' ? 'border-mint-500 bg-mint-50 text-mint-800' : status === 'ko' ? 'border-coral-500 bg-coral-50 text-coral-800' : 'border-navy-100 bg-white text-navy-900'
                  }`}
                >
                  <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">{i + 1}</span>
                  <span className="flex-1">{step}</span>
                  {status === 'ok' && <Check aria-hidden="true" className="size-4 shrink-0" />}
                  {status === 'ko' && <X aria-hidden="true" className="size-4 shrink-0" />}
                </li>
              )
            })}
          </ol>
        )}
        {!result && selected.length > 0 && (
          <button type="button" onClick={undoLast} className="mt-3 flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink-400 underline">
            <Undo2 aria-hidden="true" className="size-4" /> Revenir en arrière
          </button>
        )}
      </Card>

      {pool.length > 0 && !result && (
        <div className="animate-rise flex flex-wrap gap-2">
          {pool.map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => pick(step)}
              className="min-h-11 rounded-full border-2 border-navy-100 bg-white px-4 text-[15px] font-semibold text-navy-900 active:scale-[0.97]"
            >
              {step}
            </button>
          ))}
        </div>
      )}

      {!result && pool.length === 0 && selected.length > 0 && (
        <Button variant="primary" onClick={verify} className="w-full">Vérifier mon ordre</Button>
      )}

      {result && (
        <div className="animate-rise space-y-3">
          <Card className={result.correct ? '!border-mint-200 !bg-mint-50' : '!border-amber-100 !bg-amber-50'}>
            <p className={`text-[15px] font-bold ${result.correct ? 'text-mint-800' : 'text-amber-800'}`}>
              {frenchNbsp(result.correct ? 'Bravo, c’est le bon ordre !' : 'Pas tout à fait : regarde les étapes en rouge.')}
            </p>
          </Card>
          {!result.correct && (
            <Card>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-mint-600">{frenchNbsp('Le bon ordre :')}</h2>
              <ol className="space-y-2">
                {REFLEX_STEPS.map((step, i) => (
                  <li key={step} className="flex items-center gap-3 text-[15px] font-semibold text-navy-900">
                    <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-full bg-mint-500 text-xs font-bold text-white">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </Card>
          )}
          <p className="rounded-2xl bg-navy-50 p-3 text-sm text-navy-700">{frenchNbsp(REFLEX_NOTE)}</p>
          <Button variant="ghost" onClick={restart} className="w-full">
            <RotateCcw aria-hidden="true" className="size-4" /> Recommencer
          </Button>
        </div>
      )}
    </div>
  )
}
