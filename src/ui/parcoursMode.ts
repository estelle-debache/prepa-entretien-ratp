import { useSearchParams } from 'react-router'

/** Vrai quand l'utilisateur navigue depuis la barre de parcours (`?parcours=1`). */
export function useParcoursMode(): boolean {
  const [params] = useSearchParams()
  return params.get('parcours') === '1'
}
