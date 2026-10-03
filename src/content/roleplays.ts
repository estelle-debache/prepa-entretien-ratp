import type { RolePlay } from './types'

export const ROLE_PLAYS: RolePlay[] = [
  {
    "id": "JR1",
    "title": "Voyageur agressif",
    "roles": "ton ami joue un voyageur qui hausse le ton et t'insulte sur ton âge. Tu joues Yahia, candidat conducteur. L'observateur peut être une troisième personne.",
    "lines": [
      {
        "speaker": "voyageur",
        "text": "Vous êtes trop jeune pour faire ce travail !"
      },
      {
        "speaker": "candidat",
        "text": "Je comprends que vous soyez mécontent. Je vous écoute."
      },
      {
        "speaker": "voyageur",
        "text": "Vous ne comprenez rien, dépêchez-vous !"
      },
      {
        "speaker": "candidat",
        "text": "Je vais vous répondre calmement. Qu'est-ce qui vous pose problème ?"
      },
      {
        "speaker": "voyageur",
        "text": "Je suis en retard à cause de vous !"
      },
      {
        "speaker": "candidat",
        "text": "Je ne peux pas rouler plus vite, c'est une question de sécurité. Par contre, je peux vous dire où on en est : on a environ dix minutes de retard."
      },
      {
        "speaker": "voyageur",
        "text": "Alors faites quelque chose !"
      },
      {
        "speaker": "candidat",
        "text": "Je comprends, et je fais tout pour que le trajet se passe bien pour tout le monde."
      },
      {
        "speaker": "action",
        "text": "action, pas dit au voyageur : si ça monte encore, il s'arrête en sécurité et prévient le PC"
      }
    ],
    "observerChecks": [
      "Yahia reste poli et ne répond pas à l'insulte.",
      "Il garde la sécurité et ne touche pas au voyageur.",
      "Il sait alerter le PC et ne prétend pas connaître une procédure non apprise."
    ]
  },
  {
    "id": "JR2",
    "title": "Voyageur sans titre qui refuse de payer",
    "roles": "ton ami joue un voyageur sans titre qui refuse d'acheter son trajet et insiste. Tu joues Yahia. L'observateur peut être une troisième personne.",
    "lines": [
      {
        "speaker": "voyageur",
        "text": "Je n'ai pas de titre, et je ne vais pas payer."
      },
      {
        "speaker": "candidat",
        "text": "Je peux vous indiquer comment acheter votre trajet par SMS ou carte bancaire sans contact."
      },
      {
        "speaker": "voyageur",
        "text": "Je ne veux rien acheter."
      },
      {
        "speaker": "candidat",
        "text": "Je comprends. Je ne suis pas contrôleur, mais il y a des contrôles sur la ligne, et sans titre vous risquez une amende. Je vous ai informé."
      },
      {
        "speaker": "voyageur",
        "text": "Alors je reste là et vous ne repartez pas !"
      },
      {
        "speaker": "candidat",
        "text": "Je ne vais pas me disputer avec vous. Tout le monde attend de repartir, alors on en reste là."
      },
      {
        "speaker": "voyageur",
        "text": "Vous ne pouvez pas m'obliger !"
      },
      {
        "speaker": "candidat",
        "text": "Je ne vais pas vous retenir. Je vous ai informé, je continue mon service."
      },
      {
        "speaker": "voyageur",
        "text": "Faites ce que vous voulez."
      },
      {
        "speaker": "candidat",
        "text": "Bonne journée, monsieur."
      },
      {
        "speaker": "action",
        "text": "action, pas dit au voyageur : si ça dégénère, il s'arrête en sécurité et prévient le PC"
      }
    ],
    "observerChecks": [
      "Yahia informe sur l'achat du titre et sur le risque d'amende, sans menacer ni verbaliser.",
      "Il ne menace pas, ne touche pas le voyageur et ne bloque pas le bus.",
      "Il garde son calme et sait prévenir le PC si besoin."
    ]
  },
  {
    "id": "JR3",
    "title": "Malaise d'un voyageur",
    "roles": "ton ami joue un voyageur qui se sent mal puis ne répond plus. Tu joues Yahia. L'observateur peut être une troisième personne.",
    "lines": [
      {
        "speaker": "voyageur",
        "text": "Je ne me sens pas bien…"
      },
      {
        "speaker": "candidat",
        "text": "D'accord, je m'arrête tout de suite. Asseyez-vous, je suis là."
      },
      {
        "speaker": "action",
        "text": "action : il arrête le bus dans un endroit sûr"
      },
      {
        "speaker": "voyageur",
        "text": "J'ai du mal à rester debout."
      },
      {
        "speaker": "candidat",
        "text": "Restez assis. Vous m'entendez bien ? Vous avez un problème de santé ?"
      },
      {
        "speaker": "action",
        "text": "action : il prévient le PC par la radio"
      },
      {
        "speaker": "voyageur",
        "text": "Je crois que je vais tomber."
      },
      {
        "speaker": "candidat",
        "text": "(aux autres voyageurs) S'il vous plaît, laissez-nous un peu de place."
      },
      {
        "speaker": "action",
        "text": "il ne répond plus, il s'affaisse sur son siège"
      },
      {
        "speaker": "action",
        "text": "Yahia appelle les secours (le 15 ou le 112) et prévient le PC. Puis, aux voyageurs : « Est-ce qu'il y a un médecin ou un secouriste dans le bus ? »"
      },
      {
        "speaker": "action",
        "text": "Il reste près de la personne, ne la déplace pas inutilement et fait les gestes de premiers secours qu'il connaît."
      },
      {
        "speaker": "candidat",
        "text": "Les secours arrivent. Merci de rester calmes."
      },
      {
        "speaker": "action",
        "text": "il prévient son responsable et fait le rapport demandé"
      }
    ],
    "observerChecks": [
      "Yahia sécurise, alerte et demande de l'aide rapidement.",
      "Il ne déplace pas la personne et n'improvise pas de geste inconnu.",
      "Il reste calme, suit la consigne et informe le PC."
    ]
  }
]
