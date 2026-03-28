import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
  if (!profile || profile.plan === 'free') {
    return NextResponse.json({ error: 'Upgrade required' }, { status: 403 })
  }

  const body = await request.json()
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body.autopilot_enabled !== undefined) updates.autopilot_enabled = body.autopilot_enabled
  if (body.autopilot_smo_enabled !== undefined) updates.autopilot_smo_enabled = body.autopilot_smo_enabled
  if (body.autopilot_frequency !== undefined) updates.autopilot_frequency = body.autopilot_frequency
  if (body.autopilot_brand_ids !== undefined) updates.autopilot_brand_ids = body.autopilot_brand_ids
  if (body.autopilot_url !== undefined) updates.autopilot_url = body.autopilot_url

  await supabase.from('profiles').update(updates).eq('id', user.id)
  return NextResponse.json({ ok: true })
}
