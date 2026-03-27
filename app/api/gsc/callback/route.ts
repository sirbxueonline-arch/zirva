import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { exchangeCode, listGSCSites } from '@/lib/gsc'

/** Extracts hostname from a URL or sc-domain: property */
function extractDomain(raw: string): string {
  try {
    if (raw.startsWith('sc-domain:')) return raw.replace('sc-domain:', '').toLowerCase()
    return new URL(raw).hostname.replace(/^www\./, '').toLowerCase()
  } catch { return '' }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') // user ID
  const base = process.env.NEXT_PUBLIC_APP_URL!

  if (!code || !state) {
    return NextResponse.redirect(new URL('/autopilot?gsc=error', base))
  }

  try {
    const supabase = await createClient()

    // Get the user's saved autopilot URL to match against
    const { data: profile } = await supabase.from('profiles').select('autopilot_url').eq('id', state).single()
    const autopilotUrl = profile?.autopilot_url || ''
    const targetDomain = extractDomain(autopilotUrl)

    const { access_token, refresh_token } = await exchangeCode(code)

    // Find the GSC site that matches the user's domain
    const sites = await listGSCSites(access_token)
    let matchedSite: string | null = null

    if (targetDomain) {
      matchedSite = sites.find(s => extractDomain(s) === targetDomain) ?? null
    } else {
      matchedSite = sites[0] ?? null
    }

    // If user has a URL but no matching GSC property — block the connection
    if (targetDomain && !matchedSite) {
      const msg = encodeURIComponent(`"${targetDomain}" Google Search Console-da tapılmadı. GSC-də bu domenin sahibi olduğunuzu yoxlayın.`)
      return NextResponse.redirect(new URL(`/autopilot?gsc=error&msg=${msg}`, base))
    }

    await supabase.from('profiles').update({
      gsc_access_token: access_token,
      gsc_refresh_token: refresh_token,
      gsc_site_url: matchedSite,
      gsc_connected_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', state)

    return NextResponse.redirect(new URL('/autopilot?gsc=connected', base))
  } catch (err) {
    console.error('[GSC callback error]', err)
    const msg = err instanceof Error ? encodeURIComponent(err.message) : 'unknown'
    return NextResponse.redirect(new URL(`/autopilot?gsc=error&msg=${msg}`, base))
  }
}
