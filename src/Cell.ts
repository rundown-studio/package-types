import type { DocumentSnapshotId, DocumentSnapshot } from './FirebaseBuiltins'
import { fromSnapshot, fromSerialized } from './converters'
import { ReplaceWithString } from './typeUtils'
import { REQUIRED } from './useDefaults'

/**
 * Complete Cell type with all fields
 * This is the main type for application logic
 */
export interface Cell {
  id: DocumentSnapshotId
  cueId: DocumentSnapshotId
  columnId: DocumentSnapshotId
  content: any
  createdAt: Date
  updatedAt: Date
}

/**
 * Fields added by the system (from snapshot metadata)
 */
type CellSystemFields = 'id' | 'createdAt' | 'updatedAt'

/**
 * Raw Firestore data structure for a Cell document
 * No date fields to transform, just omits system fields
 */
export type CellFirestore = Omit<Cell, CellSystemFields>

/**
 * Serialized Cell for API/network transmission
 * Contains ISO date strings and includes id/createdAt/updatedAt
 */
export type CellSerialized = ReplaceWithString<Cell>

/**
 * @deprecated Use Cell instead
 */
export type RundownCell = Cell

/**
 * @deprecated Use CellFirestore instead
 */
export type RundownCellSnapshot = CellFirestore

/**
 * Note: Firestore doesn't support the value `undefined`, so we need to omit these keys instead.
 */
export const getCellDefaults = (): Omit<Cell, CellSystemFields> => ({
  cueId: REQUIRED,
  columnId: REQUIRED,
  content: {},
})

/**
 * Cell-specific converter from Firestore snapshot
 */
export function cellFromSnapshot (snapshot: DocumentSnapshot): Cell {
  return fromSnapshot<CellFirestore, Cell>(snapshot, {
    // No date fields to convert for Cell
    dateFields: [],
  })
}

/**
 * Cell-specific converter from serialized data
 */
export function cellFromSerialized (serialized: CellSerialized): Cell {
  return fromSerialized<CellSerialized, Cell>(serialized, {
    // Only system dates need conversion
    dateFields: ['createdAt', 'updatedAt'],
  })
}
