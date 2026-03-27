import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUrl } from '@/lib/gsc'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Require a saved URL before allowing GSC connection
  const { data: profile } = await supabase.from('profiles').select('autopilot_url').eq('id', user.id).single()
  if (!profile?.autopilot_url) {
    return NextResponse.redirect(new URL('/autopilot?gsc=no-url', process.env.NEXT_PUBLIC_APP_URL!))
  }

  const url = getAuthUrl(user.id)
  return NextResponse.redirect(url)
}
