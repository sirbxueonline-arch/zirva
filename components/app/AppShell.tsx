'use client'
// v2

import { useState } from 'react'
import Sidebar from './Sidebar'
import SettingsModal from './SettingsModal'
import type { Profile } from '@/types'

interface Props {
  profile: Profile | null
  children: React.ReactNode
}

export default function AppShell({ profile, children }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      <Sidebar profile={profile} onOpenSettings={() => setSettingsOpen(true)} />
      <main className="md:ml-60 min-h-screen">{children}</main>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
