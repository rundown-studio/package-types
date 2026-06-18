import { fromSerialized, fromSnapshot } from '../utils/converters'
import type { ReplaceWithString } from '../utils/typeUtils'
import { REQUIRED } from '../utils/useDefaults'
import type { DocumentSnapshot, DocumentSnapshotId, UserRecordId } from './FirebaseBuiltins'

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
  uid?: UserRecordId
}

export interface CellHistory {
  id: DocumentSnapshotId
  content: any
  uid: UserRecordId | null
  createdAt: Date
}

export type CellHistoryWithUsers = {
  history: CellHistory[]
  users: {
    [uid: string]: {
      displayName: string | undefined
    }
  }
}

/**
 * Fields added by the system (from snapshot metadata)
 *
 * `updatedAt` is intentionally NOT in this set: it is stored as a real
 * document field (set via `serverTimestamp()` on every write) so the
 * optimistic-locking gate can read it client-side, where the web SDK does
 * not expose `snapshot.updateTime`.
 */
type CellSystemFields = 'id' | 'createdAt'

/**
 * Raw Firestore data structure for a Cell document
 * Includes `updatedAt` as a stored field; omits id/createdAt (metadata).
 */
export type CellFirestore = Omit<Cell, CellSystemFields>

/**
 * Serialized Cell for API/network transmission
 * Contains ISO date strings and includes id/createdAt/updatedAt
 */
export type CellSerialized = ReplaceWithString<Cell>

/**
 * Fields added by the system (from snapshot metadata)
 */
type CellHistorySystemFields = 'id' | 'updatedAt'

/**
 * Raw Firestore data structure for a Cell History document
 */
export type CellHistoryFirestore = Omit<CellHistory, CellHistorySystemFields>

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
  // Epoch sentinel for legacy cells without a stored `updatedAt`. Server
  // create/update paths spread `FieldValue.serverTimestamp()` after this,
  // so written cells always carry a real timestamp. The sentinel only
  // surfaces on reads of pre-optimistic-locking cells; the server gate
  // (`CellService.updateCell`) treats a missing stored field as "no
  // precondition violated" so the next PATCH heals the cell.
  updatedAt: new Date(0),
})

/**
 * Cell-specific converter from Firestore snapshot
 */
export function cellFromSnapshot(snapshot: DocumentSnapshot): Cell {
  return fromSnapshot<CellFirestore, Cell>(snapshot, {
    dateFields: ['updatedAt'],
  })
}

/**
 * Cell-specific converter from serialized data
 */
export function cellFromSerialized(serialized: CellSerialized): Cell {
  return fromSerialized<CellSerialized, Cell>(serialized, {
    // Only system dates need conversion
    dateFields: ['createdAt', 'updatedAt'],
  })
}

/**
 * Cell-history-specific converter from Firestore snapshot
 */
export function cellHistoryFromSnapshot(snapshot: DocumentSnapshot): CellHistory {
  return fromSnapshot<CellHistoryFirestore, CellHistory>(snapshot, {
    dateFields: ['createdAt'],
  })
}
