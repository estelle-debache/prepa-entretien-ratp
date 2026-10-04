/** Événements « fin naturelle d'une activité » : la barre du parcours s'y abonne pour afficher « Bien joué ! ». */
import type { ResolvedStep } from './parcours'
import { useEffect, useState } from 'react'

export type ActivityDone =
  | { kind: 'read'; route: string }
  | { kind: 'oral'; questionId: string }
  | { kind: 'quiz' }
  | { kind: 'situation'; situationId: string }
  | { kind: 'reflex' }
  | { kind: 'roleplay'; rolePlayId: string }
  | { kind: 'simulation' }
  | { kind: 'ami'; questionId: string }
  | { kind: 'revision-rapide' }

type Listener = (event: ActivityDone) => void
const listeners = new Set<Listener>()

export function subscribeActivity(listener: Listener): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function reportActivityDone(event: ActivityDone): void {
  for (const listener of [...listeners]) listener(event)
}

export function useLastActivityDone(resetKey: string): ActivityDone | null {
  const [last, setLast] = useState<{ resetKey: string; event: ActivityDone | null }>({ resetKey, event: null })
  useEffect(() => {
    setLast(current => current.resetKey === resetKey ? current : { resetKey, event: null })
    return subscribeActivity(event => setLast({ resetKey, event }))
  }, [resetKey])
  return last.resetKey === resetKey ? last.event : null
}

export function matchesStep(event: ActivityDone, step: ResolvedStep): boolean {
  switch (step.kind) {
    case 'read': return event.kind === 'read' && event.route.split('?')[0] === step.route.split('?')[0]
    case 'oral': return event.kind === 'oral' && event.questionId === step.target || event.kind === 'ami' && event.questionId === step.target
    case 'situation': return event.kind === 'situation' && event.situationId === step.target
    case 'roleplay': return event.kind === 'roleplay' && event.rolePlayId === step.target
    case 'quiz': return event.kind === 'quiz'
    case 'reflex': return event.kind === 'reflex'
    case 'simulation': return event.kind === 'simulation'
    default: return false
  }
}
