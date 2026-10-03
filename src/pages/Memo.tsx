import { Printer } from 'lucide-react'
import { SECTIONS } from '../content'
import { BlockRenderer } from '../ui/BlockRenderer'
import { Button } from '../ui/primitives'
import { useProfile } from '../ui/hooks'

export default function Memo() {
  const [profile] = useProfile()
  const section = SECTIONS.find((s) => s.id === 'memo')

  if (!section) return null

  return (
    <div className="space-y-5">
      <header className="no-print animate-rise flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Mémo</h1>
          <p className="text-[15px] text-ink-600">L'essentiel, à relire juste avant d'entrer.</p>
        </div>
        <Button variant="primary" onClick={() => window.print()}>
          <Printer aria-hidden="true" className="size-4" /> Imprimer
        </Button>
      </header>

      <h1 className="hidden text-2xl font-extrabold print:block">Mémo — Entretien RATP</h1>

      <div className="print-section">
        <BlockRenderer blocks={section.blocks} profile={profile} />
      </div>
    </div>
  )
}
