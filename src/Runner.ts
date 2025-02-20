import { RundownCue, CueStartMode } from './Cue'
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
export interface RunnerOriginalCue {
  startTime?: string | null // ISO 8601 date
  startMode?: CueStartMode
  duration: number
}

export interface RunnerElapsedCue {
  startTime: string // ISO 8601 date
  duration: number
}

export interface RunnerSnapshot {
  rundownId: Rundown['id']
  timesnap: RunnerTimesnap
  nextCueId: RundownCue['id'] | null
  originalCues: Record<RundownCue['id'], RunnerOriginalCue>
  elapsedCues: Record<RundownCue['id'], RunnerElapsedCue>
  log: string[]
}

export interface Runner extends RunnerSnapshot {
  id?: DocumentSnapshotId
  createdAt?: Date
  updatedAt?: Date
}

export enum RunnerState {
  PRESHOW = 'PRESHOW',
  ONAIR = 'ONAIR',
  ENDED = 'ENDED',
}

export const getRunnerDefaults = (): Runner => {
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
