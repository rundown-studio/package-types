import { DocumentSnapshotId } from './FirebaseBuiltins'

export enum CueType {
  CUE = 'cue',
  HEADING = 'heading',
  GROUP = 'group',
}

export enum CueStartMode {
  FLEXIBLE = 'flexible',
  FIXED = 'fixed',
}

export interface RundownCueSnapshot {
  type: CueType
  title: string
  subtitle: string
  startTime?: Date | null // Essentially ignored for first cue, taken from rundown.startTime
  startMode?: CueStartMode // Essentially ignored for first cue
  startDatePlus?: number
  duration: number
  backgroundColor: string | null
  locked: boolean // TODO: rename to editLocked
  scheduled: boolean // If scheduled to auto-start
}

export interface RundownCue extends RundownCueSnapshot {
  id: DocumentSnapshotId
  createdAt: Date
  updatedAt: Date
}

export const getCueDefaults = (): RundownCueSnapshot => ({
  type: CueType.CUE,
  title: '',
  subtitle: '',
  startTime: null,
  startMode: CueStartMode.FLEXIBLE,
  startDatePlus: 0,
  duration: 0, // 0 seconds
  backgroundColor: '',
  locked: false,
  scheduled: false,
})
