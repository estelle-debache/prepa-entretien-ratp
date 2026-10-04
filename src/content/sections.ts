import type { Section } from './types'

export const SECTIONS: Section[] = [
  {
    "id": "mode-emploi",
    "num": 0,
    "title": "Mode d’emploi",
    "summary": "Suis les étapes pour préparer ta rencontre.",
    "blocks": [
      {
        "type": "ol",
        "items": [
          [
            "Remplis d'abord ",
            {
              "link": "/fiche",
              "text": "ta fiche perso"
            },
            "."
          ],
          [
            "Lis tout une fois."
          ],
          [
            "Entraîne-toi à voix haute avec un ami, en priorité les ★ : Q1, Q2, Q7, Q9, Q13, S1, S2, S3."
          ],
          [
            "Ne récite pas : retiens les 3 idées et dis-les avec tes mots."
          ],
          [
            "Refais ",
            {
              "link": "/jeux-de-role/JR1",
              "text": "les 3 jeux de rôle"
            },
            "."
          ],
          [
            "La veille, relis seulement ",
            {
              "link": "/memo",
              "text": "le mémo"
            },
            "."
          ]
        ]
      },
      {
        "type": "p",
        "text": [
          "Environ 60 % de l'entretien porte sur l'attitude et 40 % sur les connaissances. On ne te demande pas d'être une encyclopédie."
        ]
      }
    ]
  },
  {
    "id": "evaluation",
    "num": 2,
    "title": "Ce que la RATP évalue",
    "summary": "Repère les critères, les filtres et les attitudes attendus.",
    "blocks": [
      {
        "type": "p",
        "text": [
          "**Officiellement, selon la présentation du CFA, l'entretien porte sur quatre points :** ta connaissance de l'entreprise et du métier ; ta capacité à exercer ce métier ; tes motivations ; ta capacité à t'adapter à la culture de l'entreprise."
        ]
      },
      {
        "type": "p",
        "text": [
          "**Les filtres (oui/non)**"
        ]
      },
      {
        "type": "ol",
        "items": [
          [
            "**Neutralité et respect de tous :** même traitement pour chaque voyageur et chaque collègue ; aucune expression religieuse ou politique en service ; aucune discrimination."
          ],
          [
            "**Alcool, drogues, permis :** zéro alcool au volant (seuil légal 0,2 g/l pour les conducteurs de bus) ; zéro drogue, y compris en dehors du travail (contrôles possibles) ; permis protégé (permis probatoire = vigilance maximale)."
          ],
          [
            "**Présentation et politesse :** tenue correcte, à l'heure, bonjour/merci, téléphone éteint."
          ],
          [
            "**Honnêteté sur ton dossier :** casier judiciaire, permis et enquête administrative sont vérifiés. Mentir est éliminatoire ; une erreur passée assumée ne l'est pas forcément."
          ]
        ]
      },
      {
        "type": "p",
        "text": [
          "**L’attitude (environ 60 % de la note), dans l’ordre d’importance**"
        ]
      },
      {
        "type": "ol",
        "items": [
          [
            "Sécurité (voyageurs, autres usagers, toi-même ; hygiène de vie : sommeil, alimentation, zéro alcool)."
          ],
          [
            "Respect des règles et des consignes, et prévenir son responsable."
          ],
          [
            "Fiabilité : ponctualité, assiduité, disponibilité pour les horaires décalés, un moyen fiable d'arriver au centre bus à 5 h."
          ],
          [
            "Relation avec les voyageurs : accueil, politesse, information, sens du service public."
          ],
          [
            "Maîtrise de soi : rester calme, calmer la situation, ne pas répondre aux provocations."
          ],
          [
            "Esprit d'équipe : accepter les remarques, écouter son tuteur, respecter son responsable et ses collègues."
          ]
        ]
      },
      {
        "type": "p",
        "text": [
          "**Motivation et connaissances (environ 40 %)**"
        ]
      },
      {
        "type": "ol",
        "items": [
          [
            "Motivation : pourquoi ce métier, pourquoi le groupe RATP, pourquoi maintenant, avec des exemples tirés de ton parcours."
          ],
          [
            "Connaissances : ",
            {
              "link": "/reviser/ratp",
              "text": "les 8 faits RATP"
            },
            " et ",
            {
              "link": "/reviser/metier",
              "text": "le métier et la formation"
            },
            ". Pas besoin d'être une encyclopédie."
          ]
        ]
      }
    ]
  },
  {
    "id": "deroule",
    "num": 3,
    "title": "Comment l’heure va probablement se passer",
    "summary": "Découvre les étapes probables et les bons réflexes.",
    "blocks": [
      {
        "type": "p",
        "text": [
          "**Découpage indicatif** :"
        ]
      },
      {
        "type": "ul",
        "items": [
          [
            "Accueil et présentation : environ 10 min."
          ],
          [
            "Motivation et parcours : environ 15 min."
          ],
          [
            "Connaissance de la RATP et du métier : environ 10 min."
          ],
          [
            "Mises en situation : environ 15 min. Un jeu de rôle est possible (",
            {
              "link": "/situations",
              "text": "voir les mises en situation"
            },
            ")."
          ],
          [
            "Contraintes et questions de ta part : environ 10 min."
          ]
        ]
      },
      {
        "type": "p",
        "text": [
          "Tu peux avoir 1 ou 2 interlocuteurs : un chargé de recrutement, parfois un manager."
        ]
      },
      {
        "type": "ul",
        "items": [
          [
            "Arrive 15 min en avance."
          ],
          [
            "Porte une tenue propre et sobre."
          ],
          [
            "Salue tout le monde et vouvoie."
          ],
          [
            "Éteins ton téléphone."
          ],
          [
            "Regarde les gens."
          ],
          [
            "Demande de répéter si tu n'as pas compris."
          ],
          [
            "Prends 2 secondes avant de répondre."
          ]
        ]
      }
    ]
  },
  {
    "id": "ratp",
    "num": 4,
    "title": "Le groupe RATP",
    "summary": "Retrouve les faits utiles sur le groupe et ton réseau local.",
    "blocks": []
  },
  {
    "id": "metier",
    "num": 5,
    "title": "Le métier et la formation",
    "summary": "Prépare-toi au quotidien, à la formation et aux règles.",
    "blocks": [
      {
        "type": "h",
        "text": "Le métier au quotidien"
      },
      {
        "type": "ul",
        "items": [
          [
            "Le nom historique du métier à la RATP : **machiniste-receveur**. Travail depuis un **centre bus**, en lien radio avec le **PC / la régulation**."
          ],
          [
            "Ce que fait le conducteur (présentation du CFA) : récupérer son véhicule au dépôt et le contrôler ; prendre connaissance de sa feuille de route ; accueillir les clients ; assurer le transport urbain ou interurbain ; conduire en sécurité ; anticiper les incidents ; informer sa hiérarchie en cas de panne ou de retard ; signaler les embouteillages ; intervenir en cas d'urgence (premiers secours)."
          ],
          [
            "RATP Cap Île-de-France : « mission principale : garantir la sécurité des voyageurs et respecter le code de la route » ; renseigner les voyageurs (itinéraire, tarifs) ; contrôle visuel des titres ; signaler les incidents mécaniques ; prendre soin du matériel. Horaires : matin, après-midi ou mixtes, soirée, week-ends."
          ]
        ]
      },
      {
        "type": "h",
        "text": "Les qualités demandées"
      },
      {
        "type": "ul",
        "items": [
          [
            "Qualités demandées (présentation du CFA) : ponctualité ; pratique professionnelle irréprochable ; sens du contact ; bonne présentation (tenue) ; bonne hygiène de vie."
          ]
        ]
      },
      {
        "type": "h",
        "text": "La formation"
      },
      {
        "type": "ul",
        "items": [
          [
            "Titre professionnel Conducteur de transport en commun sur route (niveau 3, Ministère du Travail). 434 h, dont 236 h de conduite (25 h de conduite individuelle sur route, dont 2 h de nuit, et 15 h hors circulation)."
          ],
          [
            "Contenu : code de la route, permis D, FIMO, gestion des conflits, sécurité incendie, écoconduite, prise en charge des PMR, SST (sauveteur secouriste du travail), notions de mécanique."
          ],
          [
            "Alternance : 3 mois en centre de formation (CAP Académie ou AFTRAL) puis 3 mois en entreprise ; contrat de 6 mois."
          ],
          [
            "À la fin : **permis D + carte de qualification conducteur (CQC) + attestation SST**."
          ],
          [
            "Évaluation : tests en continu, plateau et simulateur, mise en situation professionnelle, entretien technique, dossier professionnel, entretien final avec un jury."
          ]
        ]
      },
      {
        "type": "h",
        "text": "Les règles à connaître"
      },
      {
        "type": "ul",
        "items": [
          [
            "Alcool : seuil légal de 0,2 g par litre de sang pour les conducteurs de bus (et pour les permis probatoires) → en pratique, zéro alcool."
          ],
          [
            "Permis probatoire : 6 points au départ pour tout le monde."
          ],
          [
            "Règles du CFA : permis présenté tous les jours en formation et à l'examen ; moins de 4 points → stage obligatoire ; perte du permis → fin immédiate du contrat ; prérequis d'embauche RATP : 6 mois de permis B minimum."
          ],
          [
            "Le recrutement comprend une visite médicale et une enquête administrative ; le casier judiciaire (bulletin n° 3) est demandé."
          ]
        ]
      },
      {
        "type": "h",
        "text": "La rémunération (seulement si on te la demande)"
      },
      {
        "type": "ul",
        "items": [
          [
            "Selon la présentation du CFA, un apprenti de 18 à 20 ans en 1re année = 60 % du salaire minimum conventionnel (1 994,30 € brut) ≈ 1 197 € brut/mois."
          ],
          [
            "Conducteur de bus débutant (chiffre donné par la RATP) : environ 29 000 € brut par an, 13e mois compris, + primes (dimanche, nuit, jours fériés)."
          ]
        ]
      }
    ]
  },
  {
    "id": "recruteur",
    "num": 9,
    "title": "Les questions à poser au recruteur",
    "summary": "Choisis deux ou trois questions utiles à poser.",
    "blocks": [
      {
        "type": "p",
        "text": [
          "Pose 2 ou 3 questions, pas les 6. Ne pose pas de question sur le salaire ou les congés. Note les réponses."
        ]
      }
    ]
  },
  {
    "id": "erreurs",
    "num": 10,
    "title": "Les erreurs à ne pas faire le jour J",
    "summary": "Garde en tête les erreurs faciles à éviter.",
    "blocks": []
  },
  {
    "id": "checklist",
    "num": 11,
    "title": "Check-list",
    "summary": "Prépare tes affaires, ton trajet et ton arrivée.",
    "blocks": []
  },
  {
    "id": "memo",
    "num": 12,
    "title": "Mémo à imprimer",
    "summary": "Relis ces repères essentiels juste avant l’entretien.",
    "blocks": [
      {
        "type": "h",
        "text": "Ce qu'ils regardent"
      },
      {
        "type": "ul",
        "items": [
          [
            "**Les 4 critères officiels :** connaissance de l'entreprise et du métier ; capacité à faire ce métier ; motivation ; adaptation à la culture de l'entreprise."
          ],
          [
            "**Les filtres (oui/non) :** neutralité et respect de tous ; zéro alcool, zéro drogue, permis protégé ; politesse et tenue ; honnêteté sur ton dossier."
          ],
          [
            "**L'attitude, dans l'ordre :** 1. sécurité ; 2. règles et prévenir son responsable ; 3. fiabilité (être à l'heure, même à 5 h) ; 4. politesse avec les voyageurs ; 5. rester calme ; 6. écouter son tuteur, esprit d'équipe."
          ]
        ]
      },
      {
        "type": "h",
        "text": "Ton histoire en 3 phrases"
      },
      {
        "type": "ol",
        "items": [
          [
            "Le transport, j'ai grandi dedans : je faisais le planning des chauffeurs dans ",
            {
              "field": "entreprise",
              "hint": "comment tu présentes l’entreprise",
              "fallback": "une entreprise de transport de marchandises et de logistique"
            },
            ". J'ai vu ce qu'un retard coûte."
          ],
          [
            "J'aime aider les gens : j'ai un CAP pour accompagner les personnes âgées. Je sais être patient avec des personnes fragiles."
          ],
          [
            "Conducteur de bus, c'est les deux : conduire en sécurité et rendre service au public, dans le groupe qui fait rouler les bus et les métros de Paris depuis 1949."
          ]
        ]
      },
      {
        "type": "h",
        "text": "8 faits RATP"
      },
      {
        "type": "ol",
        "items": [
          [
            "Entreprise publique (EPIC), loi de 1948, en service depuis 1949. **IDFM** organise et finance ; la RATP exploite."
          ],
          [
            "Raison d'être : « S'engager chaque jour pour une meilleure qualité de ville » (à dire avec tes mots)."
          ],
          [
            "PDG : **Xavier Piechaczyk** (depuis février 2026, après Jean Castex). À revérifier la veille."
          ],
          [
            "Environ 73 000 collaborateurs, environ 4,5 milliards de voyages par an, une quinzaine de pays (2026)."
          ],
          [
            "Bus : 12 lots ouverts à la concurrence ; **RATP Cap Île-de-France** (filiale du groupe) en a gagné **8**. Les lots de Paris démarrent le **1er novembre 2026**. Le groupe reste public."
          ],
          [
            "Environ 75 % de bus « propres » en Île-de-France fin 2025."
          ],
          [
            "En 2026 : environ 6 600 recrutements, dont 3 500 CDI en Île-de-France."
          ],
          [
            "Valeurs : l'humain au cœur, la culture du service, la performance, la responsabilité et l'inclusion."
          ]
        ]
      },
      {
        "type": "h",
        "text": "Les 4 phrases sensibles"
      },
      {
        "type": "ul",
        "items": [
          [
            "**Âge et permis** *(seulement si on te pose la question)* : « J'ai mon permis depuis juin 2026, j'aurai mes 6 mois en décembre. Un permis récent, pour moi, c'est zéro écart : pas de téléphone, zéro alcool, mes points à protéger. »"
          ],
          [
            "**Horaires à 5 h :** d'abord ta solution concrète depuis Évry (",
            {
              "link": "/fiche",
              "text": "ta fiche perso"
            },
            "). Ensuite seulement : « En plus, je prévois de m'installer à Sucy-en-Brie, plus près des centres bus du Val-de-Marne. » Jamais « ça dépendra »."
          ],
          [
            "**Concurrence :** « Ce n'est pas une privatisation, le groupe reste public. Il a gardé 8 lots sur 12 et il recrute. Si on m'affecte chez RATP Cap Île-de-France, ça me va très bien. »"
          ],
          [
            "**Grèves, politique, religion :** « C'est un droit. Moi, ce qui compte, c'est d'être là pour les voyageurs et de respecter les règles. »"
          ]
        ]
      },
      {
        "type": "h",
        "text": "Mises en situation : le réflexe"
      },
      {
        "type": "p",
        "text": [
          "**Sécuriser → Alerter → Informer → Appliquer la consigne → Rendre compte.**"
        ]
      },
      {
        "type": "ul",
        "items": [
          [
            "Ne jamais mettre personne en danger. S'arrêter dans un endroit sûr si besoin."
          ],
          [
            "Rester calme, ne jamais toucher un voyageur, ne pas répondre aux provocations."
          ],
          [
            "Prévenir le PC par la radio, comme on te l'apprendra. Rassurer les voyageurs."
          ],
          [
            "Après : prévenir son responsable et faire le rapport demandé."
          ],
          [
            "En retard ? On ne rattrape **jamais** par la vitesse."
          ],
          [
            "Tu ne sais pas ? « Je demanderais à mon tuteur ou au PC, et j'appliquerais la consigne. »"
          ]
        ]
      },
      {
        "type": "h",
        "text": "Le jour J"
      },
      {
        "type": "p",
        "text": [
          "Arriver 15 min en avance. Tenue propre et sobre. Téléphone éteint. Saluer tout le monde, vouvoyer. Prendre 2 secondes avant de répondre. Ne jamais mentir, ne jamais critiquer, ne pas parler salaire en premier. À la fin : poser 2 ou 3 questions (",
          {
            "link": "/reviser/recruteur",
            "text": "questions au recruteur"
          },
          ") et remercier."
        ]
      }
    ]
  }
]
