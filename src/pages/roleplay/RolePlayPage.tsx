import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowRight, Check, ClipboardCheck, PartyPopper, RotateCcw, Users } from 'lucide-react'
import { ROLE_PLAYS } from '../../content'
import type { RolePlayLine } from '../../content/types'
import { stopSpeaking } from '../../lib/speech/tts'
import { Card, Chip, ProgressBar } from '../../ui/primitives'
import { SpeakButton } from '../../ui/SpeakButton'
import { useProfile } from '../../ui/hooks'
import { frenchNbsp } from '../../ui/format'

type ViewMode = 'lecture' | 'deux' | 'solo'

/** Remonte à chaque jeu de rôle : réinitialise le mode, l'étape et la grille de l'observateur. */
export default function RolePlayPage() {
  const { id = '' } = useParams()
  return <RolePlayInner key={id} id={id} />
}

function ObserverGrid({ checks, checked, onToggle }: { checks: string[]; checked: Record<number, boolean>; onToggle: (i: number) => void }) {
  return (
    <Card className="space-y-2.5">
      <h2 className="flex items-center gap-1.5 text-[15px] font-bold text-navy-900">
        <ClipboardCheck aria-hidden="true" className="size-4 text-mint-600" /> Grille de l'observateur
      </h2>
      <ul className="space-y-2">
        {checks.map((check, i) => {
          const isChecked = Boolean(checked[i])
          return (
            <li key={i}>
              <button
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                aria-label={check}
                onClick={() => onToggle(i)}
                className={`flex w-full items-start gap-2.5 rounded-xl border-2 px-3 py-2.5 text-left text-[15px] leading-relaxed transition-colors ${
                  isChecked ? 'border-mint-500 bg-mint-50 text-mint-800' : 'border-navy-100 bg-white text-ink-900'
                }`}
              >
                <span aria-hidden="true" className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${isChecked ? 'border-mint-500 bg-mint-500 text-white' : 'border-navy-200 text-transparent'}`}>
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {check}
              </button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

function StepLine({ line, hideCandidat, prenom }: { line: RolePlayLine; hideCandidat: boolean; prenom: string }) {
  if (line.speaker === 'action') {
    return <p className="animate-pop px-4 text-center text-[17px] italic text-ink-400">— {frenchNbsp(line.text)} —</p>
  }
  if (line.speaker === 'voyageur') {
    return (
      <div className="animate-pop space-y-3 rounded-3xl bg-navy-50 p-5 text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-navy-500">Voyageur</p>
        <p className="text-[22px] font-semibold leading-snug text-navy-900">{frenchNbsp(line.text)}</p>
        <div className="flex justify-center"><SpeakButton text={line.text} /></div>
      </div>
    )
  }
  if (hideCandidat) {
    return (
      <div className="animate-pop space-y-2 rounded-3xl border-2 border-dashed border-mint-300 bg-mint-50 p-6 text-center">
        <p className="text-[17px] font-bold text-mint-800">{frenchNbsp(`À toi, ${prenom} : réponds à voix haute.`)}</p>
        <p className="text-sm text-mint-700">Tape sur « Voir la réplique type » quand tu as fini.</p>
      </div>
    )
  }
  return (
    <div className="animate-pop space-y-3 rounded-3xl bg-mint-500 p-5 text-center text-white">
      <p className="text-xs font-bold uppercase tracking-wide text-white/80">Toi ({prenom})</p>
      <p className="text-[22px] font-semibold leading-snug">{frenchNbsp(line.text)}</p>
    </div>
  )
}

function RolePlayInner({ id }: { id: string }) {
  const rolePlay = ROLE_PLAYS.find((r) => r.id === id)
  const [profile] = useProfile()
  const prenom = profile.prenom?.trim() || 'Yahia'
  const [viewMode, setViewMode] = useState<ViewMode>('lecture')
  const [stepIndex, setStepIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [observerChecked, setObserverChecked] = useState<Record<number, boolean>>({})

  if (!rolePlay) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-[17px] text-ink-600">Ce jeu de rôle n'existe pas.</p>
        <Link to="/situations" className="font-semibold text-mint-700 underline">Retour aux situations</Link>
      </div>
    )
  }

  const changeMode = (mode: ViewMode) => { stopSpeaking(); setViewMode(mode); setStepIndex(0); setRevealed(false) }
  const toggleObserver = (i: number) => setObserverChecked((prev) => ({ ...prev, [i]: !prev[i] }))
  const restart = () => { stopSpeaking(); setStepIndex(0); setRevealed(false); setObserverChecked({}) }

  const currentLine = rolePlay.lines[stepIndex]
  const done = stepIndex >= rolePlay.lines.length
  const isCandidatHidden = Boolean(currentLine && currentLine.speaker === 'candidat' && !revealed)
  const advance = () => {
    stopSpeaking()
    if (isCandidatHidden) { setRevealed(true); return }
    setStepIndex((i) => i + 1)
    setRevealed(false)
  }

  return (
    <div className="animate-fade space-y-5">
      <span className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-bold text-navy-600">{rolePlay.id}</span>
      <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">{rolePlay.title}</h1>

      <Card className="flex items-start gap-2.5 !bg-navy-50">
        <Users aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-navy-700" />
        <p className="text-[15px] leading-relaxed text-navy-800">{frenchNbsp(rolePlay.roles)}</p>
      </Card>

      <div className="flex gap-2">
        <Chip active={viewMode === 'lecture'} onClick={() => changeMode('lecture')}>Lecture</Chip>
        <Chip active={viewMode === 'deux'} onClick={() => changeMode('deux')}>À deux</Chip>
        <Chip active={viewMode === 'solo'} onClick={() => changeMode('solo')}>Solo</Chip>
      </div>

      {viewMode === 'lecture' ? (
        <>
          <section className="space-y-2.5">
            {rolePlay.lines.map((line, i) => {
              if (line.speaker === 'action') {
                return <p key={i} className="px-6 text-center text-sm italic text-ink-400">— {frenchNbsp(line.text)} —</p>
              }
              const isCandidat = line.speaker === 'candidat'
              return (
                <div key={i} className={`flex ${isCandidat ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${isCandidat ? 'rounded-br-sm bg-mint-500 text-white' : 'rounded-bl-sm bg-navy-50 text-navy-900'}`}>
                    <p className={`text-[11px] font-bold uppercase tracking-wide ${isCandidat ? 'text-white/80' : 'text-navy-500'}`}>{isCandidat ? `Toi (${prenom})` : 'Voyageur'}</p>
                    <p className="text-[16px] leading-relaxed">{frenchNbsp(line.text)}</p>
                  </div>
                </div>
              )
            })}
          </section>
          <ObserverGrid checks={rolePlay.observerChecks} checked={observerChecked} onToggle={toggleObserver} />
        </>
      ) : !done ? (
        <div className="space-y-4">
          <ProgressBar value={stepIndex} max={rolePlay.lines.length} />
          <p className="text-center text-sm font-semibold text-ink-400">
            {frenchNbsp(viewMode === 'deux' ? `Ton ami lit le voyageur, toi tu es ${prenom}.` : 'Tu joues les deux rôles, à voix haute.')}
          </p>
          <StepLine key={stepIndex} line={currentLine} hideCandidat={isCandidatHidden} prenom={prenom} />
          <button
            type="button"
            onClick={advance}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-navy-900 text-[16px] font-semibold text-white"
          >
            {isCandidatHidden ? 'Voir la réplique type' : stepIndex === rolePlay.lines.length - 1 ? 'Terminer' : 'Réplique suivante'}
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      ) : (
        <div className="animate-rise space-y-4">
          <Card className="flex items-center gap-3 !bg-mint-50">
            <PartyPopper aria-hidden="true" className="size-6 shrink-0 text-mint-600" />
            <p className="text-[15px] font-bold text-mint-800">Dialogue terminé. Remplissez la grille ensemble.</p>
          </Card>
          <ObserverGrid checks={rolePlay.observerChecks} checked={observerChecked} onToggle={toggleObserver} />
          <button type="button" onClick={restart} className="mx-auto flex min-h-11 items-center gap-1.5 text-sm font-semibold text-navy-700 underline">
            <RotateCcw aria-hidden="true" className="size-4" /> Recommencer le dialogue
          </button>
        </div>
      )}
    </div>
  )
}
