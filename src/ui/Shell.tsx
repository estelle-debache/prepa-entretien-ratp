import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { ParcoursBar, PARCOURS_BAR_HEIGHT } from './ParcoursBar'
import { useParcoursMode } from './parcoursMode'
import { useScrollToTopOn } from './hooks'

export function Shell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  useScrollToTopOn(pathname)
  const isMemo = pathname === '/memo'
  const parcoursMode = useParcoursMode()

  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar />
      <main
        className={isMemo ? 'print-memo mx-auto w-full max-w-xl flex-1 px-4 pt-5' : 'mx-auto w-full max-w-xl flex-1 px-4 pt-5'}
        style={{
          paddingBottom: parcoursMode
            ? `calc(7rem + ${PARCOURS_BAR_HEIGHT} + env(safe-area-inset-bottom))`
            : 'calc(7rem + env(safe-area-inset-bottom))',
        }}
      >
        {children}
      </main>
      {parcoursMode ? <ParcoursBar /> : null}
      <BottomNav />
    </div>
  )
}
