import { describe, expect, it } from 'vitest'
import { missingFields, parseInline, resolveRichText, toPlainText } from './personalize'

describe('personalisation du texte', () => {
  it('résout les champs renseignés, vides et les valeurs de repli', () => {
    const rich = [{ field: 'prenom' as const, hint: 'prénom' }, { field: 'stageLieu' as const, hint: 'lieu' }, { field: 'entreprise' as const, hint: 'entreprise', fallback: 'une entreprise' }]
    expect(resolveRichText(rich, { prenom: '  Léa ' })).toEqual([
      { kind: 'text', text: 'Léa' }, { kind: 'missing', field: 'stageLieu', hint: 'lieu' }, { kind: 'text', text: 'une entreprise' },
    ])
    expect(toPlainText(rich, { prenom: 'Léa' })).toBe('Léa…une entreprise')
    expect(missingFields([rich, rich], {})).toEqual(['prenom', 'stageLieu'])
  })
  it('inclut les conditions vraies seulement', () => {
    const rich = [{ ifField: 'cfaVerifie' as const, text: 'Vérifié' }]
    expect(resolveRichText(rich, { cfaVerifie: 'OUI' })).toEqual([{ kind: 'text', text: 'Vérifié' }])
    expect(resolveRichText(rich, { cfaVerifie: 'non' })).toEqual([])
    expect(resolveRichText(rich, {})).toEqual([])
  })
  it('conserve les liens internes', () => {
    expect(resolveRichText([{ link: '/fiche', text: 'ma fiche' }], {})).toEqual([{ kind: 'link', to: '/fiche', text: 'ma fiche' }])
  })
})

describe('parseInline', () => {
  it('gère gras, italique et une imbrication simple', () => {
    expect(parseInline('Avant **gras *italique*** après')).toEqual([
      { text: 'Avant ' }, { text: 'gras ', bold: true }, { text: 'italique', bold: true, italic: true }, { text: ' après' },
    ])
    expect(parseInline('*simple*')).toEqual([{ text: 'simple', italic: true }])
  })
  it('retourne sans changement le texte sans marqueur', () => { expect(parseInline('Texte normal')).toEqual([{ text: 'Texte normal' }]) })
})
