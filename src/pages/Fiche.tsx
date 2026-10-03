import { CheckCircle2, Lock } from 'lucide-react'
import { PROFILE_FIELDS, PROFILE_GROUPS } from '../content/profileFields'
import type { ProfileField } from '../content/types'
import { Card, Disclosure, ProgressBar, SelectButtons, YesNoToggle } from '../ui/primitives'
import { profileCompletion, useFlash, useProfile } from '../ui/hooks'

/**
 * `yesno`/`select` sont des groupes de boutons (pas de contrôle natif unique) : on les relie au
 * libellé via `aria-labelledby` plutôt qu'un `<label>` qui les engloberait (VoiceOver n'associerait
 * alors qu'un seul des boutons). `text`/`textarea`/`date` utilisent un `<label htmlFor>` classique.
 */
function FieldControl({ field, value, onChange, labelId }: { field: ProfileField; value: string; onChange: (value: string) => void; labelId: string }) {
  switch (field.type) {
    case 'yesno':
      return <YesNoToggle value={value} onChange={onChange} labelledBy={labelId} />
    case 'select':
      return <SelectButtons options={field.options ?? []} value={value} onChange={onChange} labelledBy={labelId} />
    case 'textarea':
      return (
        <textarea
          id={field.id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="w-full rounded-xl border-2 border-navy-100 bg-white px-3.5 py-2.5 text-base leading-relaxed text-ink-900 placeholder:text-ink-400 focus:border-mint-500"
        />
      )
    case 'date':
      return (
        <input
          id={field.id}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-11 w-full rounded-xl border-2 border-navy-100 bg-white px-3.5 text-base text-ink-900 focus:border-mint-500"
        />
      )
    default:
      return (
        <input
          id={field.id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="min-h-11 w-full rounded-xl border-2 border-navy-100 bg-white px-3.5 text-base text-ink-900 placeholder:text-ink-400 focus:border-mint-500"
        />
      )
  }
}

export default function Fiche() {
  const [profile, setProfile] = useProfile()
  const [saved, flashSaved] = useFlash()
  const completion = profileCompletion(profile)

  const update = (id: ProfileField['id'], value: string) => {
    setProfile((prev) => ({ ...prev, [id]: value }))
    flashSaved()
  }

  return (
    <div className="space-y-5">
      <header className="animate-rise space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Ma fiche</h1>
        <p className="flex items-start gap-2 rounded-2xl bg-navy-50 p-3 text-sm font-medium text-navy-700">
          <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          Rien n'est envoyé nulle part : tout reste enregistré sur ton téléphone, et sert à personnaliser tes réponses dans Questions et le Mémo.
        </p>
      </header>

      <div className="animate-rise space-y-1.5" style={{ animationDelay: '40ms' }}>
        <div className="flex items-center justify-between text-sm font-bold text-navy-700">
          <span>Fiche complétée</span>
          <span>{completion}%</span>
        </div>
        <ProgressBar value={completion} max={100} />
      </div>

      <div
        aria-live="polite"
        className={`animate-rise flex items-center gap-1.5 text-sm font-semibold text-mint-700 transition-opacity ${saved ? 'opacity-100' : 'opacity-0'}`}
      >
        <CheckCircle2 aria-hidden="true" className="size-4" /> Enregistré sur ton téléphone
      </div>

      <Card className="!p-0 animate-rise divide-y divide-navy-50 overflow-hidden" style={{ animationDelay: '70ms' }}>
        {PROFILE_GROUPS.map((group) => {
          const fields = PROFILE_FIELDS.filter((f) => f.group === group.id)
          const filled = fields.filter((f) => profile[f.id]?.trim()).length
          const defaultOpen = filled < fields.length
          return (
            <Disclosure
              key={group.id}
              defaultOpen={defaultOpen}
              title={group.title}
              subtitle={`${filled}/${fields.length} rempli${filled === 1 ? '' : 's'}`}
            >
              {group.intro ? <p className="mb-3 text-sm text-ink-600">{group.intro}</p> : null}
              <div className="space-y-4">
                {fields.map((field) => {
                  const labelId = `${field.id}-label`
                  const isGroup = field.type === 'yesno' || field.type === 'select'
                  const Heading = isGroup ? 'span' : 'label'
                  return (
                    <div key={field.id} className="space-y-1.5">
                      <Heading id={isGroup ? labelId : undefined} htmlFor={isGroup ? undefined : field.id} className="block text-[15px] font-semibold text-navy-900">
                        {field.label}
                      </Heading>
                      {field.help ? <span className="block text-sm text-ink-400">{field.help}</span> : null}
                      <FieldControl field={field} value={profile[field.id] ?? field.defaultValue ?? ''} onChange={(v) => update(field.id, v)} labelId={labelId} />
                    </div>
                  )
                })}
              </div>
            </Disclosure>
          )
        })}
      </Card>
    </div>
  )
}
