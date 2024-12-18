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

// TODO: use instead of 'locked: boolean'
// export enum CueEditing {
//   ALL = 'all',
//   NONE = 'none',
// }

export interface RundownCueSnapshot {
  type: CueType
  title: string
  subtitle: string
  startTime?: Date | null // Essentially ignored for first cue, taken from rundown.startTime
  startMode?: CueStartMode // Essentially ignored for first cue
  duration: number
  backgroundColor: string | null
  locked: boolean // TODO: refactor to `editing: CueEditing`
  // editing: CueEditing
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
  duration: 0, // 0 seconds
  backgroundColor: '',
  locked: false,
})
