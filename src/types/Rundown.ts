import type { DocumentSnapshotId, DocumentSnapshot } from './FirebaseBuiltins'
import { parse } from 'date-fns'
import { CUE_BACKGROUND_COLORS } from '@rundown-studio/consts'
import { generateSalt } from '../utils/generateSalt'
import { fromSnapshot, fromSerialized } from '../utils/converters'
import { ReplaceWithTimestamp, ReplaceWithString } from '../utils/typeUtils'

export enum RundownAccess {
  WRITE = 'write',
  WRITE_COLUMN = 'write-column',
  READ = 'read',
}

export enum RundownStatus {
  IMPORTED = 'imported',
  DRAFT = 'draft',
  AWAITING_DATA = 'awaiting-data',
  APPROVED = 'approved',
  FINALIZED = 'finalized',
  REJECTED = 'rejected',
}

export interface RundownCueOrderItem {
  id: DocumentSnapshotId
  children?: RundownCueOrderItem[]
}

/**
 * Collection of text variables in a rundown
 * Simple key-value string pairs
 */
export type TextVariables = Record<string, string>

/**
 * Complete Rundown type with all fields
 * This is the main type for application logic
 */
export interface Rundown {
  id: DocumentSnapshotId
  name: string
  teamId: DocumentSnapshotId | null
  eventId: DocumentSnapshotId | null
  runnerId: DocumentSnapshotId | null
  prompterId: DocumentSnapshotId | null
  columns: DocumentSnapshotId[] // order of columns
  cues: RundownCueOrderItem[] // order of cues
  startTime: Date
  endTime: Date | null
  startCueId: DocumentSnapshotId | null
  salt: string
  status: RundownStatus
  timezone: string | null
  logo: string | null
  settings: {
    outputConfig?: string
    cueBackgroundColours?: string[]
    currentCueHighlightColor?: string
    todDisplayFormat?: '12hNoAmPm' | '12h' | '24h' | null
  }
  textVariables: TextVariables // Collection of text variables (key-value pairs)
  deletedAt: Date | null
  archivedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Fields added by the system (from snapshot metadata)
 */
type RundownSystemFields = 'id' | 'createdAt' | 'updatedAt'

/**
 * Raw Firestore data structure for a Rundown document
 * Contains Firestore Timestamp objects, no id/createdAt/updatedAt
 */
export type RundownFirestore = ReplaceWithTimestamp<Omit<Rundown, RundownSystemFields>>

/**
 * Serialized Rundown for API/network transmission
 * Contains ISO date strings and includes id/createdAt/updatedAt
 */
export type RundownSerialized = ReplaceWithString<Rundown>

/**
 * @deprecated Use CueFirestore instead
 */
export type RundownSnapshot = Omit<Rundown, RundownSystemFields>

/**
 * Note: Firestore doesn't support the value `undefined`, so we need to omit these keys instead.
 * Returns defaults with Date objects (not Firestore timestamps)
 */
export const getRundownDefaults = (): Omit<Rundown, RundownSystemFields> => ({
  name: '',
  teamId: null,
  eventId: null,
  runnerId: null,
  prompterId: null,
  columns: [],
  cues: [],
  startTime: parse('09:00:00', 'HH:mm:ss', new Date()),
  endTime: null,
  startCueId: null,
  salt: generateSalt(16),
  status: RundownStatus.DRAFT,
  timezone: null,
  logo: '',
  settings: {
    outputConfig: '',
    cueBackgroundColours: CUE_BACKGROUND_COLORS,
    currentCueHighlightColor: '',
    todDisplayFormat: null,
  },
  textVariables: {}, // Empty object for text variables
  deletedAt: null,
  archivedAt: null,
})

/**
 * Rundown-specific converter from Firestore snapshot
 */
export function rundownFromSnapshot (snapshot: DocumentSnapshot): Rundown {
  return fromSnapshot<RundownFirestore, Rundown>(snapshot, {
    dateFields: ['startTime', 'endTime', 'deletedAt', 'archivedAt'],
  })
}

/**
 * Rundown-specific converter from serialized data
 */
export function rundownFromSerialized (serialized: RundownSerialized): Rundown {
  return fromSerialized<RundownSerialized, Rundown>(serialized, {
    dateFields: ['startTime', 'endTime', 'deletedAt', 'archivedAt', 'createdAt', 'updatedAt'],
  })
}
