'use client'
// v3 — mobile responsive

import { useState } from 'react'
import Sidebar from './Sidebar'
import SettingsModal from './SettingsModal'
import type { Profile } from '@/types'
import { Menu } from 'lucide-react'

interface Props {
  profile: Profile | null
  children: React.ReactNode
}

export default function AppShell({ profile, children }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

      <main className="md:ml-60 min-h-screen pt-14 md:pt-0">{children}</main>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
