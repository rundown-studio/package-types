/**
 * Pub/Sub trigger wire contract.
 *
 * The envelope — its shape *and* the set of valid routes — is the contract
 * between every publisher and the single `onPubSubTrigger` consumer, so it lives
 * here. The one route that crosses codebases (USER_CREATED, published by the
 * Gen 1 `functions-gen1` adapter) brings its payload along too.
 *
 * What does NOT belong here: the route-specific payload types
 * (SendEmailMessage, AirtableMessage, TrackDataMessage) and their internal enums
 * (EmailTemplate, EmailStream). Those are handler implementation detail, owned by
 * the `functions` codebase, not part of the wire contract.
 */

/**
 * The single Pub/Sub topic that fans every background-function job into the
 * `onPubSubTrigger` consumer. The envelope's `route` selects the handler.
 */
export const PUBSUB_TRIGGER_TOPIC = 'PUBSUB_TRIGGER'

/**
 * The valid job routes carried in a {@link TriggerEnvelope}. The consumer maps
 * each route to a handler. Most are published and consumed inside `functions`;
 * USER_CREATED is published by the Gen 1 `functions-gen1` adapter (Node 22 —
 * Auth triggers are Gen 1-only and can't run Node 24) and consumed in `functions`.
 */
export enum TriggerRoute {
  EMAIL_SEND = 'email/send',
  TRACK_DATA = 'track/data',
  AIRTABLE_CREATE = 'airtable/create',
  AIRTABLE_UPDATE = 'airtable/update',
  AIRTABLE_COMMENT = 'airtable/comment',
  USER_CREATED = 'user/created',
}

/**
 * Envelope for every message published to {@link PUBSUB_TRIGGER_TOPIC}.
 * `route` selects the consumer-side handler; `payload` is the route-specific
 * body, typed at the call site.
 */
export interface TriggerEnvelope<P = unknown> {
  route: TriggerRoute
  payload: P
}

/**
 * Payload for {@link TriggerRoute.USER_CREATED}. The one envelope payload that
 * genuinely travels between codebases (functions-gen1 → functions), so it lives
 * here with the contract.
 */
export interface UserCreatedMessage {
  uid: string
  email: string | null
  provider?: string
}
