import { google } from 'googleapis'

export function getAuthUrl(state: string): string {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  )
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/webmasters.readonly'],
    state,
  })
}

export async function exchangeCode(code: string): Promise<{ access_token: string; refresh_token: string }> {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  )
  const { tokens } = await client.getToken(code)
  return { access_token: tokens.access_token!, refresh_token: tokens.refresh_token! }
}

export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  )
  client.setCredentials({ refresh_token: refreshToken })
  const { credentials } = await client.refreshAccessToken()
  return credentials.access_token!
}

export async function listGSCSites(accessToken: string): Promise<string[]> {
  const client = new google.auth.OAuth2()
  client.setCredentials({ access_token: accessToken })
  const webmasters = google.webmasters({ version: 'v3', auth: client })
  const { data } = await webmasters.sites.list()
  return (data.siteEntry || []).map(s => s.siteUrl!).filter(Boolean)
}

export interface GSCKeyword {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
  positionChange: number
  prevClicks: number
}

export interface GSCData {
  period: { start: string; end: string }
  prevPeriod: { start: string; end: string }
  siteUrl: string
  totalClicks: number
  totalImpressions: number
  totalClicksChange: string
  totalImpressionsChange: string
  avgPosition: string
  overallCTR: string
  top10: GSCKeyword[]
  declining: GSCKeyword[]
}

export async function getGSCData(accessToken: string, siteUrl: string): Promise<GSCData> {
  const client = new google.auth.OAuth2()
  client.setCredentials({ access_token: accessToken })
  const webmasters = google.webmasters({ version: 'v3', auth: client })

  const fmt = (d: Date) => d.toISOString().split('T')[0]
  const today = new Date()

  const currentEnd = new Date(today); currentEnd.setDate(currentEnd.getDate() - 1)
  const currentStart = new Date(today); currentStart.setDate(currentStart.getDate() - 3)
  const prevEnd = new Date(today); prevEnd.setDate(prevEnd.getDate() - 4)
  const prevStart = new Date(today); prevStart.setDate(prevStart.getDate() - 6)

  const [curResp, prevResp] = await Promise.all([
    webmasters.searchanalytics.query({
      siteUrl,
      requestBody: { startDate: fmt(currentStart), endDate: fmt(currentEnd), dimensions: ['query'], rowLimit: 25 },
    }),
    webmasters.searchanalytics.query({
      siteUrl,
      requestBody: { startDate: fmt(prevStart), endDate: fmt(prevEnd), dimensions: ['query'], rowLimit: 25 },
    }),
  ])

  const curRows = curResp.data.rows || []
  const prevRows = prevResp.data.rows || []
  const prevMap = new Map(prevRows.map(r => [r.keys?.[0] || '', r]))

  const enriched: GSCKeyword[] = curRows.map(r => {
    const query = r.keys?.[0] || ''
    const prev = prevMap.get(query)
    return {
      query,
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      ctr: r.ctr ?? 0,
      position: r.position ?? 0,
      positionChange: prev ? (r.position ?? 0) - (prev.position ?? 0) : 0,
      prevClicks: prev?.clicks ?? 0,
    }
  })

  const totalClicks = enriched.reduce((s, r) => s + r.clicks, 0)
  const totalImpressions = enriched.reduce((s, r) => s + r.impressions, 0)
  const prevTotal = prevRows.reduce((s, r) => s + (r.clicks ?? 0), 0)
  const prevTotalImp = prevRows.reduce((s, r) => s + (r.impressions ?? 0), 0)

  const pct = (cur: number, prev: number) => {
    if (prev === 0) return cur > 0 ? '+∞%' : '0%'
    const v = ((cur - prev) / prev * 100).toFixed(0)
    return `${Number(v) >= 0 ? '+' : ''}${v}%`
  }

  return {
    period: { start: fmt(currentStart), end: fmt(currentEnd) },
    prevPeriod: { start: fmt(prevStart), end: fmt(prevEnd) },
    siteUrl,
    totalClicks,
    totalImpressions,
    totalClicksChange: pct(totalClicks, prevTotal),
    totalImpressionsChange: pct(totalImpressions, prevTotalImp),
    avgPosition: enriched.length > 0 ? (enriched.reduce((s, r) => s + r.position, 0) / enriched.length).toFixed(1) : '0',
    overallCTR: totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) + '%' : '0%',
    top10: [...enriched].sort((a, b) => b.clicks - a.clicks).slice(0, 10),
    declining: [...enriched].filter(r => r.positionChange > 0.5).sort((a, b) => b.positionChange - a.positionChange).slice(0, 5),
  }
}
