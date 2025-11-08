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

/**
 * Primitive bitwise permission flags for rundown access control (powers of 2)
 * Use bitwise operations to check permissions: token.permissions & RundownPermission.EDIT
 */
export enum RundownPermission {
  VIEW = 1,          // 000001 - read-only access
  EDIT = 2,          // 000010 - edit all content
  SHOWCALL = 4,      // 000100 - run/control the show
  MANAGE = 8,        // 001000 - manage settings, access, invites
  // 16 reserved for future common permission
  EDIT_PARTIAL = 32, // 100000 - edit assigned columns only (special case)
}

/**
 * Precomposed permission sets for common roles
 * Each set combines multiple RundownPermission primitives
 */
export enum RundownPermissionSet {
  VIEWER =         1,              // 000001
  EDITOR =         1 | 2,          // 000011
  SHOW_CALLER =    1 | 2 | 4,      // 000111
  ADMIN =          1 | 2 | 4 | 8,  // 001111
  PARTIAL_EDITOR = 1 | 32,         // 100001
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
 * JWT token payload for rundown authentication
 * Contains permission flags for access control
 *
 * 1. Bitwise permission flags stored as a single number
 *    Use bitwise AND to check: (payload.permissions & RundownPermission.EDIT) !== 0
 *    Assign using enum values: RundownPermissionSet.EDITOR or custom combinations
 * 2. Legacy support during transition
 */
export interface RundownTokenPayload {
  rundownId: DocumentSnapshotId
  permissions: number /* 1 */
  access: RundownAccess /* 2 */
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
