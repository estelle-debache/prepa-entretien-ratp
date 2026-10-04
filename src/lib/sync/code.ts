/** Codes de synchronisation, avec échantillonnage uniforme. */
export const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export const CODE_LENGTH = 16

export function generateCode(random?: (n: number) => Uint8Array): string {
  const getRandom = random ?? ((n: number) => {
    const cryptoApi = globalThis.crypto
    if (!cryptoApi?.getRandomValues) throw new Error('La génération sécurisée de code est indisponible.')
    return cryptoApi.getRandomValues(new Uint8Array(n))
  })
  let result = ''
  while (result.length < CODE_LENGTH) {
    const bytes = getRandom(Math.max(16, (CODE_LENGTH - result.length) * 2))
    for (const byte of bytes) {
      if (byte >= 248) continue
      result += CODE_ALPHABET[byte % CODE_ALPHABET.length]
      if (result.length === CODE_LENGTH) break
    }
  }
  return result
}

export function normalizeCode(input: string): string | null {
  const normalized = input.toUpperCase().replace(/[^A-Z0-9]/g, '')
  return normalized.length === CODE_LENGTH && [...normalized].every(char => CODE_ALPHABET.includes(char)) ? normalized : null
}

export function formatCode(code: string): string {
  const normalized = normalizeCode(code)
  const value = normalized ?? code.toUpperCase().replace(/[^A-Z0-9]/g, '')
  return value.match(/.{1,4}/g)?.join('-') ?? ''
}
