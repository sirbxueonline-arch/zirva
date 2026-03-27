import React from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Preview,
} from '@react-email/components'

interface LowCreditsEmailProps {
  userName: string
  billingUrl: string
}

export default function LowCreditsEmail({ userName, billingUrl }: LowCreditsEmailProps) {
  return (
    <Html lang="az">
      <Head />
      <Preview>Zirva — Avtopilot bu dəfə işləmədi</Preview>
      <Body style={{ backgroundColor: '#F5F5FF', fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 16px' }}>

          <Section style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '36px 32px',
            border: '1px solid rgba(123,110,246,0.12)',
            boxShadow: '0 4px 24px rgba(13,13,26,0.06)',
          }}>
            {/* Logo */}
            <Text style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: '800', color: '#7B6EF6' }}>
              Zirva
            </Text>

            {/* Icon */}
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: 'rgba(242,92,84,0.1)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ margin: 0, fontSize: '26px', lineHeight: '52px', textAlign: 'center' as const }}>⚡</Text>
            </div>

            <Text style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '700', color: '#0D0D1A' }}>
              Avtopilot bu dəfə işləmədi
            </Text>

            <Text style={{ margin: '0 0 20px', fontSize: '14px', color: '#5A5D7A', lineHeight: '1.6' }}>
              Salam {userName}, bu dəfə avtopilot hesabatınız hazırlana bilmədi çünki hesabınızda 5 kredittən az kredit var.
            </Text>

            <Text style={{ margin: '0 0 28px', fontSize: '14px', color: '#5A5D7A', lineHeight: '1.6' }}>
              Hesabatı almağa davam etmək üçün kredit balansınızı artırın. Pro planında hər ay 250 kredit, Agency planında isə 1000 kredit verilir.
            </Text>

            {/* CTA */}
            <Link
              href={billingUrl}
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                backgroundColor: '#7B6EF6',
                color: '#ffffff',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '15px',
                textDecoration: 'none',
              }}
            >
              Krediti Artır →
            </Link>
          </Section>

          {/* Footer */}
          <Text style={{ margin: '20px 0 0', fontSize: '12px', color: '#9B9EBB', textAlign: 'center' as const }}>
            Zirva · <Link href="https://tryzirva.com" style={{ color: '#7B6EF6', textDecoration: 'none' }}>tryzirva.com</Link>
          </Text>

        </Container>
      </Body>
    </Html>
  )
}
