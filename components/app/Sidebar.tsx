'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Brand } from '@/types'
import { PLAN_NAMES } from '@/types'
import {
  LayoutDashboard, Globe, Clock, ChevronDown,
  Settings2, LogOut, Plus, HelpCircle, Mail, Share2, Building2, Zap,
  type LucideIcon,
} from 'lucide-react'
import BrandAvatar from './BrandAvatar'

const SPRING = { type: 'spring' as const, stiffness: 400, damping: 30 }
const SPRING_MENU = { type: 'spring' as const, stiffness: 320, damping: 26 }

const NAV_ITEMS: { label: string; href: string; Icon: LucideIcon; activeColor?: string; activeBg?: string; activeBorder?: string }[] = [
  { label: 'Dashboard',  href: '/dashboard', Icon: LayoutDashboard },
  { label: 'SEO Paketi', href: '/generate',  Icon: Globe },
  { label: 'SMO Paketi', href: '/smo',       Icon: Share2,    activeColor: '#00C9A7', activeBg: 'rgba(0,201,167,0.12)', activeBorder: 'rgba(0,201,167,0.2)' },
  { label: 'Brendlər',  href: '/brands',    Icon: Building2 },
  { label: 'Tarixçə',   href: '/history',   Icon: Clock },
  { label: 'Avtopilot', href: '/settings/autopilot', Icon: Zap, activeColor: '#F5A623', activeBg: 'rgba(245,166,35,0.1)', activeBorder: 'rgba(245,166,35,0.25)' },
]

interface SidebarProps {
  profile: Profile | null
  onOpenSettings?: () => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export default function Sidebar({ profile, onOpenSettings, mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname  = usePathname()
  const router    = useRouter()
  const supabase  = createClient()
  const menuRef   = useRef<HTMLDivElement>(null)

  const [menuOpen,       setMenuOpen]       = useState(false)
  const [brands,         setBrands]         = useState<Brand[]>([])
  const [activeBrand,    setActiveBrand]    = useState<Brand | null>(null)
  const [brandDropOpen,  setBrandDropOpen]  = useState(false)
  const brandDropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/brands').then(r => r.ok ? r.json() : null).then(d => {
      if (!d?.brands) return
      setBrands(d.brands)
      const savedId = localStorage.getItem('zirva_active_brand')
      const saved   = savedId ? d.brands.find((b: Brand) => b.id === savedId) : null
      setActiveBrand(saved ?? d.brands[0] ?? null)
    })
  }, [])

  useEffect(() => {
    function onBrandChange(e: Event) {
      setActiveBrand((e as CustomEvent<Brand>).detail)
    }
    window.addEventListener('zirva-brand-change', onBrandChange)
    return () => window.removeEventListener('zirva-brand-change', onBrandChange)
  }, [])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (brandDropRef.current && !brandDropRef.current.contains(e.target as Node)) setBrandDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function switchBrand(b: Brand) {
    setActiveBrand(b)
    setBrandDropOpen(false)
    localStorage.setItem('zirva_active_brand', b.id)
    window.dispatchEvent(new CustomEvent('zirva-brand-change', { detail: b }))
  }

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
    <aside
      className={`flex flex-col fixed left-0 top-0 h-full w-72 md:w-60 border-r z-50 transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', boxShadow: '2px 0 12px rgba(13,13,26,0.06)' }}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: 'rgba(123,110,246,0.12)' }}>
        <Link href="/" className="font-display font-bold text-2xl text-primary" onClick={onMobileClose}>Zirva</Link>
        <button
          onClick={onMobileClose}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
          aria-label="Menyu bağla"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="#5A5D7A" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Brand switcher */}
      {brands.length > 0 && (
        <div className="px-4 pt-3 pb-1 relative" ref={brandDropRef}>
          <button
            onClick={() => setBrandDropOpen(v => !v)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all hover:bg-gray-50"
            style={{ border: '1px solid rgba(123,110,246,0.15)' }}
          >
            {activeBrand ? (
              <>
                <BrandAvatar brand={activeBrand} size={24} />
                <span className="flex-1 text-xs font-semibold text-left truncate" style={{ color: '#0D0D1A' }}>{activeBrand.name}</span>
              </>
            ) : (
              <span className="flex-1 text-xs text-left" style={{ color: '#9B9EBB' }}>Brend seçin</span>
            )}
            <ChevronDown size={12} strokeWidth={2.5} style={{ color: '#9B9EBB', transform: brandDropOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s', flexShrink: 0 }} />
          </button>

          <AnimatePresence>
            {brandDropOpen && (
              <motion.div
                className="absolute left-4 right-4 top-full mt-1 rounded-xl border overflow-hidden z-50"
                style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.15)', boxShadow: '0 8px 24px rgba(13,13,26,0.12)' }}
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {brands.map(b => (
                  <button key={b.id} onClick={() => switchBrand(b)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-left transition-all hover:bg-gray-50"
                    style={{ borderBottom: '1px solid rgba(123,110,246,0.06)', background: activeBrand?.id === b.id ? 'rgba(123,110,246,0.06)' : undefined }}
                  >
                    <BrandAvatar brand={b} size={24} />
                    <span className="flex-1 font-semibold truncate" style={{ color: '#0D0D1A' }}>{b.name}</span>
                    {activeBrand?.id === b.id && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#7B6EF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </button>
                ))}
                <Link href="/brands" onClick={() => setBrandDropOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold transition-all hover:bg-gray-50"
                  style={{ color: '#7B6EF6' }}
                >
                  <Plus size={12} strokeWidth={2.5} /> Brend idarə et
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* New CTA */}
      <div className="px-4 py-3">
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
          const color  = active ? (item.activeColor ?? '#7B6EF6') : '#5A5D7A'
          const bg     = active ? (item.activeBg ?? 'rgba(123,110,246,0.12)') : 'transparent'
          const border = active ? `1px solid ${item.activeBorder ?? 'rgba(123,110,246,0.2)'}` : '1px solid transparent'
          return (
            <motion.div key={item.href} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ ...SPRING, delay: i * 0.05 }}>
              <Link href={item.href} onClick={onMobileClose}
                className="flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-1"
                style={{ background: bg, color, border }}
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
