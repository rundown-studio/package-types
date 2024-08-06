import { DocumentSnapshotId } from './FirebaseBuiltins'
import { REQUIRED } from './useDefaults'

export interface RundownCellSnapshot {
  cueId: DocumentSnapshotId
  columnId: DocumentSnapshotId
  content: any
}

export interface RundownCell extends RundownCellSnapshot {
  id: DocumentSnapshotId
  createdAt: Date
  updatedAt: Date
}

export const getCellDefaults = (): RundownCellSnapshot => ({
  cueId: REQUIRED,
  columnId: REQUIRED,
  content: {},
})
