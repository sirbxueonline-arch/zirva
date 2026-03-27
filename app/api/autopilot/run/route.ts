import { NextRequest, NextResponse } from 'next/server'
import { createClient as supabaseAdmin } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { refreshAccessToken, getGSCData } from '@/lib/gsc'
import { resend } from '@/lib/resend'
import React from 'react'
import AutopilotReportEmail from '@/emails/AutopilotReport'
import LowCreditsEmail from '@/emails/LowCredits'
import ReconnectGSCEmail from '@/emails/ReconnectGSC'
import type { AutopilotInsights } from '@/types'

const AUTOPILOT_SYSTEM_PROMPT = `Sən Azərbaycan bazarı üçün rəqəmsal marketinq analitika ekspertisən. Hər 3 gündə bir istifadəçiyə Google Search Console məlumatlarına əsaslanan Azerbaycanca SEO hesabatı hazırlayırsan. Hər hesabat fərqli olmalıdır çünki məlumatlar dəyişir. Eyni məlumatı iki dəfə yazma. Həmişə konkret rəqəmlərə əsaslan. Ümumi fikirlər yazma. Bu saytın bu həftə nə dəyişdiyinə fokuslan.

Sənə aşağıdakı məlumatlar veriləcək. Cari dövrün məlumatları son 3 gündür. Əvvəlki dövrün məlumatları bundan əvvəlki 3 gündür. Hər açar söz üçün klik, impresiya, CTR və orta mövqe var. Saytın ümumi göstəriciləri də var.

Bu məlumatları analiz et və aşağıdakı JSON strukturunu qaytar. Heç bir izahat yazma. Heç bir markdown yazma. Yalnız xam JSON:

{"seo_score":75,"score_change":5,"headline":"string — bu dövrün ən vacib məlumatı, 1 cümlə","summary":"string — 2-3 cümləlik Azerbaycanca analiz","top_performers":[{"keyword":"string","clicks":0,"position":0.0,"change":"string"}],"declining":[{"keyword":"string","position_drop":0,"reason":"string — 1 cümlə"}],"action_items":["string","string","string"],"opportunity":"string","warning":"string","total_clicks":0,"total_clicks_change":"string","total_impressions":0,"total_impressions_change":"string"}`

async function generateInsights(gscData: import('@/lib/gsc').GSCData, openai: OpenAI): Promise<AutopilotInsights> {
  const userPrompt = `Sayt: ${gscData.siteUrl}
Cari dövr: ${gscData.period.start} - ${gscData.period.end}
Əvvəlki dövr: ${gscData.prevPeriod.start} - ${gscData.prevPeriod.end}

Ümumi göstəricilər:
- Kliklər: ${gscData.totalClicks} (${gscData.totalClicksChange} əvvəlki dövrə nisbətən)
- İmpresiyalar: ${gscData.totalImpressions} (${gscData.totalImpressionsChange})
- Orta mövqe: ${gscData.avgPosition}
- CTR: ${gscData.overallCTR}

Ən yaxşı açar sözlər (klikə görə):
${gscData.top10.map(r => `- "${r.query}": ${r.clicks} klik, mövqe: ${r.position.toFixed(1)}, dəyişiklik: ${r.positionChange > 0 ? '+' : ''}${r.positionChange.toFixed(1)}`).join('\n')}

${gscData.declining.length > 0 ? `Düşən açar sözlər:\n${gscData.declining.map(r => `- "${r.query}": ${r.positionChange.toFixed(1)} mövqe düşüb`).join('\n')}` : 'Əhəmiyyətli düşüş yoxdur.'}`

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1200,
    temperature: 0.5,
    messages: [
      { role: 'system', content: AUTOPILOT_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
  })

  const raw = res.choices[0]?.message?.content ?? ''
  const clean = raw.replace(/^```json\n?/m, '').replace(/\n?```$/m, '').trim()
  return JSON.parse(clean) as AutopilotInsights
}

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
    .select('id, email, full_name, plan, credits_used, credits_limit, autopilot_url, autopilot_next_run, gsc_access_token, gsc_refresh_token, gsc_site_url')
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
      // Check credits
      if ((user.credits_used ?? 0) + 5 > (user.credits_limit ?? 25)) {
        await resend.emails.send({
          from: 'Zirva <noreply@tryzirva.com>',
          to: user.email,
          subject: 'Zirva — Avtopilot bu dəfə işləmədi',
          react: React.createElement(LowCreditsEmail, {
            userName: user.full_name?.split(' ')[0] || 'İstifadəçi',
            billingUrl: 'https://tryzirva.com/settings/billing',
          }),
        })
        results.push({ userId: user.id, status: 'skipped_low_credits' })
        await new Promise(r => setTimeout(r, 150))
        continue
      }

      // Refresh GSC token
      let accessToken: string
      try {
        accessToken = await refreshAccessToken(user.gsc_refresh_token!)
        await admin.from('profiles').update({ gsc_access_token: accessToken }).eq('id', user.id)
      } catch {
        await resend.emails.send({
          from: 'Zirva <noreply@tryzirva.com>',
          to: user.email,
          subject: 'Zirva — Google Search Console yenidən qoşulun',
          react: React.createElement(ReconnectGSCEmail, {
            userName: user.full_name?.split(' ')[0] || 'İstifadəçi',
            reconnectUrl: 'https://tryzirva.com/settings/autopilot',
          }),
        })
        results.push({ userId: user.id, status: 'skipped_gsc_token_error' })
        await new Promise(r => setTimeout(r, 150))
        continue
      }

      // Fetch GSC data
      const gscData = await getGSCData(accessToken, user.gsc_site_url!)

      // Generate insights
      const insights = await generateInsights(gscData, openai)

      // Send email
      const unsubscribeUrl = `https://tryzirva.com/api/autopilot/unsubscribe?uid=${user.id}`
      const period = `${gscData.period.start} – ${gscData.period.end}`

      await resend.emails.send({
        from: 'Zirva <noreply@tryzirva.com>',
        to: user.email,
        subject: `Zirva Avtopilot: ${insights.headline}`,
        react: React.createElement(AutopilotReportEmail, {
          userName: user.full_name?.split(' ')[0] || 'İstifadəçi',
          siteUrl: user.autopilot_url!,
          headline: insights.headline,
          summary: insights.summary,
          seoScore: insights.seo_score,
          scoreChange: insights.score_change,
          totalClicks: insights.total_clicks,
          totalClicksChange: insights.total_clicks_change,
          totalImpressions: insights.total_impressions,
          totalImpressionsChange: insights.total_impressions_change,
          topPerformers: insights.top_performers,
          declining: insights.declining,
          actionItems: insights.action_items,
          opportunity: insights.opportunity,
          warning: insights.warning,
          period,
          unsubscribeUrl,
        }),
      })

      // Deduct credits and update run times
      const nextRun = new Date()
      nextRun.setDate(nextRun.getDate() + 3)

      await admin.from('profiles').update({
        credits_used: (user.credits_used ?? 0) + 5,
        autopilot_last_run: new Date().toISOString(),
        autopilot_next_run: nextRun.toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('id', user.id)

      results.push({ userId: user.id, status: 'sent' })
    } catch (err) {
      results.push({ userId: user.id, status: 'error', error: String(err) })
    }

    await new Promise(r => setTimeout(r, 150))
  }

  return NextResponse.json({ processed: users.length, results })
}
