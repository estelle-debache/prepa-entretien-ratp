import { useNavigate } from 'react-router'
import { ArrowRight, Check, PartyPopper, SkipForward } from 'lucide-react'
import {
  currentStep, isTourFinished, jumpTo, PARCOURS_LENGTH, resolveTour, withParcours,
  type ParcoursState, type ResolvedStep,
} from '../lib/practice/parcours'
import { STEP_ICONS } from '../ui/stepIcons'
import { useParcoursEngine } from '../ui/useParcoursEngine'
import { goToNextTour } from '../ui/parcoursActions'
import { Button, Card, ProgressBar } from '../ui/primitives'
import { frenchNbsp } from '../ui/format'

function StepRow({
  step, status, onOpen,
}: { step: ResolvedStep; status: 'fait' | 'courant' | 'a-venir'; onOpen: () => void }) {
  const Icon = STEP_ICONS[step.kind]
  const statusLabel = status === 'fait' ? 'fait' : status === 'courant' ? 'en cours' : 'à venir'
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-current={status === 'courant' ? 'step' : undefined}
      aria-label={`Étape ${step.index + 1} sur ${PARCOURS_LENGTH}, ${statusLabel} : ${step.title}`}
      className={`flex min-h-16 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors active:scale-[0.99] ${
        status === 'courant'
          ? 'border-mint-500 bg-mint-50'
          : status === 'fait'
            ? 'border-navy-50 bg-white'
            : 'border-navy-100 bg-white'
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          status === 'fait' ? 'bg-mint-500 text-white' : status === 'courant' ? 'bg-mint-100 text-mint-700' : 'bg-navy-50 text-navy-600'
        }`}
      >
        {status === 'fait' ? <Check className="size-4" strokeWidth={3} /> : step.index + 1}
      </span>
      <span className="flex-1">
        <span className={`block text-[15px] font-bold leading-snug ${status === 'fait' ? 'text-ink-400' : 'text-navy-900'}`}>{step.title}</span>
        {step.subtitle ? <span className="block text-xs text-ink-400">{step.subtitle}</span> : null}
      </span>
      <Icon aria-hidden="true" className={`size-4 shrink-0 ${status === 'courant' ? 'text-mint-600' : 'text-navy-300'}`} />
    </button>
  )
}

export default function Parcours() {
  const navigate = useNavigate()
  const engine = useParcoursEngine()
  const { state, setState, ctx } = engine
  // Seule source de vérité pour « tour terminé » : jamais un paramètre d'URL (qui peut rester
  // dans l'historique après un retour arrière, une fois le tour suivant déjà commencé).
  const finished = isTourFinished(state)

  let steps: ResolvedStep[] | null = null
  try {
    steps = resolveTour(state, ctx)
  } catch {
    steps = null
  }

  const openStep = (index: number) => {
    let next: ParcoursState
    try {
      next = jumpTo(state, index, ctx)
    } catch {
      return
    }
    setState(next)
    try {
      navigate(withParcours(currentStep(next, ctx).route))
    } catch {
      /* ignore */
    }
  }

  if (!steps) {
    return <p className="text-center text-[15px] text-ink-400">Ton parcours se prépare…</p>
  }

  const statusOf = (step: ResolvedStep): 'fait' | 'courant' | 'a-venir' => {
    if (!finished && step.index === state.index) return 'courant'
    if (state.visited.includes(step.index)) return 'fait'
    return 'a-venir'
  }

  return (
    <div className="space-y-5">
      {finished ? (
        <Card className="animate-pop space-y-3 !border-mint-200 !bg-mint-50 text-center">
          <PartyPopper aria-hidden="true" className="mx-auto size-8 text-mint-600" />
          <h1 className="text-xl font-extrabold tracking-tight text-navy-900">Tour {state.tour} terminé</h1>
          <p className="text-[15px] text-mint-800">
            {frenchNbsp('Bravo, tu as fait le tour complet. Les 5 questions ★ reviennent, avec de nouvelles mises en situation et un autre jeu de rôle.')}
          </p>
          <Button variant="secondary" onClick={() => goToNextTour(engine, navigate)} className="w-full">
            Commencer le tour {state.tour + 1} <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </Card>
      ) : (
        <header className="animate-rise space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-mint-600">Ton parcours</p>
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Tour {state.tour}</h1>
            <span className="shrink-0 rounded-full bg-navy-50 px-2.5 py-1 text-xs font-bold text-navy-700">{state.visited.length}/{PARCOURS_LENGTH}</span>
          </div>
          <ProgressBar value={state.visited.length} max={PARCOURS_LENGTH} />
        </header>
      )}

      <ul className="animate-rise space-y-2" style={{ animationDelay: '60ms' }}>
        {steps.map((step) => (
          <li key={step.index}>
            <StepRow step={step} status={statusOf(step)} onOpen={() => openStep(step.index)} />
          </li>
        ))}
      </ul>

      <p className="flex items-center justify-center gap-1.5 text-center text-sm font-medium text-ink-400">
        <SkipForward aria-hidden="true" className="size-4" />
        Tout reste accessible librement dans les onglets.
      </p>
    </div>
  )
}
