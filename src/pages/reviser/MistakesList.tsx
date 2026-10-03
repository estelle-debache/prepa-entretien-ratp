import { X } from 'lucide-react'
import { MISTAKES } from '../../content'
import { Card } from '../../ui/primitives'
import { frenchNbsp } from '../../ui/format'

export function MistakesList() {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-wide text-mint-600">{MISTAKES.length} erreurs à éviter</h2>
      <div className="space-y-2.5">
        {MISTAKES.map((mistake, i) => (
          <Card key={mistake.id} className="animate-rise flex gap-3 !border-coral-100 !p-4" style={{ animationDelay: `${i * 35}ms` }}>
            <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-coral-100 text-coral-700">
              <X className="size-4" strokeWidth={2.5} />
            </span>
            <div>
              <p className="text-[15px] font-bold text-navy-900">{frenchNbsp(mistake.title)}</p>
              <p className="mt-0.5 text-[16px] leading-relaxed text-ink-900">{frenchNbsp(mistake.text)}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
