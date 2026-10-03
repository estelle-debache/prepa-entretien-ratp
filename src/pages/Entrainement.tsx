import { Link } from 'react-router'
import { ChevronRight, Drama, Gamepad2, Mic, Sparkles, Users, Zap } from 'lucide-react'
import { Card } from '../ui/primitives'

const upcoming = [
  { icon: Mic, title: "Entraînement à l'oral", description: 'Réponds à voix haute, chronométré, question par question.' },
  { icon: Users, title: 'Mode ami', description: 'Un ami te pose les questions et note ta prestation.' },
  { icon: Gamepad2, title: "Simulation d'entretien", description: 'Un entretien complet, avec un ami, du début à la fin.' },
  { icon: Zap, title: 'Quiz', description: 'Des questions rapides pour vérifier tes connaissances RATP.' },
]

export default function Entrainement() {
  return (
    <div className="space-y-5">
      <header className="animate-rise space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">S'entraîner</h1>
        <p className="text-[15px] text-ink-600">
          L'entraînement à voix haute arrive très bientôt. En attendant, les mises en situation et les jeux de rôle sont déjà prêts.
        </p>
      </header>

      <div className="animate-rise grid grid-cols-2 gap-3" style={{ animationDelay: '40ms' }}>
        <Link to="/situations" className="flex flex-col gap-2 rounded-2xl border border-mint-100 bg-mint-50 p-4 transition-transform active:scale-[0.98]">
          <Sparkles aria-hidden="true" className="size-6 text-mint-600" />
          <span className="text-[15px] font-bold text-navy-900">Mises en situation</span>
          <span className="text-sm text-ink-600">12 situations à lire, ★ en priorité</span>
          <span className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-mint-700">Disponible <ChevronRight aria-hidden="true" className="size-4" /></span>
        </Link>
        <Link to="/jeux-de-role/JR1" className="flex flex-col gap-2 rounded-2xl border border-mint-100 bg-mint-50 p-4 transition-transform active:scale-[0.98]">
          <Drama aria-hidden="true" className="size-6 text-mint-600" />
          <span className="text-[15px] font-bold text-navy-900">Jeux de rôle</span>
          <span className="text-sm text-ink-600">3 dialogues à jouer avec un ami</span>
          <span className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-mint-700">Disponible <ChevronRight aria-hidden="true" className="size-4" /></span>
        </Link>
      </div>

      <div className="animate-rise space-y-2.5" style={{ animationDelay: '80ms' }}>
        <h2 className="px-1 text-xs font-bold uppercase tracking-wide text-ink-400">Bientôt</h2>
        {upcoming.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="flex items-center gap-3 !p-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <span className="flex-1">
              <span className="block text-[15px] font-bold text-navy-900">{title}</span>
              <span className="block text-sm text-ink-400">{description}</span>
            </span>
            <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">Disponible demain</span>
          </Card>
        ))}
      </div>
    </div>
  )
}
