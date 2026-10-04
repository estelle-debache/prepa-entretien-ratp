/**
 * Configuration Supabase de la synchronisation entre appareils.
 * Ces deux valeurs sont PUBLIQUES par nature (elles sont envoyées par chaque navigateur).
 * Ne jamais mettre ici la clé « service_role » ni une clé « secret ».
 */
export const SUPABASE_URL: string = ''
export const SUPABASE_PUBLIC_KEY: string = ''

export function isSyncConfigured(): boolean {
  return SUPABASE_URL.startsWith('https://') && SUPABASE_PUBLIC_KEY.length > 20
}
