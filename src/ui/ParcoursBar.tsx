import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ArrowRight, Undo2 } from 'lucide-react'
import {
  completeCurrent, currentStep, isTourFinished, PARCOURS_LENGTH, skipCurrent, withParcours,
  type ParcoursState, type ResolveContext,
} from '../lib/practice/parcours'
import { matchesStep, useLastActivityDone } from '../lib/practice/activity'
import { STEP_ICONS } from './stepIcons'
import { useParcoursEngine } from './useParcoursEngine'
import { BOTTOM_NAV_HEIGHT } from './BottomNav'

/** Hauteur réservée par `Shell` au-dessus de la barre de navigation quand cette barre est affichée. */
export const PARCOURS_BAR_HEIGHT = '4.75rem'

/** Verrou anti-double-tap, levé au prochain changement de route (ou après 800 ms en secours). */
const LOCK_TIMEOUT_MS = 800

type Transition = (state: ParcoursState, ctx: ResolveContext, opts: { expectedIndex: number }) => ParcoursState

/**
 * Barre flottante du mode parcours (au-dessus de `BottomNav`). Propose une unique action
 * « suivant » qui fait avancer le parcours puis navigue vers l'étape résolue.
 */
export function ParcoursBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { state, setState, ctx, step } = useParcoursEngine()
  const lastDone = useLastActivityDone(`${state.tour}:${state.index}`)

  // Anti-double-tap : un tap pose le verrou immédiatement, un second tap très rapide est ignoré
  // tant que la navigation n'a pas eu lieu (ou pendant 800 ms maximum, en filet de sécurité).
  const lockedRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    lockedRef.current = false
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = undefined }
  }, [pathname])
  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])

  if (!step) {
    return (
      <div
        role="status"
        className="no-print fixed inset-x-0 z-20 border-t border-navy-100 bg-white/95 px-4 py-3.5 text-center text-sm font-semibold text-ink-400 backdrop-blur"
        style={{ bottom: BOTTOM_NAV_HEIGHT }}
      >
        Ton parcours se prépare…
      </div>
    )
  }

  const stepPath = step.route.split('?')[0]
  const onStep = pathname === stepPath
  const bravo = Boolean(lastDone && matchesStep(lastDone, step))
  const Icon = STEP_ICONS[step.kind]

  const withLock = (fn: () => void) => {
    if (lockedRef.current) return
    lockedRef.current = true
    timeoutRef.current = setTimeout(() => { lockedRef.current = false }, LOCK_TIMEOUT_MS)
    fn()
  }

  const goToStep = () => navigate(withParcours(step.route))

  const runTransition = (transition: Transition) => {
    let next: ParcoursState
    try {
      next = transition(state, ctx, { expectedIndex: state.index })
    } catch {
      return
    }
    setState(next)
    if (isTourFinished(next)) {
      navigate(`/parcours?fini=${next.tour}`)
      return
    }
    try {
      navigate(withParcours(currentStep(next, ctx).route))
    } catch {
      navigate('/parcours')
    }
  }

  const advance = () => withLock(() => { if (!onStep) { goToStep(); return } runTransition(completeCurrent) })
  const skip = () => withLock(() => { if (!onStep) { goToStep(); return } runTransition(skipCurrent) })

  const mainLabel = !onStep ? 'Revenir à l’étape' : step.kind === 'read' ? "J'ai lu" : 'Étape suivante'

  return (
    <div
      role="region"
      aria-label="Parcours en cours"
      className="no-print fixed inset-x-0 z-20 border-t border-navy-100 bg-white/97 backdrop-blur"
      style={{ bottom: BOTTOM_NAV_HEIGHT, paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}
    >
      <div className="mx-auto flex max-w-xl items-center gap-2.5 px-4 py-2.5">
        <span
          aria-hidden="true"
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${bravo ? 'bg-mint-500 text-white' : 'bg-navy-50 text-navy-700'}`}
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1" aria-live="polite">
          <p className="truncate text-[11px] font-bold uppercase tracking-wide text-ink-400">
            {`Tour ${state.tour} · Étape ${state.index + 1}/${PARCOURS_LENGTH}`}
          </p>
          <p className="truncate text-[14px] font-bold text-navy-900">{bravo ? 'Bien joué !' : step.title}</p>
        </div>
        {onStep ? (
          <button
            type="button"
            onClick={skip}
            className="flex min-h-11 shrink-0 items-center px-1.5 text-[13px] font-semibold text-ink-400 underline"
          >
            Passer
          </button>
        ) : null}
        <button
          type="button"
          onClick={advance}
          className={`flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-[14px] font-bold text-white transition-colors ${
            !onStep ? 'bg-amber-600' : bravo ? 'bg-mint-600 animate-pulse-ring' : 'bg-navy-900'
          }`}
        >
          {!onStep ? <Undo2 aria-hidden="true" className="size-4" /> : null}
          {mainLabel}
          {onStep ? <ArrowRight aria-hidden="true" className="size-4" /> : null}
        </button>
      </div>
    </div>
  )
}
