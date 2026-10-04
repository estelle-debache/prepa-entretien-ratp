import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, Check, FastForward, Gamepad2, ListOrdered, Mic, PartyPopper, Sparkles, Users, Zap, type LucideIcon } from 'lucide-react'
import { QUESTIONS, SITUATIONS } from '../../content'
import { quickReviewOrder } from '../../lib/practice/selection'
import { isTourFinished, withParcours } from '../../lib/practice/parcours'
import { useStatutQuestions } from '../../ui/hooks'
import { useParcoursEngine } from '../../ui/useParcoursEngine'
import { goToNextTour } from '../../ui/parcoursActions'
import { STEP_ICONS } from '../../ui/stepIcons'
import { frenchNbsp } from '../../ui/format'
import { ProgressBar } from '../../ui/primitives'
import { TrainingProgressCard } from '../../ui/TrainingProgressCard'
import { useTrainingProgress } from '../../ui/useTrainingProgress'
import type { ModeId, ModeProgress } from '../../ui/trainingProgress'

interface ModeCard { id: ModeId; icon: LucideIcon; title: string; description: string; to: string }

/** Pastille d'état : lisible visuellement (couleur + texte) et par VoiceOver via le `aria-label` de la carte parente. */
function ModeStatusPill({ started, done }: { started: boolean; done: boolean }) {
  if (done) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-mint-100 bg-mint-50 px-2.5 py-1 text-xs font-bold text-mint-700">
        <Check aria-hidden="true" className="size-3.5" strokeWidth={3} /> Fait
      </span>
    )
  }
  if (started) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-500" /> En cours
      </span>
    )
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-navy-100 bg-navy-50 px-2.5 py-1 text-xs font-semibold text-navy-500">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-navy-300" /> Pas encore fait
    </span>
  )
}

function modeStateLabel(started: boolean, done: boolean): string {
  return done ? 'Fait' : started ? 'En cours' : 'Pas encore fait'
}

export default function Hub() {
  const navigate = useNavigate()
  const [statutQuestions] = useStatutQuestions()
  const engine = useParcoursEngine()
  const { state, step } = engine
  const finished = isTourFinished(state)

  const recommendedId = useMemo(() => quickReviewOrder(QUESTIONS, statutQuestions)[0]?.id ?? 'Q1', [statutQuestions])

  const trainingProgress = useTrainingProgress()
  const progressByMode = useMemo(
    () => Object.fromEntries(trainingProgress.modes.map((m) => [m.modeId, m])) as Record<ModeId, ModeProgress>,
    [trainingProgress],
  )

  const modes: ModeCard[] = [
    { id: 'oral', icon: Mic, title: 'Oral seul', description: 'Réponds à voix haute, chronométré, puis auto-évalue-toi.', to: `/entrainement/oral/${recommendedId}` },
    { id: 'ami', icon: Users, title: 'Avec un ami', description: 'Ton ami pose la question et coche ta grille.', to: `/entrainement/ami/${recommendedId}` },
    { id: 'simulation', icon: Gamepad2, title: "Simulation d'entretien", description: 'Un entretien complet, seul ou avec un ami.', to: '/simulation' },
    { id: 'quiz', icon: Zap, title: 'Quiz', description: 'Des questions rapides sur la RATP, le métier et les règles.', to: '/quiz' },
    { id: 'situations', icon: Sparkles, title: 'Mises en situation', description: `« Que fais-tu ? » sur les ${SITUATIONS.length} situations possibles.`, to: '/situations' },
    { id: 'reflex', icon: ListOrdered, title: 'Exercice des réflexes', description: 'Remets les 5 réflexes dans le bon ordre.', to: '/situations/ordre' },
    { id: 'revision', icon: FastForward, title: 'Révision rapide', description: 'Enchaîne les questions, sans chrono ni micro.', to: '/revision-rapide' },
  ]

  const StepIcon = step ? STEP_ICONS[step.kind] : Mic

  return (
    <div className="space-y-5">
      <header className="animate-rise space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">S'entraîner</h1>
        <p className="text-[15px] text-ink-600">{frenchNbsp('Choisis un mode. Les sessions sont courtes : 5 à 15 minutes suffisent.')}</p>
      </header>

      <TrainingProgressCard global={trainingProgress.global} className="animate-rise" />

      {finished ? (
        <button
          type="button"
          onClick={() => goToNextTour(engine, navigate)}
          className="animate-pop flex w-full items-center gap-3 rounded-3xl bg-navy-900 p-5 text-left text-white shadow-[var(--shadow-pop)]"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <PartyPopper aria-hidden="true" className="size-6 text-mint-300" />
          </span>
          <span className="flex-1">
            <span className="block text-xs font-bold uppercase tracking-wide text-mint-300">Tour {state.tour} terminé</span>
            <span className="block text-[17px] font-bold">Commencer le tour {state.tour + 1}</span>
            <span className="block text-sm text-white/80">
              {frenchNbsp('Les 5 questions ★ reviennent, avec de nouvelles mises en situation et un autre jeu de rôle.')}
            </span>
          </span>
          <ArrowRight aria-hidden="true" className="size-5 shrink-0" />
        </button>
      ) : (
        <Link
          to={step ? withParcours(step.route) : '/parcours'}
          className="animate-pop flex items-center gap-3 rounded-3xl bg-navy-900 p-5 text-white shadow-[var(--shadow-pop)]"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <StepIcon aria-hidden="true" className="size-6 text-mint-300" />
          </span>
          <span className="flex-1">
            <span className="block text-xs font-bold uppercase tracking-wide text-mint-300">Ta prochaine étape</span>
            <span className="block text-[17px] font-bold">{step ? step.title : 'Ton parcours se prépare…'}</span>
            <span className="block text-sm text-white/80">{step ? frenchNbsp(step.why) : ''}</span>
          </span>
          <ArrowRight aria-hidden="true" className="size-5 shrink-0" />
        </Link>
      )}
      <Link to="/parcours" className="block text-center text-sm font-semibold text-navy-500 underline">
        Voir tout le parcours
      </Link>

      <div className="space-y-3">
        {modes.map(({ id, icon: Icon, title, description, to }, i) => {
          const p = progressByMode[id]
          const pct = Math.round(p.progress * 100)
          const barColor = p.done ? 'bg-mint-500' : p.started ? 'bg-amber-500' : 'bg-navy-100'
          return (
            <Link
              key={id}
              to={to}
              aria-label={`${title}. ${description} ${modeStateLabel(p.started, p.done)}. ${p.detail}.`}
              className="animate-rise flex flex-col gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-[var(--shadow-card)] transition-transform active:scale-[0.99]"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-navy-900">{title}</span>
                  <span className="block text-sm text-ink-400">{description}</span>
                </span>
                <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-navy-300" />
              </div>
              <div aria-hidden="true" className="flex items-center gap-2.5">
                <div className="min-w-0 flex-1">
                  <ProgressBar value={pct} max={100} colorClassName={barColor} trackClassName="bg-navy-50" />
                </div>
                <ModeStatusPill started={p.started} done={p.done} />
              </div>
              <p aria-hidden="true" className="text-xs text-ink-400">{p.detail}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
