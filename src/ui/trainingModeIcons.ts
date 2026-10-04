import { FastForward, Gamepad2, ListOrdered, Mic, Sparkles, Users, Zap, type LucideIcon } from 'lucide-react'
import type { ModeId } from './trainingProgress'

/**
 * Icône + titre courts par mode d'entraînement — source commune pour le hub (`/entrainement`) et
 * tout résumé compact ailleurs (ex. la pastille de progression sur l'accueil).
 */
export const TRAINING_MODE_ICONS: Record<ModeId, LucideIcon> = {
  oral: Mic,
  ami: Users,
  simulation: Gamepad2,
  quiz: Zap,
  situations: Sparkles,
  reflex: ListOrdered,
  revision: FastForward,
}

export const TRAINING_MODE_LABELS: Record<ModeId, string> = {
  oral: 'Oral seul',
  ami: 'Avec un ami',
  simulation: "Simulation d'entretien",
  quiz: 'Quiz',
  situations: 'Mises en situation',
  reflex: 'Exercice des réflexes',
  revision: 'Révision rapide',
}
