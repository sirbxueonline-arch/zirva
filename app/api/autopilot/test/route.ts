import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as supabaseAdmin } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { runAutopilotForUser } from '@/lib/autopilot-runner'
import { ADMIN_EMAIL } from '@/types'

export async function POST(request: NextRequest) {
  // Verify admin via auth (no profile DB query — avoids ByteString issues)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Profile data comes from the client (already loaded on the page)
  const body = await request.json()

  if (!body.gsc_refresh_token || !body.gsc_site_url) {
    return NextResponse.json({ error: 'GSC qoşulmayıb' }, { status: 400 })
  }

  const fullProfile = {
    id: user.id,
    email: user.email ?? '',
    full_name: body.full_name ?? null,
    plan: body.plan ?? 'pro',
    credits_used: body.credits_used ?? 0,
    credits_limit: body.credits_limit ?? 250,
    autopilot_url: body.autopilot_url ?? null,
    autopilot_next_run: body.autopilot_next_run ?? null,
    autopilot_smo_enabled: body.autopilot_smo_enabled ?? false,
    autopilot_brand_ids: body.autopilot_brand_ids ?? null,
    gsc_access_token: body.gsc_access_token ?? null,
    gsc_refresh_token: body.gsc_refresh_token,
    gsc_site_url: body.gsc_site_url,
  }

  const admin = supabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

  try {
    const result = await runAutopilotForUser(fullProfile, admin, openai)
    return NextResponse.json({ results: [{ userId: user.id, ...result }] })
  } catch (err) {
    return NextResponse.json({ results: [{ userId: user.id, status: 'error', error: String(err) }] }, { status: 500 })
  }
}
