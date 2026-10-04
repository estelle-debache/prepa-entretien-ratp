/**
 * Parcours en boucle : la suite d'activités recommandée, sans date.
 * Un tour ≈ 75 min. À la fin, on recommence (les situations et jeux de rôle tournent).
 */

export type ParcoursActivity =
  | { kind: 'read'; route: string }
  | { kind: 'oral'; questionId: string | 'priority' }
  | { kind: 'quiz'; mode: 'erreurs-ou-serie' }
  | { kind: 'situation'; slot: 0 | 1 | 2 }
  | { kind: 'reflex' }
  | { kind: 'roleplay' }
  | { kind: 'simulation' }

export interface ParcoursStepTemplate {
  /** Identifiant stable de l'étape. */
  key: string
  title: string
  /** Pourquoi cette étape, en une phrase. */
  why: string
  /** Durée indicative en minutes. */
  minutes: number
  activity: ParcoursActivity
}

export const PARCOURS: ParcoursStepTemplate[] = [
  {
    key: 'lire-evaluation',
    title: 'Lire ce que la RATP évalue',
    why: 'Pour garder en tête ce que le recruteur va regarder.',
    minutes: 5,
    activity: { kind: 'read', route: '/reviser/evaluation' },
  },
  {
    key: 'oral-q1',
    title: 'Te présenter à voix haute',
    why: 'C’est la première question, à coup sûr. Elle donne le ton de tout l’entretien.',
    minutes: 5,
    activity: { kind: 'oral', questionId: 'Q1' },
  },
  {
    key: 'quiz',
    title: 'Quiz',
    why: 'Quelques questions rapides pour vérifier ce que tu as retenu.',
    minutes: 6,
    activity: { kind: 'quiz', mode: 'erreurs-ou-serie' },
  },
  {
    key: 'oral-q2',
    title: 'Dire pourquoi tu veux ce métier',
    why: 'Ta motivation compte autant que tes connaissances.',
    minutes: 5,
    activity: { kind: 'oral', questionId: 'Q2' },
  },
  {
    key: 'situation-a',
    title: 'Mise en situation',
    why: 'Le recruteur peut te demander ce que tu ferais dans un cas concret.',
    minutes: 4,
    activity: { kind: 'situation', slot: 0 },
  },
  {
    key: 'reflexes',
    title: 'Les 5 réflexes dans l’ordre',
    why: 'Le même réflexe sert pour toutes les mises en situation.',
    minutes: 2,
    activity: { kind: 'reflex' },
  },
  {
    key: 'oral-q7',
    title: 'Parler de ton âge et de ton permis',
    why: 'Une question probable : mieux vaut avoir ta réponse prête.',
    minutes: 4,
    activity: { kind: 'oral', questionId: 'Q7' },
  },
  {
    key: 'situation-b',
    title: 'Mise en situation',
    why: 'Plus tu en fais, plus les bons réflexes viennent tout seuls.',
    minutes: 4,
    activity: { kind: 'situation', slot: 1 },
  },
  {
    key: 'oral-q9',
    title: 'Expliquer comment tu viendras à 5 h',
    why: 'La fiabilité est un critère clé : montre que tu as une solution.',
    minutes: 4,
    activity: { kind: 'oral', questionId: 'Q9' },
  },
  {
    key: 'situation-c',
    title: 'Mise en situation',
    why: 'Sécuriser, alerter, informer : entraîne-toi encore une fois.',
    minutes: 4,
    activity: { kind: 'situation', slot: 2 },
  },
  {
    key: 'oral-q13',
    title: 'Alcool, fatigue, téléphone : les règles',
    why: 'Une réponse floue sur ce sujet peut coûter cher.',
    minutes: 4,
    activity: { kind: 'oral', questionId: 'Q13' },
  },
  {
    key: 'jeu-de-role',
    title: 'Jeu de rôle',
    why: 'À deux si quelqu’un est là, sinon en solo avec la voix du téléphone.',
    minutes: 5,
    activity: { kind: 'roleplay' },
  },
  {
    key: 'oral-priorite',
    title: 'Une question à retravailler',
    why: 'Choisie parmi celles que tu ne maîtrises pas encore.',
    minutes: 5,
    activity: { kind: 'oral', questionId: 'priority' },
  },
  {
    key: 'simulation',
    title: 'Simulation d’entretien',
    why: '7 questions à la suite, comme le jour J. Seul ou avec quelqu’un.',
    minutes: 15,
    activity: { kind: 'simulation' },
  },
  {
    key: 'memo',
    title: 'Relire le mémo',
    why: 'L’essentiel sur une page, pour finir le tour.',
    minutes: 5,
    activity: { kind: 'read', route: '/memo' },
  },
]
