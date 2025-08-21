import type { DocumentSnapshotId, DocumentSnapshot } from './FirebaseBuiltins'
import { fromSnapshot, fromSerialized } from '../utils/converters'
import { ReplaceWithTimestamp, ReplaceWithString } from '../utils/typeUtils'

/**
 * Complete Mention type with all fields
 * This is the main type for application logic
 */
export interface Mention {
  id: DocumentSnapshotId
  key: string // External API key (enumerated: "1", "2", "3"...)
  name: string // User-facing name (renameable)
  color: string // Hex color for highlighting (#RRGGBB format)
  description: string // Rich text description (HTML from TipTap)
  createdAt: Date
  updatedAt: Date
}

/**
 * Fields added by the system (from snapshot metadata)
 */
type MentionSystemFields = 'id' | 'createdAt' | 'updatedAt'

/**
 * Raw Firestore data structure for a Mention document
 * Contains Firestore Timestamp objects, no id/createdAt/updatedAt
 */
export type MentionFirestore = ReplaceWithTimestamp<Omit<Mention, MentionSystemFields>>

/**
 * Serialized Mention for API/network transmission
 * Contains ISO date strings and includes id/createdAt/updatedAt
 */
export type MentionSerialized = ReplaceWithString<Mention>

/**
 * Note: Firestore doesn't support the value `undefined`, so we need to omit these keys instead.
 * Returns defaults with Date objects (not Firestore timestamps)
 */
export const getMentionDefaults = (): Omit<Mention, MentionSystemFields> => ({
  key: '1',
  name: 'New Item',
  color: '#6b6bff', // Default blue color
  description: '',
})

/**
 * Mention-specific converter from Firestore snapshot
 */
export function mentionFromSnapshot (snapshot: DocumentSnapshot): Mention {
  return fromSnapshot<MentionFirestore, Mention>(snapshot, {
    // Mention has no Date fields besides system fields
    dateFields: [],
  })
}

/**
 * Mention-specific converter from serialized data
 */
export function mentionFromSerialized (serialized: MentionSerialized): Mention {
  return fromSerialized<MentionSerialized, Mention>(serialized, {
    dateFields: ['createdAt', 'updatedAt'],
  })
}
