import { DocumentSnapshotId, FirestoreTimestamp } from './FirebaseBuiltins'
import { RundownCue } from './Cue'
import { parse } from 'date-fns'
import { CUE_BACKGROUND_COLORS } from '@rundown-studio/consts'
import { nanoid } from 'nanoid'

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
  timezone: string | null
  logo: string | null
  settings: {
    outputConfig?: string
    cueBackgroundColours?: string[]
    currentCueHighlightColor?: string
    todDisplayFormat?: '12hNoAmPm' | '12h' | '24h' | null
  }
  deletedAt: FirestoreTimestamp | Date | null
  archivedAt: FirestoreTimestamp | Date | null
}

export interface Rundown extends RundownSnapshot {
  id: DocumentSnapshotId
  createdAt: Date
  updatedAt: Date
}

/**
 * Note: Firestore doesn't support the value `undefined`, so we need to omit these keys instead.
 */
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
  salt: nanoid(16),
  status: RundownStatus.DRAFT,
  timezone: null,
  logo: '',
  settings: {
    outputConfig: '',
    cueBackgroundColours: CUE_BACKGROUND_COLORS,
    currentCueHighlightColor: '',
    todDisplayFormat: null,
  },
  deletedAt: null,
  archivedAt: null,
})
