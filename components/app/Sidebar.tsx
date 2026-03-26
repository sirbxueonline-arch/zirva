'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Brand } from '@/types'
import { PLAN_NAMES } from '@/types'
import {
  LayoutDashboard, Search, Clock, ChevronDown,
  Settings2, LogOut, Plus, HelpCircle, Mail,
  type LucideIcon,
} from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 400, damping: 30 }
const SPRING_MENU = { type: 'spring' as const, stiffness: 320, damping: 26 }

const NAV_ITEMS: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: 'Dashboard',  href: '/dashboard', Icon: LayoutDashboard },
  { label: 'SEO Paketi', href: '/generate',  Icon: Search },
  { label: 'Tarixçə',   href: '/history',   Icon: Clock },
]

interface SidebarProps {
  profile: Profile | null
  onOpenSettings?: () => void
}

export default function Sidebar({ profile, onOpenSettings }: SidebarProps) {
  const pathname  = usePathname()
  const router    = useRouter()
  const supabase  = createClient()
  const menuRef   = useRef<HTMLDivElement>(null)

  const [menuOpen, setMenuOpen] = useState(false)
  const [brands,   setBrands]   = useState<Brand[]>([])

  useEffect(() => {
    fetch('/api/brands').then(r => r.ok ? r.json() : null).then(d => { if (d?.brands) setBrands(d.brands) })
  }, [])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const planColor = { free: '#9B9EBB', pro: '#7B6EF6', agency: '#00C9A7' }[profile?.plan ?? 'free']
  const avatarLetter = (profile?.full_name || profile?.email || '?')[0].toUpperCase()

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 border-r z-30"
      style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', boxShadow: '2px 0 12px rgba(13,13,26,0.06)' }}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b" style={{ borderColor: 'rgba(123,110,246,0.12)' }}>
        <Link href="/" className="font-display font-bold text-2xl text-primary">Zirva</Link>
      </div>

      {/* New CTA */}
      <div className="px-4 py-4">
        <Link href="/generate"
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <span>+</span> Yeni SEO Paketi
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2">
        {NAV_ITEMS.map((item, i) => {
          const active = pathname === item.href
          return (
            <motion.div key={item.href} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ ...SPRING, delay: i * 0.05 }}>
              <Link href={item.href}
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

      {/* Bottom user section with dropdown */}
      <div className="border-t px-3 py-3 relative" style={{ borderColor: 'rgba(123,110,246,0.12)' }} ref={menuRef}>
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-gray-50"
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)' }}>
            {avatarLetter}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-xs font-semibold text-text-primary truncate">{profile?.full_name || 'İstifadəçi'}</div>
            <div className="text-xs text-text-muted truncate">{profile?.email}</div>
          </div>
          <ChevronDown size={14} strokeWidth={2} style={{ color: '#9B9EBB', transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </button>

        {/* Dropdown menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="absolute left-3 right-3 bottom-[72px] rounded-2xl border overflow-hidden"
              style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', boxShadow: '0 -8px 32px rgba(13,13,26,0.12)', zIndex: 50 }}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={SPRING_MENU}
            >
              {/* Account */}
              <div className="px-3 pt-3 pb-1">
                <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-1" style={{ color: '#C0C3D8' }}>Hesab</p>
                <button onClick={() => { setMenuOpen(false); onOpenSettings?.() }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-gray-50 text-text-secondary">
                  <Settings2 size={15} strokeWidth={1.8} style={{ color: '#9B9EBB' }} /> Parametrlər
                </button>
              </div>

              <div className="h-px mx-3" style={{ background: 'rgba(123,110,246,0.08)' }} />

              {/* Support */}
              <div className="px-3 py-1">
                <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-1 mt-1" style={{ color: '#C0C3D8' }}>Dəstək</p>
                <a href="mailto:support@tryzirva.com"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-gray-50 text-text-secondary">
                  <Mail size={15} strokeWidth={1.8} style={{ color: '#9B9EBB' }} /> Dəstəklə əlaqə
                </a>
                <Link href="/how-it-works" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-gray-50 text-text-secondary">
                  <HelpCircle size={15} strokeWidth={1.8} style={{ color: '#9B9EBB' }} /> Yardım mərkəzi
                </Link>
              </div>

              <div className="h-px mx-3" style={{ background: 'rgba(123,110,246,0.08)' }} />

              {/* Brands */}
              <div className="px-3 py-1">
                <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-1 mt-1" style={{ color: '#C0C3D8' }}>Brendlər</p>
                {brands.slice(0, 4).map(b => (
                  <Link key={b.id} href="/brands" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-gray-50 text-text-secondary">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: `hsl(${(b.name.charCodeAt(0) * 37) % 360}, 60%, 60%)` }}>
                      {b.name[0].toUpperCase()}
                    </div>
                    <span className="truncate">{b.name}</span>
                  </Link>
                ))}
                <Link href="/brands" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-gray-50"
                  style={{ color: '#7B6EF6' }}>
                  <div className="w-6 h-6 rounded-full border-2 border-dashed flex items-center justify-center flex-shrink-0" style={{ borderColor: '#7B6EF6' }}>
                    <Plus size={11} strokeWidth={2.5} />
                  </div>
                  Yeni brend əlavə et
                </Link>
              </div>

              <div className="h-px mx-3" style={{ background: 'rgba(123,110,246,0.08)' }} />

              {/* Plan badge + logout */}
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: `${planColor}18`, color: planColor, border: `1px solid ${planColor}35` }}>
                  {PLAN_NAMES[profile?.plan ?? 'free']}
                </span>
                <button onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all hover:bg-red-50"
                  style={{ color: '#F25C54' }}>
                  <LogOut size={12} strokeWidth={2} /> Çıxış
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  )
}
