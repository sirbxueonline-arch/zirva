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

interface AutopilotReportEmailProps {
  userName: string
  siteUrl: string
  headline: string
  summary: string
  seoScore: number
  scoreChange: number
  totalClicks: number
  totalClicksChange: string
  totalImpressions: number
  totalImpressionsChange: string
  topPerformers: { keyword: string; clicks: number; position: number; change: string }[]
  declining: { keyword: string; position_drop: number; reason: string }[]
  actionItems: string[]
  opportunity: string
  warning: string
  period: string
  unsubscribeUrl: string
}

export default function AutopilotReportEmail({
  userName,
  siteUrl,
  headline,
  summary,
  seoScore,
  scoreChange,
  totalClicks,
  totalClicksChange,
  totalImpressions,
  totalImpressionsChange,
  topPerformers,
  declining,
  actionItems,
  opportunity,
  warning,
  period,
  unsubscribeUrl,
}: AutopilotReportEmailProps) {
  const scoreColor = seoScore >= 75 ? '#00C9A7' : seoScore >= 50 ? '#F5A623' : '#F25C54'
  const changePositive = scoreChange >= 0
  const changeColor = changePositive ? '#00C9A7' : '#F25C54'

  return (
    <Html lang="az">
      <Head />
      <Preview>{headline}</Preview>
      <Body style={{ backgroundColor: '#F5F5FF', fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px' }}>

          {/* Header */}
          <Section style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px 16px 0 0',
            padding: '28px 32px 20px',
            borderBottom: '1px solid rgba(123,110,246,0.1)',
          }}>
            <table width="100%" cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr>
                  <td>
                    <Text style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#7B6EF6', letterSpacing: '-0.5px' }}>
                      Zirva
                    </Text>
                    <Text style={{ margin: '2px 0 0', fontSize: '13px', color: '#9B9EBB' }}>
                      Avtopilot SEO Hesabatı
                    </Text>
                  </td>
                  <td style={{ textAlign: 'right', verticalAlign: 'top' }}>
                    <Text style={{ margin: 0, fontSize: '12px', color: '#9B9EBB', lineHeight: '1.5' }}>
                      {period}
                    </Text>
                    <Text style={{ margin: '2px 0 0', fontSize: '12px', color: '#9B9EBB' }}>
                      {siteUrl}
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Main content */}
          <Section style={{
            backgroundColor: '#ffffff',
            padding: '28px 32px',
          }}>
            {/* Greeting */}
            <Text style={{ margin: '0 0 4px', fontSize: '14px', color: '#9B9EBB' }}>
              Salam, {userName}
            </Text>

            {/* Headline */}
            <Text style={{ margin: '0 0 20px', fontSize: '22px', fontWeight: '700', color: '#0D0D1A', lineHeight: '1.3' }}>
              {headline}
            </Text>

            {/* Stats row */}
            <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '24px' }}>
              <tbody>
                <tr>
                  {/* SEO Score */}
                  <td width="25%" style={{ paddingRight: '8px' }}>
                    <div style={{
                      backgroundColor: '#F5F5FF',
                      borderRadius: '12px',
                      padding: '14px 12px',
                      textAlign: 'center',
                      border: `1px solid ${scoreColor}30`,
                    }}>
                      <Text style={{ margin: '0 0 2px', fontSize: '26px', fontWeight: '800', color: scoreColor, lineHeight: '1' }}>
                        {seoScore}
                      </Text>
                      <Text style={{ margin: '0 0 4px', fontSize: '10px', color: '#9B9EBB', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
                        SEO Skoru
                      </Text>
                      <Text style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: changeColor }}>
                        {changePositive ? '+' : ''}{scoreChange}
                      </Text>
                    </div>
                  </td>

                  {/* Clicks */}
                  <td width="25%" style={{ paddingRight: '8px', paddingLeft: '4px' }}>
                    <div style={{
                      backgroundColor: '#F5F5FF',
                      borderRadius: '12px',
                      padding: '14px 12px',
                      textAlign: 'center',
                    }}>
                      <Text style={{ margin: '0 0 2px', fontSize: '22px', fontWeight: '800', color: '#0D0D1A', lineHeight: '1' }}>
                        {totalClicks.toLocaleString()}
                      </Text>
                      <Text style={{ margin: '0 0 4px', fontSize: '10px', color: '#9B9EBB', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
                        Kliklər
                      </Text>
                      <Text style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: totalClicksChange.startsWith('+') ? '#00C9A7' : '#F25C54' }}>
                        {totalClicksChange}
                      </Text>
                    </div>
                  </td>

                  {/* Impressions */}
                  <td width="25%" style={{ paddingRight: '4px', paddingLeft: '4px' }}>
                    <div style={{
                      backgroundColor: '#F5F5FF',
                      borderRadius: '12px',
                      padding: '14px 12px',
                      textAlign: 'center',
                    }}>
                      <Text style={{ margin: '0 0 2px', fontSize: '22px', fontWeight: '800', color: '#0D0D1A', lineHeight: '1' }}>
                        {totalImpressions >= 1000 ? `${(totalImpressions / 1000).toFixed(1)}K` : totalImpressions.toLocaleString()}
                      </Text>
                      <Text style={{ margin: '0 0 4px', fontSize: '10px', color: '#9B9EBB', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
                        İmpresiya
                      </Text>
                      <Text style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: totalImpressionsChange.startsWith('+') ? '#00C9A7' : '#F25C54' }}>
                        {totalImpressionsChange}
                      </Text>
                    </div>
                  </td>

                  {/* Period label */}
                  <td width="25%" style={{ paddingLeft: '4px' }}>
                    <div style={{
                      backgroundColor: 'rgba(123,110,246,0.06)',
                      borderRadius: '12px',
                      padding: '14px 12px',
                      textAlign: 'center',
                      border: '1px solid rgba(123,110,246,0.12)',
                    }}>
                      <Text style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '700', color: '#7B6EF6', lineHeight: '1.3' }}>
                        3 Günlük
                      </Text>
                      <Text style={{ margin: 0, fontSize: '10px', color: '#9B9EBB', fontWeight: '600', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
                        Hesabat
                      </Text>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Summary */}
            <div style={{
              backgroundColor: '#F5F5FF',
              borderRadius: '12px',
              padding: '16px 18px',
              marginBottom: '24px',
              borderLeft: '3px solid #7B6EF6',
            }}>
              <Text style={{ margin: 0, fontSize: '14px', color: '#0D0D1A', lineHeight: '1.6' }}>
                {summary}
              </Text>
            </div>

            {/* Top performers */}
            {topPerformers && topPerformers.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <Text style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: '700', color: '#0D0D1A' }}>
                  Ən Yaxşı Açar Sözlər
                </Text>
                {topPerformers.slice(0, 3).map((kw, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 14px',
                    backgroundColor: i % 2 === 0 ? '#F5F5FF' : '#ffffff',
                    borderRadius: '10px',
                    marginBottom: '6px',
                    border: '1px solid rgba(123,110,246,0.08)',
                  }}>
                    <table width="100%" cellPadding={0} cellSpacing={0}>
                      <tbody>
                        <tr>
                          <td>
                            <Text style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#0D0D1A' }}>
                              {kw.keyword}
                            </Text>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <Text style={{ margin: 0, fontSize: '12px', color: '#9B9EBB' }}>
                              {kw.clicks} klik · #{kw.position.toFixed(1)} mövqe
                              {' '}
                              <span style={{ color: kw.change.startsWith('+') || kw.change.startsWith('↑') ? '#00C9A7' : '#F25C54', fontWeight: '600' }}>
                                {kw.change}
                              </span>
                            </Text>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}

            {/* Action items */}
            {actionItems && actionItems.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <Text style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: '700', color: '#0D0D1A' }}>
                  Bu Həftə Nə Etməli
                </Text>
                {actionItems.slice(0, 3).map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    marginBottom: '8px',
                  }}>
                    <table width="100%" cellPadding={0} cellSpacing={0}>
                      <tbody>
                        <tr>
                          <td width="28" style={{ verticalAlign: 'top', paddingTop: '1px' }}>
                            <div style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              backgroundColor: '#7B6EF6',
                              color: '#ffffff',
                              fontSize: '11px',
                              fontWeight: '700',
                              textAlign: 'center',
                              lineHeight: '22px',
                              display: 'inline-block',
                            }}>
                              {i + 1}
                            </div>
                          </td>
                          <td style={{ paddingLeft: '8px', verticalAlign: 'middle' }}>
                            <Text style={{ margin: 0, fontSize: '13px', color: '#0D0D1A', lineHeight: '1.5' }}>
                              {item}
                            </Text>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}

            {/* Opportunity */}
            {opportunity && (
              <div style={{
                backgroundColor: 'rgba(0,201,167,0.06)',
                border: '1px solid rgba(0,201,167,0.25)',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '12px',
              }}>
                <Text style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '700', color: '#00C9A7', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
                  İmkan
                </Text>
                <Text style={{ margin: 0, fontSize: '13px', color: '#0D0D1A', lineHeight: '1.5' }}>
                  {opportunity}
                </Text>
              </div>
            )}

            {/* Warning */}
            {warning && (
              <div style={{
                backgroundColor: 'rgba(242,92,84,0.06)',
                border: '1px solid rgba(242,92,84,0.25)',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '24px',
              }}>
                <Text style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: '700', color: '#F25C54', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
                  Diqqət
                </Text>
                <Text style={{ margin: 0, fontSize: '13px', color: '#0D0D1A', lineHeight: '1.5' }}>
                  {warning}
                </Text>
              </div>
            )}

            {/* Declining keywords */}
            {declining && declining.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <Text style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: '700', color: '#0D0D1A' }}>
                  Düşən Açar Sözlər
                </Text>
                {declining.map((kw, i) => (
                  <div key={i} style={{
                    padding: '10px 14px',
                    backgroundColor: 'rgba(242,92,84,0.04)',
                    borderRadius: '10px',
                    marginBottom: '6px',
                    border: '1px solid rgba(242,92,84,0.1)',
                  }}>
                    <table width="100%" cellPadding={0} cellSpacing={0}>
                      <tbody>
                        <tr>
                          <td>
                            <Text style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: '#0D0D1A' }}>
                              {kw.keyword}
                            </Text>
                            <Text style={{ margin: 0, fontSize: '12px', color: '#9B9EBB' }}>
                              {kw.reason}
                            </Text>
                          </td>
                          <td style={{ textAlign: 'right', verticalAlign: 'top' }}>
                            <Text style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#F25C54' }}>
                              -{kw.position_drop}
                            </Text>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Footer */}
          <Section style={{
            backgroundColor: '#ffffff',
            borderRadius: '0 0 16px 16px',
            padding: '16px 32px 24px',
            borderTop: '1px solid rgba(123,110,246,0.1)',
          }}>
            <Hr style={{ borderColor: 'rgba(123,110,246,0.1)', margin: '0 0 16px' }} />
            <Text style={{ margin: '0 0 6px', fontSize: '12px', color: '#9B9EBB', textAlign: 'center' as const }}>
              Bu hesabat Zirva Avtopilot tərəfindən avtomatik göndərilib.
            </Text>
            <Text style={{ margin: 0, fontSize: '12px', color: '#9B9EBB', textAlign: 'center' as const }}>
              Artıq almaq istəmirsinizsə,{' '}
              <Link href={unsubscribeUrl} style={{ color: '#7B6EF6', textDecoration: 'underline' }}>
                abunəlikdən çıxın
              </Link>
              {' '}·{' '}
              <Link href="https://tryzirva.com" style={{ color: '#7B6EF6', textDecoration: 'underline' }}>
                tryzirva.com
              </Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}
