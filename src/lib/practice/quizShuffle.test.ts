import { describe, expect, it } from 'vitest'
import { shuffleQuizOptions } from './quiz'
import { mulberry32 } from './selection'

describe('shuffleQuizOptions', () => {
  it('garde la bonne réponse alignée après mélange', () => {
    const item = { id: 'x', options: ['bonne', 'b', 'c', 'd'], answer: 0 }
    for (let seed = 1; seed < 50; seed++) {
      const s = shuffleQuizOptions(item, mulberry32(seed))
      expect(s.options[s.answer]).toBe('bonne')
      expect([...s.options].sort()).toEqual([...item.options].sort())
    }
  })
  it('ne met pas toujours la bonne réponse en premier', () => {
    const item = { id: 'x', options: ['bonne', 'b', 'c'], answer: 0 }
    const positions = new Set(Array.from({ length: 30 }, (_, k) => shuffleQuizOptions(item, mulberry32(k + 1)).answer))
    expect(positions.size).toBeGreaterThan(1)
  })
})
