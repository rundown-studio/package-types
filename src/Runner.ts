import type { CueStartMode } from './Cue'
import type { DocumentSnapshotId, DocumentSnapshot } from './FirebaseBuiltins'
import { fromSnapshot, fromSerialized } from './converters'
import { ReplaceWithTimestamp, ReplaceWithString } from './typeUtils'

/**
 * The timesnap contains all the information to derive the current countdown status.
 */
export interface RunnerTimesnap {
  cueId: DocumentSnapshotId | null
  running: boolean
  kickoff: number
  lastStop: number
  deadline: number
}

/**
 * The runner remembers these basic information about all the cues to identify changes and delays.
 */
export interface RunnerOriginalCue {
  startTime: string | null // ISO 8601 date
  startMode: CueStartMode
  duration: number
}

export interface RunnerElapsedCue {
  startTime: string // ISO 8601 date
  duration: number
}

/**
 * Complete Runner type with all fields
 * This is the main type for application logic
 */
export interface Runner {
  id: DocumentSnapshotId
  rundownId: DocumentSnapshotId
  timesnap: RunnerTimesnap
  nextCueId: DocumentSnapshotId | null
  originalCues: Record<DocumentSnapshotId, RunnerOriginalCue>
  elapsedCues: Record<DocumentSnapshotId, RunnerElapsedCue>
  log: string[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Fields added by the system (from snapshot metadata)
 */
type RunnerSystemFields = 'id' | 'createdAt' | 'updatedAt'

/**
 * Raw Firestore data structure for a Runner document
 * Contains Firestore Timestamp objects, no id/createdAt/updatedAt
 */
export type RunnerFirestore = ReplaceWithTimestamp<Omit<Runner, RunnerSystemFields>>

/**
 * Serialized Runner for API/network transmission
 * Contains ISO date strings and includes id/createdAt/updatedAt
 */
export type RunnerSerialized = ReplaceWithString<Runner>

/**
 * @deprecated Use RunnerFirestore instead
 */
export type RunnerSnapshot = Omit<Runner, RunnerSystemFields>

/**
 * PRESHOW - This is the planing phase, the show has not started, the runner is 'null'
 * ONAIR   - The show has started and is currently running
 * ENDED   - The show is over, but we keep the elapsed timing on display for post-show analysis
 */
export enum RunnerState {
  PRESHOW = 'PRESHOW',
  ONAIR = 'ONAIR',
  ENDED = 'ENDED',
}

export const getRunnerDefaults = (): Omit<Runner, RunnerSystemFields> => {
  const now = Date.now()
  return {
    rundownId: '',
    timesnap: {
      cueId: null,
      running: false,
      kickoff: now,
      lastStop: now,
      deadline: now + (10 * 60000),
    },
    nextCueId: null,
    originalCues: {},
    elapsedCues: {},
    log: [],
  }
}

/**
 * Runner-specific converter from Firestore snapshot
 */
export function runnerFromSnapshot (snapshot: DocumentSnapshot): Runner {
  return fromSnapshot<RunnerFirestore, Runner>(snapshot, {
    // Runner has no Date fields, only string dates in nested objects
    dateFields: [],
  })
}

/**
 * Runner-specific converter from serialized data
 */
export function runnerFromSerialized (serialized: RunnerSerialized): Runner {
  return fromSerialized<RunnerSerialized, Runner>(serialized, {
    dateFields: ['createdAt', 'updatedAt'],
  })
}
