import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { ArrowRight, CalendarDays, Check, ChevronRight, CloudCheck, FileText, Footprints, PartyPopper, Repeat, Sparkles, UserRound, X, type LucideIcon } from 'lucide-react'
import { QUESTIONS } from '../content'
import { ONE_OFF_TASKS, type OneOffTask } from '../content/oneOff'
import { isTourFinished, PARCOURS_LENGTH, withParcours } from '../lib/practice/parcours'
import { Card, ProgressBar } from '../ui/primitives'
import { useProfile, useReglages, useSimulationsHistory, useStatutQuestions, useUneFois, profileCompletion } from '../ui/hooks'
import { useParcoursEngine } from '../ui/useParcoursEngine'
import { goToNextTour } from '../ui/parcoursActions'
import { STEP_ICONS } from '../ui/stepIcons'
import { countdownLabel, formatPercent, frenchNbsp } from '../ui/format'
import { TrainingProgressCard } from '../ui/TrainingProgressCard'
import { useTrainingProgress } from '../ui/useTrainingProgress'

function OneOffRow({ task, done, onToggle }: { task: OneOffTask; done: boolean; onToggle?: () => void }) {
  return (
    <li className="flex items-start gap-3 py-2.5">
      {task.auto ? (
        <span
          aria-label={done ? `${task.title} : fait automatiquement` : `${task.title} : pas encore fait`}
          className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-2 ${done ? 'border-mint-500 bg-mint-500 text-white' : 'border-navy-200 text-transparent'}`}
        >
          <Check aria-hidden="true" className="size-4" strokeWidth={3} />
        </span>
      ) : (
        <button
          type="button"
          role="checkbox"
          aria-checked={done}
          aria-label={task.title}
          onClick={onToggle}
          className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            done ? 'border-mint-500 bg-mint-500 text-white' : 'border-navy-200 bg-white text-transparent'
          }`}
        >
          <Check aria-hidden="true" className="size-4" strokeWidth={3} />
        </button>
      )}
      <span className="flex-1">
        <span className={`block text-[15px] font-semibold leading-snug ${done ? 'text-ink-400 line-through' : 'text-ink-900'}`}>{frenchNbsp(task.title)}</span>
        <span className="mt-0.5 block text-[13px] leading-snug text-ink-400">{frenchNbsp(task.detail)}</span>
      </span>
      {task.link ? (
        <Link to={task.link} className="mt-0.5 flex min-h-11 min-w-11 items-center justify-center text-navy-500 hover:text-navy-900" aria-label={`Ouvrir : ${task.title}`}>
          <ChevronRight aria-hidden="true" className="size-5" />
        </Link>
      ) : null}
    </li>
  )
}

function LoopStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <Card className="!p-3 text-center">
      <Icon aria-hidden="true" className="mx-auto size-5 text-mint-600" />
      <p className="mt-1.5 text-[17px] font-extrabold text-navy-900">{value}</p>
      <p className="text-[11px] font-medium leading-tight text-ink-400">{label}</p>
    </Card>
  )
}

function StatTile({ icon: Icon, label, value, progress }: { icon: LucideIcon; label: string; value: string; progress: number }) {
  return (
    <Card className="!p-3 text-center">
      <Icon aria-hidden="true" className="mx-auto size-5 text-mint-600" />
      <p className="mt-1.5 text-[17px] font-extrabold text-navy-900">{value}</p>
      <p className="text-[11px] font-medium leading-tight text-ink-400">{label}</p>
      <div className="mt-2"><ProgressBar value={progress} max={100} /></div>
    </Card>
  )
}

