import { describe, expect, it } from 'vitest'
import { PROFILE_FIELDS } from './profileFields'
import { THEMES } from './themes'
import { SECTIONS } from './sections'
import { FACTS, EXTRAS, LOCAL_NETWORK } from './facts'
import { LEXICON } from './lexicon'
import { TOP_QUESTIONS, BANK_QUESTIONS, QUESTIONS } from './questions'
import { SITUATIONS } from './situations'
import { ROLE_PLAYS } from './roleplays'
import { RECRUITER_QUESTIONS } from './recruiter'
import { MISTAKES } from './mistakes'
import { CHECKLIST } from './checklist'

const exportsToScan = { THEMES, SECTIONS, FACTS, EXTRAS, LOCAL_NETWORK, LEXICON, TOP_QUESTIONS, BANK_QUESTIONS, SITUATIONS, ROLE_PLAYS, RECRUITER_QUESTIONS, MISTAKES, CHECKLIST }
const values = (x: unknown): unknown[] => Array.isArray(x) ? x.flatMap(values) : x && typeof x === 'object' ? Object.values(x).flatMap(values) : [x]
const serialized = JSON.stringify(exportsToScan)
const links = values(exportsToScan).filter((x): x is string => typeof x === 'string').flatMap(s => [...s.matchAll(/\{link:([^}]+)\}/g)].map(m => m[1]))
const contentLinks = [...serialized.matchAll(/"link":"([^"]+)"|"link":"([^\"]+)"/g)].map(m => m[1] ?? m[2])
const validRoutes = [/^\/$/, /^\/fiche$/, /^\/reviser$/, /^\/reviser\/(mode-emploi|evaluation|deroule|ratp|metier|recruteur|erreurs|checklist)$/, /^\/questions$/, /^\/questions\/(Q[1-9]|Q1[0-5]|B([1-9]|[12][0-9]|30))$/, /^\/memo$/, /^\/donnees$/, /^\/entrainement$/, /^\/entrainement\/oral\/[^/]+$/, /^\/entrainement\/ami\/[^/]+$/, /^\/simulation$/, /^\/quiz$/, /^\/situations$/, /^\/situations\/ordre$/, /^\/situations\/S(1[0-2]|[1-9])$/, /^\/jeux-de-role\/JR[1-3]$/, /^\/revision-rapide$/]

describe('contenu éditorial', () => {
  it('contient tous les volumes attendus', () => {
    expect(TOP_QUESTIONS).toHaveLength(15)
    expect(BANK_QUESTIONS).toHaveLength(30)
    expect(SITUATIONS).toHaveLength(12)
    expect(ROLE_PLAYS).toHaveLength(3)
    expect(FACTS).toHaveLength(8)
    expect(EXTRAS).toHaveLength(7)
    expect(LEXICON).toHaveLength(10)
    expect(RECRUITER_QUESTIONS).toHaveLength(6)
    expect(MISTAKES).toHaveLength(11)
    expect(CHECKLIST).toHaveLength(4)
    expect(QUESTIONS).toHaveLength(45)
    expect(THEMES).toHaveLength(7)
    expect(SECTIONS).toHaveLength(9)
  })

  it('respecte les étoiles, les idées et les identifiants uniques', () => {
    expect(TOP_QUESTIONS.filter(q => q.star).map(q => q.id)).toEqual(['Q1', 'Q2', 'Q7', 'Q9', 'Q13'])
    expect(SITUATIONS.filter(s => s.star).map(s => s.id)).toEqual(['S1', 'S2', 'S3'])
    expect(TOP_QUESTIONS.every(q => q.ideas.length === 3)).toBe(true)
    const ids = [ ...QUESTIONS, ...SITUATIONS, ...ROLE_PLAYS, ...FACTS, ...EXTRAS, ...LEXICON, ...RECRUITER_QUESTIONS, ...MISTAKES, ...CHECKLIST.flatMap(g => g.items) ].map(x => x.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('n’utilise que des champs de profil déclarés et des routes valides', () => {
    const knownFields = new Set(PROFILE_FIELDS.map(field => field.id))
    const serializedObjects = JSON.stringify(exportsToScan)
    const fields = [...serializedObjects.matchAll(/"(?:field|ifField)":"([^"]+)"/g)].map(m => m[1])
    expect(fields.every(field => knownFields.has(field as never))).toBe(true)
    const allLinks = [...serializedObjects.matchAll(/"link":"([^"]+)"/g)].map(m => m[1])
    expect(allLinks.every(link => validRoutes.some(route => route.test(link)))).toBe(true)
    expect(contentLinks).toEqual(allLinks)
    expect(links).toEqual([])
  })

  it('ne publie aucun identifiant privé ni crochet de saisie', () => {
    expect(serialized).not.toMatch(/Yahia\s+[A-ZÀ-Ý][a-zà-ÿ]+/)
    expect(serialized).not.toMatch(/\bp[eè]re\b/i)
    for (const forbidden of ['[À COMPLÉTER', '→ fiche perso', '[ ']) {
      expect(serialized.toLocaleLowerCase('fr')).not.toContain(forbidden.toLocaleLowerCase('fr'))
    }
  })
})
