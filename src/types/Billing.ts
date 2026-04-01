//
// Branded IDs
//

export type SubscriptionId = string
export type TransactionId = string

//
// Enums
//

export enum PlanNames {
  SPARK = 'Spark', // Legacy
  EVENT = 'Event', // Legacy
  APEX = 'Apex', // Legacy
  ELEVATE = 'Elevate', // Legacy
  STUDIO_FREE = 'Studio Free',
  STUDIO_SOLO = 'Studio Solo',
  STUDIO_TEAM = 'Studio Team',
  STUDIO_UNLIMITED = 'Studio Unlimited',
}

export enum Features {
  BASIC = 'BASIC', // Basic paid plan features
  IMPORT = 'IMPORT', // Import CSV
  EXPORT = 'EXPORT', // Export CSV and PDFs
  GUEST_EDIT = 'GUEST_EDIT', // Guests can edit rundown and/or columns
}

//
// Plan (computed/derived type, not a Firestore document)
//

export interface Plan {
  name: PlanNames
  imageUrl: string
  limits: {
    members: number
    columns: number
    cues: number
    events: number
    rundowns: number
  }
  features: Features[]
  scheduledChange: {
    action: string
    effective_at: Date
    resume_at: Date | null
  } | null
  billingCycle: {
    interval: 'day' | 'week' | 'month' | 'year' | 'once'
    frequency: number
    endsAt: Date | null
    daysActive: number
  } | null
  subId: SubscriptionId | null
  txnId: TransactionId | null
  trialing: boolean
}

export const getPlanDefaults = (): Plan => ({
  name: PlanNames.STUDIO_FREE,
  imageUrl: 'https://firebasestorage.googleapis.com/v0/b/rundown-studio-46e96.appspot.com/o/paddle%2Fplan-studio-free.png?alt=media&token=1b5018d3-f43b-41f4-a568-0663bb0edfec',
  limits: {
    members: 1,
    columns: 3,
    cues: 25,
    events: 1,
    rundowns: 2,
  },
  features: [Features.IMPORT],
  scheduledChange: null,
  billingCycle: null,
  subId: null,
  txnId: null,
  trialing: false,
})

//
// Paddle types (stored as-is from the Paddle API, string dates)
//

export interface PaddleProduct {
  id: string
  name: PlanNames
  description: string | null
  tax_category: 'digital-goods' | 'saas'
  image_url: string | null
  status: 'active' | 'archived'
  created_at: string
  prices?: PaddlePrice[]
  custom_data?: object | null
  type: 'BASE' | 'MEMBER'
  days_active?: string
  members_incl?: string
  features: string
}

export interface PaddlePrice {
  id: string
  product_id: PaddleProduct['id']
  description: string
  billing_cycle: object | null
  trial_period: object | null
  tax_mode: string
  unit_price: object
  unit_price_overrides: object[]
  quantity: object
  status: string
  custom_data: object | null
  product?: PaddleProduct
}

export interface PaddleItem {
  quantity: number
  price: PaddlePrice
}

export interface PaddleSubscription {
  id: string
  status: 'active' | 'canceled' | 'past_due' | 'paused' | 'trialing'
  items: PaddleItem[]
  customer_id: string
  address_id: string
  business_id: string | null
  currency_code: string
  created_at: string
  updated_at: string
  started_at: string | null
  first_billed_at: string | null
  next_billed_at: string | null
  paused_at: string | null
  canceled_at: string | null
  discount: object | null
  collection_mode: string
  billing_details: object | null
  current_billing_period: {
    starts_at: string
    ends_at: string
  } | null
  billing_cycle: {
    interval: 'day' | 'week' | 'month' | 'year'
    frequency: number
  }
  scheduled_change: object | null
  custom_data?: object | null
  teamId: string
  uid: string
  members_incl?: string
}

export interface PaddleTransaction {
  id: string
  status: 'draft' | 'ready' | 'billed' | 'paid' | 'completed' | 'canceled' | 'past_due'
  items: PaddleItem[]
  address_id: string | null
  business_id: string | null
  customer_id: string | null
  currency_code: string
  origin: string
  invoice_id: string | null
  invoice_number: string | null
  collection_mode: string
  discount_id: string | null
  billing_details: any | null
  billing_period: any | null
  details: {
    tax_rates_used: any[]
    totals: any
    adjusted_totals: any
    payout_totals: any | null
    adjusted_payout_totals: any | null
    line_items: any[]
  }
  payments: any[]
  checkout: any | null
  created_at: string
  updated_at: string
  billed_at: string | null
  subscription_id: string | null
  custom_data?: any | null
  teamId: string
  uid: string
  members_incl?: string
}

export interface PaddleWebhookPayload {
  event_id: string
  event_type: string
  occurred_at: string
  notification_id: string
  data: PaddleSubscription | PaddleTransaction | PaddleProduct
}
