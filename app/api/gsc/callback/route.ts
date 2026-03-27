import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { exchangeCode, listGSCSites } from '@/lib/gsc'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') // user ID

  if (!code || !state) {
    return NextResponse.redirect(new URL('/autopilot?gsc=error', request.url))
  }

  try {
    const supabase = await createClient()
    const { access_token, refresh_token } = await exchangeCode(code)

    // List their GSC sites
    const sites = await listGSCSites(access_token)
    const siteUrl = sites[0] || null

    await supabase.from('profiles').update({
      gsc_access_token: access_token,
      gsc_refresh_token: refresh_token,
      gsc_site_url: siteUrl,
      gsc_connected_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', state)

    return NextResponse.redirect(new URL('/autopilot?gsc=connected', request.url))
  } catch (err) {
    console.error('[GSC callback error]', err)
    const msg = err instanceof Error ? encodeURIComponent(err.message) : 'unknown'
    return NextResponse.redirect(new URL(`/autopilot?gsc=error&msg=${msg}`, request.url))
  }
}
