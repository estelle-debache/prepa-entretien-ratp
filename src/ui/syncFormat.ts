import { CloudAlert, CloudCheck, CloudOff, CloudSync, type LucideIcon } from 'lucide-react'
import type { SyncState } from '../lib/sync'

const timeFormatter = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' })

/** « 14:32 » */
export function formatSyncTime(ms: number): string {
  return timeFormatter.format(new Date(ms))
}

/** Icône représentant l'état de synchro (nuage + coche / points / alerte / barré). */
export const SYNC_STATUS_ICON: Record<SyncState['status'], LucideIcon> = {
  disabled: CloudOff,
  synced: CloudCheck,
  pending: CloudSync,
  error: CloudAlert,
}

/** Libellé accessible court, utilisé comme `aria-label` (indicateur de la barre du haut). */
export function syncStatusAriaLabel(state: SyncState): string {
  switch (state.status) {
    case 'synced': return `Synchronisé à ${formatSyncTime(state.lastSyncAt)}`
    case 'pending': return 'Synchronisation en attente'
    case 'error': return 'Synchronisation en erreur'
    case 'disabled': return 'Synchronisation désactivée'
  }
}

/** Ligne de statut, plus détaillée (page « Tes données »). */
export function syncStatusLine(state: SyncState): string {
  switch (state.status) {
    case 'synced': return `Synchronisé à ${formatSyncTime(state.lastSyncAt)}`
    case 'pending': return state.reason === 'creating' ? 'Code créé, envoi en attente…' : 'En attente…'
    case 'error': return state.reason === 'creating' ? `Code créé, envoi en attente. ${state.message}` : `Erreur : ${state.message}`
    case 'disabled': return ''
  }
}
