import React from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Preview,
} from '@react-email/components'
import type { AutopilotInsights, InstagramInsights } from '@/types'

export interface BrandReport {
  brandName: string
  siteUrl: string
  insights?: AutopilotInsights
  instagramInsights?: InstagramInsights
}

interface AutopilotReportEmailProps {
  userName: string
  brandReports: BrandReport[]
  showSmoUpsell?: boolean
  period: string
  unsubscribeUrl: string
}

function cleanUrl(raw: string): string {
  return raw
    .replace(/^sc-domain:/i, '')
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '')
    .toLowerCase()
}

const PAD = '24px 20px'
const PAD_TOP0 = '0 20px 24px'

export default function AutopilotReportEmail({
  userName,
  brandReports,
  showSmoUpsell,
  period,
  unsubscribeUrl,
}: AutopilotReportEmailProps) {
  const firstReport = brandReports[0]
  const previewText = firstReport
    ? brandReports.length > 1
      ? `${brandReports.length} marka üçün Avtopilot hesabatı`
      : (firstReport.insights?.headline ?? firstReport.instagramInsights?.headline ?? 'Zirva Avtopilot Hesabatı')
    : 'Zirva Avtopilot Hesabatı'

  return (
    <Html lang="az">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={{ backgroundColor: '#EEEEF8', fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '580px', margin: '0 auto', padding: '24px 12px' }}>

          {/* ── Header ── */}
          <Section style={{
            background: 'linear-gradient(135deg, #6C5FF5 0%, #8B7FF7 100%)',
            borderRadius: '20px 20px 0 0',
            padding: '24px 20px',
          }}>
            <Text style={{ margin: '0 0 2px', fontSize: '22px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.5px' }}>
              Zirva
            </Text>
            <Text style={{ margin: '0 0 16px', fontSize: '12px', color: 'rgba(255,255,255,0.65)', fontWeight: '500' }}>
              Avtopilot Hesabatı · {period}
            </Text>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: '10px', padding: '7px 14px' }}>
              <Text style={{ margin: 0, fontSize: '13px', color: '#ffffff', fontWeight: '700' }}>
                Salam, {userName} 👋
              </Text>
            </div>
          </Section>

          {/* ── Brand Sections ── */}
          {brandReports.map((report, reportIdx) => {
            const { brandName, siteUrl, insights, instagramInsights } = report
            const isLast = reportIdx === brandReports.length - 1
            const isMulti = brandReports.length > 1
            const sectionPad = reportIdx === 0 ? PAD : PAD_TOP0

            // ── Instagram-only ──────────────────────────────────────
            if (!insights && instagramInsights) {
              return (
                <Section key={reportIdx} style={{ backgroundColor: '#ffffff', padding: sectionPad }}>
                  {reportIdx > 0 && <Hr style={{ borderColor: 'rgba(123,110,246,0.1)', margin: '0 0 20px' }} />}

                  {/* Brand header */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(131,58,180,0.06) 0%, rgba(131,58,180,0.02) 100%)',
                    border: '1px solid rgba(131,58,180,0.15)',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    marginBottom: '20px',
                  }}>
                    <div style={{ display: 'inline-block', backgroundColor: 'rgba(131,58,180,0.1)', borderRadius: '6px', padding: '2px 8px', marginBottom: '8px' }}>
                      <Text style={{ margin: 0, fontSize: '10px', fontWeight: '800', color: '#833AB4', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
                        📱 Instagram Strategiyası
                      </Text>
                    </div>
                    <Text style={{ margin: '0 0 1px', fontSize: '16px', fontWeight: '800', color: '#0D0D1A' }}>
                      {brandName}
                    </Text>
                    <Text style={{ margin: 0, fontSize: '12px', color: '#9B9EBB' }}>
                      {cleanUrl(siteUrl)}
                    </Text>
                  </div>

                  {/* Headline */}
                  <Text style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: '700', color: '#0D0D1A', lineHeight: '1.35' }}>
                    {instagramInsights.headline}
                  </Text>

                  {/* Summary */}
                  <div style={{ backgroundColor: 'rgba(131,58,180,0.04)', borderRadius: '12px', padding: '14px 16px', borderLeft: '3px solid #833AB4' }}>
                    <Text style={{ margin: 0, fontSize: '13px', color: '#2A2A3D', lineHeight: '1.7' }}>
                      {instagramInsights.summary}
                    </Text>
                  </div>
                </Section>
              )
            }

            // ── SEO report ──────────────────────────────────────────
            if (!insights) return null
            const scoreColor = insights.seo_score >= 75 ? '#00C9A7' : insights.seo_score >= 50 ? '#F5A623' : '#F25C54'
            const changePositive = insights.score_change >= 0
            const changeColor = changePositive ? '#00C9A7' : '#F25C54'
            const changeLabel = `${changePositive ? '+' : ''}${insights.score_change}`

            return (
              <Section key={reportIdx} style={{ backgroundColor: '#ffffff', padding: sectionPad }}>
                {reportIdx > 0 && <Hr style={{ borderColor: 'rgba(123,110,246,0.1)', margin: '0 0 20px' }} />}

                {/* Brand header */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(123,110,246,0.06) 0%, rgba(123,110,246,0.02) 100%)',
                  border: '1px solid rgba(123,110,246,0.14)',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  marginBottom: '20px',
                }}>
                  <table width="100%" cellPadding={0} cellSpacing={0}>
                    <tbody><tr>
                      <td>
                        <div style={{ display: 'inline-block', backgroundColor: 'rgba(123,110,246,0.1)', borderRadius: '6px', padding: '2px 8px', marginBottom: '8px' }}>
                          <Text style={{ margin: 0, fontSize: '10px', fontWeight: '800', color: '#7B6EF6', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
                            🔍 SEO Hesabatı
                          </Text>
                        </div>
                        <Text style={{ margin: '0 0 1px', fontSize: '16px', fontWeight: '800', color: '#0D0D1A' }}>{brandName}</Text>
                        <Text style={{ margin: 0, fontSize: '12px', color: '#9B9EBB' }}>{cleanUrl(siteUrl)}</Text>
                      </td>
                      <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                        <div style={{ display: 'inline-block', backgroundColor: `${scoreColor}18`, border: `1.5px solid ${scoreColor}50`, borderRadius: '12px', padding: '8px 14px', textAlign: 'center' as const }}>
                          <Text style={{ margin: '0 0 1px', fontSize: '24px', fontWeight: '900', color: scoreColor, lineHeight: '1' }}>{insights.seo_score}</Text>
                          <Text style={{ margin: 0, fontSize: '10px', fontWeight: '700', color: changeColor }}>{changeLabel}</Text>
                        </div>
                      </td>
                    </tr></tbody>
                  </table>
                </div>

                {/* Stats: 2×2 grid — works on mobile */}
                <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '20px' }}>
                  <tbody>
                    <tr>
                      <td width="50%" style={{ paddingRight: '5px', paddingBottom: '5px' }}>
                        <div style={{ backgroundColor: '#F5F5FF', borderRadius: '12px', padding: '14px 12px', textAlign: 'center' as const }}>
                          <Text style={{ margin: '0 0 2px', fontSize: '22px', fontWeight: '800', color: '#0D0D1A', lineHeight: '1' }}>
                            {insights.total_clicks.toLocaleString()}
                          </Text>
                          <Text style={{ margin: '0 0 3px', fontSize: '10px', color: '#9B9EBB', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.4px' }}>Kliklər</Text>
                          <Text style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: insights.total_clicks_change.startsWith('+') ? '#00C9A7' : '#F25C54' }}>
                            {insights.total_clicks_change}
                          </Text>
                        </div>
                      </td>
                      <td width="50%" style={{ paddingLeft: '5px', paddingBottom: '5px' }}>
                        <div style={{ backgroundColor: '#F5F5FF', borderRadius: '12px', padding: '14px 12px', textAlign: 'center' as const }}>
                          <Text style={{ margin: '0 0 2px', fontSize: '22px', fontWeight: '800', color: '#0D0D1A', lineHeight: '1' }}>
                            {insights.total_impressions >= 1000
                              ? `${(insights.total_impressions / 1000).toFixed(1)}K`
                              : insights.total_impressions}
                          </Text>
                          <Text style={{ margin: '0 0 3px', fontSize: '10px', color: '#9B9EBB', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.4px' }}>İmpresiya</Text>
                          <Text style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: insights.total_impressions_change.startsWith('+') ? '#00C9A7' : '#F25C54' }}>
                            {insights.total_impressions_change}
                          </Text>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td width="50%" style={{ paddingRight: '5px' }}>
                        <div style={{ backgroundColor: `${scoreColor}10`, borderRadius: '12px', padding: '14px 12px', textAlign: 'center' as const, border: `1px solid ${scoreColor}30` }}>
                          <Text style={{ margin: '0 0 2px', fontSize: '22px', fontWeight: '800', color: scoreColor, lineHeight: '1' }}>{insights.seo_score}</Text>
                          <Text style={{ margin: '0 0 3px', fontSize: '10px', color: '#9B9EBB', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.4px' }}>SEO Skoru</Text>
                          <Text style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: changeColor }}>{changeLabel}</Text>
                        </div>
                      </td>
                      <td width="50%" style={{ paddingLeft: '5px' }}>
                        <div style={{ backgroundColor: 'rgba(123,110,246,0.07)', borderRadius: '12px', padding: '14px 12px', textAlign: 'center' as const, border: '1px solid rgba(123,110,246,0.14)' }}>
                          <Text style={{ margin: '0 0 2px', fontSize: '15px', fontWeight: '800', color: '#7B6EF6', lineHeight: '1.2' }}>Hər 3 gün</Text>
                          <Text style={{ margin: '0 0 3px', fontSize: '10px', color: '#9B9EBB', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.4px' }}>Avtomatik</Text>
                          <Text style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: '#7B6EF6' }}>Hesabat</Text>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Headline */}
                <Text style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: '700', color: '#0D0D1A', lineHeight: '1.35' }}>
                  {insights.headline}
                </Text>

                {/* Summary */}
                <div style={{ backgroundColor: '#F5F5FF', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', borderLeft: '3px solid #7B6EF6' }}>
                  <Text style={{ margin: 0, fontSize: '13px', color: '#2A2A3D', lineHeight: '1.7' }}>{insights.summary}</Text>
                </div>

                {/* Improvements */}
                {insights.improvements && insights.improvements.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'inline-block', backgroundColor: 'rgba(0,201,167,0.12)', borderRadius: '8px', padding: '4px 10px', marginBottom: '10px' }}>
                      <Text style={{ margin: 0, fontSize: '10px', fontWeight: '800', color: '#00A88A', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
                        ✅ Zirva ilə əldə edilən nəticələr
                      </Text>
                    </div>
                    {insights.improvements.map((item, i) => (
                      <div key={i} style={{ padding: '12px 14px', backgroundColor: i % 2 === 0 ? 'rgba(0,201,167,0.05)' : '#F9FFF9', borderRadius: '12px', marginBottom: '6px', border: '1px solid rgba(0,201,167,0.15)' }}>
                        <table width="100%" cellPadding={0} cellSpacing={0}>
                          <tbody><tr>
                            <td style={{ paddingRight: '12px' }}>
                              <Text style={{ margin: '0 0 3px', fontSize: '13px', fontWeight: '700', color: '#0D0D1A' }}>{item.metric}</Text>
                              <Text style={{ margin: 0, fontSize: '12px', color: '#5A5D7A', lineHeight: '1.55' }}>{item.detail}</Text>
                            </td>
                            <td style={{ whiteSpace: 'nowrap' as const, verticalAlign: 'middle' }}>
                              <Text style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#00C9A7', lineHeight: '1', textAlign: 'right' as const }}>{item.value}</Text>
                            </td>
                          </tr></tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}

                {/* Top keywords */}
                {insights.top_performers && insights.top_performers.length > 0 && (
                  <div style={{ marginBottom: isMulti && !isLast ? '8px' : '4px' }}>
                    <Text style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: '800', color: '#9B9EBB', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Ən Yaxşı Açar Sözlər</Text>
                    {insights.top_performers.slice(0, 3).map((kw, i) => (
                      <div key={i} style={{ padding: '10px 12px', backgroundColor: i % 2 === 0 ? '#F5F5FF' : '#ffffff', borderRadius: '10px', marginBottom: '5px', border: '1px solid rgba(123,110,246,0.08)' }}>
                        <table width="100%" cellPadding={0} cellSpacing={0}>
                          <tbody><tr>
                            <td>
                              <Text style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#0D0D1A' }}>{kw.keyword}</Text>
                            </td>
                            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' as const }}>
                              <Text style={{ margin: 0, fontSize: '12px', color: '#9B9EBB' }}>
                                {kw.clicks} klik · <span style={{ color: '#7B6EF6', fontWeight: '600' }}>#{kw.position.toFixed(0)}</span>{' '}
                                <span style={{ color: kw.change.startsWith('+') || kw.change.startsWith('↑') ? '#00C9A7' : '#F25C54', fontWeight: '700' }}>{kw.change}</span>
                              </Text>
                            </td>
                          </tr></tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            )
          })}

          {/* SMO Upsell */}
          {showSmoUpsell && (
            <Section style={{ backgroundColor: '#ffffff', padding: '0 20px 24px' }}>
              <Hr style={{ borderColor: 'rgba(123,110,246,0.1)', margin: '0 0 20px' }} />
              <div style={{ background: 'linear-gradient(135deg, rgba(123,110,246,0.07) 0%, rgba(0,201,167,0.05) 100%)', border: '1px solid rgba(123,110,246,0.15)', borderRadius: '16px', padding: '20px', textAlign: 'center' as const }}>
                <Text style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '800', color: '#0D0D1A' }}>Sosial mediada da böyüyün</Text>
                <Text style={{ margin: '0 0 16px', fontSize: '13px', color: '#5A5D7A', lineHeight: '1.6' }}>
                  Instagram, TikTok və Facebook üçün tam SMO paketi alın.
                </Text>
                <Link href="https://tryzirva.com/smo" style={{ display: 'inline-block', padding: '11px 28px', backgroundColor: '#7B6EF6', color: '#ffffff', borderRadius: '10px', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>
                  SMO Paketi Al — 5 kredit
                </Link>
              </div>
            </Section>
          )}

          {/* Footer */}
          <Section style={{ backgroundColor: '#F0F0FA', borderRadius: '0 0 20px 20px', padding: '18px 20px 22px', borderTop: '1px solid rgba(123,110,246,0.1)' }}>
            <Text style={{ margin: '0 0 5px', fontSize: '12px', color: '#9B9EBB', textAlign: 'center' as const, lineHeight: '1.6' }}>
              Bu hesabat <span style={{ fontWeight: '700', color: '#7B6EF6' }}>Zirva Avtopilot</span> tərəfindən avtomatik göndərilib.
            </Text>
            <Text style={{ margin: 0, fontSize: '11px', color: '#C0C3D8', textAlign: 'center' as const }}>
              <Link href={unsubscribeUrl} style={{ color: '#9B9EBB', textDecoration: 'underline' }}>Abunəlikdən çıxın</Link>
              {' · '}
              <Link href="https://tryzirva.com" style={{ color: '#9B9EBB', textDecoration: 'underline' }}>tryzirva.com</Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}
