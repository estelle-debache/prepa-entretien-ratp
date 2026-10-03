import { useState } from 'react'
import { CheckCircle2, Clipboard, ClipboardPaste, Lock, Trash2, TriangleAlert, Volume2 } from 'lucide-react'
import { exportAll, importAll, clearAll } from '../lib/store'
import { Button, Callout, Card, Switch } from '../ui/primitives'
import { useReglages } from '../ui/hooks'

export default function Donnees() {
  const [reglages, setReglages] = useReglages()
  const [pasteValue, setPasteValue] = useState('')
  const [copyState, setCopyState] = useState<'idle' | 'done' | 'error'>('idle')
  const [restoreState, setRestoreState] = useState<'idle' | 'done' | 'error'>('idle')
  const [restoreMessage, setRestoreMessage] = useState('')
  const [confirmErase, setConfirmErase] = useState(false)
  const [erased, setErased] = useState(false)

  const copyBackup = async () => {
    const data = exportAll()
    try {
      await navigator.clipboard.writeText(data)
      setCopyState('done')
    } catch {
      try {
        const area = document.createElement('textarea')
        area.value = data
        area.style.position = 'fixed'
        area.style.opacity = '0'
        document.body.appendChild(area)
        area.focus()
        area.select()
        document.execCommand('copy')
        document.body.removeChild(area)
        setCopyState('done')
      } catch {
        setCopyState('error')
      }
    }
    setTimeout(() => setCopyState('idle'), 2500)
  }

  const restoreBackup = () => {
    const result = importAll(pasteValue)
    if (result.ok) {
      setRestoreState('done')
      setRestoreMessage('Ta sauvegarde a été restaurée.')
      setPasteValue('')
    } else {
      setRestoreState('error')
      setRestoreMessage(result.error ?? 'Impossible de restaurer cette sauvegarde.')
    }
  }

  const eraseAll = () => {
    clearAll()
    setConfirmErase(false)
    setErased(true)
    setTimeout(() => setErased(false), 2500)
  }

  return (
    <div className="space-y-5">
      <header className="animate-rise space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Tes données</h1>
      </header>

      <Callout tone="success" className="animate-rise">
        <p className="flex items-start gap-2 text-[15px] font-medium">
          <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          Tout reste sur ce téléphone. Rien n'est envoyé.
        </p>
      </Callout>

      <Card className="animate-rise space-y-3" style={{ animationDelay: '40ms' }}>
        <h2 className="text-[15px] font-bold text-navy-900">Date de l'entretien</h2>
        <input
          type="date"
          value={reglages.interviewDate}
          onChange={(e) => setReglages({ ...reglages, interviewDate: e.target.value })}
          className="min-h-11 w-full rounded-xl border-2 border-navy-100 bg-white px-3.5 text-base text-ink-900 focus:border-mint-500"
        />
      </Card>

      <Card className="animate-rise flex items-center justify-between gap-3" style={{ animationDelay: '70ms' }}>
        <div className="flex items-start gap-2.5">
          <Volume2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-navy-700" />
          <div>
            <h2 className="text-[15px] font-bold text-navy-900">Lecture vocale</h2>
            <p className="text-sm text-ink-400">Lire les textes à voix haute, quand c'est proposé.</p>
          </div>
        </div>
        <Switch checked={reglages.tts} onChange={(v) => setReglages({ ...reglages, tts: v })} label="Activer la lecture vocale" />
      </Card>

      <Card className="animate-rise space-y-3" style={{ animationDelay: '100ms' }}>
        <h2 className="text-[15px] font-bold text-navy-900">Sauvegarde</h2>
        <p className="text-sm text-ink-600">Copie ta sauvegarde pour la garder, ou la transférer sur un autre appareil.</p>
        <Button variant="ghost" onClick={copyBackup} className="w-full">
          <Clipboard aria-hidden="true" className="size-4" /> Copier ma sauvegarde
        </Button>
        {copyState === 'done' && <p className="flex items-center gap-1.5 text-sm font-semibold text-mint-700"><CheckCircle2 aria-hidden="true" className="size-4" /> Copié dans le presse-papiers.</p>}
        {copyState === 'error' && <p className="text-sm font-semibold text-coral-600">La copie automatique n'a pas fonctionné sur ce navigateur.</p>}

        <div className="pt-1">
          <label className="block space-y-1.5">
            <span className="block text-sm font-semibold text-navy-900">Coller pour restaurer</span>
            <textarea
              value={pasteValue}
              onChange={(e) => setPasteValue(e.target.value)}
              rows={3}
              placeholder="Colle ici le texte d'une sauvegarde"
              className="w-full rounded-xl border-2 border-navy-100 bg-white px-3.5 py-2.5 text-base text-ink-900 placeholder:text-ink-400 focus:border-mint-500"
            />
          </label>
          <Button variant="ghost" onClick={restoreBackup} disabled={!pasteValue.trim()} className="mt-2 w-full">
            <ClipboardPaste aria-hidden="true" className="size-4" /> Restaurer
          </Button>
          {restoreState !== 'idle' && (
            <p className={`mt-1.5 text-sm font-semibold ${restoreState === 'done' ? 'text-mint-700' : 'text-coral-600'}`}>{restoreMessage}</p>
          )}
        </div>
      </Card>

      <Card className="animate-rise space-y-3 !border-coral-100" style={{ animationDelay: '130ms' }}>
        <h2 className="text-[15px] font-bold text-navy-900">Tout effacer</h2>
        <p className="text-sm text-ink-600">Supprime ta fiche, tes statuts de questions, ton plan et tes réglages de ce téléphone.</p>
        {!confirmErase ? (
          <Button variant="danger" onClick={() => setConfirmErase(true)} className="w-full">
            <Trash2 aria-hidden="true" className="size-4" /> Tout effacer
          </Button>
        ) : (
          <div className="space-y-2 rounded-xl border border-coral-100 bg-coral-50 p-3">
            <p className="flex items-center gap-1.5 text-sm font-bold text-coral-700"><TriangleAlert aria-hidden="true" className="size-4" /> Confirmer l'effacement ?</p>
            <div className="flex gap-2">
              <Button variant="danger" onClick={eraseAll} className="flex-1">Oui, effacer</Button>
              <Button variant="ghost" onClick={() => setConfirmErase(false)} className="flex-1">Annuler</Button>
            </div>
          </div>
        )}
        {erased && <p className="flex items-center gap-1.5 text-sm font-semibold text-mint-700"><CheckCircle2 aria-hidden="true" className="size-4" /> Tout a été effacé.</p>}
      </Card>

      <p className="animate-rise rounded-2xl bg-navy-50 p-3 text-sm text-navy-700" style={{ animationDelay: '160ms' }}>
        Si tu ajoutes le site à ton écran d'accueil, ouvre-le toujours de la même façon : Safari et l'icône de l'écran d'accueil ne partagent pas les mêmes données.
      </p>
    </div>
  )
}
