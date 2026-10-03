import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { LEXICON } from '../../content'
import { frenchNbsp } from '../../ui/format'

export function LexiconCards() {
  const [flipped, setFlipped] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setFlipped((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-wide text-mint-600">Le lexique — touche une carte</h2>
      <div className="grid grid-cols-2 gap-3">
        {LEXICON.map((entry) => {
          const isFlipped = flipped.has(entry.id)
          return (
            <button
              key={entry.id}
              type="button"
              aria-pressed={isFlipped}
              aria-label={`${entry.term} : ${isFlipped ? 'voir le terme' : 'voir la définition'}`}
              onClick={() => toggle(entry.id)}
              className={`flip-card h-32 w-full text-left ${isFlipped ? 'is-flipped' : ''}`}
            >
              <div className="flip-card-inner size-full">
                <div className="flip-card-face flex size-full flex-col items-center justify-center rounded-2xl border border-navy-100 bg-white p-3 text-center shadow-[var(--shadow-card)]">
                  <span className="text-[15px] font-bold leading-tight text-navy-900">{entry.term}</span>
                  <span className="mt-1.5 text-[11px] font-medium text-ink-400">Toucher pour voir</span>
                </div>
                <div className="flip-card-face flip-card-face-back flex size-full flex-col items-center justify-center gap-1.5 rounded-2xl bg-navy-900 p-3 text-center text-white">
                  <span className="text-[13px] leading-snug">{frenchNbsp(entry.definition)}</span>
                  <RotateCcw aria-hidden="true" className="size-3.5 text-mint-300" />
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
