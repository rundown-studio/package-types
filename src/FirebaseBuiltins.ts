//
// Firestore
//

export type DocumentSnapshotId = string

export type DocumentSnapshot = {
  id: DocumentSnapshotId
  [key: string]: any
  createTime?: FirestoreTimestamp | undefined
  updateTime?: FirestoreTimestamp | undefined
  exists?: boolean
  ref?: any
}

export type FirestoreTimestamp = {
  nanoseconds: number
  seconds: number
  toDate: () => Date
  toMillis: () => number
  toString: () => string
}

//
// Auth
//

export type UserRecordId = string

export type UserRecord = {
  uid: UserRecordId
  email?: string | null
  emailVerified?: boolean
  displayName?: string | null
  photoURL?: string | null
  phoneNumber?: string | null
  disabled?: boolean
  metadata?: {
    creationTime?: string
    lastSignInTime?: string
  }
  providerData?: Array<{
    uid: string
    displayName?: string | null
    email?: string | null
    phoneNumber?: string | null
    photoURL?: string | null
    providerId: string
  }>
  passwordHash?: string
  passwordSalt?: string
  customClaims?: {
    [key: string]: any
  }
  tokensValidAfterTime?: string
  tenantId?: string | null
}
