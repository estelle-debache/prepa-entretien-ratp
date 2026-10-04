export type QuizCategory = 'ratp' | 'metier' | 'regles' | 'lexique' | 'situation' | 'savoir-etre'
export interface QuizItem {
  id: string; category: QuizCategory; question: string; options: string[]; answer: number; explanation: string
  sourceId: string
}
