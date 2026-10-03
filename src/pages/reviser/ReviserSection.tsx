import { Link, useParams } from 'react-router'
import { SECTIONS } from '../../content'
import { BlockRenderer } from '../../ui/BlockRenderer'
import { useProfile } from '../../ui/hooks'
import { RatpExtras } from './RatpExtras'
import { LexiconCards } from './LexiconCards'
import { ChecklistSection } from './ChecklistSection'
import { RecruiterQuestions } from './RecruiterQuestions'
import { MistakesList } from './MistakesList'

export default function ReviserSection() {
  const { sectionId = '' } = useParams()
  const [profile] = useProfile()
  const section = SECTIONS.find((s) => s.id === sectionId && s.id !== 'memo')

  if (!section) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-[17px] text-ink-600">Cette fiche n'existe pas.</p>
        <Link to="/reviser" className="font-semibold text-mint-700 underline">Retour à Réviser</Link>
      </div>
    )
  }

  return (
    <div className="animate-fade space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wide text-mint-600">Réviser</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">{section.title}</h1>
      </header>

      {section.blocks.length > 0 ? <BlockRenderer blocks={section.blocks} profile={profile} /> : null}

      {section.id === 'ratp' ? <RatpExtras profile={profile} /> : null}
      {section.id === 'metier' ? <LexiconCards /> : null}
      {section.id === 'checklist' ? <ChecklistSection profile={profile} /> : null}
      {section.id === 'recruteur' ? <RecruiterQuestions /> : null}
      {section.id === 'erreurs' ? <MistakesList /> : null}
    </div>
  )
}
