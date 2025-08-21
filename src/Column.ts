import type { DocumentSnapshotId, UserRecordId, DocumentSnapshot } from './FirebaseBuiltins'
import { fromSnapshot, fromSerialized } from './converters'
import { ReplaceWithTimestamp, ReplaceWithString } from './typeUtils'

export type ColumnType = 'richtext' | 'select' | 'images' | 'attachments'

/**
 * Complete Column type with all fields
 * This is the main type for application logic
 */
export interface Column {
  id: DocumentSnapshotId
  name: string
  type: ColumnType
  width: number // The width of a column in pixel
  privateUid: UserRecordId | null // Defines if the column is private for a single user (uid) or public (null)
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Fields added by the system (from snapshot metadata)
 */
type ColumnSystemFields = 'id' | 'createdAt' | 'updatedAt'

/**
 * Raw Firestore data structure for a Column document
 * Contains Firestore Timestamp objects, no id/createdAt/updatedAt
 */
export type ColumnFirestore = ReplaceWithTimestamp<Omit<Column, ColumnSystemFields>>

/**
 * Serialized Column for API/network transmission
 * Contains ISO date strings and includes id/createdAt/updatedAt
 */
export type ColumnSerialized = ReplaceWithString<Column>

/**
 * @deprecated Use Column instead
 */
export type RundownColumn = Column

/**
 * @deprecated Use ColumnFirestore instead
 */
export type RundownColumnSnapshot = Omit<Column, ColumnSystemFields>

/**
 * Note: Firestore doesn't support the value `undefined`, so we need to omit these keys instead.
 * Returns defaults with Date objects (not Firestore timestamps)
 */
export const getColumnDefaults = (): Omit<Column, ColumnSystemFields> => ({
  name: '',
  type: 'richtext',
  width: 200, // Default width in pixels
  privateUid: null,
  deletedAt: null,
})

/**
 * Column-specific converter from Firestore snapshot
 */
export function columnFromSnapshot (snapshot: DocumentSnapshot): Column {
  return fromSnapshot<ColumnFirestore, Column>(snapshot, {
    dateFields: ['deletedAt'],
  })
}

/**
 * Column-specific converter from serialized data
 */
export function columnFromSerialized (serialized: ColumnSerialized): Column {
  return fromSerialized<ColumnSerialized, Column>(serialized, {
    dateFields: ['deletedAt', 'createdAt', 'updatedAt'],
  })
}
