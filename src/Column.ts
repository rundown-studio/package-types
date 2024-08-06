import { DocumentSnapshotId } from './FirebaseBuiltins'

export type ColumnType = 'richtext' | 'select' | 'images' | 'attachments'

export interface RundownColumnSnapshot {
  type: ColumnType
  name: string
  width?: number
}

export interface RundownColumn extends RundownColumnSnapshot {
  id: DocumentSnapshotId
  createdAt: Date
  updatedAt: Date
}

export const getColumnDefaults = (): RundownColumnSnapshot => ({
  type: 'richtext',
  name: '',
})
