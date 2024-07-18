import { DocumentSnapshotId } from './FirebaseBuiltins'

export enum UserRole {
  TEAM_ADMIN = 'team_admin',
  TEAM_BILLING = 'team_billing',
  TEAM_MEMBER = 'team_member',
}

export type TeamMember = {
  role: UserRole
  createdAt: Date
}

export type TeamSnapshot = {
  name: string
  members: {
    [uid: string]: TeamMember
  }
  pending: {
    [email: string]: TeamMember
  }
  apiToken?: string | null
}

export type Team = TeamSnapshot & {
  id: DocumentSnapshotId
  createdAt: Date
  updatedAt: Date
}
