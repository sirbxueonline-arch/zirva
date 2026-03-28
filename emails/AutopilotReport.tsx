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

const font = 'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif'

// A reliable left-border card using a 2-cell table
function BorderCard({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F8F8FC' }}>
      <tbody><tr>
        <td style={{ width: '4px', backgroundColor: color, borderRadius: '4px 0 0 4px' }} />
        <td style={{ padding: '16px 18px' }}>{children}</td>
      </tr></tbody>
    </table>
  )
}

function StatCard({ value, label, change }: { value: string; label: string; change: string }) {
  const positive = change.startsWith('+') || change.startsWith('↑')
  const neutral = change === '0%' || change === '0'
  const changeColor = neutral ? '#9B9EBB' : positive ? '#00A37A' : '#E53E3E'
  return (
    <table width="100%" cellPadding={0} cellSpacing={0}>
      <tbody><tr><td style={{ backgroundColor: '#F4F4FA', borderRadius: '12px', padding: '16px 14px', textAlign: 'center' }}>
        <p style={{ margin: '0 0 3px', fontSize: '26px', fontWeight: '800', color: '#0D0D1A', lineHeight: '1', fontFamily: font }}>{value}</p>
        <p style={{ margin: '0 0 6px', fontSize: '10px', color: '#8B8FA8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: font }}>{label}</p>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: changeColor, fontFamily: font }}>{change}</p>
      </td></tr></tbody>
    </table>
  )
}

function Divider() {
  return <tr><td style={{ padding: '0 32px' }}><div style={{ height: '1px', backgroundColor: '#EBEBF5' }} /></td></tr>
}

function Spacer({ h }: { h: number }) {
  return <tr><td style={{ height: `${h}px` }} /></tr>
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
      <Body style={{ backgroundColor: '#EEEEF8', margin: 0, padding: 0, fontFamily: font }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 12px' }}>
          <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#ffffff', borderRadius: '20px', overflow: 'hidden' }}>
            <tbody>

              {/* ── HEADER ── */}
              <tr>
                <td style={{ backgroundColor: '#5D50E8', padding: '28px 32px 24px' }}>
                  <p style={{ margin: '0 0 18px', fontSize: '22px', fontWeight: '900', color: '#fff', letterSpacing: '-0.3px', fontFamily: font }}>Zirva</p>
                  <p style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: '700', color: '#fff', fontFamily: font }}>Salam, {userName}!</p>
                  <p style={{ margin: '0 0 18px', fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontFamily: font }}>
                    {period} dövrü üçün avtopilot hesabatınız hazırdır.
                  </p>
                  <table cellPadding={0} cellSpacing={0}>
                    <tbody><tr><td style={{ backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: '8px', padding: '7px 14px' }}>
                      <p style={{ margin: 0, fontSize: '12px', color: '#fff', fontWeight: '700', fontFamily: font }}>{period}</p>
                    </td></tr></tbody>
                  </table>
                </td>
              </tr>

              {/* ── BRAND REPORTS ── */}
              {brandReports.map((report, idx) => {
                const { brandName, siteUrl, insights, instagramInsights, smoSummary } = report

                // ── INSTAGRAM SECTION ──────────────────────────
                if (!insights && instagramInsights) {
                  return (
                    <React.Fragment key={idx}>
                      {idx > 0 && <><Spacer h={8} /><Divider /><Spacer h={8} /></>}
                      <Spacer h={28} />

                      {/* Section label */}
                      <tr><td style={{ padding: '0 32px' }}>
                        <table cellPadding={0} cellSpacing={0}><tbody><tr>
                          <td style={{ backgroundColor: '#F3E8FF', borderRadius: '6px', padding: '4px 10px' }}>
                            <p style={{ margin: 0, fontSize: '11px', fontWeight: '800', color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: font }}>📱 Sosial Media</p>
                          </td>
                        </tr></tbody></table>
                      </td></tr>

                      <Spacer h={12} />

                      {/* Brand name */}
                      <tr><td style={{ padding: '0 32px' }}>
                        <p style={{ margin: '0 0 2px', fontSize: '22px', fontWeight: '800', color: '#0D0D1A', letterSpacing: '-0.3px', fontFamily: font }}>{brandName}</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#9B9EBB', fontFamily: font }}>{cleanUrl(siteUrl)}</p>
                      </td></tr>

                      <Spacer h={18} />

                      {/* Headline */}
                      <tr><td style={{ padding: '0 32px' }}>
                        <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0D0D1A', lineHeight: '1.4', fontFamily: font }}>
                          {instagramInsights.headline}
                        </p>
                      </td></tr>

                      <Spacer h={12} />

                      {/* Summary */}
                      <tr><td style={{ padding: '0 32px' }}>
                        <BorderCard color="#7C3AED">
                          <p style={{ margin: 0, fontSize: '14px', color: '#2A2A3D', lineHeight: '1.7', fontFamily: font }}>{instagramInsights.summary}</p>
                        </BorderCard>
                      </td></tr>

                      {/* SMO data */}
                      {smoSummary && (smoSummary.score !== null || smoSummary.posting_schedule || smoSummary.content_pillars.length > 0 || smoSummary.hashtags.length > 0) && (
                        <>
                          <Spacer h={20} />
                          <tr><td style={{ padding: '0 32px' }}>
                            <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: '800', color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: font }}>
                              Zirva SMO Paketi
                            </p>
                            <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#FAF5FF', borderRadius: '14px', border: '1px solid #E9D5FF' }}>
                              <tbody>
                                {(smoSummary.score !== null || smoSummary.posting_schedule) && (
                                  <tr>
                                    {smoSummary.score !== null && (
                                      <td width="40%" style={{ padding: '16px 14px 16px 18px', verticalAlign: 'top', borderRight: smoSummary.posting_schedule ? '1px solid #E9D5FF' : 'none' }}>
                                        <p style={{ margin: '0 0 2px', fontSize: '32px', fontWeight: '900', color: '#7C3AED', lineHeight: '1', fontFamily: font }}>{smoSummary.score}</p>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#9B9EBB', fontWeight: '600', fontFamily: font }}>SMO Skoru /100</p>
                                      </td>
                                    )}
                                    {smoSummary.posting_schedule && (
                                      <td style={{ padding: '16px 18px 16px 14px', verticalAlign: 'top' }}>
                                        <p style={{ margin: '0 0 3px', fontSize: '10px', fontWeight: '700', color: '#9B9EBB', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: font }}>Tövsiyə olunan tezlik</p>
                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#4C1D95', lineHeight: '1.3', fontFamily: font }}>{smoSummary.posting_schedule}</p>
                                      </td>
                                    )}
                                  </tr>
                                )}
                                {smoSummary.content_pillars.length > 0 && (
                                  <tr><td colSpan={2} style={{ padding: '14px 18px', borderTop: '1px solid #E9D5FF' }}>
                                    <p style={{ margin: '0 0 6px', fontSize: '10px', fontWeight: '700', color: '#9B9EBB', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: font }}>Kontent sütunları</p>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#2A2A3D', fontFamily: font }}>{smoSummary.content_pillars.join('  ·  ')}</p>
                                  </td></tr>
                                )}
                                {smoSummary.hashtags.length > 0 && (
                                  <tr><td colSpan={2} style={{ padding: '14px 18px', borderTop: '1px solid #E9D5FF' }}>
                                    <p style={{ margin: '0 0 6px', fontSize: '10px', fontWeight: '700', color: '#9B9EBB', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: font }}>Aktiv hashteqlər</p>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#7C3AED', lineHeight: '1.8', fontFamily: font }}>{smoSummary.hashtags.join('  ')}</p>
                                  </td></tr>
                                )}
                              </tbody>
                            </table>
                          </td></tr>
                        </>
                      )}

                      <Spacer h={28} />
                    </React.Fragment>
                  )
                }

                // ── SEO SECTION ────────────────────────────────
                if (!insights) return null

                const sc = insights.seo_score >= 75 ? '#00A37A' : insights.seo_score >= 50 ? '#D97706' : '#DC2626'
                const scBg = insights.seo_score >= 75 ? '#F0FDF9' : insights.seo_score >= 50 ? '#FFFBEB' : '#FEF2F2'
                const scBorder = insights.seo_score >= 75 ? '#6EE7B7' : insights.seo_score >= 50 ? '#FCD34D' : '#FCA5A5'
                const chg = insights.score_change >= 0
                const chgLabel = `${chg ? '+' : ''}${insights.score_change}`

                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && <><Spacer h={8} /><Divider /><Spacer h={8} /></>}
                    <Spacer h={28} />

                    {/* Section label */}
                    <tr><td style={{ padding: '0 32px' }}>
                      <table cellPadding={0} cellSpacing={0}><tbody><tr>
                        <td style={{ backgroundColor: '#EEF2FF', borderRadius: '6px', padding: '4px 10px' }}>
                          <p style={{ margin: 0, fontSize: '11px', fontWeight: '800', color: '#4338CA', textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: font }}>🔍 SEO Hesabatı</p>
                        </td>
                      </tr></tbody></table>
                    </td></tr>

                    <Spacer h={12} />

                    {/* Brand + score badge */}
                    <tr><td style={{ padding: '0 32px' }}>
                      <table width="100%" cellPadding={0} cellSpacing={0}>
                        <tbody><tr>
                          <td style={{ verticalAlign: 'middle' }}>
                            <p style={{ margin: '0 0 2px', fontSize: '22px', fontWeight: '800', color: '#0D0D1A', letterSpacing: '-0.3px', fontFamily: font }}>{brandName}</p>
                            <p style={{ margin: 0, fontSize: '13px', color: '#9B9EBB', fontFamily: font }}>{cleanUrl(siteUrl)}</p>
                          </td>
                          <td style={{ verticalAlign: 'middle', textAlign: 'right' }}>
                            <table cellPadding={0} cellSpacing={0} style={{ marginLeft: 'auto' }}>
                              <tbody><tr><td style={{ backgroundColor: scBg, border: `1px solid ${scBorder}`, borderRadius: '14px', padding: '10px 16px', textAlign: 'center' }}>
                                <p style={{ margin: '0 0 2px', fontSize: '28px', fontWeight: '900', color: sc, lineHeight: '1', fontFamily: font }}>{insights.seo_score}</p>
                                <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: chg ? '#00A37A' : '#DC2626', fontFamily: font }}>{chgLabel}</p>
                              </td></tr></tbody>
                            </table>
                          </td>
                        </tr></tbody>
                      </table>
                    </td></tr>

                    <Spacer h={18} />

                    {/* Stats row */}
                    <tr><td style={{ padding: '0 32px' }}>
                      <table width="100%" cellPadding={0} cellSpacing={0}>
                        <tbody><tr>
                          <td width="50%" style={{ paddingRight: '6px' }}>
                            <StatCard
                              value={insights.total_clicks.toLocaleString()}
                              label="Kliklər"
                              change={insights.total_clicks_change}
                            />
                          </td>
                          <td width="50%" style={{ paddingLeft: '6px' }}>
                            <StatCard
                              value={insights.total_impressions >= 1000 ? `${(insights.total_impressions / 1000).toFixed(1)}K` : String(insights.total_impressions)}
                              label="İmpresiya"
                              change={insights.total_impressions_change}
                            />
                          </td>
                        </tr></tbody>
                      </table>
                    </td></tr>

                    <Spacer h={20} />

                    {/* Headline */}
                    <tr><td style={{ padding: '0 32px' }}>
                      <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0D0D1A', lineHeight: '1.4', fontFamily: font }}>
                        {insights.headline}
                      </p>
                    </td></tr>

                    <Spacer h={12} />

                    {/* Summary */}
                    <tr><td style={{ padding: '0 32px' }}>
                      <BorderCard color="#5D50E8">
                        <p style={{ margin: 0, fontSize: '14px', color: '#2A2A3D', lineHeight: '1.7', fontFamily: font }}>{insights.summary}</p>
                      </BorderCard>
                    </td></tr>

                    {/* Improvements */}
                    {insights.improvements && insights.improvements.length > 0 && (
                      <>
                        <Spacer h={22} />
                        <tr><td style={{ padding: '0 32px' }}>
                          <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: '800', color: '#00A37A', textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: font }}>
                            ✅ Zirva ilə əldə edilən nəticələr
                          </p>
                          <table width="100%" cellPadding={0} cellSpacing={0}>
                            <tbody>
                              {insights.improvements.map((item, i) => (
                                <tr key={i}><td style={{ paddingBottom: i < insights.improvements.length - 1 ? '8px' : '0' }}>
                                  <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#F0FDF9', borderRadius: '12px', border: '1px solid #A7F3D0' }}>
                                    <tbody><tr>
                                      <td style={{ padding: '14px 16px', paddingRight: '8px' }}>
                                        <p style={{ margin: '0 0 3px', fontSize: '13px', fontWeight: '700', color: '#065F46', fontFamily: font }}>{item.metric}</p>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: '1.5', fontFamily: font }}>{item.detail}</p>
                                      </td>
                                      <td style={{ padding: '14px 16px 14px 8px', whiteSpace: 'nowrap', verticalAlign: 'middle', textAlign: 'right' }}>
                                        <p style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#059669', lineHeight: '1', fontFamily: font }}>{item.value}</p>
                                      </td>
                                    </tr></tbody>
                                  </table>
                                </td></tr>
                              ))}
                            </tbody>
                          </table>
                        </td></tr>
                      </>
                    )}

                    {/* Top keywords */}
                    {insights.top_performers && insights.top_performers.length > 0 && (
                      <>
                        <Spacer h={22} />
                        <tr><td style={{ padding: '0 32px' }}>
                          <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: '800', color: '#9B9EBB', textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: font }}>
                            Ən Yaxşı Açar Sözlər
                          </p>
                          <table width="100%" cellPadding={0} cellSpacing={0}>
                            <tbody>
                              {insights.top_performers.slice(0, 3).map((kw, i) => {
                                const pos = (kw.change.startsWith('+') || kw.change.startsWith('↑'))
                                const neg = (kw.change.startsWith('-') || kw.change.startsWith('↓'))
                                const kwChangeColor = pos ? '#00A37A' : neg ? '#DC2626' : '#9B9EBB'
                                return (
                                  <tr key={i}><td style={{ paddingBottom: i < 2 ? '6px' : '0' }}>
                                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#F4F4FA', borderRadius: '10px' }}>
                                      <tbody><tr>
                                        <td style={{ padding: '11px 14px' }}>
                                          <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#0D0D1A', fontFamily: font }}>{kw.keyword}</p>
                                        </td>
                                        <td style={{ padding: '11px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                          <p style={{ margin: 0, fontSize: '12px', color: '#9B9EBB', fontFamily: font }}>
                                            <span style={{ fontWeight: '700', color: '#0D0D1A' }}>{kw.clicks}</span>
                                            {' klik  '}
                                            <span style={{ color: '#5D50E8', fontWeight: '700' }}>#{typeof kw.position === 'number' ? kw.position.toFixed(0) : kw.position}</span>
                                            {'  '}
                                            <span style={{ fontWeight: '800', color: kwChangeColor }}>{kw.change}</span>
                                          </p>
                                        </td>
                                      </tr></tbody>
                                    </table>
                                  </td></tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </td></tr>
                      </>
                    )}

                    <Spacer h={28} />
                  </React.Fragment>
                )
              })}

              {/* ── SMO UPSELL ── */}
              {showSmoUpsell && (
                <>
                  <Spacer h={4} />
                  <Divider />
                  <Spacer h={24} />
                  <tr><td style={{ padding: '0 32px' }}>
                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#EEF2FF', borderRadius: '14px' }}>
                      <tbody><tr><td style={{ padding: '22px 24px', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '800', color: '#1E1B4B', fontFamily: font }}>Sosial mediada da böyüyün</p>
                        <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#6366F1', lineHeight: '1.6', fontFamily: font }}>
                          Instagram, TikTok və Facebook üçün hashteqlər, kontent strategiyası, auditoriya analizi.
                        </p>
                        <Link href="https://tryzirva.com/smo" style={{ display: 'inline-block', padding: '11px 28px', backgroundColor: '#5D50E8', color: '#ffffff', borderRadius: '10px', fontWeight: '700', fontSize: '13px', textDecoration: 'none', fontFamily: font }}>
                          SMO Paketi Al — 5 kredit
                        </Link>
                      </td></tr></tbody>
                    </table>
                  </td></tr>
                  <Spacer h={28} />
                </>
              )}

              {/* ── FOOTER ── */}
              <tr>
                <td style={{ backgroundColor: '#F4F4FA', borderTop: '1px solid #EBEBF5', padding: '18px 32px 22px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#8B8FA8', fontFamily: font }}>
                    Bu hesabat <span style={{ fontWeight: '700', color: '#5D50E8' }}>Zirva Avtopilot</span> tərəfindən göndərilib.
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#B0B3CC', fontFamily: font }}>
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
