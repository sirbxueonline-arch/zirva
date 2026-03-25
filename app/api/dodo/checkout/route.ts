import { createClient } from '@/lib/supabase/server'
import { dodo, PLAN_PRODUCT_IDS } from '@/lib/dodo'
import { z } from 'zod'

const schema = z.object({ plan: z.enum(['pro', 'agency']) })

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'İcazəsiz giriş' }, { status: 401 })

    const { plan } = schema.parse(await req.json())

    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name, dodo_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile) return Response.json({ error: 'Profil tapılmadı' }, { status: 404 })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await dodo.checkoutSessions.create({
      product_cart: [{ product_id: PLAN_PRODUCT_IDS[plan], quantity: 1 }],
      // Reuse existing customer or create a new one (NewCustomer = { email, name } directly)
      customer: profile.dodo_customer_id
        ? { customer_id: profile.dodo_customer_id }
        : { email: profile.email, name: profile.full_name ?? profile.email },
      return_url: `${appUrl}/dashboard?upgraded=true`,
      cancel_url: `${appUrl}/settings/billing`,
      metadata:   { user_id: user.id, plan },
    })

    return Response.json({ url: session.checkout_url })
  } catch (err) {
    console.error('Dodo checkout error:', err)
    return Response.json({ error: 'Ödəniş yaradılarkən xəta baş verdi' }, { status: 500 })
  }
}
