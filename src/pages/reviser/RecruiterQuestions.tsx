import { RECRUITER_QUESTIONS } from '../../content'
import { Card } from '../../ui/primitives'
import { frenchNbsp } from '../../ui/format'

export function RecruiterQuestions() {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-wide text-mint-600">Des questions possibles (choisis-en 2 ou 3)</h2>
      <div className="space-y-2.5">
        {RECRUITER_QUESTIONS.map((question, i) => (
          <Card key={question.id} className="animate-rise flex gap-3 !p-4" style={{ animationDelay: `${i * 40}ms` }}>
            <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
              {i + 1}
            </span>
            <div>
              <p className="text-[16px] leading-relaxed text-ink-900">{frenchNbsp(question.text)}</p>
              {question.condition ? (
                <p className="mt-1 text-sm italic text-ink-400">({frenchNbsp(question.condition)})</p>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
