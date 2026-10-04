import { useState, type CSSProperties } from 'react'
import {
  CloudCog, CloudUpload, Copy, KeyRound, LoaderCircle, RotateCcw, Share2, Smartphone, Trash2, TriangleAlert, Unlink,
} from 'lucide-react'
import {
  deleteOnlineSave, disableSync, enableNewSync, formatCode, isSyncConfigured, joinSync, normalizeCode, syncNow, useSyncStatus,
} from '../lib/sync'
import { copyText } from './clipboard'
import { syncStatusLine, SYNC_STATUS_ICON } from './syncFormat'
import { Button, Callout, Card } from './primitives'
import { useFlash } from './hooks'
import { frenchNbsp } from './format'

function buildSyncLink(code: string): string {
  return `${location.origin}${import.meta.env.BASE_URL}#/sync/${code}`
}

function IPhoneNote() {
  return (
    <Callout tone="info" className="!border-navy-100 !bg-navy-50">
      <p className="flex items-start gap-2 text-[13px] leading-relaxed text-navy-800">
        <Smartphone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-navy-500" />
        <span>
          {frenchNbsp(
            'Sur iPhone, active la synchro depuis l’icône de l’écran d’accueil. Le lien s’ouvre dans Safari, qui ne partage pas les données de l’icône : sur l’iPhone, utilise plutôt « J’ai déjà un code ».',
          )}
        </span>
      </p>
    </Callout>
  )
}

