import { NextRequest, NextResponse } from 'next/server'
import { createClient as supabaseAdmin } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const uid = new URL(request.url).searchParams.get('uid')
  if (!uid) return new NextResponse('Invalid link', { status: 400 })

  const admin = supabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  await admin.from('profiles').update({ autopilot_enabled: false, updated_at: new Date().toISOString() }).eq('id', uid)

  return new NextResponse(`
    <!DOCTYPE html><html><head><meta charset="utf-8"><title>Avtopilot Söndürüldü</title>
    <style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#F5F5FF}
    .box{text-align:center;padding:40px;background:#fff;border-radius:16px;border:1px solid rgba(123,110,246,0.15);max-width:400px}
    h1{color:#0D0D1A;font-size:22px;margin-bottom:8px}p{color:#737599;font-size:14px}
    a{display:inline-block;margin-top:20px;padding:12px 24px;background:#7B6EF6;color:#fff;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px}</style></head>
    <body><div class="box"><h1>Avtopilot söndürüldü ✓</h1><p>Bundan sonra avtomatik hesabat göndərilməyəcək. İstənilən vaxt yenidən aktivləşdirə bilərsiniz.</p>
    <a href="https://tryzirva.com/settings/autopilot">Parametrlərə qayıt</a></div></body></html>
  `, { headers: { 'content-type': 'text/html' } })
}
