import { createClient } from '@/lib/supabase/server'
import { dodo } from '@/lib/dodo'

// Cancels the subscription at the end of the current billing period
export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'İcazəsiz giriş' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('dodo_subscription_id')
      .eq('id', user.id)
      .single()

    if (!profile?.dodo_subscription_id) {
      return Response.json({ error: 'Aktiv abunəlik tapılmadı' }, { status: 404 })
    }

    // cancel_at_next_billing_date: true — user keeps access until period ends
    await dodo.subscriptions.update(profile.dodo_subscription_id, {
      cancel_at_next_billing_date: true,
    })

    return Response.json({ success: true })
  } catch (err) {
    console.error('Dodo portal error:', err)
    return Response.json({ error: 'Abunəlik ləğvi zamanı xəta baş verdi' }, { status: 500 })
  }
}
