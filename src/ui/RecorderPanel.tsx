import { Mic, RotateCcw, Square } from 'lucide-react'
import type { RecorderResult } from '../lib/speech/recorder'
import { isRecordingSupported } from '../lib/speech/recorder'
import { formatMmSs } from '../lib/practice/timer'
import { Button } from './primitives'

/**
 * Bloc d'enregistrement réutilisable. Si l'enregistrement n'est pas possible (navigateur, refus
 * micro, contexte non sécurisé), affiche le conseil du moteur et laisse le reste de l'écran
 * utilisable (chrono seul).
 */
export function RecorderPanel({ rec, onStart, onStop }: { rec: RecorderResult; onStart: () => void; onStop: () => void }) {
  if (!isRecordingSupported()) {
    return (
      <p className="rounded-xl bg-navy-50 p-3 text-sm text-navy-700">
        L'enregistrement n'est pas possible sur cet appareil. Utilise le chrono, et si tu veux t'écouter, l'app Dictaphone.
      </p>
    )
  }

  if (rec.state === 'error') {
    return (
      <div className="space-y-2 rounded-xl bg-amber-50 p-3">
        <p className="text-sm font-semibold text-amber-800">{rec.error}</p>
        <Button variant="ghost" onClick={onStart} className="w-full">
          <RotateCcw aria-hidden="true" className="size-4" /> Réessayer
        </Button>
      </div>
    )
  }

  if (rec.state === 'recording' || rec.state === 'requesting') {
    return (
      <Button variant="danger" onClick={onStop} className="w-full !bg-coral-500 !text-white !border-0">
        <Square aria-hidden="true" className="size-4" fill="currentColor" />
        {rec.state === 'requesting' ? 'Préparation du micro…' : "Arrêter l'enregistrement"}
      </Button>
    )
  }

  if (rec.state === 'stopped' && rec.audioUrl) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <audio controls src={rec.audioUrl} className="w-full" />
          <span className="shrink-0 rounded-full bg-navy-50 px-2.5 py-1 text-xs font-bold tabular-nums text-navy-700">
            {formatMmSs(rec.durationMs / 1000)}
          </span>
        </div>
        <Button variant="ghost" onClick={onStart} className="w-full">
          <RotateCcw aria-hidden="true" className="size-4" /> Recommencer l'enregistrement
        </Button>
      </div>
    )
  }

  return (
    <Button variant="primary" onClick={onStart} className="w-full">
      <Mic aria-hidden="true" className="size-4" /> Enregistrer ma réponse
    </Button>
  )
}
