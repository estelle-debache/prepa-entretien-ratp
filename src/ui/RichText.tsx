import { Fragment } from 'react'
import { Link } from 'react-router'
import { ArrowRight, PencilLine } from 'lucide-react'
import { parseInline, resolveRichText, type Resolved } from '../lib/content/personalize'
import type { Profile, RichText as RichTextValue } from '../content/types'
import { frenchNbsp } from './format'

/** Rend une portion de texte brut avec **gras** / *italique*, en coupant proprement les sauts de ligne. */
function InlineText({ text }: { text: string }) {
  const lines = frenchNbsp(text).split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 ? <br /> : null}
          {parseInline(line).map((part, j) => {
            if (part.bold && part.italic) return <strong key={j}><em>{part.text}</em></strong>
            if (part.bold) return <strong key={j}>{part.text}</strong>
            if (part.italic) return <em key={j}>{part.text}</em>
            return <Fragment key={j}>{part.text}</Fragment>
          })}
        </Fragment>
      ))}
    </>
  )
}

function ResolvedNode({ part }: { part: Resolved }) {
  if (part.kind === 'text') return <InlineText text={part.text} />
  if (part.kind === 'link') {
    return (
      <Link
        to={part.to}
        className="mx-0.5 inline-flex items-center gap-1 rounded-full bg-mint-50 px-2.5 py-0.5 text-[0.93em] font-semibold text-mint-700 no-underline hover:bg-mint-100"
      >
        {part.text}
        <ArrowRight aria-hidden="true" className="size-3" />
      </Link>
    )
  }
  return (
    <Link
      to="/fiche"
      className="mx-0.5 inline-flex items-center gap-1 rounded-md border border-dashed border-amber-500 bg-amber-50 px-1.5 py-0.5 text-[0.92em] font-medium text-amber-700 no-underline hover:bg-amber-100"
    >
      <PencilLine aria-hidden="true" className="size-3.5" />
      à compléter : {part.hint}
    </Link>
  )
}

/**
 * Rend un `RichText` (texte, champs personnalisés, liens internes) en résolvant par rapport à la
 * fiche de l'utilisateur. Les champs vides deviennent une puce discrète « à compléter » vers `/fiche`.
 */
export function RichText({ text, profile }: { text: RichTextValue; profile: Profile }) {
  const parts = resolveRichText(text, profile)
  return (
    <>
      {parts.map((part, i) => <ResolvedNode key={i} part={part} />)}
    </>
  )
}

/** Affiche un `RichText` encadré de guillemets français, pour les répliques / accroches à dire à l'oral. */
export function QuotedRichText({ text, profile, className = '' }: { text: RichTextValue; profile: Profile; className?: string }) {
  return (
    <p className={`text-[17px] italic leading-relaxed text-navy-900 ${className}`}>
      « <RichText text={text} profile={profile} /> »
    </p>
  )
}
