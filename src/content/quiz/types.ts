export type QuizCategory = 'ratp' | 'metier' | 'regles' | 'lexique' | 'situation'
export interface QuizItem {
  id: string; category: QuizCategory; question: string; options: string[]; answer: number; explanation: string
  sourceId: string
}
