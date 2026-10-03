import { Callout } from './primitives'
import { RichText } from './RichText'
import type { Block, Profile } from '../content/types'

/** Supprime, pour l'affichage, la répétition du titre en tête du texte d'un callout. */
function stripLeadingTitle(text: string, title?: string): string {
  if (!title) return text
  const trimmedTitle = title.trim()
  if (text.startsWith(trimmedTitle)) {
    return text.slice(trimmedTitle.length).replace(/^[\s:]+/, '')
  }
  return text
}

export function BlockRenderer({ blocks, profile }: { blocks: Block[]; profile: Profile }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => <BlockNode key={i} block={block} profile={profile} />)}
    </div>
  )
}

function BlockNode({ block, profile }: { block: Block; profile: Profile }) {
  switch (block.type) {
    case 'h':
      return <h2 className="pt-2 text-lg font-bold tracking-tight text-navy-900">{block.text}</h2>
    case 'p':
      return <p className="text-[17px] leading-relaxed text-ink-900"><RichText text={block.text} profile={profile} /></p>
    case 'ul':
      return (
        <ul className="space-y-2.5 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-[17px] leading-relaxed text-ink-900">
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-mint-500" />
              <span><RichText text={item} profile={profile} /></span>
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol className="space-y-2.5 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-[17px] leading-relaxed text-ink-900">
              <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">{i + 1}</span>
              <span><RichText text={item} profile={profile} /></span>
            </li>
          ))}
        </ol>
      )
    case 'quote':
      return (
        <blockquote className="rounded-2xl border-l-4 border-mint-500 bg-mint-50 px-4 py-3 text-[17px] italic leading-relaxed text-navy-900">
          « <RichText text={block.text} profile={profile} /> »
        </blockquote>
      )
    case 'callout': {
      const resolved = { ...block, text: block.text }
      const plainStart = resolved.text.find((seg): seg is string => typeof seg === 'string')
      const cleanedText = plainStart
        ? resolved.text.map((seg) => (seg === plainStart ? stripLeadingTitle(plainStart, block.title) : seg)).filter((seg) => seg !== '')
        : resolved.text
      return (
        <Callout tone={block.tone} title={block.title}>
          <RichText text={cleanedText} profile={profile} />
        </Callout>
      )
    }
    default:
      return null
  }
}
