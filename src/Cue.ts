import { DocumentSnapshotId } from './FirebaseBuiltins'

export enum CueType {
  CUE = 'cue',
  HEADING = 'heading',
}

export type RundownCueSnapshot = {
  type: CueType
  title: string
  subtitle: string
  duration: number
  backgroundColor: string
  locked: boolean
}

export type RundownCue = RundownCueSnapshot & {
  id: DocumentSnapshotId
  createdAt: Date
  updatedAt: Date
}
