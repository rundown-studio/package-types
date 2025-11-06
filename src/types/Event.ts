import type { DocumentSnapshotId, DocumentSnapshot } from './FirebaseBuiltins'
import { generateSalt } from '../utils/generateSalt'
import { fromSnapshot, fromSerialized } from '../utils/converters'
import { ReplaceWithTimestamp, ReplaceWithString } from '../utils/typeUtils'

/**
 * Complete Event type with all fields
 * This is the main type for application logic
 */
export interface Event {
  id: DocumentSnapshotId
  name: string
  teamId: DocumentSnapshotId | null
  deletedAt: Date | null
  archivedAt: Date | null
  logo: string
  salt: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Fields added by the system (from snapshot metadata)
 */
type EventSystemFields = 'id' | 'createdAt' | 'updatedAt'

/**
 * Raw Firestore data structure for an Event document
 * Contains Firestore Timestamp objects, no id/createdAt/updatedAt
 */
export type EventFirestore = ReplaceWithTimestamp<Omit<Event, EventSystemFields>>

/**
 * Serialized Event for API/network transmission
 * Contains ISO date strings and includes id/createdAt/updatedAt
 */
export type EventSerialized = ReplaceWithString<Event>

/**
 * Note: Firestore doesn't support the value `undefined`, so we need to omit these keys instead.
 * Returns defaults with Date objects (not Firestore timestamps)
 */
export const getEventDefaults = (): Omit<Event, EventSystemFields> => ({
  name: '',
  teamId: null,
  deletedAt: null,
  archivedAt: null,
  logo: '',
  salt: generateSalt(16),
})

/**
 * Event-specific converter from Firestore snapshot
 */
export function eventFromSnapshot (snapshot: DocumentSnapshot): Event {
  return fromSnapshot<EventFirestore, Event>(snapshot, {
    dateFields: ['deletedAt', 'archivedAt'],
  })
}

/**
 * Event-specific converter from serialized data
 */
export function eventFromSerialized (serialized: EventSerialized): Event {
  return fromSerialized<EventSerialized, Event>(serialized, {
    dateFields: ['deletedAt', 'archivedAt', 'createdAt', 'updatedAt'],
  })
}
