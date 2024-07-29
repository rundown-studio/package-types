import { RundownCue } from './Cue'
import { Rundown } from './Rundown'
import { DocumentSnapshotId } from './FirebaseBuiltins'

/**
 * The timesnap contains all the information to derive the current countdown status.
 */
export interface RunnerTimesnap {
  cueId: RundownCue['id'] | null
  running: boolean
  kickoff: number
  lastStop: number
  deadline: number
}

/**
 * The runner remembers these basic information about all the cues to identify changes and delays.
 */
export interface RunnerCue {
  id?: RundownCue['id']
  duration: number
  startTime: Date
}

export interface RunnerSnapshot {
  rundownId: Rundown['id']
  timesnap: RunnerTimesnap
  nextCueId: RundownCue['id'] | null
  originalCues: Record<RundownCue['id'], RunnerCue>
  elapsedCues: Record<RundownCue['id'], RunnerCue>
  log: string[]
}

export interface Runner extends RunnerSnapshot {
  id?: DocumentSnapshotId
  createdAt?: Date
  updatedAt?: Date
}
