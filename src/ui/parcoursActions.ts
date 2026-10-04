import { currentStep, isTourFinished, startNextTour, withParcours } from '../lib/practice/parcours'
import type { ParcoursEngine } from './useParcoursEngine'

/**
 * Démarre le tour suivant, en sécurité : `isTourFinished(state)` est la seule source de vérité
 * (jamais un paramètre d'URL, qui peut rester dans l'historique après un retour arrière). Si
 * l'état n'est en réalité pas terminé, on ne fait rien avancer : on renvoie juste vers l'étape
 * courante, pour ne jamais sauter un tour.
 */
export function goToNextTour(engine: Pick<ParcoursEngine, 'state' | 'setState' | 'ctx'>, navigate: (to: string) => void): void {
  const { state, setState, ctx } = engine
  if (!isTourFinished(state)) {
    try {
      navigate(withParcours(currentStep(state, ctx).route))
    } catch {
      navigate('/parcours')
    }
    return
  }
  let next
  try {
    next = startNextTour(state, ctx)
  } catch {
    return
  }
  setState(next)
  try {
    navigate(withParcours(currentStep(next, ctx).route))
  } catch {
    navigate('/parcours')
  }
}
