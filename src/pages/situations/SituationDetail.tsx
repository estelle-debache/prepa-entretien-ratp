import { Link, useNavigate, useParams } from 'react-router'
import { ChevronLeft, ChevronRight, Drama, Star, TriangleAlert } from 'lucide-react'
import { SITUATIONS } from '../../content'
import { Button, Callout } from '../../ui/primitives'
import { RichText } from '../../ui/RichText'
import { useProfile } from '../../ui/hooks'

export default function SituationDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [profile] = useProfile()

  const index = SITUATIONS.findIndex((s) => s.id === id)
  const situation = SITUATIONS[index]
  const prev = index > 0 ? SITUATIONS[index - 1] : undefined
  const next = index >= 0 && index < SITUATIONS.length - 1 ? SITUATIONS[index + 1] : undefined

  if (!situation) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-[17px] text-ink-600">Cette situation n'existe pas.</p>
        <Link to="/situations" className="font-semibold text-mint-700 underline">Retour aux situations</Link>
      </div>
    )
  }

  return (
    <div className="animate-fade space-y-5">
      <span className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-bold text-navy-600">{situation.id} · {index + 1}/{SITUATIONS.length}</span>

      <h1 className="flex items-start gap-2 text-2xl font-extrabold leading-snug tracking-tight text-navy-900">
        {situation.star ? <Star aria-hidden="true" className="mt-1 size-5 shrink-0 fill-amber-500 text-amber-500" /> : null}
        {situation.title}
      </h1>

      <section className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wide text-mint-600">Ce que je fais</h2>
        <ol className="space-y-2.5">
          {situation.steps.map((step, i) => (
            <li key={i} className="flex gap-2.5 text-[17px] leading-relaxed text-ink-900">
              <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white">{i + 1}</span>
              <span><RichText text={step} profile={profile} /></span>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-1.5">
        <h2 className="text-xs font-bold uppercase tracking-wide text-mint-600">Phrase clé</h2>
        <p className="rounded-2xl border-l-4 border-mint-500 bg-mint-50 px-4 py-3 text-[17px] italic leading-relaxed text-navy-900">
          « {situation.keyPhrase} »
        </p>
      </section>

      <Callout tone="warning">
        <p className="flex items-start gap-2 text-[15px] font-medium">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span><strong>Piège : </strong>{situation.trap}</span>
        </p>
      </Callout>

      {situation.rolePlayId ? (
        <Link
          to={`/jeux-de-role/${situation.rolePlayId}`}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-mint-500 text-[15px] font-semibold text-white"
        >
          <Drama aria-hidden="true" className="size-4" /> Faire le jeu de rôle
        </Link>
      ) : null}

      <div className="flex items-center justify-between gap-2 border-t border-navy-100 pt-4">
        <Button variant="ghost" disabled={!prev} onClick={() => prev && navigate(`/situations/${prev.id}`)}>
          <ChevronLeft aria-hidden="true" className="size-4" /> Précédente
        </Button>
        <Button variant="ghost" disabled={!next} onClick={() => next && navigate(`/situations/${next.id}`)}>
          Suivante <ChevronRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </div>
  )
}
