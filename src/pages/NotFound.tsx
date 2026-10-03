import { Link } from 'react-router'
import { ArrowLeft, Signpost } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-navy-50 text-navy-700">
        <Signpost aria-hidden="true" className="size-7" />
      </span>
      <div className="space-y-1.5">
        <h1 className="text-xl font-extrabold tracking-tight text-navy-900">Page introuvable</h1>
        <p className="max-w-xs text-[15px] text-ink-600">Cette page n'existe pas. Elle a peut-être changé d'adresse.</p>
      </div>
      <Link to="/" className="mt-2 flex min-h-11 items-center gap-1.5 rounded-full bg-navy-900 px-5 text-[15px] font-semibold text-white">
        <ArrowLeft aria-hidden="true" className="size-4" /> Retour à l'accueil
      </Link>
    </div>
  )
}
