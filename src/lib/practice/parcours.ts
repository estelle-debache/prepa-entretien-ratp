/** Moteur pur du parcours en boucle. */
import { PARCOURS } from '../../content/parcours'
import { QUESTIONS, SITUATIONS, ROLE_PLAYS } from '../../content'
import { quickReviewOrder, mulberry32 } from './selection'
import type { ParcoursActivity } from '../../content/parcours'

export interface ParcoursState { tour: number; index: number; visited: number[]; target?: string; totalDone: number; lastAt?: number }
export const INITIAL_PARCOURS: ParcoursState = { tour: 1, index: 0, visited: [], totalDone: 0 }
export interface ResolveContext { statuses: Record<string, 'maitrise' | 'a-revoir'>; quizWrongCount: number }
export interface ResolvedStep { index: number; key: string; title: string; why: string; minutes: number; kind: ParcoursActivity['kind']; route: string; target?: string; subtitle?: string }
export const PARCOURS_LENGTH = PARCOURS.length

function positiveInt(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 1 ? Math.floor(value) : fallback
}
function targetFor(index: number, tour: number, ctx: ResolveContext): string | undefined {
  const activity = PARCOURS[index]?.activity
  if (!activity) return undefined
  switch (activity.kind) {
    case 'oral':
      if (activity.questionId !== 'priority') return activity.questionId
      return quickReviewOrder(QUESTIONS, ctx.statuses, mulberry32(tour)).find(q => !['Q1', 'Q2', 'Q7', 'Q9', 'Q13'].includes(q.id))?.id ?? 'Q4'
    case 'quiz': return tour >= 2 && ctx.quizWrongCount >= 3 ? 'erreurs' : 'serie'
    case 'situation': return `S${(((tour - 1) * 3 + activity.slot) % 12) + 1}`
    case 'roleplay': return `JR${((tour - 1) % 3) + 1}`
    default: return undefined
  }
}
function truncate(text: string, max = 45): string { return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text }
function makeStep(index: number, tour: number, ctx: ResolveContext, frozenTarget?: string): ResolvedStep {
  const template = PARCOURS[index]
  if (!template) return makeStep(0, tour, ctx)
  const { activity } = template
  const target = frozenTarget ?? targetFor(index, tour, ctx)
  let route = '/'
  let subtitle: string | undefined
  switch (activity.kind) {
    case 'read': route = activity.route; break
    case 'oral': {
      const id = target ?? activity.questionId
      route = `/entrainement/oral/${id}`
      const question = QUESTIONS.find(q => q.id === id)
      subtitle = `${id} · ${truncate(question?.question ?? id)}`
      break
    }
    case 'quiz': route = `/quiz?mode=${target === 'erreurs' ? 'erreurs' : 'serie'}`; subtitle = target === 'erreurs' ? 'Tes erreurs' : 'Série de 10'; break
    case 'situation': {
      const id = target ?? targetFor(index, tour, ctx)!
      route = `/situations/${id}`
      const item = SITUATIONS.find(s => s.id === id)
      subtitle = `${id} · ${truncate(item?.title ?? id)}`
      break
    }
    case 'reflex': route = '/situations/ordre'; break
    case 'roleplay': {
      const id = target ?? targetFor(index, tour, ctx)!
      route = `/jeux-de-role/${id}`
      const item = ROLE_PLAYS.find(r => r.id === id)
      subtitle = `${id} · ${truncate(item?.title ?? id)}`
      break
    }
    case 'simulation': route = '/simulation?length=courte'; subtitle = 'Courte · 8 étapes'; break
  }
  return { index, key: template.key, title: template.title, why: template.why, minutes: template.minutes, kind: activity.kind, route, target, subtitle }
}
export function resolveStep(index: number, tour: number, ctx: ResolveContext): ResolvedStep {
  const safeIndex = Number.isInteger(index) && index >= 0 && index < PARCOURS_LENGTH ? index : 0
  return makeStep(safeIndex, positiveInt(tour, 1), ctx)
}
export function resolveTour(state: ParcoursState, ctx: ResolveContext): ResolvedStep[] {
  return PARCOURS.map((_, index) => makeStep(index, state.tour, ctx, index === state.index ? state.target : undefined))
}
export function currentStep(state: ParcoursState, ctx: ResolveContext): ResolvedStep { return makeStep(state.index, state.tour, ctx, state.target) }
function move(state: ParcoursState, ctx: ResolveContext, done: boolean, now?: number): ParcoursState {
  const visited = [...new Set([...state.visited, state.index])]
  const next = Array.from({ length: PARCOURS_LENGTH }, (_, i) => i).find(i => i > state.index && !visited.includes(i))
    ?? Array.from({ length: PARCOURS_LENGTH }, (_, i) => i).find(i => !visited.includes(i))
  const index = next ?? state.index
  return { ...state, index, visited, target: next === undefined ? state.target : targetFor(index, state.tour, ctx), totalDone: state.totalDone + (done ? 1 : 0), ...(done && now !== undefined ? { lastAt: now } : done ? { lastAt: Date.now() } : {}) }
}
export function completeCurrent(state: ParcoursState, ctx: ResolveContext, opts: { expectedIndex: number; now?: number }): ParcoursState {
  return state.index !== opts.expectedIndex ? state : move(state, ctx, true, opts.now)
}
export function skipCurrent(state: ParcoursState, ctx: ResolveContext, opts: { expectedIndex: number }): ParcoursState {
  return state.index !== opts.expectedIndex ? state : move(state, ctx, false)
}
export function jumpTo(state: ParcoursState, index: number, ctx: ResolveContext): ParcoursState {
  if (!Number.isInteger(index) || index < 0 || index >= PARCOURS_LENGTH) return state
  return { ...state, index, target: targetFor(index, state.tour, ctx) }
}
export function startNextTour(state: ParcoursState, ctx: ResolveContext): ParcoursState {
  return { ...state, tour: state.tour + 1, index: 0, visited: [], target: targetFor(0, state.tour + 1, ctx) }
}
export function isTourFinished(state: ParcoursState): boolean { return Array.from({ length: PARCOURS_LENGTH }, (_, i) => state.visited.includes(i)).every(Boolean) }
export function normalizeParcours(raw: unknown, ctx?: ResolveContext): ParcoursState {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ...INITIAL_PARCOURS }
  const obj = raw as Record<string, unknown>
  const tour = positiveInt(obj.tour, 1)
  const index = typeof obj.index === 'number' && Number.isInteger(obj.index) && obj.index >= 0 && obj.index < PARCOURS_LENGTH ? obj.index : 0
  const visited = Array.isArray(obj.visited) ? [...new Set(obj.visited.filter((n): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < PARCOURS_LENGTH))] : []
  const totalDone = typeof obj.totalDone === 'number' && Number.isFinite(obj.totalDone) && obj.totalDone >= 0 ? Math.floor(obj.totalDone) : 0
  let target = typeof obj.target === 'string' && obj.target.length > 0 ? obj.target : undefined
  const activity = PARCOURS[index].activity
  const validTarget = activity.kind === 'oral' ? QUESTIONS.some(q => q.id === target)
    : activity.kind === 'quiz' ? target === 'serie' || target === 'erreurs'
      : activity.kind === 'situation' ? SITUATIONS.some(s => s.id === target)
        : activity.kind === 'roleplay' ? ROLE_PLAYS.some(r => r.id === target) : target === undefined
  if (!validTarget) target = undefined
  const lastAt = typeof obj.lastAt === 'number' && Number.isFinite(obj.lastAt) && obj.lastAt >= 0 ? obj.lastAt : undefined
  const result: ParcoursState = { tour, index, visited, totalDone, ...(target ? { target } : {}), ...(lastAt !== undefined ? { lastAt } : {}) }
  if (!target && ctx) result.target = targetFor(index, tour, ctx)
  return result
}
export function withParcours(route: string): string {
  const [path, raw = ''] = route.split('?', 2)
  const params = new URLSearchParams(raw)
  params.set('parcours', '1')
  return `${path}?${params.toString()}`
}
export function stripParcours(search: string): string {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  params.delete('parcours')
  const result = params.toString()
  return result ? `?${result}` : ''
}
