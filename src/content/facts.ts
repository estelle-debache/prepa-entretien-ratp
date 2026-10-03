import type { Fact, Extra, LocalNetwork } from './types'

export const FACTS: Fact[] = [
  {
    "id": "F1",
    "title": "Qui est la RATP ?",
    "text": [
      "La RATP (Régie autonome des transports parisiens) est une entreprise publique (un EPIC), créée par une loi de 1948. Elle exploite les transports parisiens depuis le 1er janvier 1949. Son siège est à Paris, quai de la Rapée (12e). **Île-de-France Mobilités (IDFM)** est l'autorité organisatrice : elle décide de l'offre de transport et des tarifs, elle finance, et elle confie l'exploitation des lignes à des opérateurs comme le groupe RATP."
    ]
  },
  {
    "id": "F2",
    "title": "Raison d'être du groupe (2021)",
    "text": [
      "« S'engager chaque jour pour une meilleure qualité de ville. » (En entretien : la dire avec ses mots, sauf si on la demande précisément.)"
    ]
  },
  {
    "id": "F3",
    "title": "PDG",
    "text": [
      "Xavier Piechaczyk, président-directeur général du groupe RATP depuis février 2026. Il a succédé à Jean Castex, parti présider la SNCF. (À revérifier la veille sur ratpgroup.com.)"
    ]
  },
  {
    "id": "F4",
    "title": "Taille (chiffres du groupe, 2026)",
    "text": [
      "environ 73 000 collaborateurs, environ 4,5 milliards de voyages par an, présent dans une quinzaine de pays sur 5 continents. Le groupe se présente comme le 2e opérateur mondial de transport urbain (l'ancienne page ratp.fr dit encore « 3e » : dire « l'un des tout premiers au monde »)."
    ]
  },
  {
    "id": "F5",
    "title": "Les bus et la concurrence",
    "text": [
      "IDFM a ouvert à la concurrence les bus de Paris et de la petite couronne, découpés en 12 lots. **RATP Cap Île-de-France**, filiale du groupe RATP créée en 2021, en a gagné 8 (plus de 70 % de l'activité). Les deux lots de Paris (Rive Gauche et Rive Droite) démarrent le 1er novembre 2026. Le groupe reste public."
    ]
  },
  {
    "id": "F6",
    "title": "Environnement",
    "text": [
      "fin 2025, environ 75 % des bus du groupe en Île-de-France sont « propres » (électriques, biométhane ou hybrides). Les centres bus sont convertis à l'électrique ou au biométhane."
    ]
  },
  {
    "id": "F7",
    "title": "Recrutement",
    "text": [
      "en 2026, le groupe recrute environ 6 600 personnes, dont 3 500 en CDI en Île-de-France."
    ]
  },
  {
    "id": "F8",
    "title": "Les 4 « traits de personnalité » du groupe",
    "text": [
      "l'humain au cœur ; la culture du service ; la performance ; la responsabilité et l'inclusion."
    ]
  }
]
export const EXTRAS: Extra[] = [
  {
    "id": "PB1",
    "text": [
      "Le CFA du groupe RATP a été créé en janvier 2017 ; 4 321 alternants formés de 2017 à 2025."
    ]
  },
  {
    "id": "PB2",
    "text": [
      "RATP Dev (filiale) exploite aussi des réseaux en France et à l'étranger, par exemple le métro et le tram de Lyon depuis le 1er janvier 2025."
    ]
  },
  {
    "id": "PB3",
    "text": [
      "La ligne 14 du métro va jusqu'à l'aéroport d'Orly et Saint-Denis Pleyel depuis 2024 (ligne automatique). La RATP a été très mobilisée pour les Jeux olympiques de Paris 2024."
    ]
  },
  {
    "id": "PB4",
    "text": [
      "Le GPSR (Groupe de protection et de sécurité des réseaux) est le service de sûreté interne de la RATP."
    ]
  },
  {
    "id": "PB5",
    "text": [
      "Depuis le 1er janvier 2025 : ticket Bus-Tram à 2 € et ticket Métro-Train-RER à 2,50 €. Les tickets en carton ne sont plus acceptés dans les bus depuis le 1er mai 2026. À bord, on peut acheter son trajet par SMS ou par carte bancaire sans contact."
    ]
  },
  {
    "id": "PB6",
    "text": [
      "Le TVM (Trans-Val-de-Marne) est l'une des lignes de bus les plus fréquentées d'Europe."
    ]
  },
  {
    "id": "PB7",
    "text": [
      "Les 3 principes présentés aux nouveaux agents : laïcité, neutralité, non-discrimination."
    ]
  }
]
export const LOCAL_NETWORK: LocalNetwork = {
  "versionA": {
    "title": "Version A — aujourd’hui (Évry-Courcouronnes)",
    "text": [
      "« J'habite Évry-Courcouronnes. Chez moi, les bus ne font pas partie de l'ancien réseau RATP : c'est un réseau de grande couronne. Le secteur le plus proche repris par RATP Cap Île-de-France, c'est Massy-Juvisy, depuis le 1er mars 2026. »"
    ]
  },
  "versionB": {
    "title": "Version B — si tu emménages à Sucy-en-Brie",
    "text": [
      "RER A (gare de Sucy-Bonneuil) ; bus **393** (en site propre, Sucy-Bonneuil RER ↔ Thiais Carrefour de la Résistance) et **308** (Gare de Villiers ↔ Créteil Préfecture), exploités depuis le 1er août 2026 par **RATP Cap Pompadour** (filiale de RATP Cap Île-de-France) : 2 centres bus, à **Thiais et Créteil**, environ 420 bus, 23 lignes dont le **TVM**. Aussi : bus 104 et Noctilien N32."
    ]
  },
  "rule": [
    "dire la version A si on te demande où tu habites ; la version B seulement comme projet (« en plus, je prévois de m'installer à Sucy-en-Brie, ce qui me rapprocherait des centres bus du Val-de-Marne »). Le déménagement n'est jamais une condition."
  ]
}
