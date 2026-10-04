import type { ChecklistGroup } from './types'

export const CHECKLIST: ChecklistGroup[] = [
  {
    "id": "veille",
    "title": "La veille",
    "items": [
      {
        "id": "CL-1-1",
        "text": [
          "Revérifie le nom du PDG et l'actualité RATP sur ratpgroup.com en 5 min."
        ]
      },
      {
        "id": "CL-1-2",
        "text": [
          "Relis ",
          {
            "link": "/memo",
            "text": "le mémo"
          },
          "."
        ]
      },
      {
        "id": "CL-1-3",
        "text": [
          "Prépare ta tenue."
        ]
      },
      {
        "id": "CL-1-4",
        "text": [
          "Vérifie ton trajet et l'horaire."
        ]
      },
      {
        "id": "CL-1-5",
        "text": [
          "Couche-toi tôt."
        ]
      },
      {
        "id": "CL-1-6",
        "text": [
          "Zéro alcool."
        ]
      }
    ]
  },
  {
    "id": "apporter",
    "title": "À apporter",
    "items": [
      {
        "id": "CL-2-1",
        "text": [
          "Pièce d'identité."
        ]
      },
      {
        "id": "CL-2-2",
        "text": [
          "Permis de conduire."
        ]
      },
      {
        "id": "CL-2-3",
        "text": [
          "CV imprimé."
        ]
      },
      {
        "id": "CL-2-4",
        "text": [
          "Convocation."
        ]
      },
      {
        "id": "CL-2-5",
        "text": [
          "De quoi noter."
        ]
      }
    ]
  },
  {
    "id": "jour-j",
    "title": "Le jour J",
    "items": [
      {
        "id": "CL-3-1",
        "text": [
          "Arrive 30 min avant."
        ]
      },
      {
        "id": "CL-3-2",
        "text": [
          "Éteins ton téléphone."
        ]
      },
      {
        "id": "CL-3-3",
        "text": [
          "Relis ",
          {
            "link": "/reviser/evaluation",
            "text": "les filtres"
          },
          " et ",
          {
            "link": "/reviser/erreurs",
            "text": "les erreurs à éviter"
          },
          "."
        ]
      }
    ]
  },
  {
    "id": "apres",
    "title": "Après l'entretien",
    "items": [
      {
        "id": "CL-4-1",
        "text": [
          "Note les questions posées."
        ]
      },
      {
        "id": "CL-4-2",
        "text": [
          "Remercie la personne qui t'a reçu."
        ]
      }
    ]
  }
]
