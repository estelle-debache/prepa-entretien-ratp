import type { Profile, ProfileFieldId, RichText } from '../../content/types'

export type Resolved =
  | { kind: 'text'; text: string }
  | { kind: 'missing'; field: ProfileFieldId; hint: string }
  | { kind: 'link'; to: string; text: string }
export interface InlinePart { text: string; bold?: boolean; italic?: boolean }

export function resolveRichText(text: RichText, profile: Profile): Resolved[] {
  const result: Resolved[] = []
  for (const segment of text) {
    if (typeof segment === 'string') { result.push({ kind: 'text', text: segment }); continue }
    if ('field' in segment) {
      const value = profile[segment.field]?.trim()
      if (value) result.push({ kind: 'text', text: value })
      else if (segment.fallback !== undefined) result.push({ kind: 'text', text: segment.fallback })
      else result.push({ kind: 'missing', field: segment.field, hint: segment.hint })
    } else if ('ifField' in segment) {
      const value = profile[segment.ifField]?.trim().toLowerCase()
      if (value === 'oui' || value === 'true') result.push({ kind: 'text', text: segment.text })
    } else result.push({ kind: 'link', to: segment.link, text: segment.text })
  }
  return result
}

export function toPlainText(text: RichText, profile: Profile): string {
  return resolveRichText(text, profile).map((part) => part.kind === 'missing' ? '…' : part.text).join('')
}

export function missingFields(texts: RichText[], profile: Profile): ProfileFieldId[] {
  const fields = new Set<ProfileFieldId>()
  for (const text of texts) for (const part of resolveRichText(text, profile)) if (part.kind === 'missing') fields.add(part.field)
  return [...fields]
}

/** Parses only **bold** and *italic*, supporting simple nested emphasis. */
export function parseInline(text: string): InlinePart[] {
  const parse = (input: string, format: Pick<InlinePart, 'bold' | 'italic'> = {}): InlinePart[] => {
    const out: InlinePart[] = []
    let plain = ''
    const flush = () => { if (plain) { out.push({ text: plain, ...format }); plain = '' } }
    for (let i = 0; i < input.length;) {
      const bold = input.startsWith('**', i)
      const italic = input[i] === '*' && !bold
      if (bold || italic) {
        const marker = bold ? '**' : '*'
        let end = input.indexOf(marker, i + marker.length)
        // In `**bold *italic***`, the first star closes italics and the next two close bold.
        if (bold && end >= 0 && input.startsWith('***', end)) end += 1
        if (end >= 0) {
          flush()
          const contents = input.slice(i + marker.length, end)
          const nested = parse(contents, { ...format, [bold ? 'bold' : 'italic']: true })
          out.push(...nested)
          i = end + marker.length
          continue
        }
      }
      plain += input[i++]
    }
    flush()
    return out
  }
  return parse(text, undefined)
}
