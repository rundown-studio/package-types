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

import type { TodDisplayFormat } from './Rundown'

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

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * Resource bodies — the fat `rundown`/`cue`/`column`/`cell` projections.
 *
 * The canonical wire shapes for the v1 resource surface, shared by both halves:
 *   - the Functions REST projections (`GET /rundowns/:id`, `…/cues/:id`,
 *     `…/columns/:id`, `…/cells`) — which own a parallel set of Zod schemas
 *     (`Public*` in schemas/rundowns.ts) and pin them structurally against these
 *     types via `_wireConformance`, exactly like `ApiV1Status` above; and
 *   - the compute-engine realtime "fat" SSE event bodies (`cue`/`rundown`/
 *     `column`/`cell` at `:fat` fidelity), projected by the `build*` helpers in
 *     `@rundown-studio/utils`.
 *
 * snake_case on purpose (the wire is the contract). Date-ish fields follow the
 * v1 convention: instants the client does clock math on are epoch ms
 * (`start_time`, `duration_ms`); audit stamps are ISO-8601 strings
 * (`created_at`/`updated_at`).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type ApiV1CueType = 'cue' | 'heading' | 'group'

/**
 * Why a cue is skipped during the show — `null` on `ApiV1Cue` means it runs.
 * `'self'` takes precedence when a cue's own flag AND its group's are both set,
 * which keeps the stored own flag recoverable as `skipped_by === 'self'`.
 */
export type ApiV1SkippedBy = 'self' | 'group'

export type ApiV1RundownStatus = 'imported' | 'draft' | 'awaiting-data' | 'approved' | 'finalized' | 'rejected'

/** Public projection of a column — the `GET /columns/:id` shape, fat `column` event body. */
export interface ApiV1Column {
  id: string
  name: string
  created_at: string | null
  updated_at: string | null
}

/**
 * Public projection of a cell — the `GET …/cells` row shape, fat `cell` event
 * body. Addressed by the `(cue_id, column_id)` coordinate (no public cell id).
 * `content` is plain text (write-time fallback strings); `content_html` is the
 * lossless round-trippable form. Empty/null for an unpopulated coordinate, but
 * the warm state only ever projects an existing changed doc.
 */
export interface ApiV1Cell {
  cue_id: string
  column_id: string
  content: string
  content_html: string
  created_at: string | null
  updated_at: string | null
}

/** Public projection of a cue — the `GET /cues/:id` shape, fat `cue` event body. */
export interface ApiV1Cue {
  id: string
  type: ApiV1CueType
  title: string
  subtitle: string
  duration_ms: number
  background_color: string | null
  prevent_edits: boolean
  skipped_by: ApiV1SkippedBy | null
  start_time: number | null
  created_at: string | null
  updated_at: string | null
}

/** A node of the cue-order tree. `children` (leaves only) is present on groups. */
export interface ApiV1OrderItem {
  id: string
  children?: { id: string }[]
}

/** Public rundown settings — the deliberate subset exposed on the wire. */
export interface ApiV1RundownSettings {
  cue_numbering: { start_from: number; prefix: string; padding: number }
  tod_display_format: TodDisplayFormat | null
}

/** Public shallow projection of a rundown — the `GET /rundowns/:id` shape, fat `rundown` event body. */
export interface ApiV1RundownShallow {
  id: string
  title: string
  timezone: string | null
  start_time: number | null
  end_time: number | null
  status: ApiV1RundownStatus
  settings: ApiV1RundownSettings
  cue_order: ApiV1OrderItem[]
  column_order: string[]
  created_at: string | null
  updated_at: string | null
}

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * Response envelopes — the uniform v1 wire wrapper, success + error.
 *
 * The canonical envelope shapes shared by both halves of the v1 API: the
 * Functions REST surface (`sendSuccess`/`sendRedirect`/`errorMiddleware`) and
 * the compute-engine realtime read surface (`…/status` + `…/countdown` polls,
 * and the problem+json it returns on a bad request/auth/missing rundown). One
 * shape so a poll against CE is byte-compatible with the same poll against
 * Functions. Functions owns the parallel Zod schemas (OpenAPI source of truth:
 * `V1SuccessMetaSchema`, `Problem*`) and pins them structurally against these
 * types via `_wireConformance`, exactly like `ApiV1Status` above.
 *
 * `meta.side_effects` is always `ApiV1SideEffect[]` (the union defined below),
 * matching the Functions Zod `V1SuccessMetaSchema` field-for-field so the
 * conformance pin is exact. Read surfaces (CE + every v1 GET) emit `[]` — the
 * builder bakes the empty array, never a caller — so they never construct a
 * side effect in practice.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** A bare `{ id, title }` cue reference inside a side-effect payload. */
