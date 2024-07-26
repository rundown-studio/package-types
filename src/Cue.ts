import { DocumentSnapshotId } from './FirebaseBuiltins'

export enum CueType {
  CUE = 'cue',
  HEADING = 'heading',
}

export enum CueStartMode {
  FLEXIBLE = 'flexible',
  LOCKED = 'locked',
}

export enum CueEditing {
  ALL = 'all',
  NONE = 'none',
}

export type RundownCueSnapshot = {
  type: CueType
  title: string
  subtitle: string
  startTime: Date | null
  startMode: CueStartMode
  duration: number
  backgroundColor: string | null
  editing: CueEditing // previously 'locked: boolean'
}

export type RundownCue = RundownCueSnapshot & {
  id: DocumentSnapshotId
  createdAt: Date
  updatedAt: Date
}
