import { DocumentSnapshotId, UserRecordId } from './FirebaseBuiltins'

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
    [uid: UserRecordId]: TeamMember
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

export const getTeamDefaults = (): TeamSnapshot => ({
  name: '',
  members: {},
  pending: {},
  apiToken: null,
})

export const getMemberDefaults = (): TeamMember => ({
  role: UserRole.TEAM_MEMBER,
  createdAt: new Date(),
})
