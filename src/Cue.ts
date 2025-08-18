import type { DocumentSnapshotId } from './FirebaseBuiltins'

export enum CueType {
  CUE = 'cue',
  HEADING = 'heading',
  GROUP = 'group',
}

export enum CueStartMode {
  FLEXIBLE = 'flexible',
  FIXED = 'fixed',
}

export interface RundownCueSettings {
  hideOnPdf: boolean
  hideOnCsv: boolean
  preventEdits: boolean
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
  locked: boolean // LEGACY kept for backward compatibility, moved to settings.preventEdits
  scheduled: boolean // If scheduled to auto-start
  deletedAt: Date | null
  settings?: RundownCueSettings
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
  deletedAt: null,
  settings: {
    hideOnPdf: false,
    hideOnCsv: false,
    preventEdits: false,
  },
})
