import type { RecruiterQuestion } from './types'

export const RECRUITER_QUESTIONS: RecruiterQuestion[] = [
  {
    "id": "R1",
    "text": "Pendant la période en entreprise, à quelle entité et à quel centre bus serais-je rattaché ?"
  },
  {
    "id": "R2",
    "text": "Comment se passe l'accompagnement par le tuteur pendant les 3 mois en entreprise ?"
  },
  {
    "id": "R3",
    "text": "Selon vous, qu'est-ce qui fait la réussite d'un apprenti conducteur chez vous ?"
  },
  {
    "id": "R4",
    "text": "Après le titre professionnel, comment se passent l'embauche et l'affectation ?"
  },
  {
    "id": "R5",
    "text": "Quelles difficultés rencontrent le plus souvent les nouveaux conducteurs, et comment les aidez-vous ?"
  },
  {
    "id": "R6",
    "text": "J'aurai mes 6 mois de permis en décembre : est-ce bien compatible avec le calendrier de la session ?",
    "condition": "seulement si le sujet n’a pas été abordé"
  }
]
