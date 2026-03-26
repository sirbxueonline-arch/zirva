import { createClient } from '@/lib/supabase/server'
import { dodo, PLAN_PRODUCT_IDS } from '@/lib/dodo'
import { z } from 'zod'

const schema = z.object({
  plan:   z.enum(['pro', 'agency']),
  period: z.enum(['monthly', 'quarterly', 'yearly']).default('monthly'),
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'İcazəsiz giriş' }, { status: 401 })

    const { plan, period } = schema.parse(await req.json())

    const productId = PLAN_PRODUCT_IDS[plan]?.[period]
    if (!productId) return Response.json({ error: 'Bu plan üçün ödəniş məhsulu tapılmadı' }, { status: 400 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name, dodo_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile) return Response.json({ error: 'Profil tapılmadı' }, { status: 404 })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await dodo.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: profile.dodo_customer_id
        ? { customer_id: profile.dodo_customer_id }
        : { email: profile.email, name: profile.full_name ?? profile.email },
      return_url: `${appUrl}/dashboard?upgraded=true`,
      cancel_url: `${appUrl}/settings/billing`,
      metadata:   { user_id: user.id, plan, period },
    })

    return Response.json({ url: session.checkout_url })
  } catch (err) {
    console.error('Dodo checkout error:', err)
    return Response.json({ error: 'Ödəniş yaradılarkən xəta baş verdi' }, { status: 500 })
  }
}
