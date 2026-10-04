import { currentStep, type ParcoursState, type ResolveContext, type ResolvedStep } from '../lib/practice/parcours'
import { useParcours, useParcoursContext } from './hooks'

export interface ParcoursEngine {
  state: ParcoursState
  setState: (value: ParcoursState | ((previous: ParcoursState) => ParcoursState)) => void
  ctx: ResolveContext
  /** `null` tant que le moteur ne sait pas résoudre l'étape (données corrompues, ou pendant le développement). */
  step: ResolvedStep | null
}

/**
 * Lit l'état du parcours en cours et résout son étape courante.
 * Défensif : si `currentStep` échoue (état pas encore normalisé, ou moteur en cours de câblage),
 * `step` vaut `null` plutôt que de faire planter l'écran.
 */
export function useParcoursEngine(): ParcoursEngine {
  const [state, setState] = useParcours()
  const ctx = useParcoursContext()
  let step: ResolvedStep | null = null
  try {
    step = currentStep(state, ctx)
  } catch {
    step = null
  }
  return { state, setState, ctx, step }
}
