import type { DocumentSnapshotId, UserRecordId, DocumentSnapshot } from './FirebaseBuiltins'
import { fromSnapshot, fromSerialized } from '../utils/converters'
import { ReplaceWithTimestamp, ReplaceWithString } from '../utils/typeUtils'

/**
 * Combined API token scope + permission level. Mirrors how UserRole bundles
 * workspace and access level into one string, but uses short codes so the JWT
 * payload stays compact:
 *
 *   - first char: `t` = team scope, `r` = rundown scope
 *   - second char: `o` = owner, `s` = showcaller, `e` = editor, `v` = viewer
 *
 * Rundown-scoped tokens intentionally have no `owner` variant — destructive
 * operations against a single rundown still flow through team-level owner.
 */
export enum ApiTokenScope {
  TEAM_OWNER = 'to',
  TEAM_SHOWCALLER = 'ts',
  TEAM_EDITOR = 'te',
  TEAM_VIEWER = 'tv',
  RUNDOWN_SHOWCALLER = 'rs',
  RUNDOWN_EDITOR = 're',
  RUNDOWN_VIEWER = 'rv',
}

/** Coarse-grained scope kind — whether the token addresses a team or a single rundown. */
export type ApiTokenScopeKind = 'team' | 'rundown'

export type ApiTokenStatus = 'active' | 'revoked'

/**
 * v1 JWT body. Field names are intentionally short to keep the bearer token
 * length down — the token is sent on every API request.
 *
 *   - `jti`: token id (also the Firestore subcollection doc id)
 *   - `tid`: team id
 *   - `rid`: rundown id, only present for rundown-scoped tokens
 *   - `s`:   ApiTokenScope (combined scope + permission)
 *   - `e`:   scope-epoch for bulk revocation
 *   - `iat` / `exp`: standard JWT claims
 */
export interface ApiTokenJwtPayload {
  jti: string
  tid: string
  rid?: string
  s: ApiTokenScope
  e: number
  iat?: number
  exp?: number
}

/**
 * Complete ApiToken type with all fields. The document id (`jti`) is the JWT's
 * `jti` claim.
 *
 * Note: `scope` collapses scope kind + permission level into one value
 * (mirroring UserRole). Resolving a scope to its kind or RundownPermission
 * bitfield is the application's responsibility, not this package's.
 */
export interface ApiToken {
  id: DocumentSnapshotId
  name: string
  createdBy: UserRecordId
  createdAt: Date
  updatedAt: Date
  lastUsedAt: Date | null
  expiresAt: Date | null
  status: ApiTokenStatus
  scope: ApiTokenScope
  /** Required when the scope is `rundown_*`; null for `team_*` scopes. */
  rundownId: DocumentSnapshotId | null
  /**
   * The signed JWT, persisted at mint time so the dashboard can re-reveal it.
   * Optional: tokens minted before this field existed (and not-yet-backfilled
   * legacy tokens) won't have it.
   *
   * SECRET — this is the bearer credential itself. Never include it in list
   * responses or anywhere the full token set is paged through; expose it only
   * via an explicit, role-gated single-token fetch.
   */
  token?: string
}

type ApiTokenSystemFields = 'id' | 'createdAt' | 'updatedAt'

/** Raw Firestore data structure for an ApiToken document. */
export type ApiTokenFirestore = ReplaceWithTimestamp<Omit<ApiToken, ApiTokenSystemFields>>

/** Serialized ApiToken for API/network transmission. */
export type ApiTokenSerialized = ReplaceWithString<ApiToken>

export const getApiTokenDefaults = (): Omit<ApiToken, ApiTokenSystemFields> => ({
  name: '',
  createdBy: '',
  lastUsedAt: null,
  expiresAt: null,
  status: 'active',
  scope: ApiTokenScope.TEAM_VIEWER,
  rundownId: null,
})

/** ApiToken-specific converter from Firestore snapshot. */
export function apiTokenFromSnapshot (snapshot: DocumentSnapshot): ApiToken {
  return fromSnapshot<ApiTokenFirestore, ApiToken>(snapshot, {
    dateFields: ['lastUsedAt', 'expiresAt'],
  })
}

/** ApiToken-specific converter from serialized data. */
export function apiTokenFromSerialized (serialized: ApiTokenSerialized): ApiToken {
  return fromSerialized<ApiTokenSerialized, ApiToken>(serialized, {
    dateFields: ['createdAt', 'updatedAt', 'lastUsedAt', 'expiresAt'],
  })
}
