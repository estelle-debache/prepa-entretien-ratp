import { Link } from 'react-router'
import { ArrowLeft, Clock3 } from 'lucide-react'

export default function ComingSoon({ title = 'Cette fonctionnalité' }: { title?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-navy-50 text-navy-700">
        <Clock3 aria-hidden="true" className="size-7" />
      </span>
      <div className="space-y-1.5">
        <h1 className="text-xl font-extrabold tracking-tight text-navy-900">{title}</h1>
        <p className="max-w-xs text-[15px] text-ink-600">Bientôt disponible. On y travaille — reviens un peu plus tard.</p>
      </div>
      <Link to="/" className="mt-2 flex min-h-11 items-center gap-1.5 rounded-full bg-navy-900 px-5 text-[15px] font-semibold text-white">
        <ArrowLeft aria-hidden="true" className="size-4" /> Retour à l'accueil
      </Link>
    </div>
  )
}
