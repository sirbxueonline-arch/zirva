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
      ? `${brandReports.length} marka üçün Avtopilot hesabatı`
      : (firstReport.insights?.headline ?? firstReport.instagramInsights?.headline ?? 'Zirva Avtopilot Hesabatı')
    : 'Zirva Avtopilot Hesabatı'

  return (
    <Html lang="az">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={{ backgroundColor: '#EEEEF8', fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '580px', margin: '0 auto', padding: '24px 12px' }}>

          {/* ── Outer card ── */}
          <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 24px rgba(13,13,26,0.08)' }}>
            <tbody>

              {/* Header row */}
              <tr>
                <td style={{ background: 'linear-gradient(135deg, #6C5FF5 0%, #8B7FF7 100%)', padding: '28px 28px 24px', borderRadius: '20px 20px 0 0' }}>
                  <table width="100%" cellPadding={0} cellSpacing={0}>
                    <tbody><tr>
                      <td>
                        <p style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.5px' }}>Zirva</p>
                        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>Avtopilot Hesabatı · {period}</p>
                      </td>
                      <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                        <span style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', color: '#ffffff', fontWeight: '700' }}>
                          Salam, {userName} 👋
                        </span>
                      </td>
                    </tr></tbody>
                  </table>
                </td>
              </tr>

              {/* Content row — single white cell */}
              <tr>
                <td style={{ backgroundColor: '#ffffff', padding: '0', borderRadius: '0 0 20px 20px' }}>

                  {brandReports.map((report, reportIdx) => {
                    const { brandName, siteUrl, insights, instagramInsights } = report
                    const isLast = reportIdx === brandReports.length - 1

                    // ── Instagram report ──────────────────────────────
                    if (!insights && instagramInsights) {
                      return (
                        <table key={reportIdx} width="100%" cellPadding={0} cellSpacing={0}>
                          <tbody>
                            {reportIdx > 0 && (
                              <tr><td style={{ padding: '0 28px' }}><hr style={{ border: 'none', borderTop: '1px solid #EEEEF8', margin: 0 }} /></td></tr>
                            )}
                            <tr>
                              <td style={{ padding: reportIdx === 0 ? '28px 28px 0' : '24px 28px 0' }}>
                                {/* Brand label */}
                                <table width="100%" cellPadding={0} cellSpacing={0}>
                                  <tbody><tr>
                                    <td>
                                      <span style={{ display: 'inline-block', backgroundColor: 'rgba(131,58,180,0.1)', borderRadius: '6px', padding: '3px 10px', fontSize: '10px', fontWeight: '800', color: '#833AB4', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                        📱 Instagram
                                      </span>
                                    </td>
                                  </tr></tbody>
                                </table>
                                <p style={{ margin: '10px 0 2px', fontSize: '18px', fontWeight: '800', color: '#0D0D1A' }}>{brandName}</p>
                                <p style={{ margin: '0 0 20px', fontSize: '12px', color: '#9B9EBB' }}>{cleanUrl(siteUrl)}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: '0 28px' }}>
                                {/* Headline */}
                                <p style={{ margin: '0 0 14px', fontSize: '20px', fontWeight: '700', color: '#0D0D1A', lineHeight: '1.35' }}>
                                  {instagramInsights.headline}
                                </p>
                                {/* Summary */}
                                <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '16px' }}>
                                  <tbody><tr>
                                    <td style={{ backgroundColor: 'rgba(131,58,180,0.05)', borderRadius: '12px', padding: '16px', borderLeft: '3px solid #833AB4' }}>
                                      <p style={{ margin: 0, fontSize: '14px', color: '#2A2A3D', lineHeight: '1.7' }}>
                                        {instagramInsights.summary}
                                      </p>
                                    </td>
                                  </tr></tbody>
                                </table>
                                {/* Highlights */}
                                {instagramInsights.highlights && instagramInsights.highlights.length > 0 && (
                                  <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: isLast ? '0' : '8px' }}>
                                    <tbody>
                                      <tr><td style={{ paddingBottom: '8px' }}>
                                        <p style={{ margin: 0, fontSize: '10px', fontWeight: '800', color: '#833AB4', textTransform: 'uppercase', letterSpacing: '0.6px' }}>📊 Bu dövrün nəticələri</p>
                                      </td></tr>
                                      {instagramInsights.highlights.map((item, i) => (
                                        <tr key={i}><td style={{ paddingBottom: '6px' }}>
                                          <table width="100%" cellPadding={0} cellSpacing={0}>
                                            <tbody><tr><td style={{ backgroundColor: i % 2 === 0 ? 'rgba(131,58,180,0.05)' : '#FDF9FF', borderRadius: '12px', padding: '12px 14px', border: '1px solid rgba(131,58,180,0.12)' }}>
                                              <table width="100%" cellPadding={0} cellSpacing={0}>
                                                <tbody><tr>
                                                  <td style={{ paddingRight: '12px' }}>
                                                    <p style={{ margin: '0 0 3px', fontSize: '13px', fontWeight: '700', color: '#0D0D1A' }}>{item.metric}</p>
                                                    <p style={{ margin: 0, fontSize: '12px', color: '#5A5D7A', lineHeight: '1.55' }}>{item.detail}</p>
                                                  </td>
                                                  <td style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', textAlign: 'right' }}>
                                                    <p style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#833AB4', lineHeight: '1' }}>{item.value}</p>
                                                  </td>
                                                </tr></tbody>
                                              </table>
                                            </td></tr></tbody>
                                          </table>
                                        </td></tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}
                              </td>
                            </tr>
                            <tr><td style={{ padding: isLast ? '16px 0 0' : '8px 0 0' }} /></tr>
                          </tbody>
                        </table>
                      )
                    }

                    // ── SEO report ──────────────────────────────────────
                    if (!insights) return null
                    const scoreColor = insights.seo_score >= 75 ? '#00C9A7' : insights.seo_score >= 50 ? '#F5A623' : '#F25C54'
                    const changePositive = insights.score_change >= 0
                    const changeColor = changePositive ? '#00C9A7' : '#F25C54'
                    const changeLabel = `${changePositive ? '+' : ''}${insights.score_change}`

                    return (
                      <table key={reportIdx} width="100%" cellPadding={0} cellSpacing={0}>
                        <tbody>
                          {reportIdx > 0 && (
                            <tr><td style={{ padding: '0 28px' }}><hr style={{ border: 'none', borderTop: '1px solid #EEEEF8', margin: 0 }} /></td></tr>
                          )}
                          {/* Brand label + score */}
                          <tr>
                            <td style={{ padding: reportIdx === 0 ? '28px 28px 0' : '24px 28px 0' }}>
                              <table width="100%" cellPadding={0} cellSpacing={0}>
                                <tbody><tr>
                                  <td>
                                    <span style={{ display: 'inline-block', backgroundColor: 'rgba(123,110,246,0.1)', borderRadius: '6px', padding: '3px 10px', fontSize: '10px', fontWeight: '800', color: '#7B6EF6', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                      🔍 SEO Hesabatı
                                    </span>
                                    <p style={{ margin: '10px 0 2px', fontSize: '18px', fontWeight: '800', color: '#0D0D1A' }}>{brandName}</p>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#9B9EBB' }}>{cleanUrl(siteUrl)}</p>
                                  </td>
                                  <td style={{ textAlign: 'right', verticalAlign: 'top' }}>
                                    <span style={{ display: 'inline-block', backgroundColor: `${scoreColor}18`, border: `1.5px solid ${scoreColor}50`, borderRadius: '12px', padding: '10px 16px', textAlign: 'center' }}>
                                      <p style={{ margin: '0 0 2px', fontSize: '26px', fontWeight: '900', color: scoreColor, lineHeight: '1' }}>{insights.seo_score}</p>
                                      <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: changeColor }}>{changeLabel}</p>
                                    </span>
                                  </td>
                                </tr></tbody>
                              </table>
                            </td>
                          </tr>

                          {/* Stats 2×2 */}
                          <tr>
                            <td style={{ padding: '16px 28px 0' }}>
                              <table width="100%" cellPadding={0} cellSpacing={0}>
                                <tbody>
                                  <tr>
                                    <td width="50%" style={{ paddingRight: '5px', paddingBottom: '6px' }}>
                                      <table width="100%" cellPadding={0} cellSpacing={0}>
                                        <tbody><tr><td style={{ backgroundColor: '#F5F5FF', borderRadius: '12px', padding: '14px 12px', textAlign: 'center' }}>
                                          <p style={{ margin: '0 0 3px', fontSize: '22px', fontWeight: '800', color: '#0D0D1A', lineHeight: '1' }}>{insights.total_clicks.toLocaleString()}</p>
                                          <p style={{ margin: '0 0 3px', fontSize: '10px', color: '#9B9EBB', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Kliklər</p>
                                          <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: insights.total_clicks_change.startsWith('+') ? '#00C9A7' : '#F25C54' }}>{insights.total_clicks_change}</p>
                                        </td></tr></tbody>
                                      </table>
                                    </td>
                                    <td width="50%" style={{ paddingLeft: '5px', paddingBottom: '6px' }}>
                                      <table width="100%" cellPadding={0} cellSpacing={0}>
                                        <tbody><tr><td style={{ backgroundColor: '#F5F5FF', borderRadius: '12px', padding: '14px 12px', textAlign: 'center' }}>
                                          <p style={{ margin: '0 0 3px', fontSize: '22px', fontWeight: '800', color: '#0D0D1A', lineHeight: '1' }}>
                                            {insights.total_impressions >= 1000 ? `${(insights.total_impressions / 1000).toFixed(1)}K` : insights.total_impressions}
                                          </p>
                                          <p style={{ margin: '0 0 3px', fontSize: '10px', color: '#9B9EBB', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.4px' }}>İmpresiya</p>
                                          <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: insights.total_impressions_change.startsWith('+') ? '#00C9A7' : '#F25C54' }}>{insights.total_impressions_change}</p>
                                        </td></tr></tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>

                          {/* Headline + summary */}
                          <tr>
                            <td style={{ padding: '20px 28px 0' }}>
                              <p style={{ margin: '0 0 14px', fontSize: '20px', fontWeight: '700', color: '#0D0D1A', lineHeight: '1.35' }}>
                                {insights.headline}
                              </p>
                              <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '20px' }}>
                                <tbody><tr><td style={{ backgroundColor: '#F5F5FF', borderRadius: '12px', padding: '16px', borderLeft: '3px solid #7B6EF6' }}>
                                  <p style={{ margin: 0, fontSize: '14px', color: '#2A2A3D', lineHeight: '1.7' }}>{insights.summary}</p>
                                </td></tr></tbody>
                              </table>
                            </td>
                          </tr>

                          {/* Improvements */}
                          {insights.improvements && insights.improvements.length > 0 && (
                            <tr>
                              <td style={{ padding: '0 28px' }}>
                                <p style={{ margin: '0 0 10px', fontSize: '10px', fontWeight: '800', color: '#00A88A', textTransform: 'uppercase', letterSpacing: '0.6px' }}>✅ Zirva ilə əldə edilən nəticələr</p>
                                {insights.improvements.map((item, i) => (
                                  <table key={i} width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '6px' }}>
                                    <tbody><tr><td style={{ backgroundColor: i % 2 === 0 ? 'rgba(0,201,167,0.06)' : '#F9FFF9', borderRadius: '12px', padding: '12px 14px', border: '1px solid rgba(0,201,167,0.15)' }}>
                                      <table width="100%" cellPadding={0} cellSpacing={0}>
                                        <tbody><tr>
                                          <td style={{ paddingRight: '12px' }}>
                                            <p style={{ margin: '0 0 3px', fontSize: '13px', fontWeight: '700', color: '#0D0D1A' }}>{item.metric}</p>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#5A5D7A', lineHeight: '1.55' }}>{item.detail}</p>
                                          </td>
                                          <td style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', textAlign: 'right' }}>
                                            <p style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#00C9A7', lineHeight: '1' }}>{item.value}</p>
                                          </td>
                                        </tr></tbody>
                                      </table>
                                    </td></tr></tbody>
                                  </table>
                                ))}
                              </td>
                            </tr>
                          )}

                          {/* Top keywords */}
                          {insights.top_performers && insights.top_performers.length > 0 && (
                            <tr>
                              <td style={{ padding: `16px 28px ${isLast && !showSmoUpsell ? '28px' : '8px'}` }}>
                                <p style={{ margin: '0 0 10px', fontSize: '10px', fontWeight: '800', color: '#9B9EBB', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Ən Yaxşı Açar Sözlər</p>
                                {insights.top_performers.slice(0, 3).map((kw, i) => (
                                  <table key={i} width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '5px' }}>
                                    <tbody><tr><td style={{ backgroundColor: i % 2 === 0 ? '#F5F5FF' : '#ffffff', borderRadius: '10px', padding: '10px 12px', border: '1px solid rgba(123,110,246,0.08)' }}>
                                      <table width="100%" cellPadding={0} cellSpacing={0}>
                                        <tbody><tr>
                                          <td><p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#0D0D1A' }}>{kw.keyword}</p></td>
                                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#9B9EBB' }}>
                                              {kw.clicks} klik · <span style={{ color: '#7B6EF6', fontWeight: '600' }}>#{kw.position.toFixed(0)}</span>{' '}
                                              <span style={{ color: kw.change.startsWith('+') || kw.change.startsWith('↑') ? '#00C9A7' : '#F25C54', fontWeight: '700' }}>{kw.change}</span>
                                            </p>
                                          </td>
                                        </tr></tbody>
                                      </table>
                                    </td></tr></tbody>
                                  </table>
                                ))}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )
                  })}

                  {/* SMO Upsell */}
                  {showSmoUpsell && (
                    <table width="100%" cellPadding={0} cellSpacing={0}>
                      <tbody>
                        <tr><td style={{ padding: '0 28px' }}><hr style={{ border: 'none', borderTop: '1px solid #EEEEF8', margin: 0 }} /></td></tr>
                        <tr>
                          <td style={{ padding: '20px 28px 28px' }}>
                            <table width="100%" cellPadding={0} cellSpacing={0}>
                              <tbody><tr><td style={{ background: 'linear-gradient(135deg, rgba(123,110,246,0.07) 0%, rgba(0,201,167,0.05) 100%)', border: '1px solid rgba(123,110,246,0.15)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
                                <p style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '800', color: '#0D0D1A' }}>Sosial mediada da böyüyün</p>
                                <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#5A5D7A', lineHeight: '1.6' }}>Instagram, TikTok və Facebook üçün tam SMO paketi alın.</p>
                                <Link href="https://tryzirva.com/smo" style={{ display: 'inline-block', padding: '11px 28px', backgroundColor: '#7B6EF6', color: '#ffffff', borderRadius: '10px', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>
                                  SMO Paketi Al — 5 kredit
                                </Link>
                              </td></tr></tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                </td>
              </tr>

              {/* Footer row */}
              <tr>
                <td style={{ backgroundColor: '#F0F0FA', borderTop: '1px solid rgba(123,110,246,0.1)', padding: '18px 28px 22px', borderRadius: '0 0 20px 20px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 5px', fontSize: '12px', color: '#9B9EBB', lineHeight: '1.6' }}>
                    Bu hesabat <span style={{ fontWeight: '700', color: '#7B6EF6' }}>Zirva Avtopilot</span> tərəfindən avtomatik göndərilib.
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#C0C3D8' }}>
                    <Link href={unsubscribeUrl} style={{ color: '#9B9EBB', textDecoration: 'underline' }}>Abunəlikdən çıxın</Link>
                    {' · '}
                    <Link href="https://tryzirva.com" style={{ color: '#9B9EBB', textDecoration: 'underline' }}>tryzirva.com</Link>
                  </p>
                </td>
              </tr>

            </tbody>
          </table>

        </Container>
      </Body>
    </Html>
  )
}
