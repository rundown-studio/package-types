import { DocumentSnapshotId, FirestoreTimestamp } from './FirebaseBuiltins'
import { RundownCue } from './Cue'
import { randomBytes } from 'crypto'
import { parse } from 'date-fns'

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
  endTime: FirestoreTimestamp | Date | null // OBSOLETE
  startCueId: RundownCue['id'] | null
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

export const getRundownDefaults = (): RundownSnapshot => ({
  name: '',
  teamId: null,
  eventId: null,
  runnerId: null,
  columns: [],
  cues: [],
  startTime: parse('09:00:00', 'HH:mm:ss', new Date()),
  endTime: null,
  startCueId: null,
  salt: randomBytes(16).toString('hex'),
  status: RundownStatus.DRAFT,
  timezone: undefined,
  deletedAt: null,
})
