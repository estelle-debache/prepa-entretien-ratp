import { REFLEX_STEPS } from '../../content/situations'
import { shuffle } from './selection'

export const REFLEX_NOTE = "L'ordre s'adapte ; le premier réflexe est de ne mettre personne en danger."
export function shuffledReflexes(rng: () => number = Math.random): string[] { return shuffle(REFLEX_STEPS, rng) }
export function checkOrder(userOrder: string[]): { correct: boolean; positions: boolean[] } {
  const positions = REFLEX_STEPS.map((step, index) => userOrder[index] === step)
  return { correct: userOrder.length === REFLEX_STEPS.length && positions.every(Boolean), positions }
}
