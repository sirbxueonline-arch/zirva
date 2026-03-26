import { createServerClient } from '@supabase/ssr'
import { dodo, PLAN_PRODUCT_IDS, PLAN_LIMITS } from '@/lib/dodo'
import { BRAND_LIMITS } from '@/types'

// Service-role client bypasses RLS for billing updates
function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

function getPlanFromProductId(productId: string): 'pro' | 'agency' | 'free' {
  if (productId === PLAN_PRODUCT_IDS.pro)    return 'pro'
  if (productId === PLAN_PRODUCT_IDS.agency) return 'agency'
  return 'free'
}

// Next.js App Router — req.text() gives the raw body needed for HMAC verification
export async function POST(req: Request) {
  const body = await req.text()

  const headers = {
    'webhook-id':        req.headers.get('webhook-id')        ?? '',
    'webhook-signature': req.headers.get('webhook-signature') ?? '',
    'webhook-timestamp': req.headers.get('webhook-timestamp') ?? '',
  }

  let event: ReturnType<typeof dodo.webhooks.unwrap>
  try {
    event = dodo.webhooks.unwrap(body, { headers })
  } catch {
    return Response.json({ error: 'Webhook imza xətası' }, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    const data = event.data as unknown as Record<string, unknown>

    switch (event.type) {

      // ── Subscription activated (first payment succeeded) ──────────────────
      case 'subscription.active': {
        const userId = (data.metadata as Record<string, string>)?.user_id
        if (!userId) break

        const productId = data.product_id as string
        const plan      = getPlanFromProductId(productId)

        await supabase
          .from('profiles')
          .update({
            plan,
            generations_limit:    PLAN_LIMITS[plan],
            brands_limit:         BRAND_LIMITS[plan],
            dodo_customer_id:     data.customer_id     as string,
            dodo_subscription_id: data.subscription_id as string,
            subscription_status:  'active',
            current_period_end:   (data.next_billing_date as string) ?? null,
            updated_at:           new Date().toISOString(),
          })
          .eq('id', userId)
        break
      }

      // ── Subscription renewed (recurring billing succeeded) ────────────────
      case 'subscription.renewed': {
        const subId = data.subscription_id as string

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('dodo_subscription_id', subId)
          .single()

        if (!profile) break

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'active',
            current_period_end:  (data.next_billing_date as string) ?? null,
            generations_used:    0,                    // reset monthly usage on renewal
            updated_at:          new Date().toISOString(),
          })
          .eq('id', profile.id)
        break
      }

      // ── Subscription cancelled or expired — downgrade to free ─────────────
      case 'subscription.cancelled':
      case 'subscription.expired': {
        const subId = data.subscription_id as string

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('dodo_subscription_id', subId)
          .single()

        if (!profile) break

        await supabase
          .from('profiles')
          .update({
            plan:                 'free',
            generations_limit:    PLAN_LIMITS.free,
            brands_limit:         BRAND_LIMITS.free,
            dodo_subscription_id: null,
            subscription_status:  'cancelled',
            current_period_end:   null,
            updated_at:           new Date().toISOString(),
          })
          .eq('id', profile.id)
        break
      }

      // ── Payment failed — mark on_hold but keep plan until expiry ──────────
      case 'subscription.on_hold': {
        const subId = data.subscription_id as string

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('dodo_subscription_id', subId)
          .single()

        if (!profile) break

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'on_hold',
            updated_at:          new Date().toISOString(),
          })
          .eq('id', profile.id)
        break
      }
    }

    return Response.json({ received: true })
  } catch (err) {
    console.error('Dodo webhook handler error:', err)
    return Response.json({ error: 'Webhook emal xətası' }, { status: 500 })
  }
}
