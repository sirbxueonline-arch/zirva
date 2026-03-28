'use client'
// v4 — mobile bottom nav + low-credit banner

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from './Sidebar'
import SettingsModal from './SettingsModal'
import MobileBottomNav from './MobileBottomNav'
import type { Profile } from '@/types'
import { Menu } from 'lucide-react'

interface Props {
  profile: Profile | null
  children: React.ReactNode
}

export default function AppShell({ profile, children }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const creditsUsed  = (profile as unknown as Record<string, unknown>)?.credits_used  as number ?? 0
  const creditsLimit = (profile as unknown as Record<string, unknown>)?.credits_limit as number ?? 25
  const creditPct    = creditsLimit > 0 ? Math.min(100, Math.round((creditsUsed / creditsLimit) * 100)) : 0
  const creditsLeft  = Math.max(0, creditsLimit - creditsUsed)
  const showWarning  = creditPct >= 85

  const warningBg     = creditPct >= 95 ? '#FEF2F2' : '#FFFBEB'
  const warningBorder = creditPct >= 95 ? '#FCA5A5' : '#FDE68A'
  const warningText   = creditPct >= 95 ? '#DC2626'  : '#D97706'
  const warningBtn    = creditPct >= 95 ? '#DC2626'  : '#D97706'

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 border-b"
        style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', boxShadow: '0 1px 8px rgba(13,13,26,0.06)' }}>
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors hover:bg-gray-100"
          aria-label="Menyu aç"
        >
          <Menu size={20} strokeWidth={2} style={{ color: '#5A5D7A' }} />
        </button>
        <span className="font-display font-bold text-lg text-primary">Zirva</span>
        <div className="w-10" />
      </div>

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        profile={profile}
        onOpenSettings={() => setSettingsOpen(true)}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* Low-credit sticky banner */}
      {showWarning && (
        <div
          className="fixed left-0 md:left-60 right-0 z-30 flex items-center justify-between px-4 py-2.5 gap-3"
          style={{
            top: '56px',
            background: warningBg,
            borderBottom: `1px solid ${warningBorder}`,
          }}
        >
          <p className="text-xs sm:text-sm font-semibold" style={{ color: warningText }}>
            {creditPct >= 95 ? '🚨' : '⚠️'} Yalnız <strong>{creditsLeft} kredit</strong> qaldı — generasiyalar dayanacaq
          </p>
          <Link
            href="/settings/billing"
            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90"
            style={{ background: warningBtn }}
          >
            Kredit al
          </Link>
        </div>
      )}

      <main className={`md:ml-60 min-h-screen pt-14 md:pt-0 pb-20 md:pb-0${showWarning ? ' pt-[calc(56px+44px)] md:pt-[44px]' : ''}`}>
        {children}
      </main>

      <MobileBottomNav />

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
