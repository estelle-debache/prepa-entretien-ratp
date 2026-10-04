import { describe, expect, it } from 'vitest'
import { capitalizeFirst, frenchNbsp } from './format'

describe('frenchNbsp', () => {
  it('insère une espace insécable après « et avant »', () => {
    const result = frenchNbsp('Lis « Ce que la RATP évalue » sur l’accueil.')
    expect(result).toContain('«\u00a0Ce')
    expect(result).toContain('évalue\u00a0»')
  })

  it('insère une espace insécable avant : ; ! ?', () => {
    expect(frenchNbsp('Vraiment ? Oui : toujours ; jamais !')).toBe('Vraiment\u00a0? Oui\u00a0: toujours\u00a0; jamais\u00a0!')
  })

  it('est idempotent', () => {
    const once = frenchNbsp('« Bonjour » : vraiment ?')
    expect(frenchNbsp(once)).toBe(once)
  })

  it('laisse le texte sans ponctuation concernée inchangé', () => {
    expect(frenchNbsp('Texte normal sans rien de spécial')).toBe('Texte normal sans rien de spécial')
  })
})

describe('capitalizeFirst', () => {
  it('met en majuscule la première lettre seulement', () => {
    expect(capitalizeFirst('salarié déclaré')).toBe('Salarié déclaré')
  })
  it('laisse une chaîne vide inchangée', () => {
    expect(capitalizeFirst('')).toBe('')
  })
})