/** Section « Synchroniser mes appareils » de la page Tes données. */
export function SyncSection({ style }: { style?: CSSProperties } = {}) {
  const status = useSyncStatus()

  const [activating, setActivating] = useState(false)
  const [activateError, setActivateError] = useState<string | null>(null)

  const [codeInput, setCodeInput] = useState('')
  const [joinStage, setJoinStage] = useState<'idle' | 'connecting' | 'error'>('idle')
  const [joinError, setJoinError] = useState('')

  const [codeCopied, flashCodeCopied] = useFlash(2000)
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'error'>('idle')

  const [confirmDisable, setConfirmDisable] = useState(false)
  const [confirmDeleteOnline, setConfirmDeleteOnline] = useState(false)
  const [deletingOnline, setDeletingOnline] = useState(false)
  const [deleteOnlineError, setDeleteOnlineError] = useState<string | null>(null)

  if (!isSyncConfigured()) {
    return (
      <Card className="animate-rise space-y-2" style={style}>
        <h2 className="flex items-center gap-2 text-[15px] font-bold text-navy-900">
          <CloudCog aria-hidden="true" className="size-4 text-navy-500" /> Synchroniser mes appareils
        </h2>
        <p className="text-sm text-ink-600">
          {frenchNbsp('Bientôt disponible : commence sur un appareil, continue sur un autre, sans rien perdre.')}
        </p>
      </Card>
    )
  }

  const handleActivate = async () => {
    setActivating(true)
    setActivateError(null)
    try {
      await enableNewSync()
    } catch (err) {
      setActivateError(err instanceof Error && err.message ? err.message : 'Impossible d’activer la synchro pour le moment.')
    } finally {
      setActivating(false)
    }
  }

  const handleJoin = async () => {
    if (!normalizeCode(codeInput)) {
      setJoinStage('error')
      setJoinError('Ce code ne semble pas valide. Vérifie les 16 caractères (sans 0, O, 1, I, L).')
      return
    }
    setJoinStage('connecting')
    setJoinError('')
    const result = await joinSync(codeInput)
    if (result.ok) {
      setJoinStage('idle')
      setCodeInput('')
    } else {
      setJoinStage('error')
      setJoinError(result.message || 'Impossible de récupérer cette sauvegarde.')
    }
  }

  const handleCopyCode = async () => {
    if (status.status === 'disabled') return
    if (await copyText(formatCode(status.code))) flashCodeCopied()
  }

  const handleShareLink = async () => {
    if (status.status === 'disabled') return
    const url = buildSyncLink(status.code)
    if (navigator.share) {
      try {
        await navigator.share({ url })
        return
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
      }
    }
    const ok = await copyText(url)
    setShareState(ok ? 'copied' : 'error')
    setTimeout(() => setShareState('idle'), 2500)
  }

  const handleDisable = () => {
    disableSync()
    setConfirmDisable(false)
  }

  const handleDeleteOnline = async () => {
    setDeletingOnline(true)
    setDeleteOnlineError(null)
    const result = await deleteOnlineSave()
    setDeletingOnline(false)
    setConfirmDeleteOnline(false)
    if (!result.ok) setDeleteOnlineError(result.message ?? 'Impossible de supprimer tes données en ligne pour le moment.')
  }

  return (
    <Card className="animate-rise space-y-4" style={style}>
      <h2 className="text-[15px] font-bold text-navy-900">Synchroniser mes appareils</h2>

      {status.status === 'disabled' ? (
        <div className="space-y-4">
          <p className="text-sm text-ink-600">
            {frenchNbsp(
              'Commence sur ton iPhone, continue sur ton ordinateur, reprends sur l’iPhone : tes réponses et ta progression se retrouvent partout.',
            )}
          </p>

          <Button variant="primary" onClick={handleActivate} disabled={activating} className="w-full">
            {activating ? (
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <CloudUpload aria-hidden="true" className="size-4" />
            )}
            Activer sur cet appareil
          </Button>
          {activateError ? <p role="alert" className="text-sm font-semibold text-coral-600">{activateError}</p> : null}

          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-ink-400">
            <span aria-hidden="true" className="h-px flex-1 bg-navy-100" /> ou <span aria-hidden="true" className="h-px flex-1 bg-navy-100" />
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); void handleJoin() }}
            className="space-y-2"
          >
            <label className="block space-y-1.5">
              <span className="block text-sm font-semibold text-navy-900">J'ai déjà un code</span>
              <input
                type="text"
                inputMode="text"
                autoCapitalize="characters"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={codeInput}
                onChange={(e) => { setCodeInput(e.target.value); if (joinStage === 'error') setJoinStage('idle') }}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                aria-label="Code de synchronisation, 16 caractères"
                className="min-h-11 w-full rounded-xl border-2 border-navy-100 bg-white px-3.5 text-center font-mono text-[17px] uppercase tracking-widest text-ink-900 placeholder:font-sans placeholder:tracking-normal placeholder:text-ink-400 focus:border-mint-500"
              />
            </label>
            <Button
              type="submit"
              variant="ghost"
              disabled={joinStage === 'connecting' || !codeInput.trim()}
              className="w-full"
            >
              {joinStage === 'connecting' ? (
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <KeyRound aria-hidden="true" className="size-4" />
              )}
              Récupérer mes données
            </Button>
            <div aria-live="polite">
              {joinStage === 'connecting' ? (
                <p className="text-sm font-medium text-navy-600">Connexion… (peut prendre 30 secondes)</p>
              ) : null}
              {joinStage === 'error' && joinError ? (
                <p role="alert" className="text-sm font-semibold text-coral-600">{joinError}</p>
              ) : null}
            </div>
          </form>

          <IPhoneNote />
        </div>
      ) : (
        <div className="space-y-4">
          {(() => {
            const StatusIcon = SYNC_STATUS_ICON[status.status]
            return (
              <div aria-live="polite" className="flex items-center justify-between gap-3">
                <p
                  className={`flex items-center gap-1.5 text-sm font-semibold ${
                    status.status === 'synced' ? 'text-mint-700' : status.status === 'error' ? 'text-coral-600' : 'text-navy-600'
                  }`}
                >
                  <StatusIcon aria-hidden="true" className={`size-4 ${status.status === 'pending' ? 'animate-spin' : ''}`} />
                  {syncStatusLine(status)}
                </p>
                {status.status === 'error' ? (
                  <Button variant="ghost" onClick={() => void syncNow()} className="!min-h-9 !px-3 !py-1.5 !text-xs">
                    <RotateCcw aria-hidden="true" className="size-3.5" /> Réessayer
                  </Button>
                ) : null}
              </div>
            )
          })()}

          <div className="rounded-2xl bg-navy-50 p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-navy-500">Ton code</p>
            <p className="mt-1 font-mono text-[26px] font-extrabold tracking-wider text-navy-900">{formatCode(status.code)}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => void handleCopyCode()} className="flex-1">
              <Copy aria-hidden="true" className="size-4" /> Copier le code
            </Button>
            <Button variant="ghost" onClick={() => void handleShareLink()} className="flex-1">
              <Share2 aria-hidden="true" className="size-4" /> Envoyer le lien
            </Button>
          </div>
          <div aria-live="polite">
            {codeCopied ? <p className="text-sm font-semibold text-mint-700">Code copié.</p> : null}
            {shareState === 'copied' ? <p className="text-sm font-semibold text-mint-700">Lien copié dans le presse-papiers.</p> : null}
            {shareState === 'error' ? <p className="text-sm font-semibold text-coral-600">La copie automatique n'a pas fonctionné sur ce navigateur.</p> : null}
          </div>

          <IPhoneNote />

          <div className="space-y-2 border-t border-navy-100 pt-4">
            {!confirmDisable ? (
              <Button variant="ghost" onClick={() => setConfirmDisable(true)} className="w-full">
                <Unlink aria-hidden="true" className="size-4" /> Désactiver sur cet appareil
              </Button>
            ) : (
              <div className="space-y-2 rounded-xl border border-navy-100 bg-navy-50 p-3">
                <p className="text-sm font-semibold text-navy-800">
                  {frenchNbsp('Désactiver la synchro sur cet appareil ? Tes données restent sur cet appareil.')}
                </p>
                <div className="flex gap-2">
                  <Button variant="primary" onClick={handleDisable} className="flex-1">Oui, désactiver</Button>
                  <Button variant="ghost" onClick={() => setConfirmDisable(false)} className="flex-1">Annuler</Button>
                </div>
              </div>
            )}

            {!confirmDeleteOnline ? (
              <Button variant="danger" onClick={() => setConfirmDeleteOnline(true)} className="w-full">
                <Trash2 aria-hidden="true" className="size-4" /> Supprimer mes données en ligne
              </Button>
            ) : (
              <div className="space-y-2 rounded-xl border border-coral-100 bg-coral-50 p-3">
                <p className="flex items-start gap-1.5 text-sm font-bold text-coral-700">
                  <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  {frenchNbsp('Désactive d’abord la synchro sur tes autres appareils, sinon ils renverront leurs données.')}
                </p>
                <div className="flex gap-2">
                  <Button variant="danger" onClick={() => void handleDeleteOnline()} disabled={deletingOnline} className="flex-1">
                    {deletingOnline ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null} Oui, supprimer
                  </Button>
                  <Button variant="ghost" onClick={() => setConfirmDeleteOnline(false)} disabled={deletingOnline} className="flex-1">Annuler</Button>
                </div>
              </div>
            )}
            {deleteOnlineError ? <p role="alert" className="text-sm font-semibold text-coral-600">{deleteOnlineError}</p> : null}
          </div>
        </div>
      )}
    </Card>
  )
}
