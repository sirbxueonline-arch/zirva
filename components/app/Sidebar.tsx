'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'
import { PLAN_NAMES } from '@/types'
import {
  LayoutDashboard,
  Search,
  Share2,
  Clock,
  Settings,
  CreditCard,
  LogOut,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 400, damping: 30 }

const NAV_ITEMS: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: 'Dashboard',    href: '/dashboard',        Icon: LayoutDashboard },
  { label: 'SEO Paketi',   href: '/generate',          Icon: Search },
  { label: 'SMO Paketi',   href: '/smo',               Icon: Share2 },
  { label: 'Tarixçə',      href: '/history',            Icon: Clock },
  { label: 'Parametrlər',  href: '/settings',           Icon: Settings },
  { label: 'Billing',      href: '/settings/billing',   Icon: CreditCard },
]

interface SidebarProps {
  profile: Profile | null
}

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const planColor = {
    free:   '#9B9EBB',
    pro:    '#7B6EF6',
    agency: '#00C9A7',
  }[profile?.plan ?? 'free']

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 border-r z-30"
      style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', boxShadow: '2px 0 12px rgba(13,13,26,0.06)' }}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b" style={{ borderColor: 'rgba(123,110,246,0.12)' }}>
        <Link href="/" className="font-display font-bold text-2xl text-primary">
          Zirva
        </Link>
      </div>

      {/* New generation CTA */}
      <div className="px-4 py-4">
        <Link
          href="/generate"
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          <span>+</span>
          Yeni SEO Paketi
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2">
        {NAV_ITEMS.map((item, i) => {
          const active = pathname === item.href
          return (
            <motion.div
              key={item.href}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ ...SPRING_SNAPPY, delay: i * 0.05 }}
            >
              <Link
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-1"
                style={{
                  background: active ? 'rgba(123,110,246,0.12)' : 'transparent',
                  color: active ? '#7B6EF6' : '#5A5D7A',
                  border: active ? '1px solid rgba(123,110,246,0.2)' : '1px solid transparent',
                }}
              >
                <item.Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                {item.label}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t px-4 py-4" style={{ borderColor: 'rgba(123,110,246,0.12)' }}>
        {profile && (
          <div className="mb-3 px-2">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: '#7B6EF6' }}
              >
                {(profile.full_name || profile.email)[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-text-primary text-xs font-medium truncate">
                  {profile.full_name || 'İstifadəçi'}
                </div>
                <div className="text-text-muted text-xs truncate">{profile.email}</div>
              </div>
            </div>
            <div className="mt-2">
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: `${planColor}20`,
                  color: planColor,
                  border: `1px solid ${planColor}40`,
                }}
              >
                {PLAN_NAMES[profile.plan]}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-text-muted hover:text-error hover:bg-surface-hover text-sm transition-all duration-200"
        >
          <LogOut size={15} strokeWidth={1.8} />
          Çıxış
        </button>
      </div>
    </aside>
  )
}
