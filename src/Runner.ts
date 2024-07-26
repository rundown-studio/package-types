import { RundownCue } from './Cue'
import { Rundown } from './Rundown'
import { DocumentSnapshotId } from './FirebaseBuiltins'

/**
 * The timesnap contains all the information to derive the current countdown status.
 */
export type RunnerTimesnap = {
  cueId: RundownCue['id'] | null
  running: boolean
  kickoff: number
  lastStop: number
  deadline: number
}

/**
 * The runner remembers these basic information about all the cues to identify changes and delays.
 */
export type RunnerCue = {
  id: RundownCue['id']
  duration: number
  startTime: Date
}

export type RunnerSnapshot = {
  rundownId: Rundown['id']
  timesnap: RunnerTimesnap
  nextCueId: RundownCue['id'] | null
  elapsedCues: Record<RundownCue['id'], RunnerCue>
  originalCues: Record<RundownCue['id'], RunnerCue>
  log: string[]
}

export type Runner = RunnerSnapshot & {
  id?: DocumentSnapshotId
  createdAt?: Date
  updatedAt?: Date
}
