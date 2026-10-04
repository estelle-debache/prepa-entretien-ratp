/** Tâches à faire une seule fois (hors boucle, sans date imposée). */

export type OneOffId =
  | 'fiche'
  | 'ecran-accueil'
  | 'lire-ratp'
  | 'lire-metier'
  | 'simulation-complete'
  | 'ami'
  | 'pdg'
  | 'preparatifs'

export interface OneOffTask {
  id: OneOffId
  title: string
  detail: string
  link?: string
  /** Cochée automatiquement par le site (pas de case à cocher manuelle). */
  auto?: boolean
}

export const ONE_OFF_TASKS: OneOffTask[] = [
  {
    id: 'fiche',
    title: 'Remplir ta fiche',
    detail: 'Tes vraies infos remplacent les passages « à compléter » dans les réponses.',
    link: '/fiche',
    auto: true,
  },
  {
    id: 'ecran-accueil',
    title: 'Mettre le site sur ton écran d’accueil',
    detail: 'Dans Safari : Partager, puis « Sur l’écran d’accueil ». Ouvre-le ensuite toujours depuis l’icône.',
  },
  {
    id: 'lire-ratp',
    title: 'Lire les 8 faits sur la RATP',
    detail: 'Ce qu’il faut savoir sur l’entreprise, sans devenir une encyclopédie.',
    link: '/reviser/ratp',
  },
  {
    id: 'lire-metier',
    title: 'Lire « Le métier et la formation »',
    detail: 'Le quotidien du conducteur, la formation et les règles à connaître.',
    link: '/reviser/metier',
  },
  {
    id: 'simulation-complete',
    title: 'Faire une simulation complète',
    detail: 'Un entretien entier, du début à la fin. Prévois environ 30 minutes.',
    link: '/simulation?length=complete',
    auto: true,
  },
  {
    id: 'ami',
    title: 'T’entraîner avec quelqu’un',
    detail: 'Un ami ou un proche te pose les questions et coche ce qu’il entend.',
    link: '/entrainement/ami/Q1',
  },
  {
    id: 'pdg',
    title: 'La veille : vérifier l’actualité',
    detail: 'Sur ratpgroup.com, vérifie le nom du PDG et les dernières nouvelles (5 minutes).',
  },
  {
    id: 'preparatifs',
    title: 'Préparer tenue, papiers et trajet',
    detail: 'Tout ce qu’il faut avoir prêt la veille.',
    link: '/reviser/checklist',
  },
]
