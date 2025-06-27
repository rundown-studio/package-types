import type { DocumentSnapshotId, UserRecordId } from './FirebaseBuiltins'

export type ColumnType = 'richtext' | 'select' | 'images' | 'attachments'

export interface RundownColumnSnapshot {
  name: string
  type: ColumnType

  // The width of a column in pixel
  width?: number

  // Defines if the column is private for a single user (uid) or public (null)
  privateUid?: UserRecordId | null
}

export interface RundownColumn extends RundownColumnSnapshot {
  id: DocumentSnapshotId
  createdAt: Date
  updatedAt: Date
}

export const getColumnDefaults = (): RundownColumnSnapshot => ({
  name: '',
  type: 'richtext',
  privateUid: null,
})
