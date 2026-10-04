import { Link } from 'react-router'
import { ChevronRight, Star } from 'lucide-react'
import { SITUATIONS } from '../../content'
import { Card } from '../../ui/primitives'

export default function SituationsList() {
  return (
    <div className="space-y-5">
      <header className="animate-rise space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Mises en situation</h1>
        <p className="text-[15px] text-ink-600">{SITUATIONS.length} situations possibles le jour de l'entretien. Lis-les, puis entraîne-toi en jeu de rôle.</p>
      </header>

      <Card className="!p-0 overflow-hidden">
        {SITUATIONS.map((situation, i) => (
          <Link
            key={situation.id}
            to={`/situations/${situation.id}`}
            className="animate-rise flex min-h-16 items-center gap-3 border-b border-navy-50 px-4 py-3 last:border-b-0 hover:bg-navy-50/60"
            style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}
          >
            {situation.star ? <Star aria-hidden="true" className="size-4 shrink-0 fill-amber-500 text-amber-500" /> : <span className="w-4 shrink-0" />}
            <span className="flex-1">
              <span className="block text-[15px] font-semibold leading-snug text-navy-900">{situation.title}</span>
              <span className="mt-0.5 block text-xs font-medium text-ink-400">{situation.id}</span>
            </span>
            <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-navy-300" />
          </Link>
        ))}
      </Card>
    </div>
  )
}
