'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { X, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const APP_PATHS = ['/dashboard', '/generate', '/history', '/result', '/settings', '/smo', '/onboarding', '/help']

const DEADLINE = new Date('2026-04-30T23:59:59').getTime()

function getTimeLeft() {
  const diff = DEADLINE - Date.now()
  if (diff <= 0) return null
  return {
    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
    m: Math.floor((diff / (1000 * 60)) % 60),
    s: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function LaunchBanner() {
  const pathname = usePathname()
  const [time, setTime]         = useState<ReturnType<typeof getTimeLeft>>(null)
  const [dismissed, setDismiss] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('launch-banner-dismissed')) {
      setDismiss(true)
      return
    }
    setTime(getTimeLeft())
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  function dismiss() {
    sessionStorage.setItem('launch-banner-dismissed', '1')
    setDismiss(true)
  }

  const isAppPage = APP_PATHS.some(p => pathname.startsWith(p))
  if (dismissed || !time || isAppPage) return null

  const vals = [time.d, time.h, time.m, time.s]

  return (
    <div
      className="sticky z-40 flex items-center justify-center gap-3 sm:gap-5 px-10 py-0"
      style={{
        top: 64,
        minHeight: 46,
        backgroundImage: 'linear-gradient(90deg, #1a0f6e 0%, #4f3cc9 30%, #7B6EF6 55%, #4f3cc9 75%, #1a0f6e 100%)',
        backgroundSize: '300% 100%',
        animation: 'bannerShimmer 7s linear infinite',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Fire badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 20,
        padding: '2px 10px 2px 7px',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 13 }}>🔥</span>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#FCD34D',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>Məhdud Təklif</span>
      </div>

      {/* Main message */}
      <span style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.95)',
        whiteSpace: 'nowrap',
        letterSpacing: '0.01em',
      }}>
        Bütün planlarda{' '}
        <span style={{
          color: '#FCD34D',
          fontWeight: 800,
          fontSize: 14,
        }}>50% endirim</span>
        {' '}— teklif bitir:
      </span>

      {/* Countdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {vals.map((val, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {i > 0 && (
              <span style={{
                color: 'rgba(255,255,255,0.35)',
                fontWeight: 800,
                fontSize: 15,
                lineHeight: 1,
              }}>:</span>
            )}
            <div style={{
              fontFamily: 'monospace',
              fontSize: 15,
              fontWeight: 800,
              color: '#ffffff',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 7,
              padding: '3px 8px',
              minWidth: 36,
              textAlign: 'center',
              letterSpacing: '0.04em',
              lineHeight: 1.4,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
            }}>
              {pad(val)}
            </div>
          </div>
        ))}
      </div>

      {/* CTA button */}
      <Link
        href="/signup"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          background: '#FCD34D',
          color: '#1a0f6e',
          fontWeight: 800,
          fontSize: 12,
          padding: '5px 14px',
          borderRadius: 20,
          whiteSpace: 'nowrap',
          letterSpacing: '0.02em',
          textDecoration: 'none',
          flexShrink: 0,
          transition: 'transform 0.15s, box-shadow 0.15s',
          boxShadow: '0 0 16px rgba(252,211,77,0.4)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(252,211,77,0.6)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(252,211,77,0.4)'
        }}
      >
        İndi Al
        <ArrowRight size={12} strokeWidth={3} />
      </Link>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:bg-white/15"
        aria-label="Bağla"
      >
        <X size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
      </button>

      <style>{`
        @keyframes bannerShimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 300% center; }
        }
      `}</style>
    </div>
  )
}
