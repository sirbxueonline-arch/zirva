import React from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Preview,
  Link,
} from '@react-email/components'
import type { AutopilotInsights, InstagramInsights } from '@/types'

export interface SmoSummary {
  score: number | null
  posting_schedule: string | null
  hashtags: string[]
  content_pillars: string[]
}

export interface BrandReport {
  brandName: string
  siteUrl: string
  insights?: AutopilotInsights
  instagramInsights?: InstagramInsights
  smoSummary?: SmoSummary | null
}

interface AutopilotReportEmailProps {
  userName: string
  brandReports: BrandReport[]
  showSmoUpsell?: boolean
  period: string
  unsubscribeUrl: string
}

function cleanUrl(raw: string): string {
  return raw.replace(/^sc-domain:/i, '').replace(/^https?:\/\//i, '').replace(/\/+$/, '').toLowerCase()
}

const font = 'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'

// Reusable row cell
function Row({ children, pad = '0 32px' }: { children: React.ReactNode; pad?: string }) {
  return (
    <tr><td style={{ padding: pad }}>{children}</td></tr>
  )
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
      ? `${brandReports.length} marka üçün Avtopilot hesabatı — ${period}`
      : (firstReport.insights?.headline ?? firstReport.instagramInsights?.headline ?? 'Zirva Avtopilot Hesabatı')
    : 'Zirva Avtopilot Hesabatı'

  return (
    <Html lang="az">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={{ backgroundColor: '#E8E8F4', margin: 0, padding: 0, fontFamily: font }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '28px 16px' }}>
          <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden' }}>
            <tbody>

              {/* ── HEADER ── */}
              <tr>
                <td style={{ background: 'linear-gradient(160deg, #5D50E8 0%, #7B6EF6 50%, #9B8FF8 100%)', padding: '32px 32px 28px' }}>
                  <table width="100%" cellPadding={0} cellSpacing={0}>
                    <tbody>
                      <tr>
                        <td>
                          <p style={{ margin: '0 0 20px', fontSize: '28px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px', fontFamily: font }}>Zirva</p>
                          <p style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: '700', color: '#fff', letterSpacing: '-0.3px', fontFamily: font }}>Salam, {userName} 👋</p>
                          <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.72)', fontFamily: font }}>{period} dövrü üçün avtopilot hesabatınız hazırdır.</p>
                        </td>
                        <td style={{ verticalAlign: 'bottom', textAlign: 'right' }}>
                          <span style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '12px', padding: '10px 16px' }}>
                            <p style={{ margin: '0 0 2px', fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: font }}>Hesabat dövrü</p>
                            <p style={{ margin: 0, fontSize: '13px', color: '#fff', fontWeight: '800', fontFamily: font }}>{period}</p>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              {/* ── BRAND REPORTS ── */}
              {brandReports.map((report, idx) => {
                const { brandName, siteUrl, insights, instagramInsights, smoSummary } = report
                const isLast = idx === brandReports.length - 1
                const topPad = idx === 0 ? '32px 32px 0' : '0 32px'

                // ── INSTAGRAM ────────────────────────────────────────
                if (!insights && instagramInsights) {
                  return (
                    <React.Fragment key={idx}>
                      {idx > 0 && (
                        <tr><td style={{ padding: '0 32px' }}><div style={{ height: '1px', backgroundColor: '#F0F0F8', margin: '28px 0' }} /></td></tr>
                      )}
                      {/* Brand header */}
                      <tr>
                        <td style={{ padding: topPad }}>
                          <table width="100%" cellPadding={0} cellSpacing={0}>
                            <tbody><tr>
                              <td>
                                <span style={{ display: 'inline-block', backgroundColor: 'rgba(131,58,180,0.12)', borderRadius: '8px', padding: '4px 12px', fontSize: '11px', fontWeight: '800', color: '#6D28A4', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', fontFamily: font }}>
                                  📱 Instagram
                                </span>
                                <p style={{ margin: '0 0 3px', fontSize: '20px', fontWeight: '800', color: '#0D0D1A', fontFamily: font }}>{brandName}</p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#9B9EBB', fontFamily: font }}>{cleanUrl(siteUrl)}</p>
                              </td>
                            </tr></tbody>
                          </table>
                        </td>
                      </tr>

                      {/* Headline */}
                      <tr>
                        <td style={{ padding: '20px 32px 0' }}>
                          <p style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#0D0D1A', lineHeight: '1.35', fontFamily: font }}>
                            {instagramInsights.headline}
                          </p>
                        </td>
                      </tr>

                      {/* Summary */}
                      <tr>
                        <td style={{ padding: '14px 32px 0' }}>
                          <table width="100%" cellPadding={0} cellSpacing={0}>
                            <tbody><tr><td style={{ backgroundColor: 'rgba(131,58,180,0.05)', borderRadius: '14px', padding: '18px 20px', borderLeft: '4px solid #833AB4' }}>
                              <p style={{ margin: 0, fontSize: '14px', color: '#2A2A3D', lineHeight: '1.75', fontFamily: font }}>{instagramInsights.summary}</p>
                            </td></tr></tbody>
                          </table>
                        </td>
                      </tr>

                      {/* SMO Package data */}
                      {smoSummary && (
                        <tr>
                          <td style={{ padding: '20px 32px 0' }}>
                            <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '800', color: '#833AB4', textTransform: 'uppercase', letterSpacing: '0.7px', fontFamily: font }}>
                              Zirva SMO Paketi
                            </p>
                            <table width="100%" cellPadding={0} cellSpacing={0}>
                              <tbody>
                                {/* Score + schedule side by side */}
                                <tr>
                                  {smoSummary.score !== null && (
                                    <td width="50%" style={{ paddingRight: '6px', paddingBottom: '8px', verticalAlign: 'top' }}>
                                      <table width="100%" cellPadding={0} cellSpacing={0}>
                                        <tbody><tr><td style={{ backgroundColor: '#FAF5FF', borderRadius: '14px', padding: '16px', textAlign: 'center', border: '1px solid rgba(131,58,180,0.14)' }}>
                                          <p style={{ margin: '0 0 3px', fontSize: '32px', fontWeight: '900', color: '#833AB4', lineHeight: '1', fontFamily: font }}>{smoSummary.score}</p>
                                          <p style={{ margin: '0 0 2px', fontSize: '10px', fontWeight: '700', color: '#9B9EBB', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: font }}>SMO Skoru</p>
                                          <p style={{ margin: 0, fontSize: '10px', color: '#C0C3D8', fontFamily: font }}>/100</p>
                                        </td></tr></tbody>
                                      </table>
                                    </td>
                                  )}
                                  {smoSummary.posting_schedule && (
                                    <td width={smoSummary.score !== null ? '50%' : '100%'} style={{ paddingLeft: smoSummary.score !== null ? '6px' : '0', paddingBottom: '8px', verticalAlign: 'top' }}>
                                      <table width="100%" cellPadding={0} cellSpacing={0}>
                                        <tbody><tr><td style={{ backgroundColor: '#FAF5FF', borderRadius: '14px', padding: '16px', border: '1px solid rgba(131,58,180,0.14)' }}>
                                          <p style={{ margin: '0 0 6px', fontSize: '10px', fontWeight: '700', color: '#9B9EBB', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: font }}>Tövsiyə olunan tezlik</p>
                                          <p style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#6D28A4', lineHeight: '1.3', fontFamily: font }}>{smoSummary.posting_schedule}</p>
                                        </td></tr></tbody>
                                      </table>
                                    </td>
                                  )}
                                </tr>
                                {/* Content pillars */}
                                {smoSummary.content_pillars.length > 0 && (
                                  <tr><td colSpan={2} style={{ paddingBottom: '8px' }}>
                                    <table width="100%" cellPadding={0} cellSpacing={0}>
                                      <tbody><tr><td style={{ backgroundColor: '#FAF5FF', borderRadius: '14px', padding: '14px 16px', border: '1px solid rgba(131,58,180,0.14)' }}>
                                        <p style={{ margin: '0 0 8px', fontSize: '10px', fontWeight: '700', color: '#9B9EBB', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: font }}>Kontent sütunları</p>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#2A2A3D', fontFamily: font }}>{smoSummary.content_pillars.join('  ·  ')}</p>
                                      </td></tr></tbody>
                                    </table>
                                  </td></tr>
                                )}
                                {/* Hashtags */}
                                {smoSummary.hashtags.length > 0 && (
                                  <tr><td colSpan={2}>
                                    <table width="100%" cellPadding={0} cellSpacing={0}>
                                      <tbody><tr><td style={{ backgroundColor: '#FAF5FF', borderRadius: '14px', padding: '14px 16px', border: '1px solid rgba(131,58,180,0.14)' }}>
                                        <p style={{ margin: '0 0 8px', fontSize: '10px', fontWeight: '700', color: '#9B9EBB', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: font }}>Aktiv hashteqlər</p>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#833AB4', lineHeight: '1.8', fontFamily: font }}>{smoSummary.hashtags.join('  ')}</p>
                                      </td></tr></tbody>
                                    </table>
                                  </td></tr>
                                )}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}

                      <tr><td style={{ height: isLast ? '32px' : '0' }} /></tr>
                    </React.Fragment>
                  )
                }

                // ── SEO ──────────────────────────────────────────────
                if (!insights) return null
                const sc = insights.seo_score >= 75 ? '#00C9A7' : insights.seo_score >= 50 ? '#F5A623' : '#F25C54'
                const chg = insights.score_change >= 0
                const chgLabel = `${chg ? '+' : ''}${insights.score_change}`

                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && (
                      <tr><td style={{ padding: '0 32px' }}><div style={{ height: '1px', backgroundColor: '#F0F0F8', margin: '28px 0' }} /></td></tr>
                    )}

                    {/* Brand header */}
                    <tr>
                      <td style={{ padding: topPad }}>
                        <table width="100%" cellPadding={0} cellSpacing={0}>
                          <tbody><tr>
                            <td style={{ verticalAlign: 'middle' }}>
                              <span style={{ display: 'inline-block', backgroundColor: 'rgba(123,110,246,0.12)', borderRadius: '8px', padding: '4px 12px', fontSize: '11px', fontWeight: '800', color: '#5D50E8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', fontFamily: font }}>
                                🔍 SEO Hesabatı
                              </span>
                              <p style={{ margin: '0 0 3px', fontSize: '20px', fontWeight: '800', color: '#0D0D1A', fontFamily: font }}>{brandName}</p>
                              <p style={{ margin: 0, fontSize: '13px', color: '#9B9EBB', fontFamily: font }}>{cleanUrl(siteUrl)}</p>
                            </td>
                            <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                              <span style={{ display: 'inline-block', backgroundColor: `${sc}14`, border: `2px solid ${sc}40`, borderRadius: '16px', padding: '12px 18px', textAlign: 'center' }}>
                                <p style={{ margin: '0 0 2px', fontSize: '30px', fontWeight: '900', color: sc, lineHeight: '1', fontFamily: font }}>{insights.seo_score}</p>
                                <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: chg ? '#00C9A7' : '#F25C54', fontFamily: font }}>{chgLabel}</p>
                              </span>
                            </td>
                          </tr></tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Stats: 3 cells */}
                    <tr>
                      <td style={{ padding: '20px 32px 0' }}>
                        <table width="100%" cellPadding={0} cellSpacing={0}>
                          <tbody><tr>
                            <td width="33%" style={{ paddingRight: '5px' }}>
                              <table width="100%" cellPadding={0} cellSpacing={0}>
                                <tbody><tr><td style={{ backgroundColor: '#F7F7FF', borderRadius: '14px', padding: '16px 12px', textAlign: 'center' }}>
                                  <p style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '900', color: '#0D0D1A', lineHeight: '1', fontFamily: font }}>{insights.total_clicks.toLocaleString()}</p>
                                  <p style={{ margin: '0 0 4px', fontSize: '10px', color: '#9B9EBB', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: font }}>Kliklər</p>
                                  <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: insights.total_clicks_change.startsWith('+') ? '#00C9A7' : '#F25C54', fontFamily: font }}>{insights.total_clicks_change}</p>
                                </td></tr></tbody>
                              </table>
                            </td>
                            <td width="33%" style={{ paddingRight: '5px', paddingLeft: '5px' }}>
                              <table width="100%" cellPadding={0} cellSpacing={0}>
                                <tbody><tr><td style={{ backgroundColor: '#F7F7FF', borderRadius: '14px', padding: '16px 12px', textAlign: 'center' }}>
                                  <p style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '900', color: '#0D0D1A', lineHeight: '1', fontFamily: font }}>
                                    {insights.total_impressions >= 1000 ? `${(insights.total_impressions / 1000).toFixed(1)}K` : insights.total_impressions}
                                  </p>
                                  <p style={{ margin: '0 0 4px', fontSize: '10px', color: '#9B9EBB', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: font }}>İmpresiya</p>
                                  <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: insights.total_impressions_change.startsWith('+') ? '#00C9A7' : '#F25C54', fontFamily: font }}>{insights.total_impressions_change}</p>
                                </td></tr></tbody>
                              </table>
                            </td>
                            <td width="34%" style={{ paddingLeft: '5px' }}>
                              <table width="100%" cellPadding={0} cellSpacing={0}>
                                <tbody><tr><td style={{ backgroundColor: `${sc}10`, borderRadius: '14px', padding: '16px 12px', textAlign: 'center', border: `1px solid ${sc}30` }}>
                                  <p style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '900', color: sc, lineHeight: '1', fontFamily: font }}>{insights.seo_score}</p>
                                  <p style={{ margin: '0 0 4px', fontSize: '10px', color: '#9B9EBB', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: font }}>SEO Skoru</p>
                                  <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', color: chg ? '#00C9A7' : '#F25C54', fontFamily: font }}>{chgLabel}</p>
                                </td></tr></tbody>
                              </table>
                            </td>
                          </tr></tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Headline */}
                    <tr>
                      <td style={{ padding: '24px 32px 0' }}>
                        <p style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#0D0D1A', lineHeight: '1.35', fontFamily: font }}>
                          {insights.headline}
                        </p>
                      </td>
                    </tr>

                    {/* Summary */}
                    <tr>
                      <td style={{ padding: '14px 32px 0' }}>
                        <table width="100%" cellPadding={0} cellSpacing={0}>
                          <tbody><tr><td style={{ backgroundColor: '#F7F7FF', borderRadius: '14px', padding: '18px 20px', borderLeft: '4px solid #7B6EF6' }}>
                            <p style={{ margin: 0, fontSize: '14px', color: '#2A2A3D', lineHeight: '1.75', fontFamily: font }}>{insights.summary}</p>
                          </td></tr></tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Improvements */}
                    {insights.improvements && insights.improvements.length > 0 && (
                      <tr>
                        <td style={{ padding: '24px 32px 0' }}>
                          <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '800', color: '#00A88A', textTransform: 'uppercase', letterSpacing: '0.7px', fontFamily: font }}>
                            ✅ Zirva ilə əldə edilən nəticələr
                          </p>
                          <table width="100%" cellPadding={0} cellSpacing={0}>
                            <tbody>
                              {insights.improvements.map((item, i) => (
                                <tr key={i}><td style={{ paddingBottom: i < insights.improvements.length - 1 ? '8px' : '0' }}>
                                  <table width="100%" cellPadding={0} cellSpacing={0}>
                                    <tbody><tr><td style={{ backgroundColor: '#F0FDF9', borderRadius: '14px', padding: '14px 16px', border: '1px solid rgba(0,201,167,0.18)' }}>
                                      <table width="100%" cellPadding={0} cellSpacing={0}>
                                        <tbody><tr>
                                          <td style={{ paddingRight: '16px' }}>
                                            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '700', color: '#0D0D1A', fontFamily: font }}>{item.metric}</p>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#5A5D7A', lineHeight: '1.55', fontFamily: font }}>{item.detail}</p>
                                          </td>
                                          <td style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', textAlign: 'right' }}>
                                            <p style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#00C9A7', lineHeight: '1', fontFamily: font }}>{item.value}</p>
                                          </td>
                                        </tr></tbody>
                                      </table>
                                    </td></tr></tbody>
                                  </table>
                                </td></tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}

                    {/* Top keywords */}
                    {insights.top_performers && insights.top_performers.length > 0 && (
                      <tr>
                        <td style={{ padding: '24px 32px 0' }}>
                          <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '800', color: '#9B9EBB', textTransform: 'uppercase', letterSpacing: '0.7px', fontFamily: font }}>
                            Ən Yaxşı Açar Sözlər
                          </p>
                          <table width="100%" cellPadding={0} cellSpacing={0}>
                            <tbody>
                              {insights.top_performers.slice(0, 3).map((kw, i) => (
                                <tr key={i}><td style={{ paddingBottom: i < 2 ? '6px' : '0' }}>
                                  <table width="100%" cellPadding={0} cellSpacing={0}>
                                    <tbody><tr><td style={{ backgroundColor: '#F7F7FF', borderRadius: '12px', padding: '12px 14px', border: '1px solid rgba(123,110,246,0.1)' }}>
                                      <table width="100%" cellPadding={0} cellSpacing={0}>
                                        <tbody><tr>
                                          <td>
                                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#0D0D1A', fontFamily: font }}>{kw.keyword}</p>
                                          </td>
                                          <td style={{ textAlign: 'right', whiteSpace: 'nowrap', paddingLeft: '12px' }}>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#9B9EBB', fontFamily: font }}>
                                              <span style={{ fontWeight: '700', color: '#0D0D1A' }}>{kw.clicks}</span> klik
                                              {'  '}
                                              <span style={{ color: '#7B6EF6', fontWeight: '700' }}>#{kw.position.toFixed(0)}</span>
                                              {'  '}
                                              <span style={{ fontWeight: '800', color: (kw.change.startsWith('+') || kw.change.startsWith('↑')) ? '#00C9A7' : '#F25C54' }}>{kw.change}</span>
                                            </p>
                                          </td>
                                        </tr></tbody>
                                      </table>
                                    </td></tr></tbody>
                                  </table>
                                </td></tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}

                    <tr><td style={{ height: isLast && !showSmoUpsell ? '32px' : '0' }} /></tr>
                  </React.Fragment>
                )
              })}

              {/* ── SMO UPSELL ── */}
              {showSmoUpsell && (
                <tr>
                  <td style={{ padding: '0 32px 32px' }}>
                    <div style={{ height: '1px', backgroundColor: '#F0F0F8', margin: '0 0 24px' }} />
                    <table width="100%" cellPadding={0} cellSpacing={0}>
                      <tbody><tr><td style={{ background: 'linear-gradient(135deg, rgba(123,110,246,0.07) 0%, rgba(0,201,167,0.06) 100%)', border: '1px solid rgba(123,110,246,0.16)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: '800', color: '#0D0D1A', fontFamily: font }}>Sosial mediada da böyüyün</p>
                        <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#5A5D7A', lineHeight: '1.6', fontFamily: font }}>
                          Instagram, TikTok və Facebook üçün tam SMO paketi alın — hashteqlər, kontent strategiyası, auditoriya analizi.
                        </p>
                        <Link href="https://tryzirva.com/smo" style={{ display: 'inline-block', padding: '12px 32px', backgroundColor: '#7B6EF6', color: '#ffffff', borderRadius: '12px', fontWeight: '800', fontSize: '14px', textDecoration: 'none', fontFamily: font }}>
                          SMO Paketi Al — 5 kredit
                        </Link>
                      </td></tr></tbody>
                    </table>
                  </td>
                </tr>
              )}

              {/* ── FOOTER ── */}
              <tr>
                <td style={{ backgroundColor: '#F5F5FF', borderTop: '1px solid #ECEDF8', padding: '20px 32px 24px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#9B9EBB', lineHeight: '1.6', fontFamily: font }}>
                    Bu hesabat <span style={{ fontWeight: '800', color: '#7B6EF6' }}>Zirva Avtopilot</span> tərəfindən göndərilib.
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#C0C3D8', fontFamily: font }}>
                    <Link href={unsubscribeUrl} style={{ color: '#B0B3CC', textDecoration: 'underline' }}>Abunəlikdən çıxın</Link>
                    {' · '}
                    <Link href="https://tryzirva.com" style={{ color: '#B0B3CC', textDecoration: 'underline' }}>tryzirva.com</Link>
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
