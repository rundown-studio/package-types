import type { FirestoreTimestamp } from '../types/FirebaseBuiltins'

/**
 * Type utility to replace Date fields with FirestoreTimestamp
 */
export type ReplaceWithTimestamp<T> = {
  [K in keyof T]: T[K] extends Date | null
    ? FirestoreTimestamp | (T[K] extends Date ? never : null)
    : T[K] extends Date
      ? FirestoreTimestamp
      : T[K]
}

/**
 * Type utility to replace Date fields with ISO strings
 */
export type ReplaceWithString<T> = {
  [K in keyof T]: T[K] extends Date | null
    ? string | (T[K] extends Date ? never : null)
    : T[K] extends Date
      ? string
      : T[K]
}
