import type { PlanDay } from './types'

export const PLAN: PlanDay[] = [
  {
    "id": "J-4",
    "offset": -4,
    "title": "J-4 — Découvrir",
    "tasks": [
      {
        "id": "J-4-1",
        "text": "Remplis ta fiche perso",
        "link": "/fiche"
      },
      {
        "id": "J-4-2",
        "text": "Lis « Ce que la RATP évalue »",
        "link": "/reviser/evaluation"
      },
      {
        "id": "J-4-3",
        "text": "Lis les 8 faits sur la RATP",
        "link": "/reviser/ratp"
      },
      {
        "id": "J-4-4",
        "text": "Lis les questions ★ Q1 et Q2",
        "link": "/questions"
      }
    ]
  },
  {
    "id": "J-3",
    "offset": -3,
    "title": "J-3 — S’entraîner à voix haute",
    "tasks": [
      {
        "id": "J-3-1",
        "text": "Entraîne-toi à l’oral sur Q1, Q2, Q7, Q9, Q13",
        "link": "/entrainement"
      },
      {
        "id": "J-3-2",
        "text": "Fais les mises en situation S1, S2, S3",
        "link": "/situations"
      },
      {
        "id": "J-3-3",
        "text": "Fais le quiz",
        "link": "/quiz"
      },
      {
        "id": "J-3-4",
        "text": "Lis « Le métier et la formation »",
        "link": "/reviser/metier"
      }
    ]
  },
  {
    "id": "J-2",
    "offset": -2,
    "title": "J-2 — Avec quelqu’un",
    "tasks": [
      {
        "id": "J-2-1",
        "text": "Appelle le CFA : date de ta session, et à quel moment les 6 mois de permis sont comptés. Note la réponse dans ta fiche",
        "link": "/fiche"
      },
      {
        "id": "J-2-2",
        "text": "Fais les 3 jeux de rôle avec un ami",
        "link": "/jeux-de-role/JR1"
      },
      {
        "id": "J-2-3",
        "text": "Fais une simulation d’entretien avec un ami",
        "link": "/simulation"
      },
      {
        "id": "J-2-4",
        "text": "Revois les questions « à revoir »",
        "link": "/questions"
      }
    ]
  },
  {
    "id": "J-1",
    "offset": -1,
    "title": "J-1 — Lever le pied",
    "tasks": [
      {
        "id": "J-1-1",
        "text": "Vérifie le nom du PDG et l’actualité sur ratpgroup.com (5 min)"
      },
      {
        "id": "J-1-2",
        "text": "Relis seulement le mémo",
        "link": "/memo"
      },
      {
        "id": "J-1-3",
        "text": "Prépare ta tenue, tes papiers et ton trajet",
        "link": "/reviser/checklist"
      },
      {
        "id": "J-1-4",
        "text": "Couche-toi tôt, zéro alcool"
      }
    ]
  },
  {
    "id": "J-0",
    "offset": 0,
    "title": "J-0 — Le jour J",
    "tasks": [
      {
        "id": "J-0-1",
        "text": "Arrive 15 min en avance, téléphone éteint"
      },
      {
        "id": "J-0-2",
        "text": "Relis le mémo une dernière fois avant d’entrer",
        "link": "/memo"
      },
      {
        "id": "J-0-3",
        "text": "Respire : tu es prêt"
      }
    ]
  }
]
