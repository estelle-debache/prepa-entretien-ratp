import { Link } from 'react-router'
import { CalendarDays, Check, ChevronRight, FileText, Sparkles, Star, UserRound, type LucideIcon } from 'lucide-react'
import { PLAN, TOP_QUESTIONS, QUESTIONS } from '../content'
import type { PlanDay, PlanTask } from '../content/types'
import { Card, Disclosure, ProgressBar } from '../ui/primitives'
import { usePlan, useProfile, useReglages, useStatutQuestions, profileCompletion } from '../ui/hooks'
import { clamp, countdownLabel, formatPercent, frenchNbsp, planDayLabel } from '../ui/format'

function TaskRow({ task, done, onToggle }: { task: PlanTask; done: boolean; onToggle: () => void }) {
  return (
    <li className="flex items-center gap-3 py-2">
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={task.text}
        onClick={onToggle}
        className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          done ? 'border-mint-500 bg-mint-500 text-white' : 'border-navy-200 bg-white text-transparent'
        }`}
      >
        <Check aria-hidden="true" className="size-4" strokeWidth={3} />
      </button>
      <span className={`flex-1 text-[15px] leading-snug ${done ? 'text-ink-400 line-through' : 'text-ink-900'}`}>{frenchNbsp(task.text)}</span>
      {task.link ? (
        <Link to={task.link} className="flex min-h-11 min-w-11 items-center justify-center text-navy-500 hover:text-navy-900" aria-label={`Ouvrir : ${task.text}`}>
          <ChevronRight aria-hidden="true" className="size-5" />
        </Link>
      ) : null}
    </li>
  )
}

function PlanDayBlock({ day, plan, setPlan }: { day: PlanDay; plan: Record<string, boolean>; setPlan: (v: Record<string, boolean>) => void }) {
  const done = day.tasks.filter((t) => plan[t.id]).length
  return (
    <ul className="divide-y divide-navy-50">
      {day.tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          done={Boolean(plan[task.id])}
          onToggle={() => setPlan({ ...plan, [task.id]: !plan[task.id] })}
        />
      ))}
      <li className="sr-only">{done}/{day.tasks.length} faites</li>
    </ul>
  )
}

export default function Home() {
  const [profile] = useProfile()
  const [reglages] = useReglages()
  const [plan, setPlan] = usePlan()
  const [statutQuestions] = useStatutQuestions()

  const { days, label } = countdownLabel(reglages.interviewDate)
  const currentOffset = -clamp(days, 0, 4)
  const currentDay = PLAN.find((d) => d.offset === currentOffset) ?? PLAN[0]
  const otherDays = PLAN.filter((d) => d.id !== currentDay.id)

  const masteredCount = QUESTIONS.filter((q) => statutQuestions[q.id] === 'maitrise').length
  const starMasteredCount = TOP_QUESTIONS.filter((q) => q.star && statutQuestions[q.id] === 'maitrise').length
  const completion = profileCompletion(profile)
  const currentDone = currentDay.tasks.filter((t) => plan[t.id]).length

  const firstName = profile.prenom?.trim() || 'toi'

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
        <p className="relative z-10 mt-3 text-[15px] font-medium text-white/90">
          {firstName === 'toi' ? 'Tu es sur la bonne voie.' : `${firstName}, tu es sur la bonne voie.`}
        </p>
      </section>

      <div className="space-y-5 px-4 pt-5">
        {/* Plan du jour */}
        <Card className="animate-rise" style={{ animationDelay: '60ms' }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-mint-600">{currentDay.id} · ton programme</p>
              <h2 className="text-lg font-bold text-navy-900">{planDayLabel(currentDay.title, reglages.interviewDate, currentDay.offset)}</h2>
            </div>
            <span className="shrink-0 rounded-full bg-navy-50 px-2.5 py-1 text-xs font-bold text-navy-700">
              {currentDone}/{currentDay.tasks.length}
            </span>
          </div>
          <div className="mt-2"><ProgressBar value={currentDone} max={currentDay.tasks.length} /></div>
          <div className="mt-1">
            <PlanDayBlock day={currentDay} plan={plan} setPlan={setPlan} />
          </div>
        </Card>

        {/* Autres jours */}
        <Card className="animate-rise !p-0" style={{ animationDelay: '110ms' }}>
          <Disclosure title="Voir les autres jours du plan" subtitle={`${PLAN.length} jours au total`}>
            <div className="space-y-1">
              {otherDays.map((day) => {
                const done = day.tasks.filter((t) => plan[t.id]).length
                return (
                  <Disclosure key={day.id} tone="card" title={planDayLabel(day.title, reglages.interviewDate, day.offset)} subtitle={`${done}/${day.tasks.length} faites`}>
                    <PlanDayBlock day={day} plan={plan} setPlan={setPlan} />
                  </Disclosure>
                )
              })}
            </div>
          </Disclosure>
        </Card>

        {/* Progression */}
        <div className="animate-rise grid grid-cols-3 gap-3" style={{ animationDelay: '160ms' }}>
          <StatTile icon={Check} label="Questions sues" value={`${masteredCount}/45`} progress={(masteredCount / 45) * 100} />
          <StatTile icon={UserRound} label="Fiche remplie" value={formatPercent(completion)} progress={completion} />
          <StatTile icon={Star} label="★ maîtrisées" value={`${starMasteredCount}/5`} progress={(starMasteredCount / 5) * 100} />
        </div>

        {/* Raccourcis */}
        <div className="animate-rise space-y-2.5" style={{ animationDelay: '210ms' }}>
          <ShortcutRow to="/memo" icon={FileText} title="Mémo" subtitle="L'essentiel sur une page" />
          <ShortcutRow to="/questions?star=1" icon={Sparkles} title="Questions ★" subtitle="Les 5 questions prioritaires" />
          <ShortcutRow to="/fiche" icon={UserRound} title="Ma fiche" subtitle="Personnalise tes réponses" />
        </div>
      </div>
    </div>
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
