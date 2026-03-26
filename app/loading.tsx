// FILE: app/loading.tsx
'use client'

import { useEffect, useState } from 'react'

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

export default function Loading() {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft>>(null)

  useEffect(() => {
    setTime(getTimeLeft())
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#EDEDFF',
      gap: 28,
      zIndex: 9999,
    }}>

      {/* Spinner */}
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '3px solid rgba(91,78,232,0.15)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: '#5B4EE8',
          animation: 'spin 0.9s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display, system-ui)',
          fontWeight: 800, fontSize: 22,
          color: '#3D2FD6',
          animation: 'fadeIn 0.4s ease-out 0.1s both',
        }}>Z</div>
      </div>

      {/* Brand */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        animation: 'rise 0.6s ease-out 0.1s both',
      }}>
        <span style={{
          fontFamily: 'var(--font-display, system-ui)',
          fontWeight: 800, fontSize: 34,
          letterSpacing: '-0.03em', color: '#0D0D1A',
        }}>Zirva</span>
        <span style={{
          fontSize: 11, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase' as const,
          color: '#5B4EE8',
        }}>Zirvəyə Doğru</span>
      </div>

      {/* Countdown */}
      {time && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          animation: 'rise 0.6s ease-out 0.3s both',
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#737599', letterSpacing: '0.05em' }}>
            50% endirim başa çatır:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'monospace' }}>
            {[time.d, time.h, time.m, time.s].map((val, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {i > 0 && <span style={{ color: 'rgba(91,78,232,0.4)', fontWeight: 700 }}>:</span>}
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  background: 'rgba(91,78,232,0.1)',
                  color: '#3D2FD6',
                  padding: '2px 6px', borderRadius: 6,
                  minWidth: 28, textAlign: 'center' as const,
                }}>{pad(val)}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rise    { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
