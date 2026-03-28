'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Globe, Building2, Clock, Zap } from 'lucide-react'

const TABS = [
  { href: '/dashboard', Icon: LayoutDashboard, label: 'Ana Səhifə' },
  { href: '/generate',  Icon: Globe,           label: 'SEO' },
  { href: '/brands',    Icon: Building2,        label: 'Brendlər' },
  { href: '/history',   Icon: Clock,            label: 'Tarixçə' },
  { href: '/autopilot', Icon: Zap,              label: 'Avtopilot' },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t"
      style={{
        background: '#FFFFFF',
        borderColor: 'rgba(123,110,246,0.12)',
        boxShadow: '0 -4px 20px rgba(13,13,26,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around px-1 pt-2 pb-3">
        {TABS.map(({ href, Icon, label }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 min-w-0 flex-1"
              style={{
                background: active ? 'rgba(123,110,246,0.1)' : 'transparent',
                color: active ? '#7B6EF6' : '#9B9EBB',
              }}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              <span className="text-[10px] font-semibold leading-none">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
