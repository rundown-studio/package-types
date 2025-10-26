/**
 * Available scheduler command types.
 */
export enum SchedulerCommandType {
  SCHEDULE_CUE_START = 'SCHEDULE_CUE_START',
  SCHEDULE_CUE_END = 'SCHEDULE_CUE_END',
  CANCEL_BY_CUE_ID = 'CANCEL_BY_CUE_ID',
  CANCEL_BY_RUNDOWN_ID = 'CANCEL_BY_RUNDOWN_ID',
}

/**
 * Unified scheduler command interface with examples.
 *
 * @example Schedule cue start:
 * Use this to schedule hard auto-starts. Will auto-cancel all other CUE_START jobs on the same cue.
 * {
 *   type: 'SCHEDULE_CUE_START',
 *   params: {
 *     time: '2024-12-15T10:00:00Z',
 *     rundownId: 'abc123',
 *     cueId: 'xyz789'
 *   }
 * }
 *
 * @example Schedule cue end:
 * Use this when a cue becomes active, is resumed, or any runner timestamp changes.
 * Will auto-cancel all other CUE_END for this rundown because only one cue can be active at any time.
 * {
 *   type: 'SCHEDULE_CUE_END',
 *   params: {
 *     time: '2024-12-15T10:00:00Z',
 *     rundownId: 'abc123',
 *     cueId: 'xyz789'
 *   }
 * }
 *
 * @example Cancel by cue ID:
 * Use this when the active cue is paused or when a cue is no longer hard auto-start.
 * {
 *   type: 'CANCEL_BY_CUE_ID',
 *   params: {
 *     cueId: 'xyz789'
 *   }
 * }
 *
 * @example Cancel by rundown ID:
 * Use this when deleting a rundown.
 * {
 *   type: 'CANCEL_BY_RUNDOWN_ID',
 *   params: {
 *     rundownId: 'abc123'
 *   }
 * }
 */
export interface SchedulerCommand {
  type: SchedulerCommandType
  params?: {
    time?: string
    rundownId?: string
    cueId?: string
    [key: string]: unknown
  }
}
