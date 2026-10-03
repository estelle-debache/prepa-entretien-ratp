import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { useScrollToTopOn } from './hooks'

export function Shell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  useScrollToTopOn(pathname)
  const isMemo = pathname === '/memo'

  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar />
      <main
        className={isMemo ? 'print-memo mx-auto w-full max-w-xl flex-1 px-4 pb-28 pt-5' : 'mx-auto w-full max-w-xl flex-1 px-4 pb-28 pt-5'}
        style={{ paddingBottom: 'calc(7rem + env(safe-area-inset-bottom))' }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
