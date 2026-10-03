import { Link, useLocation } from 'react-router'
import { ArrowLeft, FileText, Route as RouteIcon, ShieldCheck } from 'lucide-react'

const rootPaths = new Set(['/', '/reviser', '/questions', '/entrainement', '/fiche'])

function getParentPath(pathname: string): string | null {
  if (rootPaths.has(pathname)) return null
  if (pathname === '/memo' || pathname === '/donnees' || pathname === '/simulation' || pathname === '/quiz' || pathname === '/revision-rapide') return '/'
  if (/^\/reviser\/.+/.test(pathname)) return '/reviser'
  if (/^\/questions\/.+/.test(pathname)) return '/questions'
  if (/^\/situations/.test(pathname)) return pathname === '/situations' ? '/entrainement' : '/situations'
  if (/^\/jeux-de-role\/.+/.test(pathname)) return '/situations'
  if (/^\/entrainement\/.+/.test(pathname)) return '/entrainement'
  return '/'
}

export function TopBar() {
  const { pathname } = useLocation()
  const parent = getParentPath(pathname)

  return (
    <header
      className="no-print sticky top-0 z-30 border-b border-navy-800/60 bg-navy-900 text-white"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex h-14 max-w-xl items-center justify-between gap-2 px-3">
        {parent ? (
          <Link
            to={parent}
            className="flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-full pl-1 pr-2 text-sm font-semibold text-white/90 hover:bg-white/10"
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
            <span className="sr-only">Retour</span>
          </Link>
        ) : (
          <Link to="/" className="flex min-h-11 items-center gap-1.5 rounded-full pr-2 text-[15px] font-extrabold tracking-tight">
            <RouteIcon aria-hidden="true" className="size-5 text-mint-400" />
            Prépa entretien
          </Link>
        )}
        <div className="flex items-center gap-1">
          <Link
            to="/memo"
            aria-label="Mémo"
            className={`flex min-h-11 min-w-11 items-center justify-center rounded-full hover:bg-white/10 ${pathname === '/memo' ? 'bg-white/15' : ''}`}
          >
            <FileText aria-hidden="true" className="size-5" />
          </Link>
          <Link
            to="/donnees"
            aria-label="Tes données"
            className={`flex min-h-11 min-w-11 items-center justify-center rounded-full hover:bg-white/10 ${pathname === '/donnees' ? 'bg-white/15' : ''}`}
          >
            <ShieldCheck aria-hidden="true" className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
