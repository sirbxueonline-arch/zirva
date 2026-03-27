import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await supabase.from('profiles').update({
    gsc_access_token: null,
    gsc_refresh_token: null,
    gsc_site_url: null,
    gsc_connected_at: null,
    autopilot_enabled: false,
    updated_at: new Date().toISOString(),
  }).eq('id', user.id)

  return NextResponse.json({ ok: true })
}
