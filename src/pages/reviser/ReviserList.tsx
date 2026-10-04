import { Link } from 'react-router'
import { Bus, ChevronRight, ClipboardList, GraduationCap, Route, ShieldCheck, Signpost, TriangleAlert, type LucideIcon } from 'lucide-react'
import { SECTIONS } from '../../content'
import type { SectionId } from '../../content/types'

const icons: Record<SectionId, LucideIcon> = {
  'mode-emploi': Signpost,
  evaluation: ShieldCheck,
  deroule: Route,
  ratp: Bus,
  metier: GraduationCap,
  erreurs: TriangleAlert,
  checklist: ClipboardList,
  memo: ClipboardList,
}

export default function ReviserList() {
  const sections = SECTIONS.filter((s) => s.id !== 'memo').sort((a, b) => a.num - b.num)

  return (
    <div className="space-y-5">
      <header className="animate-rise space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Réviser</h1>
        <p className="text-[15px] text-ink-600">Toutes les fiches, dans l'ordre qui a du sens avant un entretien.</p>
      </header>

      <div className="space-y-2.5">
        {sections.map((section, i) => {
          const Icon = icons[section.id]
          return (
            <Link
              key={section.id}
              to={`/reviser/${section.id}`}
              className="animate-rise flex min-h-16 items-center gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-[var(--shadow-card)] transition-transform active:scale-[0.99]"
              style={{ animationDelay: `${i * 45}ms` }}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-[15px] font-bold text-navy-900">{section.title}</span>
                <span className="block text-sm text-ink-400">{section.summary}</span>
              </span>
              <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-navy-300" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
