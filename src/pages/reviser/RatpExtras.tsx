import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { EXTRAS, FACTS, LOCAL_NETWORK } from '../../content'
import type { Profile } from '../../content/types'
import { Callout, Card, Chip, Disclosure } from '../../ui/primitives'
import { RichText } from '../../ui/RichText'

export function RatpExtras({ profile }: { profile: Profile }) {
  const [tab, setTab] = useState<'A' | 'B'>('A')
  const current = tab === 'A' ? LOCAL_NETWORK.versionA : LOCAL_NETWORK.versionB

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wide text-mint-600">8 faits à connaître</h2>
        <div className="space-y-2.5">
          {FACTS.map((fact, i) => (
            <Card key={fact.id} className="animate-rise flex gap-3 !p-4" style={{ animationDelay: `${i * 40}ms` }}>
              <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="text-[15px] font-bold text-navy-900">{fact.title}</p>
                <p className="mt-0.5 text-[16px] leading-relaxed text-ink-900"><RichText text={fact.text} profile={profile} /></p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Card className="!p-0 overflow-hidden">
        <Disclosure title="Pour briller" subtitle={`${EXTRAS.length} infos en plus, si tu veux aller plus loin`}>
          <ul className="space-y-2.5">
            {EXTRAS.map((extra) => (
              <li key={extra.id} className="flex gap-2.5 text-[16px] leading-relaxed text-ink-900">
                <Sparkles aria-hidden="true" className="mt-1 size-4 shrink-0 text-amber-500" />
                <span><RichText text={extra.text} profile={profile} /></span>
              </li>
            ))}
          </ul>
        </Disclosure>
      </Card>

      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wide text-mint-600">Le réseau près de toi</h2>
        <div className="flex gap-2">
          <Chip active={tab === 'A'} onClick={() => setTab('A')}>Aujourd'hui</Chip>
          <Chip active={tab === 'B'} onClick={() => setTab('B')}>Si je déménage</Chip>
        </div>
        <Card key={tab} className="animate-fade">
          <p className="text-[15px] font-bold text-navy-900">{current.title}</p>
          <p className="mt-1 text-[16px] leading-relaxed text-ink-900"><RichText text={current.text} profile={profile} /></p>
        </Card>
        <Callout tone="info">
          <RichText text={LOCAL_NETWORK.rule} profile={profile} />
        </Callout>
      </section>
    </div>
  )
}
