import type { TopQuestion, BankQuestion, Question } from './types'

export const TOP_QUESTIONS: TopQuestion[] = [
  {
    "id": "Q1",
    "kind": "top",
    "star": true,
    "theme": "presentation",
    "question": "Présentez-vous / parlez-moi de votre parcours",
    "checks": "un parcours clair, une motivation cohérente et le bon moment pour se lancer.",
    "ideas": [
      [
        "Mon CAP et ce qu'il m'a appris."
      ],
      [
        "Mon expérience du planning et mon intérêt pour le transport."
      ],
      [
        "Pourquoi le groupe RATP et pourquoi maintenant."
      ]
    ],
    "example": [
      "Je m'appelle ",
      {
        "field": "prenom",
        "hint": "ton prénom",
        "fallback": "Yahia"
      },
      ", j'ai 18 ans et j'habite à Évry-Courcouronnes. J'ai obtenu un CAP Agent accompagnant au grand âge. Cette formation m'a appris à être attentif aux personnes, à leurs besoins et à leur sécurité. ",
      "J'ai fait mes stages dans ",
      {
        "field": "stageLieu",
        "hint": "lieu de tes stages"
      },
      ".",
      " Actuellement, je suis salarié dans une entreprise de transport logistique de ",
      {
        "field": "nbChauffeurs",
        "hint": "nombre de chauffeurs"
      },
      " chauffeurs, je m'occupe des plannings des tournées des chauffeurs. Aujourd'hui, je veux devenir conducteur de bus, parce que ce métier réunit les deux choses qui me plaisent : le transport et le contact avec les gens. Et je veux le faire dans le groupe RATP. C'est un service public utilisé par énormément de gens chaque jour. Et la formation en alternance me permet d'apprendre le métier sérieusement, avec un tuteur. C'est le bon moment pour moi : je sais ce que je veux, je veux construire mon avenir dans une entreprise stable, je veux m'investir avec sérieux et avoir un objectif de vie."
    ],
    "avoid": [
      "réciter sans naturel ; inventer une anecdote ; parler comme si j'étais déjà conducteur formé."
    ],
    "targetSeconds": [
      60,
      90
    ]
  },
  {
    "id": "Q2",
    "kind": "top",
    "star": true,
    "theme": "presentation",
    "question": "Pourquoi voulez-vous devenir conducteur de bus plutôt qu'un autre métier ?",
    "checks": "une motivation réfléchie, liée au contact humain et à la sécurité.",
    "ideas": [
      [
        "Le transport, j'ai grandi dedans (planning des chauffeurs)."
      ],
      [
        "J'aime aider les gens (CAP accompagnant au grand âge)."
      ],
      [
        "Le bus réunit les deux, au service du public."
      ]
    ],
    "example": [
      "Pour deux raisons. D'abord, le transport, j'ai grandi dedans : dans ",
      {
        "field": "entreprise",
        "hint": "comment tu présentes l’entreprise",
        "fallback": "une entreprise de transport de marchandises et de logistique"
      },
      ", je faisais le planning des chauffeurs. Quand un chauffeur arrivait en retard, les livraisons prenaient du retard et les clients appelaient. J'ai compris que la ponctualité, ce n'est pas un détail. Ensuite, j'ai fait un CAP pour accompagner les personnes âgées : j'aime être utile et je sais être patient. Conducteur de bus, c'est les deux : conduire en sécurité et rendre service à beaucoup de gens chaque jour."
    ],
    "avoid": [
      "« J'aime conduire » comme seule raison ; « c'est un emploi stable » ; le salaire."
    ],
    "targetSeconds": [
      30,
      45
    ]
  },
  {
    "id": "Q3",
    "kind": "top",
    "star": false,
    "theme": "presentation",
    "question": "Pourquoi le groupe RATP plutôt qu'un autre transporteur ?",
    "checks": "une raison précise et une compréhension de la culture de l'entreprise.",
    "ideas": [
      [
        "Le service public : énormément de voyageurs comptent sur ces bus chaque jour."
      ],
      [
        "Une entreprise qui forme vraiment ses conducteurs (son propre CFA, un tuteur)."
      ],
      [
        "Des valeurs qui me ressemblent (« l'humain au cœur », « la culture du service »)."
      ]
    ],
    "example": [
      "D'abord pour le service public. Les bus du groupe RATP, énormément de gens en dépendent chaque jour pour aller travailler ou étudier : je veux faire partie de ça. Ensuite parce que le groupe forme vraiment ses conducteurs. Il a son propre CFA, et je serai suivi par un tuteur. Pour un métier où la sécurité passe avant tout, c'est important pour moi d'apprendre correctement. Et enfin, quand j'ai lu les valeurs du groupe, « l'humain au cœur » m'a parlé. C'est ce que j'ai vécu pendant mon CAP avec les personnes âgées."
    ],
    "avoid": [
      "critiquer un autre transporteur ; dire « parce que c'est la RATP, c'est sûr » ; parler de la sécurité de l'emploi."
    ],
    "targetSeconds": [
      30,
      45
    ]
  },
  {
    "id": "Q4",
    "kind": "top",
    "star": false,
    "theme": "ratp",
    "question": "Que savez-vous du groupe RATP ?",
    "checks": "des connaissances fiables, expliquées avec ses mots.",
    "ideas": [
      [
        "Une entreprise publique qui fait rouler les transports parisiens depuis 1949, devenue un grand groupe (environ 73 000 collaborateurs)."
      ],
      [
        "Île-de-France Mobilités organise et finance ; le groupe exploite. Le PDG est Xavier Piechaczyk."
      ],
      [
        "Pour les bus, RATP Cap Île-de-France a gagné 8 lots sur 12."
      ]
    ],
    "example": [
      "La RATP est une entreprise publique qui fait rouler les transports parisiens depuis 1949. Aujourd'hui c'est un grand groupe, avec environ 73 000 collaborateurs, présent aussi à l'étranger. Son PDG est Xavier Piechaczyk. En Île-de-France, c'est Île-de-France Mobilités qui organise et finance les transports, et qui confie les lignes aux opérateurs. Pour les bus, il y a eu une mise en concurrence, et la filiale RATP Cap Île-de-France a gagné 8 lots sur 12. Ce qui m'a marqué, c'est que les bus du groupe roulent de plus en plus à l'électrique ou au biométhane."
    ],
    "avoid": [
      "enchaîner les chiffres comme une liste ; donner un chiffre dont tu n'es pas sûr (dis plutôt « environ »)."
    ],
    "targetSeconds": [
      30,
      45
    ]
  },
  {
    "id": "Q5",
    "kind": "top",
    "star": false,
    "theme": "metier",
    "question": "Que connaissez-vous du métier ? Décrivez une journée type.",
    "checks": "que je comprends le travail au-delà de la conduite.",
    "ideas": [
      [
        "Préparer et contrôler le véhicule."
      ],
      [
        "Conduire en sécurité et accueillir les voyageurs."
      ],
      [
        "Informer le PC et rendre compte d'un problème."
      ]
    ],
    "example": [
      "Je commence au centre bus. Je prends connaissance de ma feuille de route et je contrôle le véhicule selon ce qu'on m'aura appris. Ensuite, j'accueille les voyageurs, je conduis en respectant le code de la route et je les renseigne si besoin. Il faut aussi rester attentif aux embouteillages, aux retards et aux éventuels problèmes mécaniques. En cas de souci, je contacte le PC par radio et je suis la consigne. Le métier ne consiste donc pas seulement à conduire : il faut aussi veiller à la sécurité, garder son calme et transmettre les bonnes informations. Les horaires peuvent être le matin, l'après-midi, le soir ou le week-end."
    ],
    "avoid": [
      "réduire le métier à « conduire toute la journée »."
    ],
    "targetSeconds": [
      30,
      45
    ]
  },
  {
    "id": "Q6",
    "kind": "top",
    "star": false,
    "theme": "metier",
    "question": "Pour vous, qu'est-ce qu'un bon conducteur de bus ? Quelle est sa qualité n°1 ?",
    "checks": "que la sécurité est ma priorité.",
    "ideas": [
      [
        "La vigilance."
      ],
      [
        "Le respect des consignes."
      ],
      [
        "Le calme quand un imprévu arrive."
      ]
    ],
    "example": [
      "Pour moi, la qualité numéro un, c'est la vigilance, parce que la sécurité passe avant le reste. Il faut regarder la route, anticiper et respecter les consignes, même quand on est pressé ou qu'un voyageur s'impatiente. Il faut aussi connaître ses limites. Si je ne me sens pas en état de conduire, je le signale à mon responsable au lieu de prendre un risque. Mon CAP m'a appris à observer les personnes et à prévenir mon responsable si je repère une anomalie. Je veux garder cette attention, tout en apprenant les bons réflexes de conduite pendant la formation."
    ],
    "avoid": [
      "dire que la ponctualité ou la vitesse passe avant la sécurité."
    ],
    "targetSeconds": [
      30,
      45
    ]
  },
  {
    "id": "Q7",
    "kind": "top",
    "star": true,
    "theme": "securite",
    "question": "Âge et permis : pourquoi vous confier un bus ? Où en êtes-vous ?",
    "checks": "honnêteté, prudence et capacité à progresser sans s'excuser de son âge.",
    "ideas": [
      [
        "Volet âge : je suis jeune, mais j'ai déjà eu des responsabilités (planning d'adultes plus âgés que moi, personnes âgées fragiles pendant mon CAP)."
      ],
      [
        "Volet permis : obtenu en juin 2026, j'aurai mes 6 mois en décembre."
      ],
      [
        "Un permis récent, c'est zéro écart : pas de téléphone, zéro alcool, mes 6 points à protéger."
      ]
    ],
    "example": [
      "C'est normal que vous posiez la question. J'ai 18 ans, mais j'ai déjà eu des responsabilités : j'organisais le travail de chauffeurs plus âgés que moi, et pendant mon CAP, je m'occupais de personnes âgées fragiles. Je ne confonds pas mon permis B avec le fait de savoir conduire un bus : c'est justement ce que je viens apprendre. Pour le permis, je l'ai depuis juin 2026, donc j'aurai mes six mois en décembre. Et un permis récent, pour moi, c'est zéro écart : pas de téléphone au volant, zéro alcool, et mes points à protéger."
    ],
    "avoid": [
      "t'excuser d'être jeune ; dire « je suis mature » (montre-le plutôt) ; aborder le sujet du permis avant qu'on te le demande ; parler de décret ou de règles techniques."
    ],
    "targetSeconds": [
      30,
      45
    ]
  },
  {
    "id": "Q8",
    "kind": "top",
    "star": false,
    "theme": "ratp",
    "question": "Que savez-vous de l'ouverture à la concurrence des bus et de RATP Cap Île-de-France ?",
    "checks": "une compréhension juste de la situation et de l'employeur possible.",
    "ideas": [
      [
        "Ce n'est pas une privatisation : le groupe reste public."
      ],
      [
        "Le groupe a gardé 8 lots sur 12 et recrute pour les faire tourner."
      ],
      [
        "Je suis prêt à travailler pour RATP Cap Île-de-France si c'est là qu'on m'affecte."
      ]
    ],
    "example": [
      "Ce n'est pas une privatisation, le groupe reste public. Île-de-France Mobilités a ouvert à la concurrence les bus de Paris et de la petite couronne. Le groupe RATP a gardé 8 lots sur 12 et recrute pour les faire tourner. Je suis prêt à travailler pour RATP Cap Île-de-France si c'est là qu'on m'affecte. Je sais que l'entreprise exacte et le centre bus dépendent de l'affectation. Je préfère vous demander directement comment cela se passe pour cette session, plutôt que de faire une supposition."
    ],
    "avoid": [
      "affirmer quel sera mon employeur exact ou présenter cela comme une privatisation."
    ],
    "targetSeconds": [
      30,
      45
    ]
  },
  {
    "id": "Q9",
    "kind": "top",
    "star": true,
    "theme": "contraintes",
    "question": "Comment allez-vous vous organiser pour les horaires décalés ?",
    "checks": "une solution concrète et une disponibilité réelle.",
    "ideas": [
      [
        "Ma solution concrète aujourd'hui depuis Évry."
      ],
      [
        "Je sais qu'à 5 h du matin, les transports en commun ne suffisent pas toujours."
      ],
      [
        "En plus, mon projet d'installation à Sucy-en-Brie me rapprocherait des centres bus du Val-de-Marne."
      ]
    ],
    "example": [
      "Aujourd'hui, depuis Évry-Courcouronnes, je peux venir au centre bus à 5 h ",
      {
        "field": "transport5h",
        "hint": "ton moyen de transport"
      },
      ". Je sais qu'à cette heure-là, les transports en commun ne suffisent pas toujours, donc j'ai prévu ma solution. En plus, je prévois de m'installer à Sucy-en-Brie, plus près des centres bus du Val-de-Marne. C'est un projet, mais ma disponibilité ne dépend pas de ce déménagement. Il peut y avoir des prises tôt, des fins tardives, des week-ends et des jours fériés. Je m'organiserai pour être à l'heure et garder un rythme compatible avec la sécurité."
    ],
    "avoid": [
      "dire que je ne serai disponible qu'après avoir déménagé."
    ],
    "targetSeconds": [
      30,
      45
    ]
  },
  {
    "id": "Q10",
    "kind": "top",
    "star": false,
    "theme": "presentation",
    "question": "Votre expérience au planning des chauffeurs : qu'est-ce qu'elle vous apporte ?",
    "checks": "mon rôle réel, ma fiabilité et ma façon de travailler avec des adultes.",
    "ideas": [
      [
        "Dire clairement mon statut."
      ],
      [
        "Gérer des horaires, des temps de repos et des imprévus."
      ],
      [
        "Donner un exemple vécu, sans exagérer."
      ]
    ],
    "example": [
      "Dans ",
      {
        "field": "entreprise",
        "hint": "comment tu présentes l’entreprise",
        "fallback": "une entreprise de transport de marchandises et de logistique"
      },
      ", j'ai fait",
      " le planning des chauffeurs. ",
      "J'y étais ",
      {
        "field": "statutExperience",
        "hint": "ton statut réel"
      },
      ".",
      " Mon rôle, c'était le planning, pas la conduite. Il fallait tenir compte des horaires, des temps de repos des chauffeurs et des imprévus. ",
      "Par exemple : ",
      {
        "field": "imprevuPlanning",
        "hint": "un imprévu, ce que tu as fait, le résultat"
      },
      ". ",
      " Cette expérience m'a appris à m'organiser et à échanger avec des adultes plus âgés que moi. Je sais que le travail de conducteur est différent et que je dois apprendre ses règles."
    ],
    "avoid": [
      "laisser croire que j'ai été pistonné, inventer des responsabilités ou cacher mon statut."
    ],
    "targetSeconds": [
      30,
      45
    ]
  },
  {
    "id": "Q11",
    "kind": "top",
    "star": false,
    "theme": "presentation",
    "question": "En quoi votre CAP vous sert-il pour conduire un bus ? Pourquoi ne pas continuer dans ce secteur ?",
    "checks": "le lien entre mon CAP, le contact humain et mon choix de métier.",
    "ideas": [
      [
        "Observer et écouter les personnes."
      ],
      [
        "Repérer une anomalie et prévenir son responsable."
      ],
      [
        "Continuer à aider autrement, avec la conduite et le transport."
      ]
    ],
    "example": [
      "Mon CAP Agent accompagnant au grand âge m'a appris à être attentif aux personnes, à écouter et à repérer quand quelque chose ne va pas. ",
      {
        "field": "stageSouvenir",
        "hint": "ton souvenir concret de stage"
      },
      " Ce sont des qualités utiles avec des voyageurs différents, par exemple une personne âgée ou quelqu'un qui a besoin d'aide. Je sais aussi qu'à bord, la sécurité et les consignes passent avant tout. J'ai aimé aider dans ce secteur. Je veux continuer à aider autrement, en ajoutant la conduite et le transport. Ce n'est pas un rejet de mon CAP : c'est la suite du parcours que je souhaite construire."
    ],
    "avoid": [
      "dénigrer le grand âge, les personnes accompagnées ou le secteur."
    ],
    "targetSeconds": [
      30,
      45
    ]
  },
  {
    "id": "Q12",
    "kind": "top",
    "star": false,
    "theme": "culture",
    "question": "Neutralité : « Un voyageur veut parler religion ou politique avec vous » / « Un collègue refuse de serrer la main d'une collègue ». Que faites-vous ?",
    "checks": "le respect de tous et la capacité à garder une posture professionnelle.",
    "ideas": [
      [
        "Je ne prends pas part aux discussions politiques ou religieuses en service."
      ],
      [
        "Je respecte chaque personne de la même façon, hommes et femmes, collègues comme voyageurs."
      ],
      [
        "Je signale un problème et je suis la consigne."
      ]
    ],
    "example": [
      "Pour moi, la neutralité, c'est traiter tout le monde pareil et garder mes opinions politiques ou religieuses pour moi pendant le service. Si un voyageur veut en parler, je reste poli et je ramène la conversation à son trajet. Pour le collègue : au travail, on doit le même respect à tout le monde, hommes et femmes. Si ça pose un problème dans l'équipe, j'en parle à mon responsable."
    ],
    "avoid": [
      "faire un exposé juridique ou juger une religion ou une opinion."
    ],
    "targetSeconds": [
      30,
      45
    ]
  },
  {
    "id": "Q13",
    "kind": "top",
    "star": true,
    "theme": "securite",
    "question": "Alcool, médicaments, fatigue, téléphone : quelles règles ?",
    "checks": "que je ne conduis pas quand un risque peut toucher la sécurité.",
    "ideas": [
      [
        "Zéro alcool avant de conduire, jamais de drogue, au travail comme en dehors."
      ],
      [
        "Pas de téléphone au volant ; prudence avec les médicaments et la fatigue."
      ],
      [
        "Si je ne suis pas en état, je préviens mon responsable."
      ]
    ],
    "example": [
      "Pour moi, c'est zéro alcool avant de conduire, et jamais de drogue, au travail comme en dehors. Je ne touche pas à mon téléphone quand je conduis. Si je prends un médicament, je regarde le pictogramme sur la boîte et je demande au médecin ou au pharmacien si je peux conduire. Si je suis fatigué, je ne force pas. Je ne prends pas le volant si je ne me sens pas en état. Je préviens mon responsable pour qu'on voie la suite, au lieu de cacher le problème ou de mettre des voyageurs en danger. Je ferai attention à mon sommeil et à mon hygiène de vie."
    ],
    "avoid": [
      "minimiser un médicament, la fatigue, l'alcool ou l'usage du téléphone."
    ],
    "targetSeconds": [
      30,
      45
    ]
  },
  {
    "id": "Q14",
    "kind": "top",
    "star": false,
    "theme": "presentation",
    "question": "Quelles sont vos qualités et vos défauts ?",
    "checks": "une réponse honnête appuyée sur des exemples.",
    "ideas": [
      [
        "Deux qualités avec une preuve."
      ],
      [
        "Un défaut réel."
      ],
      [
        "Ce que je fais pour progresser."
      ]
    ],
    "example": [
      "Je dirais que je suis ",
      {
        "field": "qualite1",
        "hint": "une qualité"
      },
      " et ",
      {
        "field": "qualite2",
        "hint": "une autre qualité"
      },
      ". Par exemple, ",
      {
        "field": "preuve1",
        "hint": "une preuve tirée de ton parcours"
      },
      ". Mon défaut, c'est ",
      {
        "field": "defaut",
        "hint": "ton défaut travaillé"
      },
      ". Pour progresser, ",
      {
        "field": "defautProgres",
        "hint": "ce que tu fais pour progresser"
      },
      ". Je préfère en parler franchement plutôt que de prétendre ne pas avoir de défaut. Dans un métier où il faut suivre des consignes et travailler avec une équipe, je sais qu'il faut aussi accepter les remarques. Je suis prêt à continuer à progresser avec mon tuteur et à demander de l'aide si je ne comprends pas."
    ],
    "avoid": [
      "choisir un défaut inventé ou présenter une qualité sans preuve."
    ],
    "targetSeconds": [
      30,
      45
    ]
  },
  {
    "id": "Q15",
    "kind": "top",
    "star": false,
    "theme": "presentation",
    "question": "Pourquoi devrions-nous vous choisir ?",
    "checks": "une synthèse crédible et une attitude de futur apprenti.",
    "ideas": [
      [
        "Mon expérience du planning."
      ],
      [
        "Mon CAP et mon contact avec les personnes."
      ],
      [
        "Mon sérieux face aux règles et à la formation."
      ]
    ],
    "example": [
      "Je ne vais pas prétendre être déjà conducteur : je viens pour apprendre. J'ai une première expérience du transport grâce au planning des chauffeurs dans ",
      {
        "field": "entreprise",
        "hint": "comment tu présentes l’entreprise",
        "fallback": "une entreprise de transport de marchandises et de logistique"
      },
      ", et mon CAP m'a appris à être attentif aux personnes. Je sais que le métier demande de la sécurité, de la ponctualité, du calme et du respect des consignes. Et je suis particulièrement attentif à protéger mon permis et à écouter les conseils. Si vous me choisissez, je m'investirai dans la formation, je poserai mes questions et je ferai le travail demandé sérieusement."
    ],
    "avoid": [
      "prétendre être meilleur que les autres ou faire une promesse impossible."
    ],
    "targetSeconds": [
      30,
      45
    ]
  }
]
export const BANK_QUESTIONS: BankQuestion[] = [
  {
    "id": "B1",
    "kind": "bank",
    "theme": "presentation",
    "group": "Parcours & motivation",
    "question": "Pourquoi ne pas rester dans votre ancienne entreprise ou devenir chauffeur poids lourd ?",
    "ideas": [
      [
        "expliquer mon choix personnel"
      ],
      [
        "distinguer planning et conduite"
      ],
      [
        "ne jamais laisser entendre que je pourrai toujours y revenir"
      ]
    ],
    "hook": [
      "J'ai découvert le transport, mais je veux construire mon propre parcours."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B2",
    "kind": "bank",
    "theme": "presentation",
    "group": "Parcours & motivation",
    "question": "Pourquoi l'alternance ? Comment voyez-vous 3 mois en centre puis 3 mois en entreprise ?",
    "ideas": [
      [
        "apprendre les bases"
      ],
      [
        "les appliquer avec un tuteur"
      ],
      [
        "demander conseil"
      ]
    ],
    "hook": [
      "J'apprends mieux quand je peux relier les explications à la pratique."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B3",
    "kind": "bank",
    "theme": "presentation",
    "group": "Parcours & motivation",
    "question": "Où vous voyez-vous dans 5 ans ? Et dans 10 ans ?",
    "ideas": [
      [
        "conducteur confirmé"
      ],
      [
        "continuer à apprendre"
      ],
      [
        "dans 10 ans : pourquoi pas formateur, régulation ou encadrement, grâce à mon expérience du planning"
      ]
    ],
    "hook": [
      "D'abord, je veux devenir un conducteur fiable et bien connaître le métier."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B4",
    "kind": "bank",
    "theme": "presentation",
    "group": "Parcours & motivation",
    "question": "Avez-vous déjà eu affaire à un public difficile ? Racontez.",
    "ideas": [
      [
        "choisir une situation réelle ",
        {
          "link": "/fiche",
          "text": "ta fiche perso (conflit géré)"
        }
      ],
      [
        "expliquer ce que j'ai fait"
      ],
      [
        "dire ce que j'en ai appris"
      ]
    ],
    "hook": [
      "Je peux vous parler d'un désaccord que j'ai essayé de gérer calmement."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B5",
    "kind": "bank",
    "theme": "presentation",
    "group": "Parcours & motivation",
    "question": "Comment avez-vous connu le CFA et cette formation ?",
    "ideas": [
      [
        "dire la source réelle"
      ],
      [
        "expliquer ce qui m'a intéressé"
      ],
      [
        "montrer que je me suis renseigné"
      ]
    ],
    "hook": [
      "J'ai découvert cette formation par ",
      {
        "field": "sourceCFA",
        "hint": "comment tu as connu le CFA"
      },
      "."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B6",
    "kind": "bank",
    "theme": "ratp",
    "group": "Groupe RATP",
    "question": "Quelle est la raison d'être du groupe ? Quelle valeur vous parle le plus ?",
    "ideas": [
      [
        "citer « S'engager chaque jour pour une meilleure qualité de ville. »"
      ],
      [
        "expliquer avec mes mots"
      ],
      [
        "parler du service aux voyageurs"
      ]
    ],
    "hook": [
      "Pour moi, cela veut dire rendre les déplacements utiles et accessibles au quotidien."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B7",
    "kind": "bank",
    "theme": "ratp",
    "group": "Groupe RATP",
    "question": "Qui dirige le groupe RATP ?",
    "ideas": [
      [
        "Xavier Piechaczyk"
      ],
      [
        "président-directeur général depuis février 2026"
      ],
      [
        "revérifier la veille"
      ]
    ],
    "hook": [
      "À ma connaissance, le PDG est Xavier Piechaczyk."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B8",
    "kind": "bank",
    "theme": "ratp",
    "group": "Groupe RATP",
    "question": "Qu'est-ce qu'Île-de-France Mobilités ? Quel lien avec la RATP ?",
    "ideas": [
      [
        "autorité organisatrice"
      ],
      [
        "décide de l'offre et des tarifs et finance"
      ],
      [
        "confie les lignes à des opérateurs"
      ]
    ],
    "hook": [
      "Île-de-France Mobilités organise les transports et confie l'exploitation des lignes."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B9",
    "kind": "bank",
    "theme": "ratp",
    "group": "Groupe RATP",
    "question": "Que fait le groupe pour l'environnement ?",
    "ideas": [
      [
        "bus électriques"
      ],
      [
        "biométhane ou hybrides"
      ],
      [
        "conversion des centres bus"
      ]
    ],
    "hook": [
      "Le groupe convertit ses bus et ses centres bus à des énergies plus propres."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B10",
    "kind": "bank",
    "theme": "ratp",
    "group": "Groupe RATP",
    "question": "Quelles lignes ou quels centres bus connaissez-vous ?",
    "ideas": [
      [
        "version A (Évry, aujourd'hui) puis version B en projet (Sucy-en-Brie, ",
        {
          "link": "/reviser/ratp",
          "text": "ton réseau local"
        },
        ")"
      ],
      [
        "ne pas mélanger domicile et projet"
      ],
      [
        "demander l'affectation"
      ]
    ],
    "hook": [
      "J'habite à Évry-Courcouronnes, où le réseau de bus n'est pas celui de la RATP. Mais je me suis renseigné sur le Val-de-Marne, où je prévois de m'installer."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B11",
    "kind": "bank",
    "theme": "metier",
    "group": "Métier & formation",
    "question": "Que vérifiez-vous sur le bus avant de partir du centre bus ?",
    "ideas": [
      [
        "pneus, rétroviseurs et éclairage"
      ],
      [
        "portes, propreté et rampe"
      ],
      [
        "suivre ce qu'on m'apprendra en formation"
      ]
    ],
    "hook": [
      "Je vérifierais les éléments de sécurité et j'appliquerais la consigne apprise en formation."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B12",
    "kind": "bank",
    "theme": "metier",
    "group": "Métier & formation",
    "question": "Que contient la formation ? Qu'obtiendrez-vous à la fin ?",
    "ideas": [
      [
        "conduite, sécurité et gestion des conflits"
      ],
      [
        "alternance"
      ],
      [
        "permis D, CQC et attestation SST"
      ]
    ],
    "hook": [
      "La formation associe la conduite à la sécurité et à la relation avec les voyageurs."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B13",
    "kind": "bank",
    "theme": "metier",
    "group": "Métier & formation",
    "question": "Qu'est-ce que l'écoconduite ?",
    "ideas": [
      [
        "conduite souple"
      ],
      [
        "anticiper plutôt que freiner brusquement"
      ],
      [
        "appliquer les conseils de formation"
      ]
    ],
    "hook": [
      "C'est conduire de façon souple et anticiper, sans compromettre la sécurité."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B14",
    "kind": "bank",
    "theme": "metier",
    "group": "Métier & formation",
    "question": "Depuis juin, vous conduisez combien ? Quoi ? En boîte manuelle ?",
    "ideas": [
      [
        "répondre avec les données réelles ",
        {
          "link": "/fiche",
          "text": "ta fiche perso (pratique de conduite)"
        }
      ],
      [
        "ne pas laisser croire que j'ai conduit un bus"
      ],
      [
        "dire clairement ce que je ne sais pas encore faire"
      ]
    ],
    "hook": [
      "Je conduis ",
      {
        "field": "pratiqueConduite",
        "hint": "ta pratique réelle"
      },
      ", et je préfère être précis sur mon expérience."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B15",
    "kind": "bank",
    "theme": "metier",
    "group": "Métier & formation",
    "question": "Quelles sont les difficultés du métier, et comment gérez-vous le stress, la fatigue ou la routine ?",
    "ideas": [
      [
        "horaires et circulation"
      ],
      [
        "sommeil et organisation"
      ],
      [
        "rester concentré et suivre la consigne"
      ]
    ],
    "hook": [
      "Les horaires et les imprévus demandent une bonne organisation et de la vigilance."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B16",
    "kind": "bank",
    "theme": "securite",
    "group": "Sécurité & règles",
    "question": "Quel est le taux d'alcool autorisé pour un conducteur de bus ?",
    "ideas": [
      [
        "seuil légal 0,2 g par litre de sang"
      ],
      [
        "en pratique zéro alcool"
      ],
      [
        "ne pas conduire après avoir bu"
      ]
    ],
    "hook": [
      "Même si le seuil légal est de 0,2 g par litre, ma règle est zéro alcool."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B17",
    "kind": "bank",
    "theme": "securite",
    "group": "Sécurité & règles",
    "question": "Combien de points avez-vous ? Des infractions ? Que se passe-t-il si vous perdez votre permis ?",
    "ideas": [
      [
        "donner mon solde réel ",
        {
          "link": "/fiche",
          "text": "ta fiche perso (solde de points)"
        }
      ],
      [
        "dire la vérité sur les infractions"
      ],
      [
        "perte du permis : fin immédiate du contrat"
      ]
    ],
    "hook": [
      "J'ai ",
      {
        "field": "soldePoints",
        "hint": "ton solde de points"
      },
      " points. Je sais que si je perds mon permis, mon contrat s'arrête, donc j'y fais très attention."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B18",
    "kind": "bank",
    "theme": "contraintes",
    "group": "Sécurité & règles",
    "question": "Que faites-vous la veille d'une prise de service à 5 h ?",
    "ideas": [
      [
        "préparer mon trajet et mes affaires"
      ],
      [
        "me coucher tôt"
      ],
      [
        "éviter une sortie qui nuirait à mon sommeil"
      ]
    ],
    "hook": [
      "Je prépare la veille pour être reposé et arriver à l'heure."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B19",
    "kind": "bank",
    "theme": "culture",
    "group": "Culture d'entreprise & équipe",
    "question": "Comment réagissez-vous quand on vous fait une remarque, même si vous la trouvez injuste ?",
    "ideas": [
      [
        "écouter sans répondre à chaud"
      ],
      [
        "demander un exemple pour comprendre"
      ],
      [
        "expliquer mon point de vue calmement"
      ]
    ],
    "hook": [
      "Je l'écoute d'abord et je cherche à comprendre ce que je peux améliorer."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B20",
    "kind": "bank",
    "theme": "culture",
    "group": "Culture d'entreprise & équipe",
    "question": "On vous donne une consigne que vous ne comprenez pas.",
    "ideas": [
      [
        "ne pas improviser"
      ],
      [
        "demander qu'on me la réexplique"
      ],
      [
        "la répéter avec mes mots pour vérifier"
      ]
    ],
    "hook": [
      "Je demande qu'on me l'explique à nouveau, et je la répète avec mes mots pour être sûr d'avoir compris, avant d'agir."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B21",
    "kind": "bank",
    "theme": "culture",
    "group": "Culture d'entreprise & équipe",
    "question": "Vous serez sans doute le plus jeune du centre bus. Comment travaillerez-vous avec des collègues différents ?",
    "ideas": [
      [
        "respecter chacun"
      ],
      [
        "écouter les collègues expérimentés"
      ],
      [
        "garder le même comportement quelle que soit l'origine ou l'opinion"
      ]
    ],
    "hook": [
      "Je viens pour apprendre et travailler avec toute l'équipe, quel que soit l'âge."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B22",
    "kind": "bank",
    "theme": "culture",
    "group": "Culture d'entreprise & équipe",
    "question": "Que pensez-vous du port de l'uniforme ?",
    "ideas": [
      [
        "respecter la tenue demandée"
      ],
      [
        "représenter l'entreprise"
      ],
      [
        "garder une présentation correcte"
      ]
    ],
    "hook": [
      "Je porterai la tenue demandée et je la garderai correcte."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B23",
    "kind": "bank",
    "theme": "culture",
    "group": "Culture d'entreprise & équipe",
    "question": "Un collègue sent l'alcool avant de prendre son bus, ou ne respecte pas une règle de sécurité.",
    "ideas": [
      [
        "ne pas laisser la situation sans suite"
      ],
      [
        "lui en parler d'abord si c'est possible"
      ],
      [
        "prévenir tout de suite mon responsable avant qu'il prenne le volant"
      ]
    ],
    "hook": [
      "Je préviens mon responsable sans attendre, car la sécurité passe d'abord."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B24",
    "kind": "bank",
    "theme": "culture",
    "group": "Culture d'entreprise & équipe",
    "question": "Un collègue vous demande de faire quelque chose qui ne respecte pas les règles (par exemple le couvrir pour un retard).",
    "ideas": [
      [
        "ne pas mentir"
      ],
      [
        "rester respectueux"
      ],
      [
        "expliquer que je ne peux pas cacher les faits"
      ]
    ],
    "hook": [
      "Je ne mentirai pas, même pour rendre service à un collègue."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B25",
    "kind": "bank",
    "theme": "pieges",
    "group": "Questions pièges",
    "question": "Que pensez-vous des grèves ?",
    "ideas": [
      [
        "« C'est un droit. Moi, ce qui compte, c'est d'être là pour les voyageurs et de respecter les règles. »"
      ],
      [
        "rester neutre"
      ],
      [
        "ne pas promettre ce que je ne maîtrise pas"
      ]
    ],
    "hook": [
      "C'est un droit. Moi, ce qui compte, c'est d'être là pour les voyageurs et de respecter les règles."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B26",
    "kind": "bank",
    "theme": "pieges",
    "group": "Questions pièges",
    "question": "Le salaire, c'est important pour vous ? Combien pensez-vous gagner ?",
    "ideas": [
      [
        "ne pas en faire ma motivation"
      ],
      [
        "si on me demande un chiffre : selon le CFA, environ 60 % du minimum conventionnel en 1re année, soit à peu près 1 200 € brut par mois"
      ],
      [
        "montrer que je le sais et que je l'accepte le temps d'apprendre"
      ]
    ],
    "hook": [
      "Ma priorité aujourd'hui, c'est d'apprendre le métier et de réussir la formation."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B27",
    "kind": "bank",
    "theme": "pieges",
    "group": "Questions pièges",
    "question": "Et si vous échouez au permis D ?",
    "ideas": [
      [
        "prendre connaissance des points à retravailler"
      ],
      [
        "demander conseil"
      ],
      [
        "me préparer à nouveau selon les possibilités"
      ]
    ],
    "hook": [
      "Je demanderais où j'ai besoin de progresser et je suivrais les conseils reçus."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B28",
    "kind": "bank",
    "theme": "contraintes",
    "group": "Questions pièges",
    "question": "Et si on vous affecte dans un centre bus loin de chez vous ?",
    "ideas": [
      [
        "étudier le trajet concret"
      ],
      [
        "m'organiser pour être à l'heure"
      ],
      [
        "ne pas conditionner ma disponibilité au déménagement"
      ]
    ],
    "hook": [
      "Je regarderai comment faire le trajet de façon fiable et je m'organiserai."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B29",
    "kind": "bank",
    "theme": "pieges",
    "group": "Questions pièges",
    "question": "Avez-vous postulé ailleurs ?",
    "ideas": [
      [
        "répondre honnêtement"
      ],
      [
        "expliquer pourquoi cette formation m'intéresse"
      ],
      [
        "ne pas dénigrer d'autres choix"
      ]
    ],
    "hook": [
      "Je vous réponds franchement : ",
      {
        "field": "autresCandidatures",
        "hint": "ta réponse vraie"
      },
      "."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B30",
    "kind": "bank",
    "theme": "pieges",
    "group": "Questions pièges",
    "question": "Avez-vous déjà eu des problèmes avec la justice ?",
    "ideas": [
      [
        "répondre honnêtement"
      ],
      [
        "ne rien cacher sur le casier ou l'enquête"
      ],
      [
        "demander si une précision est nécessaire"
      ]
    ],
    "hook": [
      "Je répondrai clairement et honnêtement sur mon dossier."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B31",
    "kind": "bank",
    "theme": "presentation",
    "group": "Parcours & motivation",
    "question": "Êtes-vous plutôt quelqu'un de calme ou de stressé ?",
    "ideas": [
      [
        "plutôt calme, avec une preuve vécue (personnes âgées fragiles pendant mon CAP)"
      ],
      [
        "reconnaître que le stress existe : ce qui compte, c'est ce que j'en fais"
      ],
      [
        "quand ça monte : je respire, je reste poli et j'applique la consigne"
      ]
    ],
    "hook": [
      "Plutôt calme. Le stress, ça arrive à tout le monde : moi, je respire, je reste poli et j'applique la consigne."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B32",
    "kind": "bank",
    "theme": "contraintes",
    "group": "Horaires & contraintes",
    "question": "Êtes-vous ponctuel ?",
    "ideas": [
      [
        "oui, avec une preuve vécue : au planning, un retard pénalise toute l'équipe"
      ],
      [
        "mon organisation : réveil, trajet prévu, toujours de la marge (",
        {
          "link": "/fiche",
          "text": "ta fiche perso (venir à 5 h)"
        },
        ")"
      ],
      [
        "en cas d'imprévu : je préviens tout de suite"
      ]
    ],
    "hook": [
      "Oui. Au planning, j'ai vu ce qu'un retard coûte à toute une équipe : je prévois mon trajet et je pars avec de la marge."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B33",
    "kind": "bank",
    "theme": "contraintes",
    "group": "Horaires & contraintes",
    "question": "Êtes-vous capable de travailler seul pendant une grande partie de la journée ?",
    "ideas": [
      [
        "oui : seul au volant, mais jamais isolé (PC par radio, collègues au terminus et au centre bus)"
      ],
      [
        "j'aime l'autonomie et la responsabilité"
      ],
      [
        "je suis en contact avec les voyageurs toute la journée"
      ]
    ],
    "hook": [
      "Oui. Au volant je suis seul, mais pas isolé : le PC est joignable par radio, et je retrouve mes collègues au terminus."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B34",
    "kind": "bank",
    "theme": "culture",
    "group": "Culture d'entreprise & équipe",
    "question": "Avez-vous déjà eu un conflit avec un collègue ou un responsable ?",
    "ideas": [
      [
        "choisir un exemple vrai et pas trop grave (",
        {
          "link": "/fiche",
          "text": "ta fiche perso (conflit géré)"
        },
        ")"
      ],
      [
        "raconter ce que j'ai fait : écouter, en parler calmement, trouver une solution"
      ],
      [
        "ce que j'en ai retenu ; ne jamais critiquer l'autre personne"
      ]
    ],
    "hook": [
      "Oui, un désaccord. J'ai attendu d'être calme, on en a parlé, et on a trouvé une solution. J'en retiens qu'il faut se parler tôt."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B35",
    "kind": "bank",
    "theme": "pieges",
    "group": "Questions pièges",
    "question": "Qu'est-ce qui pourrait vous faire abandonner la formation ?",
    "ideas": [
      [
        "montrer que je me suis renseigné : horaires décalés, rythme de la formation, règles strictes"
      ],
      [
        "en cas de difficulté, j'en parle à mon tuteur ou au CFA au lieu d'abandonner"
      ],
      [
        "la seule chose qui m'arrêterait : perdre mon permis, c'est pour ça que j'y fais très attention"
      ]
    ],
    "hook": [
      "Je me suis renseigné sur les horaires et les règles, et je suis prêt. Si j'ai une difficulté, j'en parlerai à mon tuteur."
    ],
    "targetSeconds": [
      15,
      30
    ]
  },
  {
    "id": "B36",
    "kind": "bank",
    "theme": "metier",
    "group": "Métier & formation",
    "question": "Quelle est la longueur et le poids d'un bus RATP ?",
    "ideas": [
      [
        "bus standard : environ 12 m de long et 2,55 m de large ; un articulé : environ 18 m"
      ],
      [
        "environ 11 à 14 tonnes à vide selon le modèle, jusqu'à 19 tonnes chargé ; une centaine de voyageurs"
      ],
      [
        "pourquoi c'est important : il freine plus loin et prend de la place dans les virages, donc j'anticipe"
      ]
    ],
    "hook": [
      "Un bus standard fait environ 12 mètres et jusqu'à 19 tonnes chargé. Ça demande beaucoup d'anticipation au freinage et dans les virages."
    ],
    "targetSeconds": [
      15,
      30
    ]
  }
]
export const QUESTIONS: Question[] = [...TOP_QUESTIONS, ...BANK_QUESTIONS]
export function getQuestion(id: string): Question | undefined { return QUESTIONS.find(question => question.id === id) }