export interface ApiV1SideEffectCueRef {
  id: string
  title: string
}

/** The active cue carried by a `runner.timesnap` side effect. `paused_at` is null while running. */
export interface ApiV1SideEffectTimesnapActiveCue {
  id: string
  title: string
  started_at: number
  paused_at: number | null
  duration_ms: number
}

/** The output-message body carried by an `output_message.changed` side effect. */
export interface ApiV1SideEffectOutputMessage {
  text: string
  visible: boolean
  color: string
  bold: boolean
  underline: boolean
}

/**
 * A single `meta.side_effects` entry — a downstream effect a v1 **write** caused,
 * discriminated on `type`. The vocabulary is shared with the realtime push
 * channel (same names, same payload shapes); `server_time` lives on `meta`, not
 * per entry, and every id is paired with a human-readable name. Read surfaces
 * leave the array empty.
 */
export type ApiV1SideEffect =
  | {
      type: 'runner.timesnap'
      state: ApiV1ControlState
      active_cue: ApiV1SideEffectTimesnapActiveCue | null
      next_cue: ApiV1SideEffectCueRef | null
    }
  | { type: 'runner.active_cue_changed'; active_cue: ApiV1SideEffectCueRef | null }
  | { type: 'runner.next_cue_changed'; next_cue: ApiV1SideEffectCueRef | null }
  | { type: 'runner.retimed'; delta_ms: number }
  | { type: 'rundown.changed'; rundown_id: string; fields: string[] }
  | { type: 'output_message.changed'; message: ApiV1SideEffectOutputMessage }
  | { type: 'column.deleted'; column_id: string; name: string; cell_count: number }

/**
 * Envelope metadata block present on every v1 success response. `request_id`
 * mirrors the `X-Request-Id` header; `server_time` is the response-assembly
 * instant (epoch ms) the body and any snapshot built from it share.
 * `side_effects` is always present (empty on reads; populated on writes).
 */
export interface ApiV1ResponseMeta {
  request_id: string
  server_time: number
  side_effects: ApiV1SideEffect[]
}

/**
 * Uniform v1 success envelope: `{ ok, message, data, included?, meta }`. `data`
 * is the primary resource alone; sideloaded relations (`?include=`) ride in the
 * optional `included` sibling (compound-document pattern), absent when nothing
 * was sideloaded.
 */
export interface ApiV1SuccessEnvelope<T> {
  ok: true
  message: string
  data: T
  included?: Record<string, unknown>
  meta: ApiV1ResponseMeta
}

/**
 * 302 redirect envelope — sets `Location` and restates it as a flat `location`
 * field so a JSON client that doesn't auto-follow still gets the target in-band.
 * No `data`: a redirect carries no resource.
 */
export interface ApiV1RedirectEnvelope {
  ok: true
  message: string
  location: string
  meta: ApiV1ResponseMeta
}

/**
 * RFC 9457 problem+json error body — the uniform v1 error shape across both
 * surfaces (`Content-Type: application/problem+json`). `code` is a stable
 * dot-namespaced error code; `spec_url` + `documentation_url` are discovery
 * pointers present on every error; `details` carries structured, code-specific
 * context when present.
 */
export interface ApiV1Problem {
  type: string
  title: string
  status: number
  code: string
  detail: string
  instance: string
  request_id: string
  server_time: number
  spec_url: string
  documentation_url: string
  details?: Record<string, unknown>
}
