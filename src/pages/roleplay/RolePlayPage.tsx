import { Link, useParams } from 'react-router'
import { ClipboardCheck, Users } from 'lucide-react'
import { ROLE_PLAYS } from '../../content'
import { Card } from '../../ui/primitives'

export default function RolePlayPage() {
  const { id = '' } = useParams()
  const rolePlay = ROLE_PLAYS.find((r) => r.id === id)

  if (!rolePlay) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-[17px] text-ink-600">Ce jeu de rôle n'existe pas.</p>
        <Link to="/situations" className="font-semibold text-mint-700 underline">Retour aux situations</Link>
      </div>
    )
  }

  return (
    <div className="animate-fade space-y-5">
      <span className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-bold text-navy-600">{rolePlay.id}</span>
      <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">{rolePlay.title}</h1>

      <Card className="flex items-start gap-2.5 !bg-navy-50">
        <Users aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-navy-700" />
        <p className="text-[15px] leading-relaxed text-navy-800">{rolePlay.roles}</p>
      </Card>

      <section className="space-y-2.5">
        {rolePlay.lines.map((line, i) => {
          if (line.speaker === 'action') {
            return (
              <p key={i} className="animate-rise px-6 text-center text-sm italic text-ink-400" style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}>
                — {line.text} —
              </p>
            )
          }
          const isCandidat = line.speaker === 'candidat'
          return (
            <div key={i} className={`animate-rise flex ${isCandidat ? 'justify-end' : 'justify-start'}`} style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${isCandidat ? 'rounded-br-sm bg-mint-500 text-white' : 'rounded-bl-sm bg-navy-50 text-navy-900'}`}>
                <p className={`text-[11px] font-bold uppercase tracking-wide ${isCandidat ? 'text-white/80' : 'text-navy-500'}`}>
                  {isCandidat ? 'Toi (Yahia)' : 'Voyageur'}
                </p>
                <p className="text-[16px] leading-relaxed">{line.text}</p>
              </div>
            </div>
          )
        })}
      </section>

      <Card className="space-y-2.5">
        <h2 className="flex items-center gap-1.5 text-[15px] font-bold text-navy-900">
          <ClipboardCheck aria-hidden="true" className="size-4 text-mint-600" /> Grille de l'observateur
        </h2>
        <ul className="space-y-2">
          {rolePlay.observerChecks.map((check, i) => (
            <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-ink-900">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-mint-500" />
              {check}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
