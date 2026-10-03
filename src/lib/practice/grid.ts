import type { Question, RichText, Segment } from '../../content/types'

export interface GridItem { id: string; kind: 'idea' | 'avoid' | 'general'; label: string }
export const GENERAL_GRID_LABELS = [
  "J'ai donné un exemple vécu", "J'ai parlé calmement, sans réciter", "J'ai respecté la durée",
] as const

export function richTextToPlain(text: RichText): string {
  return text.map((segment: Segment) => {
    if (typeof segment === 'string') return segment
    if ('field' in segment) return `[${segment.hint}]`
    return segment.text
  }).join('').replace(/\*\*/g, '').replace(/\*/g, '').trim()
}

export function buildGrid(question: Question, perspective: 'self' | 'ami' = 'self'): GridItem[] {
  const ideas = question.ideas.map((idea, i) => ({ id: `${question.id}-idea-${i + 1}`, kind: 'idea' as const, label: richTextToPlain(idea) }))
  const avoid = question.kind === 'top' ? richTextToPlain(question.avoid).split(';').map((label, i) => ({
    id: `${question.id}-avoid-${i + 1}`, kind: 'avoid' as const, label: label.trim(),
  })).filter((item) => item.label) : []
  const labels = perspective === 'ami' ? [
    'Il a donné un exemple vécu', 'Il a parlé calmement, sans réciter', 'Il a respecté la durée',
  ] : GENERAL_GRID_LABELS
  const general = labels.map((label, i) => ({ id: `${question.id}-general-${i + 1}`, kind: 'general' as const, label }))
  return [...ideas, ...avoid, ...general]
}

export function scoreGrid(items: GridItem[], checked: Record<string, boolean>): {
  ideas: [number, number]; avoidsHit: number; general: [number, number]
} {
  const ideas = items.filter((item) => item.kind === 'idea')
  const general = items.filter((item) => item.kind === 'general')
  return {
    ideas: [ideas.filter((item) => checked[item.id]).length, ideas.length],
    avoidsHit: items.filter((item) => item.kind === 'avoid' && checked[item.id]).length,
    general: [general.filter((item) => checked[item.id]).length, general.length],
  }
}
