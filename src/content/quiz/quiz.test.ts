import { describe, expect, it } from 'vitest'
import { QUIZ } from './quiz'

describe('QUIZ contract', () => {
  it('has valid unique questions and approved sources', () => {
    expect(QUIZ).toHaveLength(36)
    const ids = QUIZ.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
    const sources = /^(F[1-8]|PB[1-7]|L(?:[1-9]|10)|S(?:[1-9]|1[0-3])|metier|evaluation|checklist)$/
    for (const item of QUIZ) {
      expect(item.id).toMatch(/^QZ\d+$/)
      expect(item.options.length).toBeGreaterThanOrEqual(3)
      expect(item.options.length).toBeLessThanOrEqual(4)
      expect(new Set(item.options).size).toBe(item.options.length)
      expect(item.answer).toBeGreaterThanOrEqual(0)
      expect(item.answer).toBeLessThan(item.options.length)
      expect(item.sourceId).toMatch(sources)
      expect(`${item.question} ${item.options.join(' ')} ${item.explanation}`).not.toMatch(/salaire|€|rémunération|\bpère\b/i)
    }
    expect(QUIZ.filter((item) => item.category === 'situation').length / QUIZ.length).toBeGreaterThanOrEqual(0.35)
  })
})
