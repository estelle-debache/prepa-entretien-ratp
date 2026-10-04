import type { ProfileField, ProfileGroup } from './types'

export const PROFILE_GROUPS: ProfileGroup[] = [
  { id: 'toi', title: 'Toi', intro: 'Tout ce que tu écris ici reste sur ton téléphone. Rien n’est envoyé.' },
  { id: 'cap', title: 'Ton CAP', intro: 'Ton CAP Agent accompagnant au grand âge est un vrai atout : prépare un exemple concret.' },
  { id: 'experience', title: 'Ton expérience au planning', intro: 'Dis toujours la vérité sur ton statut : le recruteur peut te le demander.' },
  { id: 'permis', title: 'Ton permis et ta conduite' },
  { id: 'trajet', title: 'Venir au centre bus à 5 h', intro: 'Prévois une solution qui marche dès aujourd’hui, sans attendre un déménagement.' },
  { id: 'cfa', title: 'Le CFA' },
  { id: 'exemples', title: 'Toi, en exemples', intro: 'Une qualité sans exemple ne compte pas. Écris des faits vrais, en 2 ou 3 phrases.' },
]

export const PROFILE_FIELDS: ProfileField[] = [
  { id: 'prenom', group: 'toi', label: 'Ton prénom', type: 'text', defaultValue: 'Yahia' },

  { id: 'capAnnee', group: 'cap', label: 'Année d’obtention du CAP', type: 'text', placeholder: 'ex. 2026' },
  { id: 'stageLieu', group: 'cap', label: 'Où as-tu fait tes stages ?', help: 'Complète la phrase « J’ai fait mes stages dans … ».', type: 'text', placeholder: 'ex. un EHPAD à …' },
  {
    id: 'stageSouvenir',
    group: 'cap',
    label: 'Un souvenir concret avec une personne âgée',
    help: 'Ce qui s’est passé, ce que tu as fait, ce que ça a changé. 2 ou 3 phrases.',
    type: 'textarea',
  },

  {
    id: 'entreprise',
    group: 'experience',
    label: 'Comment tu présentes l’entreprise où tu faisais le planning',
    help: 'Écris-le comme tu le diras à l’oral.',
    placeholder: 'ex. une entreprise de transport de marchandises',
    type: 'text',
  },
  {
    id: 'statutExperience',
    group: 'experience',
    label: 'Ton statut là-bas',
    help: 'Choisis la réponse vraie.',
    type: 'select',
    options: ['salarié déclaré', 'en aide familiale', 'en stage'],
  },
  { id: 'experienceDuree', group: 'experience', label: 'Pendant combien de temps ?', type: 'text', placeholder: 'ex. un an' },
  { id: 'nbChauffeurs', group: 'experience', label: 'Pour combien de chauffeurs ?', type: 'text', placeholder: 'ex. une dizaine de chauffeurs' },
  {
    id: 'imprevuPlanning',
    group: 'experience',
    label: 'Un imprévu de planning que tu as géré',
    help: 'L’imprévu, ce que tu as fait, le résultat.',
    type: 'textarea',
  },

  { id: 'conduiteAccompagnee', group: 'permis', label: 'As-tu fait la conduite accompagnée ?', type: 'yesno' },
  { id: 'soldePoints', group: 'permis', label: 'Ton solde de points', help: 'Vérifie-le sur le site officiel du permis à points.', type: 'text', placeholder: 'ex. 6' },
  { id: 'infraction', group: 'permis', label: 'As-tu eu une infraction ? Laquelle ?', type: 'text', placeholder: 'ex. non' },
  {
    id: 'pratiqueConduite',
    group: 'permis',
    label: 'Ta pratique de la conduite depuis juin',
    help: 'Combien de kilomètres par semaine, quel véhicule, boîte manuelle ?',
    type: 'textarea',
  },

  { id: 'transport5h', group: 'trajet', label: 'Comment tu viens au centre bus pour 5 h ?', help: 'Complète la phrase « Je peux venir au centre bus à 5 h … ».', type: 'text', placeholder: 'ex. en voiture, avec ma propre voiture' },

  { id: 'sourceCFA', group: 'cfa', label: 'Comment as-tu connu le CFA et cette formation ?', type: 'text', placeholder: 'ex. France Travail' },

  { id: 'qualite1', group: 'exemples', label: 'Qualité n° 1', type: 'text', placeholder: 'ex. ponctuel' },
  { id: 'preuve1', group: 'exemples', label: 'Preuve de la qualité n° 1', type: 'textarea' },
  { id: 'qualite2', group: 'exemples', label: 'Qualité n° 2', type: 'text', placeholder: 'ex. patient' },
  { id: 'preuve2', group: 'exemples', label: 'Preuve de la qualité n° 2', type: 'textarea' },
  { id: 'qualite3', group: 'exemples', label: 'Qualité n° 3', type: 'text' },
  { id: 'preuve3', group: 'exemples', label: 'Preuve de la qualité n° 3', type: 'textarea' },
  { id: 'defaut', group: 'exemples', label: 'Un défaut réel, avec un exemple concret', type: 'textarea', placeholder: 'ex. que je veux parfois aller trop vite, par exemple …' },
  { id: 'defautProgres', group: 'exemples', label: 'Ce que tu fais pour progresser', type: 'textarea', placeholder: 'ex. maintenant, je prends le temps de vérifier avant d’agir' },
  { id: 'conflit', group: 'exemples', label: 'Un conflit que tu as géré calmement', type: 'textarea' },
  { id: 'erreur', group: 'exemples', label: 'Une erreur assumée et ce que tu en as appris', type: 'textarea' },
  { id: 'autresCandidatures', group: 'exemples', label: 'As-tu postulé ailleurs ? (réponse vraie)', type: 'text' },
]
