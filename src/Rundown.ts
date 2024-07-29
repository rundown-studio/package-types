import { DocumentSnapshotId, FirestoreTimestamp } from './FirebaseBuiltins'

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

export interface RundownSnapshot {
  name: string
  teamId: DocumentSnapshotId | null
  eventId: DocumentSnapshotId | null
  runnerId: DocumentSnapshotId | null
  columns: DocumentSnapshotId[] // order of columns
  cues: RundownCueOrderItem[] // order of cues
  startTime: FirestoreTimestamp | Date
  endTime: FirestoreTimestamp | Date
  salt: string
  status: RundownStatus
  timezone?: string
  deletedAt: FirestoreTimestamp | Date | null
}

export interface Rundown extends RundownSnapshot {
  id: DocumentSnapshotId
  createdAt: Date
  updatedAt: Date
}
