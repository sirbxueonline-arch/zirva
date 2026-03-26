import DodoPayments from 'dodopayments'

// Lazy singleton — only instantiated at request time, not during build
let _dodo: DodoPayments | null = null

export function getDodo(): DodoPayments {
  if (!_dodo) {
    _dodo = new DodoPayments({
      bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
      environment: (process.env.DODO_PAYMENTS_ENVIRONMENT ?? 'test_mode') as 'test_mode' | 'live_mode',
      webhookKey:  process.env.DODO_PAYMENTS_WEBHOOK_KEY,
    })
  }
  return _dodo
}

// Keep a convenience alias for callers that use `dodo.x`
export const dodo = new Proxy({} as DodoPayments, {
  get(_target, prop) {
    return (getDodo() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

// product_id lookup by plan + billing period
export const PLAN_PRODUCT_IDS: Record<string, Record<string, string>> = {
  pro: {
    monthly:   process.env.DODO_PRO_PRODUCT_ID!,
    quarterly: process.env.DODO_PRO_QUARTERLY_PRODUCT_ID!,
    yearly:    process.env.DODO_PRO_YEARLY_PRODUCT_ID!,
  },
  agency: {
    monthly:   process.env.DODO_AGENCY_PRODUCT_ID!,
    quarterly: process.env.DODO_AGENCY_QUARTERLY_PRODUCT_ID!,
    yearly:    process.env.DODO_AGENCY_YEARLY_PRODUCT_ID!,
  },
}

export const PLAN_LIMITS: Record<string, number> = {
  free:   5,
  pro:    50,
  agency: 300,
}
