import type { DocumentSnapshot } from '../types/FirebaseBuiltins'

/**
 * Configuration for converting from Firestore snapshot
 */
export interface FromSnapshotConfig {
  dateFields?: string[]
  defaults?: Record<string, any>
}

/**
 * Configuration for converting from serialized data
 */
export interface FromSerializedConfig {
  dateFields?: string[]
}

/**
 * Generic converter from Firestore DocumentSnapshot to entity with Dates
 * - Adds id, createdAt, updatedAt from snapshot metadata
 * - Converts FirestoreTimestamp fields to Date objects
 * - Applies defaults if provided
 */
export function fromSnapshot<TFirestore, TEntity> (
  snapshot: DocumentSnapshot,
  config: FromSnapshotConfig = {},
): TEntity {
  const data = snapshot.data() as TFirestore | undefined
  if (!data) {
    throw new Error('Snapshot data is undefined')
  }

  const result: any = {
    ...config.defaults,
    ...data,
    id: snapshot.id,
    createdAt: snapshot.createTime ? snapshot.createTime.toDate() : new Date(),
    updatedAt: snapshot.updateTime ? snapshot.updateTime.toDate() : new Date(),
  }

  // Convert date fields from FirestoreTimestamp to Date
  if (config.dateFields) {
    for (const field of config.dateFields) {
      const value = result[field]
      if (value && typeof value === 'object' && 'toDate' in value) {
        result[field] = value.toDate()
      } else if (value === null || value === undefined) {
        result[field] = null
      }
    }
  }

  return result as TEntity
}

/**
 * Generic converter from serialized data to entity with Dates
 * - Converts ISO string fields to Date objects
 */
export function fromSerialized<TSerialized extends Record<string, any>, TEntity> (
  serialized: TSerialized,
  config: FromSerializedConfig = {},
): TEntity {
  const result: any = { ...serialized }

  // Convert date fields from ISO strings to Date
  if (config.dateFields) {
    for (const field of config.dateFields) {
      const value = result[field]
      if (typeof value === 'string') {
        const parsed = new Date(value)
        result[field] = isNaN(parsed.getTime()) ? null : parsed
      } else if (value === null || value === undefined) {
        result[field] = null
      }
    }
  }

  return result as TEntity
}
