import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function normalizeUrl(raw: string): string {
  let url = raw.trim().replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url
  return url
}

/* ── POST: test + save any CMS connection ── */
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { cms_type, site_url, username, app_password } = await req.json()
  if (!cms_type) return NextResponse.json({ error: 'cms_type tələb olunur' }, { status: 400 })

  let siteName = site_url || cms_type
  let siteUrl  = site_url ? normalizeUrl(site_url) : ''

  try {
    /* ── WordPress ── */
    if (cms_type === 'wordpress') {
      if (!site_url || !username || !app_password)
        return NextResponse.json({ error: 'Bütün sahələri doldurun' }, { status: 400 })

      const credentials = Buffer.from(`${username}:${app_password.replace(/\s/g, '')}`).toString('base64')
      const res = await fetch(`${siteUrl}/wp-json/wp/v2/users/me`, {
        headers: { Authorization: `Basic ${credentials}` },
        signal: AbortSignal.timeout(10000),
      })
      if (!res.ok) {
        const msg = res.status === 401 ? 'İstifadəçi adı və ya şifrə yanlışdır'
          : res.status === 404 ? 'WordPress REST API tapılmadı — URL-i yoxlayın'
          : `WordPress xətası: ${res.status}`
        return NextResponse.json({ error: msg }, { status: 400 })
      }
      const me = await res.json()
      siteName = me.name || siteUrl
      const siteRes = await fetch(`${siteUrl}/wp-json`, {
        headers: { Authorization: `Basic ${credentials}` },
        signal: AbortSignal.timeout(5000),
      })
      if (siteRes.ok) { const s = await siteRes.json(); if (s.name) siteName = s.name }

    /* ── Ghost ── */
    } else if (cms_type === 'ghost') {
      if (!site_url || !app_password)
        return NextResponse.json({ error: 'Bütün sahələri doldurun' }, { status: 400 })

      const res = await fetch(`${siteUrl}/ghost/api/content/settings/?key=${app_password.trim()}`, {
        signal: AbortSignal.timeout(10000),
      })
      if (!res.ok) {
        const msg = res.status === 401 || res.status === 403 ? 'API açarı yanlışdır'
          : res.status === 404 ? 'Ghost sayt tapılmadı — URL-i yoxlayın'
          : `Ghost xətası: ${res.status}`
        return NextResponse.json({ error: msg }, { status: 400 })
      }
      const data = await res.json()
      siteName = data.settings?.title || siteUrl

    /* ── Webflow ── */
    } else if (cms_type === 'webflow') {
      if (!app_password)
        return NextResponse.json({ error: 'API token tələb olunur' }, { status: 400 })

      const res = await fetch('https://api.webflow.com/v2/sites', {
        headers: { Authorization: `Bearer ${app_password.trim()}`, Accept: 'application/json' },
        signal: AbortSignal.timeout(10000),
      })
      if (!res.ok) {
        const msg = res.status === 401 ? 'API token yanlışdır'
          : `Webflow xətası: ${res.status}`
        return NextResponse.json({ error: msg }, { status: 400 })
      }
      const data = await res.json()
      const firstSite = data.sites?.[0]
      siteName = firstSite?.displayName || firstSite?.shortName || 'Webflow'
      siteUrl = firstSite ? `https://${firstSite.shortName}.webflow.io` : 'webflow.com'

    /* ── Shopify ── */
    } else if (cms_type === 'shopify') {
      if (!site_url || !app_password)
        return NextResponse.json({ error: 'Bütün sahələri doldurun' }, { status: 400 })

      let shop = siteUrl.replace(/^https?:\/\//i, '').replace(/\/.*$/, '')
      if (!shop.includes('.myshopify.com')) shop = `${shop}.myshopify.com`
      siteUrl = `https://${shop}`

      const res = await fetch(`${siteUrl}/admin/api/2024-01/shop.json`, {
        headers: { 'X-Shopify-Access-Token': app_password.trim() },
        signal: AbortSignal.timeout(10000),
      })
      if (!res.ok) {
        const msg = res.status === 401 || res.status === 403 ? 'Access token yanlışdır'
          : res.status === 404 ? 'Shopify mağazası tapılmadı — URL-i yoxlayın'
          : `Shopify xətası: ${res.status}`
        return NextResponse.json({ error: msg }, { status: 400 })
      }
      const data = await res.json()
      siteName = data.shop?.name || shop

    /* ── Wix ── */
    } else if (cms_type === 'wix') {
      if (!app_password || !username)
        return NextResponse.json({ error: 'Bütün sahələri doldurun' }, { status: 400 })

      const res = await fetch('https://www.wixapis.com/site-properties/v4/properties', {
        headers: {
          Authorization: app_password.trim(),
          'wix-site-id': username.trim(),
        },
        signal: AbortSignal.timeout(10000),
      })
      if (!res.ok) {
        const msg = res.status === 401 || res.status === 403 ? 'API açarı və ya Site ID yanlışdır'
          : `Wix xətası: ${res.status}`
        return NextResponse.json({ error: msg }, { status: 400 })
      }
      const data = await res.json()
      siteName = data.properties?.siteDisplayName || data.properties?.name || 'Wix sayt'
      siteUrl  = `https://manage.wix.com/dashboard/${username.trim()}`

    } else {
      return NextResponse.json({ error: 'Dəstəklənməyən CMS növü' }, { status: 400 })
    }

  } catch (err: unknown) {
    const msg = err instanceof Error && err.name === 'TimeoutError'
      ? 'Sayt cavab vermir — URL-i yoxlayın'
      : 'Qoşulmaq mümkün olmadı'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const { error } = await supabase.from('cms_connections').upsert({
    user_id:      user.id,
    cms_type,
    site_url:     siteUrl,
    username:     username || null,
    app_password: app_password?.replace(/\s/g, '') || null,
    site_name:    siteName,
    status:       'connected',
    last_used_at: new Date().toISOString(),
  }, { onConflict: 'user_id,cms_type' })

  if (error) return NextResponse.json({ error: 'Verilənlər bazası xətası' }, { status: 500 })
  return NextResponse.json({ success: true, site_name: siteName })
}

/* ── DELETE: disconnect ── */
export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const cms_type = searchParams.get('cms_type') || 'wordpress'

  await supabase.from('cms_connections')
    .delete()
    .eq('user_id', user.id)
    .eq('cms_type', cms_type)

  return NextResponse.json({ success: true })
}

/* ── GET: fetch all connections ── */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase.from('cms_connections')
    .select('id, cms_type, site_url, site_name, status, created_at')
    .eq('user_id', user.id)

  return NextResponse.json({ connections: data || [] })
}
