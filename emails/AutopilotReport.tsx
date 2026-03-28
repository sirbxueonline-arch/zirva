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
      ? `${brandReports.length} marka ucun Avtopilot hesabati`
      : (firstReport.insights?.headline ?? firstReport.instagramInsights?.headline ?? 'Zirva Avtopilot Hesabati')
    : 'Zirva Avtopilot Hesabati'

  return (
    <Html lang="az">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={{ backgroundColor: '#EEEEF8', fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 16px' }}>

          {/* Header */}
          <Section style={{
            background: 'linear-gradient(135deg, #7B6EF6 0%, #9B8FF8 100%)',
            borderRadius: '16px 16px 0 0',
            padding: '28px 32px 24px',
          }}>
            <table width="100%" cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  <td>
                    <Text style={{ margin: 0, fontSize: '26px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.5px' }}>
                      Zirva
                    </Text>
                    <Text style={{ margin: '3px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontWeight: '500' }}>
                      Avtopilot Hesabatı · {period}
                    </Text>
                  </td>
                  <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                    <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '8px 14px' }}>
                      <Text style={{ margin: 0, fontSize: '13px', color: '#ffffff', fontWeight: '600' }}>
                        Salam, {userName} 👋
                      </Text>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Brand Sections */}
          {brandReports.map((report, reportIdx) => {
            const { brandName, siteUrl, insights, instagramInsights } = report
            const isLast = reportIdx === brandReports.length - 1
            const isMulti = brandReports.length > 1

            // ── Instagram-only report ──────────────────────────────
            if (!insights && instagramInsights) {
              return (
                <Section key={reportIdx} style={{
                  backgroundColor: '#ffffff',
                  padding: reportIdx === 0 ? '28px 32px' : '0 32px 28px',
                }}>
                  {/* Brand divider for multi-brand */}
                  {isMulti && (
                    <div style={{ marginBottom: '20px' }}>
                      {reportIdx > 0 && <Hr style={{ borderColor: 'rgba(123,110,246,0.1)', margin: '0 0 20px' }} />}
                      <table width="100%" cellPadding={0} cellSpacing={0}>
                        <tbody>
                          <tr>
                            <td>
                              <Text style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0D0D1A' }}>
                                {brandName}
                              </Text>
                              <Text style={{ margin: '2px 0 0', fontSize: '12px', color: '#9B9EBB' }}>
                                {cleanUrl(siteUrl)}
                              </Text>
                            </td>
                            <td style={{ textAlign: 'right', verticalAlign: 'top' }}>
                              <div style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(131,58,180,0.08)',
                                border: '1px solid rgba(131,58,180,0.2)',
                              }}>
                                <Text style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: '#833AB4' }}>Instagram</Text>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Instagram header badge (single brand) */}
                  {!isMulti && (
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(131,58,180,0.07) 0%, rgba(131,58,180,0.03) 100%)',
                      border: '1px solid rgba(131,58,180,0.18)',
                      borderRadius: '14px',
                      padding: '14px 18px',
                      marginBottom: '24px',
                    }}>
                      <table width="100%" cellPadding={0} cellSpacing={0}>
                        <tbody>
                          <tr>
                            <td>
                              <div style={{ display: 'inline-block', backgroundColor: 'rgba(131,58,180,0.1)', borderRadius: '6px', padding: '2px 8px', marginBottom: '6px' }}>
                                <Text style={{ margin: 0, fontSize: '10px', fontWeight: '800', color: '#833AB4', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  📱 Instagram Strategiyası
                                </Text>
                              </div>
                              <Text style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0D0D1A' }}>
                                {brandName}
                              </Text>
                              <Text style={{ margin: '2px 0 0', fontSize: '12px', color: '#9B9EBB' }}>
                                {cleanUrl(siteUrl)}
                              </Text>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Headline */}
                  <Text style={{ margin: '0 0 12px', fontSize: isMulti ? '15px' : '20px', fontWeight: '700', color: '#0D0D1A', lineHeight: '1.3' }}>
                    {instagramInsights.headline}
                  </Text>

                  {/* Summary */}
                  <div style={{ backgroundColor: 'rgba(131,58,180,0.04)', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', borderLeft: '3px solid #833AB4' }}>
                    <Text style={{ margin: 0, fontSize: '13px', color: '#0D0D1A', lineHeight: '1.6' }}>
                      {instagramInsights.summary}
                    </Text>
                  </div>

                </Section>
              )
            }

            // ── SEO report (has insights) ─────────────────────────
            if (!insights) return null
            const scoreColor = insights.seo_score >= 75 ? '#00C9A7' : insights.seo_score >= 50 ? '#F5A623' : '#F25C54'
            const changePositive = insights.score_change >= 0
            const changeColor = changePositive ? '#00C9A7' : '#F25C54'

            return (
              <Section key={reportIdx} style={{
                backgroundColor: '#ffffff',
                padding: reportIdx === 0 ? '28px 32px' : '0 32px 28px',
              }}>
                {/* Brand divider (for multi-brand) */}
                {isMulti && (
                  <div style={{ marginBottom: '20px' }}>
                    {reportIdx > 0 && <Hr style={{ borderColor: 'rgba(123,110,246,0.1)', margin: '0 0 20px' }} />}
                    <table width="100%" cellPadding={0} cellSpacing={0}>
                      <tbody>
                        <tr>
                          <td>
                            <Text style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0D0D1A' }}>
                              {brandName}
                            </Text>
                            <Text style={{ margin: '2px 0 0', fontSize: '12px', color: '#9B9EBB' }}>
                              {cleanUrl(siteUrl)}
                            </Text>
                          </td>
                          <td style={{ textAlign: 'right', verticalAlign: 'top' }}>
                            <div style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              backgroundColor: `${scoreColor}15`,
                              border: `1px solid ${scoreColor}40`,
                            }}>
                              <Text style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: scoreColor, lineHeight: '1' }}>
                                {insights.seo_score}
                                <span style={{ fontSize: '11px', fontWeight: '600', color: changeColor, marginLeft: '4px' }}>
                                  {changePositive ? '+' : ''}{insights.score_change}
                                </span>
                              </Text>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Stats row (single brand only) */}
                {!isMulti && (
                  <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '24px' }}>
                    <tbody>
                      <tr>
                        <td width="25%" style={{ paddingRight: '8px' }}>
                          <div style={{ backgroundColor: '#F5F5FF', borderRadius: '12px', padding: '14px 12px', textAlign: 'center', border: `1px solid ${scoreColor}30` }}>
                            <Text style={{ margin: '0 0 2px', fontSize: '26px', fontWeight: '800', color: scoreColor, lineHeight: '1' }}>{insights.seo_score}</Text>
                            <Text style={{ margin: '0 0 4px', fontSize: '10px', color: '#9B9EBB', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>SEO Skoru</Text>
                            <Text style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: changeColor }}>{changePositive ? '+' : ''}{insights.score_change}</Text>
                          </div>
                        </td>
                        <td width="25%" style={{ paddingRight: '8px', paddingLeft: '4px' }}>
                          <div style={{ backgroundColor: '#F5F5FF', borderRadius: '12px', padding: '14px 12px', textAlign: 'center' }}>
                            <Text style={{ margin: '0 0 2px', fontSize: '22px', fontWeight: '800', color: '#0D0D1A', lineHeight: '1' }}>{insights.total_clicks.toLocaleString()}</Text>
                            <Text style={{ margin: '0 0 4px', fontSize: '10px', color: '#9B9EBB', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Kliklər</Text>
                            <Text style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: insights.total_clicks_change.startsWith('+') ? '#00C9A7' : '#F25C54' }}>{insights.total_clicks_change}</Text>
                          </div>
                        </td>
                        <td width="25%" style={{ paddingRight: '4px', paddingLeft: '4px' }}>
                          <div style={{ backgroundColor: '#F5F5FF', borderRadius: '12px', padding: '14px 12px', textAlign: 'center' }}>
                            <Text style={{ margin: '0 0 2px', fontSize: '22px', fontWeight: '800', color: '#0D0D1A', lineHeight: '1' }}>{insights.total_impressions >= 1000 ? `${(insights.total_impressions / 1000).toFixed(1)}K` : insights.total_impressions}</Text>
                            <Text style={{ margin: '0 0 4px', fontSize: '10px', color: '#9B9EBB', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Impresiya</Text>
                            <Text style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: insights.total_impressions_change.startsWith('+') ? '#00C9A7' : '#F25C54' }}>{insights.total_impressions_change}</Text>
                          </div>
                        </td>
                        <td width="25%" style={{ paddingLeft: '4px' }}>
                          <div style={{ backgroundColor: 'rgba(123,110,246,0.06)', borderRadius: '12px', padding: '14px 12px', textAlign: 'center', border: '1px solid rgba(123,110,246,0.12)' }}>
                            <Text style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: '#7B6EF6', lineHeight: '1.3' }}>3 Gunluk</Text>
                            <Text style={{ margin: 0, fontSize: '10px', color: '#9B9EBB', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Hesabat</Text>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {/* Compact stats for multi-brand */}
                {isMulti && (
                  <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '16px' }}>
                    <tbody>
                      <tr>
                        <td width="33%" style={{ paddingRight: '6px' }}>
                          <div style={{ backgroundColor: '#F5F5FF', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
                            <Text style={{ margin: '0 0 1px', fontSize: '18px', fontWeight: '800', color: '#0D0D1A', lineHeight: '1' }}>{insights.total_clicks}</Text>
                            <Text style={{ margin: 0, fontSize: '10px', color: '#9B9EBB', fontWeight: '600' }}>Kliklər {insights.total_clicks_change}</Text>
                          </div>
                        </td>
                        <td width="33%" style={{ paddingRight: '3px', paddingLeft: '3px' }}>
                          <div style={{ backgroundColor: '#F5F5FF', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
                            <Text style={{ margin: '0 0 1px', fontSize: '18px', fontWeight: '800', color: '#0D0D1A', lineHeight: '1' }}>{insights.total_impressions >= 1000 ? `${(insights.total_impressions / 1000).toFixed(1)}K` : insights.total_impressions}</Text>
                            <Text style={{ margin: 0, fontSize: '10px', color: '#9B9EBB', fontWeight: '600' }}>Impresiya {insights.total_impressions_change}</Text>
                          </div>
                        </td>
                        <td width="33%" style={{ paddingLeft: '6px' }}>
                          <div style={{ backgroundColor: 'rgba(123,110,246,0.06)', borderRadius: '10px', padding: '10px 12px', textAlign: 'center', border: '1px solid rgba(123,110,246,0.1)' }}>
                            <Text style={{ margin: '0 0 1px', fontSize: '12px', fontWeight: '700', color: '#7B6EF6' }}>{insights.seo_score}</Text>
                            <Text style={{ margin: 0, fontSize: '10px', color: '#9B9EBB', fontWeight: '600' }}>SEO Skoru</Text>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {/* Headline */}
                <Text style={{ margin: '0 0 12px', fontSize: isMulti ? '15px' : '20px', fontWeight: '700', color: '#0D0D1A', lineHeight: '1.3' }}>
                  {insights.headline}
                </Text>

                {/* Summary */}
                <div style={{ backgroundColor: '#F5F5FF', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', borderLeft: '3px solid #7B6EF6' }}>
                  <Text style={{ margin: 0, fontSize: '13px', color: '#0D0D1A', lineHeight: '1.6' }}>{insights.summary}</Text>
                </div>

                {/* Improvements — shown first, most prominent */}
                {insights.improvements && insights.improvements.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'inline-block', backgroundColor: 'rgba(0,201,167,0.1)', borderRadius: '6px', padding: '2px 8px', marginBottom: '10px' }}>
                      <Text style={{ margin: 0, fontSize: '10px', fontWeight: '800', color: '#00C9A7', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
                        ✅ Zirva ilə əldə edilən nəticələr
                      </Text>
                    </div>
                    {insights.improvements.map((item, i) => (
                      <div key={i} style={{ padding: '12px 14px', backgroundColor: 'rgba(0,201,167,0.05)', borderRadius: '10px', marginBottom: '6px', border: '1px solid rgba(0,201,167,0.15)' }}>
                        <table width="100%" cellPadding={0} cellSpacing={0}>
                          <tbody><tr>
                            <td>
                              <Text style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: '#0D0D1A' }}>{item.metric}</Text>
                              <Text style={{ margin: 0, fontSize: '12px', color: '#5A5D7A', lineHeight: '1.5' }}>{item.detail}</Text>
                            </td>
                            <td style={{ textAlign: 'right', verticalAlign: 'middle', paddingLeft: '12px' }}>
                              <Text style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#00C9A7', lineHeight: '1' }}>{item.value}</Text>
                            </td>
                          </tr></tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}

                {/* Top performing keywords */}
                {insights.top_performers && insights.top_performers.length > 0 && (
                  <div style={{ marginBottom: isMulti && !isLast ? '8px' : '20px' }}>
                    <Text style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: '700', color: '#0D0D1A' }}>Ən Yaxşı Açar Sözlər</Text>
                    {insights.top_performers.slice(0, 3).map((kw, i) => (
                      <div key={i} style={{ padding: '9px 12px', backgroundColor: i % 2 === 0 ? '#F5F5FF' : '#ffffff', borderRadius: '8px', marginBottom: '5px', border: '1px solid rgba(123,110,246,0.06)' }}>
                        <table width="100%" cellPadding={0} cellSpacing={0}>
                          <tbody><tr>
                            <td><Text style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#0D0D1A' }}>{kw.keyword}</Text></td>
                            <td style={{ textAlign: 'right' }}>
                              <Text style={{ margin: 0, fontSize: '11px', color: '#9B9EBB' }}>
                                {kw.clicks} klik · #{kw.position.toFixed(1)}{' '}
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
            <Section style={{ backgroundColor: '#ffffff', padding: '0 32px 28px' }}>
              <Hr style={{ borderColor: 'rgba(123,110,246,0.1)', margin: '0 0 20px' }} />
              <div style={{ background: 'linear-gradient(135deg, rgba(123,110,246,0.08) 0%, rgba(0,201,167,0.06) 100%)', border: '1px solid rgba(123,110,246,0.18)', borderRadius: '14px', padding: '18px 20px', textAlign: 'center' as const }}>
                <Text style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '800', color: '#0D0D1A' }}>Sosial Media da boyuyin</Text>
                <Text style={{ margin: '0 0 14px', fontSize: '12px', color: '#5A5D7A', lineHeight: '1.6' }}>Instagram, TikTok ve Facebook ucun tam SMO paketi alin — hashteqler, kontent strategiyasi, auditoriya analizi.</Text>
                <Link href="https://tryzirva.com/smo" style={{ display: 'inline-block', padding: '10px 24px', backgroundColor: '#7B6EF6', color: '#ffffff', borderRadius: '10px', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>
                  SMO Paketi Al - 5 kredit
                </Link>
              </div>
            </Section>
          )}

          {/* Footer */}
          <Section style={{ backgroundColor: '#F5F5FF', borderRadius: '0 0 16px 16px', padding: '20px 32px 24px', borderTop: '1px solid rgba(123,110,246,0.1)' }}>
            <Text style={{ margin: '0 0 4px', fontSize: '12px', color: '#9B9EBB', textAlign: 'center' as const, lineHeight: '1.6' }}>
              Bu hesabat <span style={{ fontWeight: '600', color: '#7B6EF6' }}>Zirva Avtopilot</span> tərəfindən avtomatik göndərilib.
            </Text>
            <Text style={{ margin: 0, fontSize: '11px', color: '#C0C3D8', textAlign: 'center' as const }}>
              <Link href={unsubscribeUrl} style={{ color: '#9B9EBB', textDecoration: 'underline' }}>Abunəlikdən çıxın</Link>
              {'  ·  '}
              <Link href="https://tryzirva.com" style={{ color: '#9B9EBB', textDecoration: 'underline' }}>tryzirva.com</Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}
