import { Check } from 'lucide-react'
import { CHECKLIST } from '../../content'
import type { Profile } from '../../content/types'
import { toPlainText } from '../../lib/content/personalize'
import { Card, ProgressBar } from '../../ui/primitives'
import { RichText } from '../../ui/RichText'
import { useChecklistState } from '../../ui/hooks'

export function ChecklistSection({ profile }: { profile: Profile }) {
  const [checklist, setChecklist] = useChecklistState()
  const allItems = CHECKLIST.flatMap((g) => g.items)
  const done = allItems.filter((item) => checklist[item.id]).length

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm font-bold text-navy-700">
          <span>Check-list</span>
          <span>{done}/{allItems.length}</span>
        </div>
        <ProgressBar value={done} max={allItems.length} />
      </div>

      {CHECKLIST.map((group, gi) => (
        <Card key={group.id} className="animate-rise !p-0 overflow-hidden" style={{ animationDelay: `${gi * 50}ms` }}>
          <h2 className="border-b border-navy-50 px-4 py-3 text-[15px] font-bold text-navy-900">{group.title}</h2>
          <ul className="divide-y divide-navy-50">
            {group.items.map((item) => {
              const checked = Boolean(checklist[item.id])
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    aria-label={toPlainText(item.text, profile)}
                    onClick={() => setChecklist({ ...checklist, [item.id]: !checked })}
                    className="flex min-h-12 w-full items-center gap-3 px-4 py-2.5 text-left"
                  >
                    <span className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${checked ? 'border-mint-500 bg-mint-500 text-white' : 'border-navy-200 text-transparent'}`}>
                      <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
                    </span>
                    <span className={`text-[15px] leading-snug ${checked ? 'text-ink-400 line-through' : 'text-ink-900'}`}>
                      <RichText text={item.text} profile={profile} />
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Card>
      ))}
    </div>
  )
}
