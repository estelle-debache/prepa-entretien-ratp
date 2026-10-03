import { NavLink } from 'react-router'
import { BookOpen, Home, Mic, MessageCircleQuestion, UserRound } from 'lucide-react'

const tabs = [
  { to: '/', label: 'Accueil', icon: Home },
  { to: '/reviser', label: 'Réviser', icon: BookOpen },
  { to: '/questions', label: 'Questions', icon: MessageCircleQuestion },
  { to: '/entrainement', label: "S'entraîner", icon: Mic },
  { to: '/fiche', label: 'Ma fiche', icon: UserRound },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Navigation principale"
      className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-navy-100 bg-white/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-xl items-stretch justify-between px-1">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex min-h-14 flex-col items-center justify-center gap-0.5 py-1.5 text-[11px] font-semibold transition-colors ${
                  isActive ? 'text-mint-700' : 'text-ink-400 hover:text-navy-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon aria-hidden="true" className={`size-[22px] ${isActive ? 'text-mint-700' : 'text-ink-400'}`} strokeWidth={isActive ? 2.3 : 1.9} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export const BOTTOM_NAV_HEIGHT = 'calc(3.75rem + env(safe-area-inset-bottom))'
