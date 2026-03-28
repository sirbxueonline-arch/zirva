import { NextRequest, NextResponse } from 'next/server'
import { createClient as supabaseAdmin } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { runAutopilotForUser } from '@/lib/autopilot-runner'

export async function GET(request: NextRequest) {
  // Verify cron secret
  const secret = request.headers.get('x-cron-secret') || new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = supabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

  // Query eligible users
  const { data: users } = await admin
    .from('profiles')
    .select('id, email, full_name, plan, credits_used, credits_limit, autopilot_url, autopilot_next_run, autopilot_smo_enabled, autopilot_frequency, autopilot_brand_ids, gsc_access_token, gsc_refresh_token, gsc_site_url')
    .in('plan', ['pro', 'agency'])
    .eq('autopilot_enabled', true)
    .not('autopilot_url', 'is', null)
    .not('gsc_refresh_token', 'is', null)
    .not('gsc_site_url', 'is', null)
    .or(`autopilot_next_run.is.null,autopilot_next_run.lte.${new Date().toISOString()}`)

  if (!users?.length) {
    return NextResponse.json({ processed: 0, message: 'No eligible users' })
  }

  const results: { userId: string; status: string; error?: string }[] = []

  for (const user of users) {
    try {
      const result = await runAutopilotForUser(user, admin, openai)
      results.push({ userId: user.id, ...result })
    } catch (err) {
      results.push({ userId: user.id, status: 'error', error: String(err) })
    }
    await new Promise(r => setTimeout(r, 150))
  }

  return NextResponse.json({ processed: users.length, results })
}
