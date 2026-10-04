/**
 * Contrat de données du site (FIGÉ après Gate 1).
 * Toute extension passe par de NOUVEAUX fichiers/types, pas par la modification de ceux-ci.
 */

/* ------------------------------------------------------------------ */
/* Fiche personnelle                                                   */
/* ------------------------------------------------------------------ */

export type ProfileFieldId =
  // Toi
  | 'prenom'
  // CAP
  | 'capAnnee'
  | 'stageLieu'
  | 'stageSouvenir'
  // Expérience au planning
  | 'entreprise'
  | 'statutExperience'
  | 'experienceDuree'
  | 'nbChauffeurs'
  | 'imprevuPlanning'
  // Permis & conduite
  | 'conduiteAccompagnee'
  | 'soldePoints'
  | 'infraction'
  | 'pratiqueConduite'
  // Venir à 5 h
  | 'transport5h'
  // CFA
  | 'sourceCFA'
  // Toi, en exemples
  | 'qualite1'
  | 'preuve1'
  | 'qualite2'
  | 'preuve2'
  | 'qualite3'
  | 'preuve3'
  | 'defaut'
  | 'defautProgres'
  | 'conflit'
  | 'erreur'
  | 'autresCandidatures'

export type ProfileFieldType = 'text' | 'textarea' | 'select' | 'yesno' | 'date'

export interface ProfileField {
  id: ProfileFieldId
  group: ProfileGroupId
  label: string
  /** Aide courte affichée sous le champ. */
  help?: string
  placeholder?: string
  type: ProfileFieldType
  options?: string[]
  /** Valeur par défaut (tout est vide sauf le prénom). */
  defaultValue?: string
}

export type ProfileGroupId = 'toi' | 'cap' | 'experience' | 'permis' | 'trajet' | 'cfa' | 'exemples'

export interface ProfileGroup {
  id: ProfileGroupId
  title: string
  intro?: string
}

/** Valeurs saisies (clé de stockage « profil »). */
export type Profile = Partial<Record<ProfileFieldId, string>>

/* ------------------------------------------------------------------ */
/* Texte enrichi personnalisable                                       */
/* ------------------------------------------------------------------ */

/**
 * Un segment de texte :
 * - string : texte brut (peut contenir **gras** et *italique* Markdown simples, rien d'autre) ;
 * - field : remplacé par la valeur de la fiche ; si vide → `fallback` s'il existe, sinon une
 *   puce « à compléter : hint » qui renvoie vers /fiche ;
 * - ifField : `text` affiché seulement si la valeur du champ vaut « oui » (insensible à la casse) ;
 * - link : lien interne (route HashRouter, ex. « /reviser/ratp »).
 */
export type Segment =
  | string
  | { field: ProfileFieldId; hint: string; fallback?: string }
  | { ifField: ProfileFieldId; text: string }
  | { link: string; text: string }

export type RichText = Segment[]

/* ------------------------------------------------------------------ */
/* Blocs de prose (fiches de révision, mémo)                            */
/* ------------------------------------------------------------------ */

export type Block =
  | { type: 'h'; text: string }
  | { type: 'p'; text: RichText }
  | { type: 'ul'; items: RichText[] }
  | { type: 'ol'; items: RichText[] }
  | { type: 'quote'; text: RichText }
  | { type: 'callout'; tone: 'info' | 'warning' | 'success'; title?: string; text: RichText }

export type SectionId =
  | 'mode-emploi' // 0
  | 'evaluation' // 2
  | 'deroule' // 3
  | 'recruteur' // 9
  | 'ratp' // 4
  | 'metier' // 5
  | 'erreurs' // 10
  | 'checklist' // 11
  | 'memo' // 12

export interface Section {
  id: SectionId
  /** Numéro de section dans le document d'origine (0-12). */
  num: number
  title: string
  /** Résumé d'une phrase pour les cartes de navigation. */
  summary: string
  blocks: Block[]
}

/* ------------------------------------------------------------------ */
/* Section 4 : faits RATP                                              */
/* ------------------------------------------------------------------ */

export interface Fact {
  /** F1 … F8 */
  id: string
  title: string
  text: RichText
}

