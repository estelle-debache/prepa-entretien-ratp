import { Check } from 'lucide-react'
import type { GridItem } from '../lib/practice/grid'
import { frenchNbsp } from './format'

const kindLabels: Record<GridItem['kind'], string> = {
  idea: 'Idées placées',
  avoid: 'As-tu fait une de ces erreurs ?',
  general: 'En général',
}
const kindTone: Record<GridItem['kind'], string> = {
  idea: 'border-mint-500 bg-mint-500',
  avoid: 'border-coral-500 bg-coral-500',
  general: 'border-navy-900 bg-navy-900',
}
const kindOrder: GridItem['kind'][] = ['idea', 'avoid', 'general']

/** Grille d'auto-évaluation cochable (idées / erreurs à éviter / critères généraux). */
export function EvalGrid({
  items,
  checked,
  onToggle,
  big = false,
}: { items: GridItem[]; checked: Record<string, boolean>; onToggle: (id: string) => void; big?: boolean }) {
  return (
    <div className="space-y-5">
      {kindOrder.map((kind) => {
        const groupItems = items.filter((item) => item.kind === kind)
        if (groupItems.length === 0) return null
        return (
          <section key={kind} className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-mint-600">{frenchNbsp(kindLabels[kind])}</h3>
            <ul className="space-y-2">
              {groupItems.map((item) => {
                const isChecked = Boolean(checked[item.id])
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked}
                      aria-label={item.label}
                      onClick={() => onToggle(item.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl border-2 text-left transition-colors ${
                        big ? 'min-h-16 px-4 py-3' : 'min-h-12 px-3.5 py-2.5'
                      } ${isChecked ? 'border-navy-900 bg-navy-50' : 'border-navy-100 bg-white'}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`flex shrink-0 items-center justify-center rounded-full border-2 text-white transition-colors ${
                          big ? 'size-8' : 'size-6'
                        } ${isChecked ? kindTone[kind] : 'border-navy-200 bg-white text-transparent'}`}
                      >
                        <Check className={big ? 'size-5' : 'size-3.5'} strokeWidth={3} />
                      </span>
                      <span className={`${big ? 'text-[17px]' : 'text-[15px]'} leading-snug text-ink-900`}>{frenchNbsp(item.label)}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
