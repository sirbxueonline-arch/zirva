import { createClient as supabaseAdmin, type SupabaseClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { refreshAccessToken, getGSCData } from '@/lib/gsc'
import { resend } from '@/lib/resend'
import React from 'react'
import AutopilotReportEmail from '@/emails/AutopilotReport'
import type { BrandReport } from '@/emails/AutopilotReport'
import LowCreditsEmail from '@/emails/LowCredits'
import ReconnectGSCEmail from '@/emails/ReconnectGSC'
import type { AutopilotInsights, InstagramInsights } from '@/types'
import type { GSCData } from '@/lib/gsc'

const AUTOPILOT_SYSTEM_PROMPT = `Sən Azərbaycan bazarı üçün rəqəmsal marketinq analitika ekspertisən. Hər 3 gündə bir istifadəçiyə Google Search Console məlumatlarına əsaslanan Azerbaycanca SEO hesabatı hazırlayırsan. Hər hesabat fərqli olmalıdır çünki məlumatlar dəyişir. Eyni məlumatı iki dəfə yazma. Həmişə konkret rəqəmlərə əsaslan. Ümumi fikirlər yazma. Bu saytın bu dövrdə nə dəyişdiyinə fokuslan.

Sənə aşağıdakı məlumatlar veriləcək. Cari dövrün məlumatları son 3 gündür. Əvvəlki dövrün məlumatları bundan əvvəlki 3 gündür.

"improvements" sahəsi ən vacib hissədir. Burada yalnız bu dövrdə əldə edilən REAL nəticələri göstər — kliklər nə qədər artdı, mövqelər necə yaxşılaşdı, yeni açar sözlər top 10-a düşdümi, CTR dəyişdimi. Bunlar Zirva-nın istifadəçiyə gətirdiyi dəyərdir. Mütləq 3 improvements yaz, hətta kiçik dəyişikliklər olsa belə. Rəqəm yoxdursa "Sabit qaldı" yazma — həmişə konkret rəqəm tap.

Bu məlumatları analiz et və aşağıdakı JSON strukturunu qaytar. Heç bir izahat yazma. Heç bir markdown yazma. Yalnız xam JSON:

{"seo_score":75,"score_change":5,"headline":"string — bu dövrün ən vacib məlumatı, 1 cümlə","summary":"string — 2-3 cümləlik Azerbaycanca analiz","top_performers":[{"keyword":"string","clicks":0,"position":0.0,"change":"string"}],"declining":[{"keyword":"string","position_drop":0,"reason":"string — 1 cümlə"}],"action_items":[],"opportunity":"string","warning":"string","total_clicks":0,"total_clicks_change":"string","total_impressions":0,"total_impressions_change":"string","improvements":[{"metric":"string — nə yaxşılaşdı","value":"string — konkret rəqəm","detail":"string — 1 cümlə, bu nailiyyətin əhəmiyyəti"},{"metric":"string","value":"string","detail":"string"},{"metric":"string","value":"string","detail":"string"}]}`

const INSTAGRAM_SYSTEM_PROMPT = `Sən Azərbaycan bazarı üçün Instagram marketinq ekspertisən. Aşağıdakı brend məlumatlarına əsaslanaraq konkret Instagram strategiyası hazırla. Heç bir izahat yazma. Heç bir markdown yazma. Yalnız xam JSON:

{"headline":"string — 1 cümlə, ən vacib Instagram tövsiyəsi","summary":"string — 2-3 cümlə Instagram strategiyası Azərbaycanca","content_ideas":["string — kontent ideyası","string — kontent ideyası","string — kontent ideyası"],"hashtags":["#hashtag","#hashtag","#hashtag","#hashtag","#hashtag","#hashtag","#hashtag","#hashtag"],"best_post_time":"string — məsələn: Axşam 19:00-21:00 arası","action_items":["string — konkret addım","string — konkret addım","string — konkret addım"]}`

export async function generateInsights(gscData: GSCData, openai: OpenAI): Promise<AutopilotInsights> {
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
    max_tokens: 1800,
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

export async function generateInstagramInsights(
  brand: { name: string; instagram_url?: string | null; category?: string | null; description?: string | null; city?: string | null },
  openai: OpenAI,
): Promise<InstagramInsights> {
  const userPrompt = `Brend adı: ${brand.name}
${brand.category ? `Kateqoriya: ${brand.category}` : ''}
${brand.city ? `Şəhər: ${brand.city}` : ''}
${brand.description ? `Açıqlama: ${brand.description}` : ''}
${brand.instagram_url ? `Instagram: ${brand.instagram_url}` : ''}

Bu brend üçün Azərbaycan bazarına uyğun Instagram strategiyası hazırla.`

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1000,
    temperature: 0.6,
    messages: [
      { role: 'system', content: INSTAGRAM_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
  })

  const raw = res.choices[0]?.message?.content ?? ''
  const clean = raw.replace(/^```json\n?/m, '').replace(/\n?```$/m, '').trim()
  return JSON.parse(clean) as InstagramInsights
}

function extractDomain(raw: string): string {
  try {
    if (raw.startsWith('sc-domain:')) return raw.replace('sc-domain:', '').replace(/^www\./, '').toLowerCase()
    const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase()
  } catch { return raw.toLowerCase() }
}

async function getGSCDataForBrand(accessToken: string, websiteUrl: string): Promise<GSCData | null> {
  const domain = extractDomain(websiteUrl)
  const candidates = [
    websiteUrl,
    `sc-domain:${domain}`,
    `https://${domain}/`,
    `http://${domain}/`,
  ]
  for (const url of candidates) {
    try {
      return await getGSCData(accessToken, url)
    } catch { continue }
  }
  return null
}

export interface AutopilotUser {
  id: string
  email: string
  full_name: string | null
  plan: string
  credits_used: number | null
  credits_limit: number | null
  autopilot_url: string | null
  autopilot_next_run: string | null
  autopilot_smo_enabled: boolean | null
  autopilot_brand_ids: string[] | null
  gsc_access_token: string | null
  gsc_refresh_token: string | null
  gsc_site_url: string | null
}

export async function runAutopilotForUser(
  user: AutopilotUser,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: SupabaseClient<any, any, any>,
  openai: OpenAI,
): Promise<{ status: string; error?: string }> {
  // Build the list of entries to report on
  const primaryUrl = user.gsc_site_url ?? user.autopilot_url
  const brandIds: string[] = user.autopilot_brand_ids?.length ? user.autopilot_brand_ids : []

  type ReportEntry = { id: string; name: string; website_url: string; instagram_url?: string | null; category?: string | null; description?: string | null; city?: string | null }
  let entriesToReport: ReportEntry[] = []

  // Load selected brands from DB
  if (brandIds.length > 0) {
    const { data } = await admin
      .from('brands')
      .select('id, name, website_url, instagram_url, category, description, city')
      .in('id', brandIds)
      .order('created_at', { ascending: true })
    entriesToReport = (data ?? []).filter((b: ReportEntry) => b.name)
  }

  // Always prepend the primary GSC site so it always gets an SEO report
  if (primaryUrl) {
    const primaryDomain = extractDomain(primaryUrl)
    const alreadyCovered = entriesToReport.some(b => b.website_url && extractDomain(b.website_url) === primaryDomain)
    if (!alreadyCovered) {
      entriesToReport.unshift({ id: 'primary', name: primaryDomain, website_url: primaryUrl })
    }
  }

  // If still nothing, abort
  if (entriesToReport.length === 0) {
    return { status: 'error', error: 'GSC qoşulmayıb' }
  }

  // Credit cost: 3 for primary + 0.5 per additional brand
  const creditCost = 3 + Math.max(entriesToReport.length - 1, 0) * 0.5

  // Check credits
  if ((user.credits_used ?? 0) + creditCost > (user.credits_limit ?? 25)) {
    await resend.emails.send({
      from: 'Zirva <noreply@tryzirva.com>',
      to: user.email,
      subject: 'Zirva — Avtopilot bu dəfə işləmədi',
      react: React.createElement(LowCreditsEmail, {
        userName: user.full_name?.split(' ')[0] || 'İstifadəçi',
        billingUrl: 'https://tryzirva.com/settings/billing',
      }),
    })
    return { status: 'skipped_low_credits' }
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
        reconnectUrl: 'https://tryzirva.com/autopilot',
      }),
    })
    return { status: 'skipped_gsc_token_error' }
  }

  const brandReports: BrandReport[] = []

  console.log(`[autopilot] Processing ${entriesToReport.length} entries for user ${user.id}:`, entriesToReport.map(e => `${e.name} (${e.id})`))

  for (const entry of entriesToReport) {
    let hasSeoReport = false

    // Try GSC data (works for primary site and any brand whose site is in GSC)
    if (entry.website_url) {
      try {
        const gscData = await getGSCDataForBrand(accessToken, entry.website_url)
        if (gscData) {
          console.log(`[autopilot] GSC data found for ${entry.name}, generating insights...`)
          const insights = await generateInsights(gscData, openai)
          brandReports.push({
            brandName: entry.name,
            siteUrl: extractDomain(entry.website_url),
            insights,
          })
          hasSeoReport = true
        } else {
          console.log(`[autopilot] No GSC data for ${entry.name}`)
        }
      } catch (err) {
        console.error(`[autopilot] GSC/AI failed for ${entry.name}:`, err)
      }
    }

    if (hasSeoReport) continue
    if (entry.id === 'primary') continue  // primary site without GSC data: skip, no Instagram fallback

    // Non-primary brand without GSC data → Instagram insights
    try {
      console.log(`[autopilot] Generating Instagram insights for ${entry.name}...`)
      const instagramInsights = await generateInstagramInsights(entry, openai)
      const rawUrl = entry.website_url || entry.instagram_url || ''
      brandReports.push({
        brandName: entry.name,
        siteUrl: rawUrl ? extractDomain(rawUrl) : entry.name,
        instagramInsights,
      })
    } catch (err) {
      console.error(`[autopilot] Instagram failed for ${entry.name}:`, err)
    }
  }

  if (brandReports.length === 0) {
    console.error(`[autopilot] All entries failed. Entries were:`, entriesToReport.map(e => e.name))
    return { status: 'error', error: 'No GSC or Instagram data available for any selected brand' }
  }

  // Send one combined email
  const unsubscribeUrl = `https://tryzirva.com/api/autopilot/unsubscribe?uid=${user.id}`

  // Build period string
  const today = new Date()
  const end = new Date(today); end.setDate(end.getDate() - 1)
  const start = new Date(today); start.setDate(start.getDate() - 3)
  const fmt = (d: Date) => d.toLocaleDateString('az-AZ', { day: 'numeric', month: 'long' })
  const periodStr = `${fmt(start)} – ${fmt(end)}`

  // Build subject from first report
  const firstReport = brandReports[0]
  const firstHeadline = firstReport.insights?.headline ?? firstReport.instagramInsights?.headline ?? 'Hesabatınız hazırdır'

  await resend.emails.send({
    from: 'Zirva <noreply@tryzirva.com>',
    to: user.email,
    subject: brandReports.length > 1
      ? `Zirva Avtopilot: ${brandReports.length} marka ucun hesabat`
      : `Zirva Avtopilot: ${firstHeadline}`,
    react: React.createElement(AutopilotReportEmail, {
      userName: user.full_name?.split(' ')[0] || 'İstifadəçi',
      brandReports,
      showSmoUpsell: !user.autopilot_smo_enabled,
      period: periodStr,
      unsubscribeUrl,
    }),
  })

  // Deduct credits and update run times
  const nextRun = new Date()
  nextRun.setDate(nextRun.getDate() + 3)

  await admin.from('profiles').update({
    credits_used: (user.credits_used ?? 0) + creditCost,
    autopilot_last_run: new Date().toISOString(),
    autopilot_next_run: nextRun.toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('id', user.id)

  return { status: 'sent' }
}