export interface Extra {
  /** PB1 … PB7 (« pour briller ») */
  id: string
  text: RichText
}

export interface LocalNetwork {
  versionA: { title: string; text: RichText }
  versionB: { title: string; text: RichText }
  rule: RichText
}

/* ------------------------------------------------------------------ */
/* Section 5 : lexique                                                 */
/* ------------------------------------------------------------------ */

export interface LexiconEntry {
  /** L1 … L10 */
  id: string
  term: string
  definition: string
}

/* ------------------------------------------------------------------ */
/* Questions                                                           */
/* ------------------------------------------------------------------ */

export type ThemeId = 'presentation' | 'ratp' | 'metier' | 'securite' | 'contraintes' | 'culture' | 'pieges'

export interface Theme {
  id: ThemeId
  label: string
}

/** Q1 … Q15 : format complet. */
export interface TopQuestion {
  id: string
  kind: 'top'
  star: boolean
  theme: ThemeId
  question: string
  /** « Ce qu'ils vérifient » */
  checks: string
  /** « 3 idées à placer » (3 éléments) */
  ideas: RichText[]
  /** « Exemple (à dire avec tes mots) », sans les guillemets « » */
  example: RichText
  /** « À éviter » */
  avoid: RichText
  /** Durée orale cible en secondes [min, max] */
  targetSeconds: [number, number]
}

/** B1 … B30 : format court. */
export interface BankQuestion {
  id: string
  kind: 'bank'
  theme: ThemeId
  /** Sous-titre d'origine (« Parcours & motivation », …) */
  group: string
  question: string
  /** Idées (séparées par « / » dans la source) */
  ideas: RichText[]
  /** Accroche, sans les guillemets « » */
  hook: RichText
  targetSeconds: [number, number]
}

export type Question = TopQuestion | BankQuestion

/* ------------------------------------------------------------------ */
/* Mises en situation et jeux de rôle                                  */
/* ------------------------------------------------------------------ */

export interface Situation {
  /** S1 … S12 */
  id: string
  star: boolean
  title: string
  /** « Ce que je fais » (puces, dans l'ordre de la source) */
  steps: RichText[]
  keyPhrase: string
  trap: string
  /** JR associé éventuel (S1→JR1, S2→JR2, S3→JR3) */
  rolePlayId?: string
}

export type RolePlaySpeaker = 'voyageur' | 'candidat' | 'action'

export interface RolePlayLine {
  speaker: RolePlaySpeaker
  text: string
}

export interface RolePlay {
  /** JR1 … JR3 */
  id: string
  title: string
  roles: string
  lines: RolePlayLine[]
  observerChecks: string[]
}

/* ------------------------------------------------------------------ */
/* Section 9 : questions au recruteur ; section 10 : erreurs            */
/* ------------------------------------------------------------------ */

export interface RecruiterQuestion {
  /** R1 … R6 */
  id: string
  text: string
  /** Condition d'usage (ex. 6e question) */
  condition?: string
}

export interface MistakeItem {
  /** E1 … */
  id: string
  title: string
  text: string
}

/* ------------------------------------------------------------------ */
/* Section 11 : check-list ; plan jour par jour                         */
/* ------------------------------------------------------------------ */

export interface ChecklistItem {
  /** CL-<groupe>-<n> */
  id: string
  text: RichText
}

export interface ChecklistGroup {
  id: string
  title: string
  items: ChecklistItem[]
}

export interface PlanTask {
  /** <jour>-<n>, ex. « J-4-1 » */
  id: string
  text: string
  /** Route interne optionnelle (ex. « /fiche ») */
  link?: string
}

export interface PlanDay {
  /** « J-4 » … « J-0 » */
  id: string
  /** Décalage en jours par rapport à la date de l'entretien (-4 … 0) */
  offset: number
  title: string
  tasks: PlanTask[]
}

/* ------------------------------------------------------------------ */
/* Réglages                                                            */
/* ------------------------------------------------------------------ */

/** Date d'entretien par défaut (modifiable par l'utilisateur). */
export const DEFAULT_INTERVIEW_DATE = '2026-10-07'
