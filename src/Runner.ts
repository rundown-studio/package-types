import { DocumentSnapshotId } from './FirebaseBuiltins'

export type RunnerSnapshot = {
  rundownId: DocumentSnapshotId
  timesnap: RunnerTimesnap
  nextCueId: DocumentSnapshotId | null
  cuesElapsed: Record<string, number>
  log: string[]
}

export type Runner = RunnerSnapshot & {
  id?: DocumentSnapshotId
  createdAt?: Date
  updatedAt?: Date
}

export type RunnerTimesnap = {
  cueId: DocumentSnapshotId | null
  running: boolean
  kickoff: number
  lastStop: number
  deadline: number
}
