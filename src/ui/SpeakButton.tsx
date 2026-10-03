import { Volume2, VolumeX } from 'lucide-react'
import { useSpeakable } from './hooks'

/**
 * Bouton « Écouter » : masqué si la lecture vocale est désactivée dans les réglages ou non
 * supportée par le navigateur. Le tap déclenche `speak()` directement (geste utilisateur requis
 * par Safari).
 */
export function SpeakButton({ text, rate = 0.95, className = '', hint = true }: { text: string; rate?: number; className?: string; hint?: boolean }) {
  const { available, isSpeaking, speak, stop } = useSpeakable()
  if (!available) return null
  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => (isSpeaking ? stop() : speak(text, rate))}
        aria-pressed={isSpeaking}
        className={`flex min-h-11 items-center gap-2 rounded-full border-2 border-navy-100 bg-white px-4 text-[15px] font-semibold text-navy-700 ${className}`}
      >
        {isSpeaking ? <VolumeX aria-hidden="true" className="size-4" /> : <Volume2 aria-hidden="true" className="size-4" />}
        {isSpeaking ? 'Arrêter' : 'Écouter la question'}
      </button>
      {hint ? <p className="text-xs text-ink-400">Pas de son{'\u00a0'}? Vérifie que ton iPhone n'est pas en mode silencieux.</p> : null}
    </div>
  )
}
