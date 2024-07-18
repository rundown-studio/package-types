export type DocumentSnapshotId = string

export type UserRecordId = string

export type FirestoreTimestamp = {
  nanoseconds: number
  seconds: number
  toDate: () => Date
  toMillis: () => number
  toString: () => string
}
