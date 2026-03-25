import DodoPayments from 'dodopayments'

export const dodo = new DodoPayments({
  bearerToken:  process.env.DODO_PAYMENTS_API_KEY!,
  environment:  (process.env.DODO_PAYMENTS_ENVIRONMENT ?? 'test_mode') as 'test_mode' | 'live_mode',
  webhookKey:   process.env.DODO_PAYMENTS_WEBHOOK_KEY,
})

export const PLAN_PRODUCT_IDS: Record<string, string> = {
  pro:    process.env.DODO_PRO_PRODUCT_ID!,
  agency: process.env.DODO_AGENCY_PRODUCT_ID!,
}

export const PLAN_LIMITS: Record<string, number> = {
  free:   5,
  pro:    50,
  agency: 999999, // unlimited — shown as ∞ in UI
}
