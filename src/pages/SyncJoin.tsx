import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { LoaderCircle, TriangleAlert } from 'lucide-react'
import { joinSync } from '../lib/sync'
import { frenchNbsp } from '../ui/format'

type Stage = 'connecting' | 'error'

/** Route `/sync/:code` : rejoint une sauvegarde depuis un lien partagé, puis revient à l'accueil. */
export default function SyncJoin() {
  const { code = '' } = useParams()
  const navigate = useNavigate()
  const [stage, setStage] = useState<Stage>('connecting')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    joinSync(code)
      .then((result) => {
        if (cancelled) return
        if (result.ok) {
          navigate('/', { replace: true, state: { syncMessage: 'Synchro activée : tes données sont à jour sur cet appareil.' } })
        } else {
          setMessage(result.message || 'Impossible de récupérer cette sauvegarde.')
          setStage('error')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMessage('Impossible de récupérer cette sauvegarde.')
          setStage('error')
        }
      })
    return () => { cancelled = true }
  }, [code, navigate])

  if (stage === 'error') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-coral-50 text-coral-600">
          <TriangleAlert aria-hidden="true" className="size-7" />
        </span>
        <div className="space-y-1.5">
          <h1 className="text-xl font-extrabold tracking-tight text-navy-900">Connexion impossible</h1>
          <p className="max-w-xs text-[15px] text-ink-600">{frenchNbsp(message)}</p>
        </div>
        <Link to="/donnees" className="mt-2 flex min-h-11 items-center gap-1.5 rounded-full bg-navy-900 px-5 text-[15px] font-semibold text-white">
          Aller à Tes données
        </Link>
      </div>
    )
  }

  return (
    <div role="status" aria-live="polite" className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <LoaderCircle aria-hidden="true" className="size-10 animate-spin text-mint-600" />
      <div className="space-y-1.5">
        <h1 className="text-xl font-extrabold tracking-tight text-navy-900">Connexion à ta sauvegarde…</h1>
        <p className="max-w-xs text-[15px] text-ink-600">
          {frenchNbsp("Ça peut prendre jusqu'à 30 secondes si ton autre appareil n'a pas synchronisé depuis un moment.")}
        </p>
      </div>
    </div>
  )
}
