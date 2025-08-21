import type { DocumentSnapshotId, UserRecordId, DocumentSnapshot } from './FirebaseBuiltins'
import { fromSnapshot, fromSerialized } from '../utils/converters'
import { ReplaceWithTimestamp, ReplaceWithString } from '../utils/typeUtils'

export enum UserRole {
  TEAM_ADMIN = 'team_admin',
  TEAM_BILLING = 'team_billing',
  TEAM_MEMBER = 'team_member',
}

export interface TeamMember {
  role: UserRole
  createdAt: Date
}

/**
 * Complete Team type with all fields
 * This is the main type for application logic
 */
export interface Team {
  id: DocumentSnapshotId
  name: string
  members: {
    [uid: UserRecordId]: TeamMember
  }
  pending: {
    [email: string]: TeamMember
  }
  apiToken?: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Fields added by the system (from snapshot metadata)
 */
type TeamSystemFields = 'id' | 'createdAt' | 'updatedAt'

/**
 * Raw Firestore data structure for a Team document
 * Contains Firestore Timestamp objects, no id/createdAt/updatedAt
 * Note: TeamMember createdAt is also converted to Timestamp
 */
export type TeamFirestore = ReplaceWithTimestamp<Omit<Team, TeamSystemFields>>

/**
 * Serialized Team for API/network transmission
 * Contains ISO date strings and includes id/createdAt/updatedAt
 * Note: TeamMember createdAt is also converted to string
 */
export type TeamSerialized = ReplaceWithString<Team>

/**
 * @deprecated Use TeamFirestore instead
 */
export type TeamSnapshot = Omit<Team, TeamSystemFields>

/**
 * Note: Firestore doesn't support the value `undefined`, so we need to omit these keys instead.
 * Returns defaults with Date objects (not Firestore timestamps)
 */
export const getTeamDefaults = (): Omit<Team, TeamSystemFields> => ({
  name: '',
  members: {},
  pending: {},
  apiToken: null,
})

export const getMemberDefaults = (): TeamMember => ({
  role: UserRole.TEAM_MEMBER,
  createdAt: new Date(),
})

/**
 * Team-specific converter from Firestore snapshot
 * Note: This doesn't handle nested TeamMember dates - those need special handling
 */
export function teamFromSnapshot (snapshot: DocumentSnapshot): Team {
  const team = fromSnapshot<TeamFirestore, Team>(snapshot, {
    // No top-level date fields in Team
    dateFields: [],
  })

  // Convert nested TeamMember dates
  for (const uid in team.members) {
    const member = team.members[uid] as any
    if (member.createdAt && typeof member.createdAt === 'object' && 'toDate' in member.createdAt) {
      team.members[uid] = {
        ...member,
        createdAt: member.createdAt.toDate(),
      }
    }
  }

  for (const email in team.pending) {
    const member = team.pending[email] as any
    if (member.createdAt && typeof member.createdAt === 'object' && 'toDate' in member.createdAt) {
      team.pending[email] = {
        ...member,
        createdAt: member.createdAt.toDate(),
      }
    }
  }

  return team
}

/**
 * Team-specific converter from serialized data
 * Note: This handles nested TeamMember dates
 */
export function teamFromSerialized (serialized: TeamSerialized): Team {
  const team = fromSerialized<TeamSerialized, Team>(serialized, {
    dateFields: ['createdAt', 'updatedAt'],
  })

  // Convert nested TeamMember dates
  for (const uid in team.members) {
    const member = team.members[uid] as any
    if (typeof member.createdAt === 'string') {
      team.members[uid] = {
        ...member,
        createdAt: new Date(member.createdAt),
      }
    }
  }

  for (const email in team.pending) {
    const member = team.pending[email] as any
    if (typeof member.createdAt === 'string') {
      team.pending[email] = {
        ...member,
        createdAt: new Date(member.createdAt),
      }
    }
  }

  return team
}
