import { describe, expect, it } from 'vitest'
import { CODE_ALPHABET, formatCode, generateCode, normalizeCode } from './code'

describe('codes de synchronisation', () => {
  it('formate et normalise casse, espaces et tirets', () => {
    const code = 'ABCDEFGHJKMNPQRS'
    expect(formatCode(code)).toBe('ABCD-EFGH-JKMN-PQRS')
    expect(normalizeCode(' abcd-efgh jkmn\npqrs ')).toBe(code)
  })
  it('refuse les longueurs incorrectes et les caractères ambigus', () => {
    for (const code of ['ABC', 'ABCDEFGHJKMNPQ', 'ABCDEFGHJKMNPQRS0', 'ABCDEFGHJKMNPQRI', 'ABCDEFGHJKMNPQRL', 'ABCDEFGHJKMNPQRO']) expect(normalizeCode(code)).toBeNull()
  })
  it('génère 16 caractères autorisés avec rejet et une distribution plausible', () => {
    const rejects: number[] = []
    const code = generateCode(n => Uint8Array.from({ length: n }, (_, i) => i % 32 === 0 ? (rejects.push(248), 255) : (i * 13) % 248))
    expect(code).toHaveLength(16)
    expect([...code].every(c => CODE_ALPHABET.includes(c))).toBe(true)
    expect(rejects.length).toBeGreaterThan(0)
    const histogram = new Map<string, number>()
    for (let i = 0; i < 6200; i++) {
      const n = (i * 73) % 248
      const c = CODE_ALPHABET[n % 31]
      histogram.set(c, (histogram.get(c) ?? 0) + 1)
    }
    expect(Math.max(...histogram.values()) - Math.min(...histogram.values())).toBeLessThan(10)
  })
})
