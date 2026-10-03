import type { Situation } from './types'

export const SITUATIONS: Situation[] = [
  {
    "id": "S1",
    "star": true,
    "title": "Un voyageur devient agressif verbalement",
    "steps": [
      [
        "Je reste calme et poli. Je ne réponds pas sur le même ton. Je reste à mon poste de conduite et je ne touche jamais la personne."
      ],
      [
        "J'écoute, je répète avec mes mots ce qu'il me reproche, j'explique la règle simplement, sans juger."
      ],
      [
        "Si ça monte ou devient menaçant : je m'arrête dans un endroit sûr et je préviens le PC par la radio, comme on me l'apprendra."
      ],
      [
        "Je rassure les autres voyageurs."
      ],
      [
        "Après, je préviens mon responsable et je fais le rapport qu'on me demande."
      ]
    ],
    "keyPhrase": "Ma priorité, c'est la sécurité de tout le monde, pas d'avoir le dernier mot.",
    "trap": "dire qu'on « remet la personne à sa place » ou qu'on la fait descendre de force. Et s'il t'insulte sur ton âge : ne pas le prendre pour toi, rester sur la règle.",
    "rolePlayId": "JR1"
  },
  {
    "id": "S2",
    "star": true,
    "title": "Un voyageur sans titre refuse de payer",
    "steps": [
      [
        "Je reste poli et j'explique simplement les moyens d'acheter son trajet, par SMS ou carte bancaire sans contact."
      ],
      [
        "Je ne verbalise pas : le contrôle visuel des titres fait partie de mon rôle, pas la sanction. Les amendes, ce sont les contrôleurs."
      ],
      [
        "Je ne bloque pas le bus pour ce refus et je ne me mets pas en danger."
      ],
      [
        "Si la situation s'envenime, je m'écarte du conflit et je contacte le PC comme on me l'apprendra."
      ],
      [
        "Ensuite, je préviens mon responsable et je fais le rapport demandé."
      ]
    ],
    "keyPhrase": "Je vous indique comment acheter votre trajet ; ma priorité reste la sécurité de tous.",
    "trap": "verbaliser, retenir le voyageur ou empêcher le bus de repartir pour obtenir le paiement.",
    "rolePlayId": "JR2"
  },
  {
    "id": "S3",
    "star": true,
    "title": "Un voyageur fait un malaise",
    "steps": [
      [
        "Je m'arrête en sécurité."
      ],
      [
        "Je vérifie si la personne répond, sans la déplacer inutilement."
      ],
      [
        "J'alerte tout de suite : le PC par la radio et, si la personne ne répond pas ou respire mal, les secours (le 15 ou le 112). Je demande s'il y a un médecin ou un secouriste à bord."
      ],
      [
        "Je peux appliquer mes connaissances de premiers secours, dans les limites de ma formation."
      ],
      [
        "Je rassure les voyageurs, puis je rends compte à mon responsable."
      ]
    ],
    "keyPhrase": "Je m'occupe d'abord de sécuriser la situation et d'alerter les secours.",
    "trap": "improviser un geste que je ne connais pas ou laisser la personne seule sans alerter.",
    "rolePlayId": "JR3"
  },
  {
    "id": "S4",
    "star": false,
    "title": "Une bagarre éclate entre voyageurs",
    "steps": [
      [
        "Je ne m'interpose pas physiquement et je garde une distance sûre."
      ],
      [
        "Si je conduis, je m'arrête en sécurité, puis j'alerte le PC."
      ],
      [
        "Je demande aux voyageurs de s'éloigner si cela peut se faire sans risque."
      ],
      [
        "J'appelle les secours (le 112) si quelqu'un est blessé ou menacé, sans attendre. Ensuite, je suis les indications du PC."
      ],
      [
        "Après l'incident, je préviens mon responsable et je rends compte des faits."
      ]
    ],
    "keyPhrase": "Je ne vais pas au contact ; je protège les personnes et j'alerte.",
    "trap": "tenter de séparer les personnes ou prendre parti dans le conflit."
  },
  {
    "id": "S5",
    "star": false,
    "title": "Retard de dix minutes ; un voyageur demande à descendre entre deux arrêts",
    "steps": [
      [
        "Je ne cherche jamais à rattraper le retard en roulant plus vite."
      ],
      [
        "Je préviens le PC du retard et je suis la consigne de la ligne."
      ],
      [
        "J'informe les voyageurs simplement de la situation."
      ],
      [
        "Pour le voyageur qui veut descendre entre deux arrêts : je lui réponds poliment et j'applique les consignes de la ligne qu'on m'aura apprises. Sans consigne particulière, je m'arrête aux arrêts prévus."
      ],
      [
        "Ensuite, je rends compte à mon responsable si nécessaire."
      ]
    ],
    "keyPhrase": "Je ne prends pas de risque pour rattraper du temps ; je suis la consigne et j'informe.",
    "trap": "accélérer pour rattraper le retard ; s'arrêter n'importe où juste pour faire plaisir, sans consigne."
  },
  {
    "id": "S6",
    "star": false,
    "title": "Vous avez un accrochage avec une voiture",
    "steps": [
      [
        "Je m'arrête et je sécurise le bus sans mettre les voyageurs ni les autres usagers en danger."
      ],
      [
        "Je vérifie s'il y a une personne blessée et j'alerte les secours si besoin."
      ],
      [
        "Je préviens le PC par radio et j'informe les voyageurs avec calme."
      ],
      [
        "Je ne déplace rien et ne repars pas avant d'avoir reçu la consigne adaptée."
      ],
      [
        "Je donne les faits à mon responsable et fais le rapport demandé."
      ]
    ],
    "keyPhrase": "Je sécurise les personnes, j'alerte et je suis les consignes reçues.",
    "trap": "repartir sans prévenir ou reconnaître une responsabilité sans savoir."
  },
  {
    "id": "S7",
    "star": false,
    "title": "Un voyant s'allume, un bruit anormal se fait entendre ou il y a de la fumée",
    "steps": [
      [
        "Je ne continue pas comme si de rien n'était ; je m'arrête en sécurité si nécessaire."
      ],
      [
        "En cas de fumée : je m'arrête, j'ouvre les portes, je fais descendre tout le monde et je les éloigne du bus. Ensuite, j'alerte."
      ],
      [
        "Je préviens le PC et décris clairement le voyant, le bruit ou la fumée."
      ],
      [
        "Je suis les consignes reçues et ne tente pas une réparation que je ne maîtrise pas."
      ],
      [
        "Je préviens mon responsable et rends compte de la situation."
      ]
    ],
    "keyPhrase": "Je ne prends pas de risque avec un défaut du véhicule : j'alerte et j'applique la consigne.",
    "trap": "ignorer le signal ou toucher à un élément mécanique sans formation."
  },
  {
    "id": "S8",
    "star": false,
    "title": "Vous repérez un bagage ou un colis abandonné",
    "steps": [
      [
        "Je ne touche pas au colis et je demande aux voyageurs de garder leurs distances sans créer de panique."
      ],
      [
        "Je préviens le PC et je décris où se trouve l'objet."
      ],
      [
        "Je suis les indications reçues et garde les voyageurs à l'écart si c'est possible sans risque."
      ],
      [
        "Je n'ouvre pas le sac pour chercher son propriétaire."
      ],
      [
        "Je rends compte ensuite à mon responsable."
      ]
    ],
    "keyPhrase": "Je ne touche pas à l'objet ; j'alerte et j'attends la consigne.",
    "trap": "déplacer ou ouvrir le bagage, ou annoncer qu'il est forcément dangereux."
  },
  {
    "id": "S9",
    "star": false,
    "title": "Une personne en fauteuil ou avec une poussette veut monter, mais le bus est plein ou la rampe ne fonctionne pas",
    "steps": [
      [
        "Je reste respectueux et j'explique calmement la situation."
      ],
      [
        "Je ne force pas la montée si ce n'est pas sûr et je ne manipule pas la rampe au hasard."
      ],
      [
        "Je contacte le PC pour connaître la consigne et informer la personne des possibilités prévues."
      ],
      [
        "Je veille à la sécurité des autres voyageurs et j'évite de promettre une solution que je ne maîtrise pas."
      ],
      [
        "Je rends compte du problème à mon responsable."
      ]
    ],
    "keyPhrase": "Je veux vous aider, mais je dois d'abord vérifier ce qui est possible en sécurité.",
    "trap": "refuser sans explication, ou essayer une manipulation inconnue."
  },
  {
    "id": "S10",
    "star": false,
    "title": "Un voyageur ivre dérange les autres",
    "steps": [
      [
        "Je garde une distance et je parle calmement, sans provoquer ni humilier la personne."
      ],
      [
        "Je vérifie que les autres voyageurs ne sont pas en danger."
      ],
      [
        "Si le comportement menace la sécurité, je m'arrête dans un endroit sûr et j'alerte le PC."
      ],
      [
        "Je suis la consigne reçue et ne touche pas au voyageur."
      ],
      [
        "Après, je préviens mon responsable et rends compte des faits."
      ]
    ],
    "keyPhrase": "Je reste calme et je demande de l'aide avant que la situation devienne dangereuse.",
    "trap": "discuter sur le même ton ou essayer de faire descendre la personne de force."
  },
  {
    "id": "S11",
    "star": false,
    "title": "Vous vous trompez d'itinéraire ou oubliez un arrêt",
    "steps": [
      [
        "Je ne fais pas de manœuvre brusque pour revenir sur mon trajet."
      ],
      [
        "Je préviens le PC honnêtement et j'explique où je suis."
      ],
      [
        "J'informe les voyageurs sans inventer d'explication."
      ],
      [
        "Je suis la consigne reçue et je garde une conduite sûre."
      ],
      [
        "Je rends compte de mon erreur à mon responsable et j'explique ce que j'en retiens."
      ]
    ],
    "keyPhrase": "Je reconnais mon erreur, je préviens le PC et je corrige la situation sans risque.",
    "trap": "cacher l'erreur, improviser un demi-tour ou mettre les voyageurs en danger pour rattraper l'arrêt."
  },
  {
    "id": "S12",
    "star": false,
    "title": "Une personne âgée semble perdue ou désorientée",
    "steps": [
      [
        "Je lui parle avec calme et respect et je lui demande ce dont elle a besoin."
      ],
      [
        "Je ne la laisse pas dans une situation dangereuse et je ne la déplace pas sans raison."
      ],
      [
        "Je préviens le PC et demande la consigne à suivre."
      ],
      [
        "Si son état m'inquiète (malaise, confusion forte), j'appelle le 15 ou le 112."
      ],
      [
        "Je rassure la personne et rends compte à mon responsable."
      ]
    ],
    "keyPhrase": "Je prends le temps de l'écouter, je veille à sa sécurité et je demande conseil.",
    "trap": "supposer ce qu'elle veut ou la laisser partir seule si elle paraît en danger."
  }
]
export const REFLEX_STEPS: string[] = ['Sécuriser', 'Alerter', 'Informer', 'Appliquer la consigne', 'Rendre compte']