function ShortcutRow({ to, icon: Icon, title, subtitle }: { to: string; icon: LucideIcon; title: string; subtitle: string }) {
  return (
    <Link to={to} className="flex min-h-14 items-center gap-3 rounded-2xl border border-navy-100 bg-white px-4 py-3 shadow-[var(--shadow-card)] transition-transform active:scale-[0.99]">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <span className="flex-1">
        <span className="block text-[15px] font-bold text-navy-900">{title}</span>
        <span className="block text-sm text-ink-400">{subtitle}</span>
      </span>
      <ChevronRight aria-hidden="true" className="size-5 text-navy-300" />
    </Link>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const [syncMessage, setSyncMessage] = useState<string | null>(null)
  // Affiché une seule fois (ex. après avoir rejoint une synchro via /sync/:code) : on vide l'état
  // de navigation tout de suite, pour qu'un rechargement de page ne le fasse pas réapparaître.
  useEffect(() => {
    const state = location.state as { syncMessage?: string } | null
    if (state?.syncMessage) {
      setSyncMessage(state.syncMessage)
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])
  const [profile] = useProfile()
  const [reglages] = useReglages()
  const [statutQuestions] = useStatutQuestions()
  const [uneFois, setUneFois] = useUneFois()
  const [history] = useSimulationsHistory()
  const trainingProgress = useTrainingProgress()
  const engine = useParcoursEngine()
  const { state, step } = engine
  const finished = isTourFinished(state)

  const { days, label } = countdownLabel(reglages.interviewDate)

  const masteredCount = QUESTIONS.filter((q) => statutQuestions[q.id] === 'maitrise').length
  const completion = profileCompletion(profile)

  const firstName = profile.prenom?.trim() || 'toi'
  const heroMessage =
    days === 1
      ? 'Demain : relis le mémo, c’est tout.'
      : days === 0
        ? 'C’est aujourd’hui : relis le mémo et respire.'
        : firstName === 'toi'
          ? 'Tu es sur la bonne voie.'
          : `${firstName}, tu es sur la bonne voie.`

  const isOneOffDone = (task: OneOffTask): boolean => {
    if (task.id === 'fiche') return completion >= 60
    if (task.id === 'simulation-complete') return history.some((record) => record.length === 'complete')
    if (task.auto) return false
    return Boolean(uneFois[task.id])
  }
  const oneOffDoneCount = ONE_OFF_TASKS.filter(isOneOffDone).length

  const StepIcon = step ? STEP_ICONS[step.kind] : Sparkles

  return (
    <div className="-mx-4 -mt-5">
      <h1 className="sr-only">Accueil — prépa entretien RATP</h1>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-b-[2rem] bg-navy-900 px-4 pb-7 pt-5 text-white">
        <div aria-hidden="true" className="absolute -right-10 -top-16 h-44 w-44 rotate-12 rounded-[2rem] bg-mint-500/20" />
        <div aria-hidden="true" className="absolute -right-24 top-6 h-24 w-56 -rotate-12 bg-mint-400/15" />
        <p className="relative z-10 text-xs font-bold uppercase tracking-[0.18em] text-mint-300">Entretien RATP</p>
        <div className="relative z-10 mt-2 animate-rise">
          <p className="text-4xl font-extrabold tracking-tight">
            {days > 1 ? <>J-{days}</> : days === 1 ? 'Demain' : days === 0 ? "Aujourd'hui" : 'Passé'}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-[15px] text-white/85">
            <CalendarDays aria-hidden="true" className="size-4" />
            {label}
          </p>
        </div>
        <p className="relative z-10 mt-3 text-[15px] font-medium text-white/90">{frenchNbsp(heroMessage)}</p>
      </section>

      <div className="space-y-5 px-4 pt-5">
        {syncMessage ? (
          <div
            role="status"
            aria-live="polite"
            className="animate-rise flex items-center gap-2.5 rounded-2xl border border-mint-200 bg-mint-50 px-4 py-3"
          >
            <CloudCheck aria-hidden="true" className="size-4 shrink-0 text-mint-600" />
            <p className="flex-1 text-[14px] font-semibold text-mint-800">{frenchNbsp(syncMessage)}</p>
            <button
              type="button"
              onClick={() => setSyncMessage(null)}
              aria-label="Fermer ce message"
              className="flex min-h-11 min-w-11 shrink-0 items-center justify-center text-mint-600 hover:text-mint-800"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        ) : null}

        {/* Ta prochaine étape */}
        <Card className="relative animate-rise overflow-hidden !border-mint-200" style={{ animationDelay: '60ms' }}>
          <div aria-hidden="true" className="absolute -right-8 -top-8 size-28 rounded-full bg-mint-50" />
          <div className="relative z-10 flex items-start justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wide text-mint-600">
              {finished ? `Tour ${state.tour} terminé` : step ? `Tour ${state.tour} · Étape ${state.index + 1}/${PARCOURS_LENGTH}` : 'Ton parcours'}
            </p>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mint-50 text-mint-600">
              {finished ? <PartyPopper aria-hidden="true" className="size-4" /> : <StepIcon aria-hidden="true" className="size-4" />}
            </span>
          </div>
          {finished ? (
            <>
              <h2 className="relative z-10 mt-1.5 text-xl font-extrabold leading-snug text-navy-900">Bravo, tour {state.tour} terminé !</h2>
              <p className="relative z-10 mt-2 text-[15px] leading-relaxed text-ink-600">
                {frenchNbsp('Les 5 questions ★ reviennent, avec de nouvelles mises en situation et un autre jeu de rôle.')}
              </p>
              <button
                type="button"
                onClick={() => goToNextTour(engine, navigate)}
                className="relative z-10 mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-mint-500 text-[16px] font-bold text-white shadow-[var(--shadow-pop)] transition-transform active:scale-[0.98]"
              >
                Commencer le tour {state.tour + 1} <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            </>
          ) : step ? (
            <>
              <h2 className="relative z-10 mt-1.5 text-xl font-extrabold leading-snug text-navy-900">{step.title}</h2>
              {step.subtitle ? <p className="relative z-10 text-sm font-semibold text-navy-500">{step.subtitle}</p> : null}
              <p className="relative z-10 mt-2 text-[15px] leading-relaxed text-ink-600">{frenchNbsp(step.why)}</p>
              <p className="relative z-10 mt-1 text-xs font-semibold text-ink-400">{step.minutes} min</p>
              <Link
                to={withParcours(step.route)}
                className="relative z-10 mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-mint-500 text-[16px] font-bold text-white shadow-[var(--shadow-pop)] transition-transform active:scale-[0.98]"
              >
                Continuer <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </>
          ) : (
            <p className="relative z-10 mt-2 text-[15px] text-ink-600">Ton parcours se prépare…</p>
          )}
          <Link to="/parcours" className="relative z-10 mt-3 block text-center text-sm font-semibold text-navy-500 underline">
            Voir tout le parcours
          </Link>
        </Card>

        {/* Progression de l'entraînement */}
        <TrainingProgressCard
          global={trainingProgress.global}
          modes={trainingProgress.modes}
          to="/entrainement"
          className="animate-rise"
          style={{ animationDelay: '110ms' }}
        />

        {/* À faire une fois */}
        <Card className="animate-rise" style={{ animationDelay: '160ms' }}>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-bold text-navy-900">À faire une fois</h2>
            <span className="shrink-0 rounded-full bg-navy-50 px-2.5 py-1 text-xs font-bold text-navy-700">
              {oneOffDoneCount}/{ONE_OFF_TASKS.length}
            </span>
          </div>
          <ul className="mt-1 divide-y divide-navy-50">
            {ONE_OFF_TASKS.map((task) => (
              <OneOffRow
                key={task.id}
                task={task}
                done={isOneOffDone(task)}
                onToggle={task.auto ? undefined : () => setUneFois({ ...uneFois, [task.id]: !uneFois[task.id] })}
              />
            ))}
          </ul>
        </Card>

        {/* Progression */}
        <div className="animate-rise grid grid-cols-2 gap-3" style={{ animationDelay: '210ms' }}>
          <LoopStat icon={Repeat} label="Tour en cours" value={`Tour ${state.tour}`} />
          <LoopStat icon={Footprints} label="Étapes faites" value={String(state.totalDone)} />
          <StatTile icon={Check} label="Questions sues" value={`${masteredCount}/${QUESTIONS.length}`} progress={(masteredCount / QUESTIONS.length) * 100} />
          <StatTile icon={UserRound} label="Fiche remplie" value={formatPercent(completion)} progress={completion} />
        </div>

        {/* Raccourcis */}
        <div className="animate-rise space-y-2.5" style={{ animationDelay: '260ms' }}>
          <ShortcutRow to="/memo" icon={FileText} title="Mémo" subtitle="L'essentiel sur une page" />
          <ShortcutRow to="/questions?star=1" icon={Sparkles} title="Questions ★" subtitle="Les 5 questions prioritaires" />
          <ShortcutRow to="/fiche" icon={UserRound} title="Ma fiche" subtitle="Personnalise tes réponses" />
        </div>
      </div>
    </div>
  )
}
