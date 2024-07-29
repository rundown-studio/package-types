import { DocumentSnapshotId } from './FirebaseBuiltins'

export enum UserRole {
  TEAM_ADMIN = 'team_admin',
  TEAM_BILLING = 'team_billing',
  TEAM_MEMBER = 'team_member',
}

export interface TeamMember {
  role: UserRole
  createdAt: Date
}

export interface TeamSnapshot {
  name: string
  members: {
    [uid: string]: TeamMember
  }
  pending: {
    [email: string]: TeamMember
  }
  apiToken?: string | null
}

export interface Team extends TeamSnapshot {
  id: DocumentSnapshotId
  createdAt: Date
  updatedAt: Date
}
