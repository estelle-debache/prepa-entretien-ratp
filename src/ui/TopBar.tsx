import { Link, useLocation } from 'react-router'
import { ArrowLeft, FileText, Route as RouteIcon, ShieldCheck } from 'lucide-react'
import { useSyncStatus } from '../lib/sync'
import { SYNC_STATUS_ICON, syncStatusAriaLabel } from './syncFormat'

const rootPaths = new Set(['/', '/reviser', '/questions', '/entrainement', '/fiche'])

function getParentPath(pathname: string): string | null {
  if (rootPaths.has(pathname)) return null
  if (pathname === '/memo' || pathname === '/donnees') return '/'
  if (pathname === '/simulation' || pathname === '/quiz' || pathname === '/revision-rapide') return '/entrainement'
  if (/^\/reviser\/.+/.test(pathname)) return '/reviser'
  if (/^\/questions\/.+/.test(pathname)) return '/questions'
  if (/^\/situations/.test(pathname)) return pathname === '/situations' ? '/entrainement' : '/situations'
  if (/^\/jeux-de-role\/.+/.test(pathname)) return '/situations'
  if (/^\/entrainement\/.+/.test(pathname)) return '/entrainement'
  if (/^\/sync\/.+/.test(pathname)) return '/donnees'
  return '/'
}

function SyncIndicator({ active }: { active: boolean }) {
  const status = useSyncStatus()
  if (status.status === 'disabled') return null
  const Icon = SYNC_STATUS_ICON[status.status]
  const toneClass = status.status === 'error' ? 'text-coral-300' : status.status === 'pending' ? 'text-amber-300' : 'text-mint-300'
  return (
    <Link
      to="/donnees"
      aria-label={syncStatusAriaLabel(status)}
      className={`flex min-h-11 min-w-11 items-center justify-center rounded-full hover:bg-white/10 ${active ? 'bg-white/15' : ''}`}
    >
      <Icon aria-hidden="true" className={`size-5 ${toneClass} ${status.status === 'pending' ? 'animate-spin' : ''}`} />
    </Link>
  )
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
            className="flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-full pl-1 pr-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
            <span className="sr-only">Retour</span>
          </Link>
        ) : (
          <Link to="/" className="flex min-h-11 items-center gap-1.5 rounded-full pr-2 text-[15px] font-extrabold tracking-tight text-white">
            <RouteIcon aria-hidden="true" className="size-5 text-mint-400" />
            Prépa entretien
          </Link>
        )}
        <div className="flex items-center gap-1">
          <SyncIndicator active={pathname === '/donnees'} />
          <Link
            to="/memo"
            aria-label="Mémo"
            className={`flex min-h-11 min-w-11 items-center justify-center rounded-full text-white hover:bg-white/10 ${pathname === '/memo' ? 'bg-white/15' : ''}`}
          >
            <FileText aria-hidden="true" className="size-5" />
          </Link>
          <Link
            to="/donnees"
            aria-label="Tes données"
            className={`flex min-h-11 min-w-11 items-center justify-center rounded-full text-white hover:bg-white/10 ${pathname === '/donnees' ? 'bg-white/15' : ''}`}
          >
            <ShieldCheck aria-hidden="true" className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
