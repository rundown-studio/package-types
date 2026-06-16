/**
 * Public wire shapes for the v1 API control plane (status + countdown).
 *
 * These are the canonical TypeScript shapes shared by every v1 control
 * surface: the Functions REST endpoints (`GET …/status`, `…/countdown`, the
 * `action:<verb>` responses) and the compute-engine realtime read surface
 * (the `status` SSE event and its `…/status`/`…/countdown` polls). Functions
 * owns a parallel set of Zod schemas (single source of truth for validation +
 * OpenAPI docs) and asserts they stay structurally identical to these types —
 * so the documented shape and the realtime shape can never drift.
 *
 * Named `ApiV1*` (matching `ApiV0*`): these are version-scoped wire contracts,
 * not internal/canonical types. Field names are snake_case on purpose — the v1
 * API is agent-first and the wire is the contract; don't camelCase these when
 * projecting.
 */

/**
 * The three-state control machine.
 * - `running` — the countdown is live and ticking against `server_time`.
 * - `paused`  — the clock is frozen at `paused_at`.
 * - `stopped` — pre-show (nothing started) or post-show (the rundown ended).
 */
export type ApiV1ControlState = 'running' | 'paused' | 'stopped'

/**
 * The currently-active cue. Populated when `state` is `running` or `paused`;
 * null when `stopped`. `paused_at` is null while running.
 */
export interface ApiV1ActiveCue {
  id: string
  title: string
  started_at: number
  paused_at: number | null
  duration_ms: number
}

/**
 * The next cue the show will advance to. While `stopped` (pre-show) this is the
 * first playable cue; null when there are no remaining playable cues.
 */
export interface ApiV1NextCue {
  id: string
  title: string
}

/**
 * Public control-plane status — the shape returned by `GET …/status`, every
 * control action's `data`, and the realtime `status` event. `server_time` is
 * the anchor for client-side countdown math.
 */
export interface ApiV1Status {
  server_time: number
  state: ApiV1ControlState
  active_cue: ApiV1ActiveCue | null
  next_cue: ApiV1NextCue | null
}

/**
 * Pre-formatted countdown components — the `remaining` block of a countdown
 * active cue. Components are absolute values, ceil-rounded to the whole second
 * (a 999ms countdown shows `seconds: 1`); the sign lives in `is_overtime` +
 * `prefix`, and `formatted` already includes the prefix.
 */
export interface ApiV1CountdownParts {
  is_overtime: boolean
  prefix: string
  days: number
  hours: number
  minutes: number
  seconds: number
  formatted: string
}

/**
 * Active-cue countdown payload. Populated when state is `running` or `paused`;
 * null when `stopped`. `remaining_ms` is the raw signed value — negative is
 * overtime; consumers clamp at 0 if they want to hide it.
 */
export interface ApiV1CountdownActiveCue {
  cue_id: string
  title: string
  duration_ms: number
  remaining_ms: number
  remaining: ApiV1CountdownParts
}

/**
 * Public countdown — the server-computed cousin of `ApiV1Status` for clients
 * that don't want to do clock math. `GET …/countdown` returns this shape.
 */
export interface ApiV1Countdown {
  state: ApiV1ControlState
  server_time: number
  active_cue: ApiV1CountdownActiveCue | null
}
