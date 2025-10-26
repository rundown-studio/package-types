import type { DocumentSnapshotId, DocumentSnapshot } from './FirebaseBuiltins'
import { fromSnapshot, fromSerialized } from '../utils/converters'
import { ReplaceWithTimestamp, ReplaceWithString } from '../utils/typeUtils'

export enum CueType {
  CUE = 'cue',
  HEADING = 'heading',
  GROUP = 'group',
}

export enum CueStartMode {
  FLEXIBLE = 'flexible',
  FIXED = 'fixed',
}

export interface CueSettings {
  hideOnPdf: boolean
  hideOnCsv: boolean
  preventEdits: boolean
}

/**
 * Complete Cue type with all fields
 * This is the main type for application logic
 */
export interface Cue {
  id: DocumentSnapshotId
  type: CueType
  title: string
  subtitle: string
  startTime: Date | null // Essentially ignored for first cue, taken from rundown.startTime
  startMode: CueStartMode // Essentially ignored for first cue
  startDatePlus: number
  duration: number
  backgroundColor: string | null
  locked: boolean // LEGACY kept for backward compatibility, moved to settings.preventEdits
  scheduled: boolean // If scheduled to auto-start
  deletedAt: Date | null
  settings: CueSettings // Optional for backward compatibility, but should always be present after migration
  createdAt: Date
  updatedAt: Date
}

/**
 * Fields added by the system (from snapshot metadata)
 */
type CueSystemFields = 'id' | 'createdAt' | 'updatedAt'

/**
 * Raw Firestore data structure for a Cue document
 * Contains Firestore Timestamp objects, no id/createdAt/updatedAt
 */
export type CueFirestore = ReplaceWithTimestamp<Omit<Cue, CueSystemFields>>

/**
 * Serialized Cue for API/network transmission
 * Contains ISO date strings and includes id/createdAt/updatedAt
 */
export type CueSerialized = ReplaceWithString<Cue>

/**
 * @deprecated Use Cue instead
 */
export type RundownCue = Cue

/**
 * @deprecated Use CueFirestore instead
 */
export type RundownCueSnapshot = Omit<Cue, CueSystemFields>

/**
 * Note: Firestore doesn't support the value `undefined`, so we need to omit these keys instead.
 * Returns defaults with Date objects (not Firestore timestamps)
 */
export const getCueDefaults = (): Omit<Cue, CueSystemFields> => ({
  type: CueType.CUE,
  title: '',
  subtitle: '',
  startTime: null,
  startMode: CueStartMode.FLEXIBLE,
  startDatePlus: 0,
  duration: 0, // 0 seconds
  backgroundColor: '',
  locked: false,
  scheduled: false,
  deletedAt: null,
  settings: {
    hideOnPdf: false,
    hideOnCsv: false,
    preventEdits: false,
  },
})

/**
 * Cue-specific converter from Firestore snapshot
 */
export function cueFromSnapshot (snapshot: DocumentSnapshot): Cue {
  return fromSnapshot<CueFirestore, Cue>(snapshot, {
    dateFields: ['startTime', 'deletedAt'],
  })
}

/**
 * Cue-specific converter from serialized data
 */
export function cueFromSerialized (serialized: CueSerialized): Cue {
  return fromSerialized<CueSerialized, Cue>(serialized, {
    dateFields: ['startTime', 'deletedAt', 'createdAt', 'updatedAt'],
  })
}
