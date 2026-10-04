import { BookOpenCheck, Gamepad2, ListOrdered, Mic, Sparkles, Zap, type LucideIcon } from 'lucide-react'
import type { ParcoursActivity } from '../content/parcours'

/** Une icône par type d'étape du parcours, réutilisée partout (accueil, hub, barre, page parcours). */
export const STEP_ICONS: Record<ParcoursActivity['kind'], LucideIcon> = {
  read: BookOpenCheck,
  oral: Mic,
  quiz: Zap,
  situation: Sparkles,
  reflex: ListOrdered,
  roleplay: Gamepad2,
  simulation: Gamepad2,
}
