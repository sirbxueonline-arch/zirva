'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ToastContainer } from '@/components/shared/Toast'
import type { Profile, BillingPeriod } from '@/types'
import { PLAN_NAMES, PLAN_PRICES, PLAN_PERIOD_PRICES } from '@/types'
import {
  LayoutGrid, Plug, CreditCard, User,
  Globe, CheckCircle2, Plus, AlertTriangle,
  Package, Languages, ClipboardList, Download,
  Search, Sparkles, Zap, CheckCircle, BarChart2, Target,
  Star, ArrowRight, Loader2, type LucideIcon,
} from 'lucide-react'
import WordPressModal from './WordPressModal'
import CMSConnectModal from './CMSConnectModal'

interface ToastItem { id: string; message: string; type?: 'success' | 'error' | 'info' }
interface Connection { site_url: string; site_name: string; status: string; created_at: string; cms_type?: string }
interface PlanFeature { Icon: LucideIcon; text: string }

const PLAN_FEATURES: Record<string, PlanFeature[]> = {
  free:   [
    { Icon: Package,       text: '25 kredit/ay' },
    { Icon: Globe,         text: '1 brend profili' },
    { Icon: Search,        text: 'Əsas SEO teqləri (AZ dili)' },
    { Icon: Sparkles,      text: 'Əsas SMO analizi' },
  ],
  pro:    [
    { Icon: Package,       text: '250 kredit/ay' },
    { Icon: Globe,         text: '5 brend profili' },
    { Icon: Search,        text: 'Güclü SEO — AZ + RU, Schema, OG' },
    { Icon: Sparkles,      text: 'Tam SMO paketi' },
    { Icon: Download,      text: 'JSON / HTML ixracı' },
    { Icon: Zap,           text: 'Prioritet dəstək' },
  ],
  agency: [
    { Icon: Package,       text: '1000 kredit/ay' },
    { Icon: Globe,         text: '15 brend profili' },
    { Icon: Search,        text: 'Maksimum SEO gücü' },
    { Icon: Sparkles,      text: 'Maksimum SMO gücü' },
    { Icon: CheckCircle,   text: 'Pro-nun bütün imkanları' },
    { Icon: Plug,          text: 'API girişi (tezliklə)' },
  ],
}

const TABS = [
  { id: 'workspace',    label: 'İş sahəsi',     Icon: LayoutGrid },
  { id: 'integrations', label: 'İnteqrasiyalar', Icon: Plug },
  { id: 'billing',      label: 'Abunəlik',       Icon: CreditCard },
  { id: 'account',      label: 'Hesab',          Icon: User },
]

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 28 }

interface Props {
  open: boolean
  onClose: () => void
}

export default function SettingsModal({ open, onClose }: Props) {
  const [tab, setTab]               = useState('workspace')
  const [profile, setProfile]       = useState<Profile | null>(null)
  const [fullName, setFullName]     = useState('')
  const [genCount, setGenCount]     = useState(0)
  const [saving, setSaving]         = useState(false)
  const [upgrading, setUpgrading]   = useState(false)
  const [period, setPeriod]         = useState<BillingPeriod>('monthly')
  const [toasts, setToasts]         = useState<ToastItem[]>([])
  const [wpConnection,      setWpConnection]      = useState<Connection | null>(null)
  const [wpModalOpen,       setWpModalOpen]       = useState(false)
  const [ghostConnection,   setGhostConnection]   = useState<Connection | null>(null)
  const [webflowConnection, setWebflowConnection] = useState<Connection | null>(null)
  const [shopifyConnection, setShopifyConnection] = useState<Connection | null>(null)
  const [wixConnection,    setWixConnection]     = useState<Connection | null>(null)
  const [cmsModal, setCmsModal] = useState<'ghost' | 'webflow' | 'shopify' | 'wix' | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  function addToast(message: string, type: ToastItem['type'] = 'success') {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
  }

  useEffect(() => {
    if (!open) return
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) { setProfile(data as Profile); setFullName(data.full_name || '') }
      const { count } = await supabase.from('generations').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
      setGenCount(count ?? 0)
      const res = await fetch('/api/cms')
      if (res.ok) {
        const { connections } = await res.json()
        const all = connections as Connection[]
        setWpConnection(     all.find(c => c.cms_type === 'wordpress') ?? null)
        setGhostConnection(  all.find(c => c.cms_type === 'ghost')     ?? null)
        setWebflowConnection(all.find(c => c.cms_type === 'webflow')   ?? null)
        setShopifyConnection(all.find(c => c.cms_type === 'shopify')   ?? null)
        setWixConnection(    all.find(c => c.cms_type === 'wix')       ?? null)
      }
    }
    load()
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  async function handleSaveProfile() {
    if (!profile) return
    setSaving(true)
    const { error } = await supabase.from('profiles')
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', profile.id)
    addToast(error ? 'Xəta baş verdi' : 'Saxlandı!', error ? 'error' : 'success')
    setSaving(false)
  }

  async function handleUpgrade(plan: 'pro' | 'agency') {
    setUpgrading(true)
    try {
      const res = await fetch('/api/dodo/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan, period }) })
      const { url, error } = await res.json()
      if (error) { addToast(error, 'error'); return }
      if (url) window.location.href = url
    } finally { setUpgrading(false) }
  }

  async function handleCancel() {
    if (!confirm('Abunəliyi ləğv etmək istədiyinizə əminsiniz?')) return
    setUpgrading(true)
    try {
      const res = await fetch('/api/dodo/portal', { method: 'POST' })
      const { success, error } = await res.json()
      if (error) { addToast(error, 'error'); return }
      if (success) {
        addToast('Abunəlik ləğv edildi', 'info')
        const { data: { user } } = await supabase.auth.getUser()
        if (user) { const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single(); if (data) setProfile(data as Profile) }
      }
    } finally { setUpgrading(false) }
  }

  async function handleDeleteAccount() {
    const confirm1 = prompt('Hesabı silmək üçün "sil" yazın:')
    if (confirm1 !== 'sil') return
    addToast('Hesab silmə tələbi göndərildi. Dəstək komandası ilə əlaqə saxlayın.', 'info')
  }

  const plan        = profile?.plan ?? 'free'
  const planColor   = { free: '#9B9EBB', pro: '#7B6EF6', agency: '#00C9A7' }[plan]
  const used        = (profile as unknown as Record<string, unknown>)?.credits_used  as number ?? 0
  const limit       = (profile as unknown as Record<string, unknown>)?.credits_limit as number ?? 25
  const pct         = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0
  const usageColor  = pct >= 95 ? '#F25C54' : pct >= 80 ? '#F5A623' : '#00C9A7'
  const avatarLetter = (profile?.full_name || profile?.email || '?')[0].toUpperCase()
  const inputStyle  = { background: '#F8F8FF', border: '1px solid rgba(123,110,246,0.15)', color: '#0D0D1A' }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={id => setToasts(prev => prev.filter(t => t.id !== id))} />
      <AnimatePresence>
        {open && (
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
            style={{ background: 'rgba(13,13,26,0.45)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => { if (e.target === overlayRef.current) onClose() }}
          >
            <motion.div
              className="w-full sm:max-w-4xl rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col sm:flex-row h-[100dvh] sm:h-[700px]"
              style={{ background: '#FFFFFF', boxShadow: '0 24px 80px rgba(13,13,26,0.2)' }}
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ ...SPRING }}
            >
              {/* Left nav */}
              <div className="hidden sm:flex w-60 flex-shrink-0 border-r py-7 px-4 flex-col"
                style={{ background: '#FAFAFE', borderColor: 'rgba(123,110,246,0.08)' }}
              >
                <p className="text-xs font-bold uppercase tracking-widest px-3 mb-4" style={{ color: '#C0C3D8' }}>Parametrlər</p>
                {TABS.map(t => {
                  const active = tab === t.id
                  return (
                    <button key={t.id} onClick={() => setTab(t.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 text-left"
                      style={{ background: active ? 'rgba(123,110,246,0.1)' : 'transparent', color: active ? '#7B6EF6' : '#5A5D7A' }}
                    >
                      <t.Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                      {t.label}
                    </button>
                  )
                })}
              </div>

              {/* Right content */}
              <div className="flex-1 overflow-hidden flex flex-col">
                {/* Top bar: mobile tabs + close button */}
                <div className="relative flex-shrink-0">
                  <button onClick={onClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-100"
                  >
                    <X size={16} strokeWidth={2} style={{ color: '#9B9EBB' }} />
                  </button>
                  <div className="flex sm:hidden border-b" style={{ borderColor: 'rgba(123,110,246,0.08)' }}>
                    {TABS.map(t => {
                      const active = tab === t.id
                      return (
                        <button key={t.id} onClick={() => setTab(t.id)}
                          className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors relative"
                          style={{ color: active ? '#7B6EF6' : '#9B9EBB' }}
                        >
                          <t.Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                          {t.label}
                          {active && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: '#7B6EF6' }} />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-8 sm:pt-6">

                  {/* ── WORKSPACE ── */}
                  {tab === 'workspace' && (
                    <div>
                      <h2 className="font-display font-bold text-xl sm:text-2xl text-text-primary mb-5 sm:mb-7">İş sahəsi</h2>

                      {/* Profile card */}
                      <div className="flex flex-wrap items-center gap-4 p-4 sm:p-5 rounded-2xl mb-5 sm:mb-7"
                        style={{ background: 'linear-gradient(135deg, rgba(123,110,246,0.06) 0%, rgba(155,143,248,0.04) 100%)', border: '1px solid rgba(123,110,246,0.12)' }}
                      >
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)', boxShadow: '0 8px 24px rgba(123,110,246,0.3)' }}
                        >
                          {avatarLetter}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-lg text-text-primary leading-tight">{profile?.full_name || 'İstifadəçi'}</div>
                          <div className="text-sm text-text-muted mt-0.5 truncate">{profile?.email}</div>
                          <span className="inline-flex items-center mt-2 text-xs font-bold px-3 py-1 rounded-full"
                            style={{ background: `${planColor}18`, color: planColor, border: `1px solid ${planColor}35` }}
                          >
                            {PLAN_NAMES[plan as keyof typeof PLAN_NAMES]}
                          </span>
                        </div>
                        {/* Usage pill */}
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs text-text-muted mb-1.5">Kredit balansı</div>
                          <div className="text-sm font-bold" style={{ color: usageColor }}>{used} / {limit === 999999 ? '∞' : limit} kredit</div>
                          <div className="mt-1.5 h-1.5 w-24 rounded-full overflow-hidden" style={{ background: 'rgba(123,110,246,0.1)' }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: usageColor, transition: 'width 0.6s ease' }} />
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-7">
                        <div className="rounded-2xl p-5" style={{ background: '#F8F8FF', border: '1px solid rgba(123,110,246,0.1)' }}>
                          <div className="text-3xl font-bold mb-1" style={{ color: '#7B6EF6' }}>{genCount}</div>
                          <div className="text-xs font-medium text-text-muted">Generasiya</div>
                        </div>
                        <div className="rounded-2xl p-5" style={{ background: '#EEF6FF', border: '1px solid rgba(59,130,246,0.12)' }}>
                          <div className="text-3xl font-bold mb-1" style={{ color: '#3B82F6' }}>{genCount * 2}<span className="text-base ml-1 font-semibold">saat</span></div>
                          <div className="text-xs font-medium text-text-muted">Qənaət olunan vaxt</div>
                        </div>
                        <div className="rounded-2xl p-5" style={{ background: '#FFF0F8', border: '1px solid rgba(236,72,153,0.12)' }}>
                          <div className="text-3xl font-bold mb-1" style={{ color: '#EC4899' }}>₼{genCount * 40}</div>
                          <div className="text-xs font-medium text-text-muted">Qənaət olunan pul</div>
                        </div>
                      </div>

                      {/* Form */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#9B9EBB' }}>Ad Soyad</label>
                          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                            placeholder="Adınız"
                            className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all"
                            style={inputStyle}
                            onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                            onBlur={e  => (e.target.style.borderColor = 'rgba(123,110,246,0.15)')}
                          />
                        </div>
                        <button onClick={handleSaveProfile} disabled={saving}
                          className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 flex items-center gap-2 hover:scale-[1.02]"
                          style={{ background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)', boxShadow: '0 4px 16px rgba(123,110,246,0.35)' }}
                        >
                          {saving ? <><Loader2 size={14} className="animate-spin" /> Saxlanır...</> : 'Saxla'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── INTEGRATIONS ── */}
                  {tab === 'integrations' && (
                    <div>
                      <h2 className="font-display font-bold text-xl text-text-primary mb-1.5 sm:mb-2">Bütün inteqrasiyalar</h2>
                      <p className="text-sm text-text-muted mb-6">Saytınıza birbaşa məqalə nəşr etmək üçün CMS-i bağlayın</p>
                      <div className="rounded-2xl overflow-hidden divide-y" style={{ background: '#F8F8FF', border: '1px solid rgba(123,110,246,0.1)' }}>

                        {/* WordPress */}
                        <button onClick={() => setWpModalOpen(true)}
                          className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white"
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#21759B12' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://cdn.simpleicons.org/wordpress/21759B" alt="WordPress" width={22} height={22} style={{ objectFit: 'contain' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-text-primary">WordPress</div>
                            <div className="text-xs text-text-muted truncate">
                              {wpConnection ? wpConnection.site_name || wpConnection.site_url : 'Qoşulmayıb'}
                            </div>
                          </div>
                          {wpConnection ? (
                            <CheckCircle2 size={18} strokeWidth={2} style={{ color: '#00C9A7', flexShrink: 0 }} />
                          ) : (
                            <div className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0"
                              style={{ background: 'rgba(123,110,246,0.1)', color: '#7B6EF6' }}
                            >
                              <Plus size={12} strokeWidth={2.5} /> Bağla
                            </div>
                          )}
                        </button>

                        {/* Ghost */}
                        <button onClick={() => setCmsModal('ghost')}
                          className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white"
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#15171A10' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://cdn.simpleicons.org/ghost/15171A" alt="Ghost" width={22} height={22} style={{ objectFit: 'contain' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-text-primary">Ghost</div>
                            <div className="text-xs text-text-muted truncate">{ghostConnection ? ghostConnection.site_name || ghostConnection.site_url : 'Qoşulmayıb'}</div>
                          </div>
                          {ghostConnection ? <CheckCircle2 size={18} strokeWidth={2} style={{ color: '#00C9A7', flexShrink: 0 }} /> : (
                            <div className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0" style={{ background: 'rgba(123,110,246,0.1)', color: '#7B6EF6' }}>
                              <Plus size={12} strokeWidth={2.5} /> Bağla
                            </div>
                          )}
                        </button>

                        {/* Webflow */}
                        <button onClick={() => setCmsModal('webflow')}
                          className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white"
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#146EF510' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://cdn.simpleicons.org/webflow/146EF5" alt="Webflow" width={22} height={22} style={{ objectFit: 'contain' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-text-primary">Webflow</div>
                            <div className="text-xs text-text-muted truncate">{webflowConnection ? webflowConnection.site_name || webflowConnection.site_url : 'Qoşulmayıb'}</div>
                          </div>
                          {webflowConnection ? <CheckCircle2 size={18} strokeWidth={2} style={{ color: '#00C9A7', flexShrink: 0 }} /> : (
                            <div className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0" style={{ background: 'rgba(123,110,246,0.1)', color: '#7B6EF6' }}>
                              <Plus size={12} strokeWidth={2.5} /> Bağla
                            </div>
                          )}
                        </button>

                        {/* Shopify */}
                        <button onClick={() => setCmsModal('shopify')}
                          className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white"
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#96BF4810' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://cdn.simpleicons.org/shopify/96BF48" alt="Shopify" width={22} height={22} style={{ objectFit: 'contain' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-text-primary">Shopify</div>
                            <div className="text-xs text-text-muted truncate">{shopifyConnection ? shopifyConnection.site_name || shopifyConnection.site_url : 'Qoşulmayıb'}</div>
                          </div>
                          {shopifyConnection ? <CheckCircle2 size={18} strokeWidth={2} style={{ color: '#00C9A7', flexShrink: 0 }} /> : (
                            <div className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0" style={{ background: 'rgba(123,110,246,0.1)', color: '#7B6EF6' }}>
                              <Plus size={12} strokeWidth={2.5} /> Bağla
                            </div>
                          )}
                        </button>

                        {/* Wix */}
                        <button onClick={() => setCmsModal('wix')}
                          className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white"
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FAAD4D10' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://cdn.simpleicons.org/wix/FAAD4D" alt="Wix" width={22} height={22} style={{ objectFit: 'contain' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-text-primary">Wix</div>
                            <div className="text-xs text-text-muted truncate">{wixConnection ? wixConnection.site_name || wixConnection.site_url : 'Qoşulmayıb'}</div>
                          </div>
                          {wixConnection ? <CheckCircle2 size={18} strokeWidth={2} style={{ color: '#00C9A7', flexShrink: 0 }} /> : (
                            <div className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0" style={{ background: 'rgba(123,110,246,0.1)', color: '#7B6EF6' }}>
                              <Plus size={12} strokeWidth={2.5} /> Bağla
                            </div>
                          )}
                        </button>

                      </div>
                      <WordPressModal
                        open={wpModalOpen}
                        onClose={() => setWpModalOpen(false)}
                        existing={wpConnection}
                        onSaved={conn => { setWpConnection(conn); addToast('WordPress uğurla bağlandı!') }}
                        onDeleted={() => { setWpConnection(null); addToast('Bağlantı silindi', 'info') }}
                      />
                      {(['ghost', 'webflow', 'shopify', 'wix'] as const).map(p => (
                        <CMSConnectModal key={p} platform={p}
                          open={cmsModal === p}
                          onClose={() => setCmsModal(null)}
                          existing={p === 'ghost' ? ghostConnection : p === 'webflow' ? webflowConnection : p === 'shopify' ? shopifyConnection : wixConnection}
                          onSaved={conn => {
                            if (p === 'ghost')   setGhostConnection(conn)
                            if (p === 'webflow') setWebflowConnection(conn)
                            if (p === 'shopify') setShopifyConnection(conn)
                            if (p === 'wix')     setWixConnection(conn)
                            addToast(`${p.charAt(0).toUpperCase() + p.slice(1)} uğurla bağlandı!`)
                          }}
                          onDeleted={() => {
                            if (p === 'ghost')   setGhostConnection(null)
                            if (p === 'webflow') setWebflowConnection(null)
                            if (p === 'shopify') setShopifyConnection(null)
                            if (p === 'wix')     setWixConnection(null)
                            addToast('Bağlantı silindi', 'info')
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* ── BILLING ── */}
                  {tab === 'billing' && (
                    <div>
                      <h2 className="font-display font-bold text-xl text-text-primary mb-4 sm:mb-6">Abunəlik</h2>
                      <div className="rounded-2xl p-5 mb-6 relative overflow-hidden"
                        style={{ background: '#FFFFFF', border: `1px solid ${planColor}25`, boxShadow: `0 4px 24px ${planColor}08` }}
                      >
                        <div className="absolute right-0 top-0 w-40 h-40 rounded-full pointer-events-none"
                          style={{ background: `${planColor}08`, filter: 'blur(40px)', transform: 'translate(30%,-30%)' }} />
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-4 relative z-10">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: '#9B9EBB' }}>Cari plan</p>
                            <div className="flex items-baseline gap-2">
                              <span className="font-display font-bold text-2xl" style={{ color: planColor }}>
                                {PLAN_NAMES[plan as keyof typeof PLAN_NAMES]}
                              </span>
                              <span className="text-text-muted text-sm">{PLAN_PRICES[plan as keyof typeof PLAN_PRICES]}</span>
                            </div>
                          </div>
                          {profile?.current_period_end && plan !== 'free' && (
                            <div className="text-right">
                              <div className="text-xs text-text-muted">Növbəti ödəniş</div>
                              <div className="text-sm font-semibold text-text-primary mt-0.5">
                                {new Date(profile.current_period_end).toLocaleDateString('az-AZ')}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="mb-4 relative z-10">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-text-muted">Kredit istifadəsi</span>
                            <span className="text-xs font-semibold" style={{ color: usageColor }}>{used} / {limit === 999999 ? '∞' : limit} kredit</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(123,110,246,0.07)' }}>
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: usageColor }} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1 relative z-10">
                          {PLAN_FEATURES[plan]?.map(f => (
                            <div key={f.text} className="flex items-center gap-2 text-xs text-text-secondary py-0.5">
                              <f.Icon size={13} strokeWidth={1.8} style={{ color: planColor, flexShrink: 0 }} />
                              <span>{f.text}</span>
                            </div>
                          ))}
                        </div>
                        {plan !== 'free' && (
                          <div className="mt-4 pt-4 border-t relative z-10 flex items-center justify-between" style={{ borderColor: 'rgba(123,110,246,0.1)' }}>
                            <div className="text-xs text-text-muted">
                              {profile?.subscription_status === 'cancelled' ? 'Ləğv edilib — dövr bitənə qədər giriş var'
                                : profile?.subscription_status === 'on_hold' ? 'Ödəniş uğursuz'
                                : 'Abunəlik aktiv'}
                            </div>
                            {profile?.subscription_status !== 'cancelled' && (
                              <button onClick={handleCancel} disabled={upgrading}
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:bg-red-50 disabled:opacity-50"
                                style={{ borderColor: 'rgba(242,92,84,0.3)', color: '#F25C54' }}
                              >
                                Ləğv Et
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      {(plan === 'pro' || plan === 'agency') && profile?.subscription_status !== 'cancelled' && (
                        <div className="rounded-2xl p-4 mt-3" style={{ background: '#FAFAFE', border: `1px solid ${planColor}22` }}>
                          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#C0C3D8' }}>Daha Sərfəli Dövr</p>
                          <div className="grid grid-cols-3 gap-1.5 mb-3">
                            {([
                              { id: 'monthly'   as BillingPeriod, label: 'Aylıq',   pct: undefined },
                              { id: 'quarterly' as BillingPeriod, label: 'Rüblük',  pct: 15 },
                              { id: 'yearly'    as BillingPeriod, label: 'İllik',   pct: 25 },
                            ]).map(p => {
                              const prices = PLAN_PERIOD_PRICES[plan][p.id]
                              return (
                                <button key={p.id} onClick={() => setPeriod(p.id)}
                                  className="relative rounded-xl p-2.5 text-left transition-all"
                                  style={{
                                    background: period === p.id ? `${planColor}10` : '#FFFFFF',
                                    border: `1.5px solid ${period === p.id ? planColor : 'rgba(0,0,0,0.07)'}`,
                                  }}
                                >
                                  {p.pct && (
                                    <span className="absolute -top-2 left-1.5 text-[9px] font-bold px-1 py-0.5 rounded-full leading-none" style={{ background: '#00C9A7', color: '#fff' }}>
                                      -{p.pct}%
                                    </span>
                                  )}
                                  <div className="text-[10px] font-semibold text-text-primary mb-0.5">{p.label}</div>
                                  <div className="text-xs font-bold" style={{ color: planColor }}>{prices.perMonth}<span className="text-[10px] font-normal text-text-muted"> AZN/ay</span></div>
                                </button>
                              )
                            })}
                          </div>
                          <button
                            onClick={() => handleUpgrade(plan as 'pro' | 'agency')}
                            disabled={upgrading || period === 'monthly'}
                            className="w-full py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40 text-white hover:opacity-90"
                            style={{ background: planColor }}
                          >
                            {upgrading ? '...' : period === 'monthly' ? 'Rüblük/illik seçin' : `${PLAN_NAMES[plan]} ${period === 'quarterly' ? 'Rüblük' : 'İllik'}-ə keç`}
                          </button>
                        </div>
                      )}
                      {plan === 'pro' && (
                        <>
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 mt-4">
                            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#C0C3D8' }}>Agency-ə Yüksəlt</p>
                            <div className="flex items-center gap-0.5 p-1 rounded-xl" style={{ background: 'rgba(0,201,167,0.07)', border: '1px solid rgba(0,201,167,0.12)' }}>
                              {([
                                { id: 'monthly'   as BillingPeriod, label: 'Aylıq' },
                                { id: 'quarterly' as BillingPeriod, label: 'Rüblük', pct: 15 },
                                { id: 'yearly'    as BillingPeriod, label: 'İllik',  pct: 25 },
                              ]).map(p => (
                                <button key={p.id} onClick={() => setPeriod(p.id)}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
                                  style={{
                                    background: period === p.id ? '#FFFFFF' : 'transparent',
                                    color: period === p.id ? '#00C9A7' : '#9B9EBB',
                                    boxShadow: period === p.id ? '0 1px 4px rgba(13,13,26,0.08)' : 'none',
                                  }}
                                >
                                  {p.label}
                                  {'pct' in p && (
                                    <span className="text-[9px] font-bold px-1 py-0.5 rounded-full leading-none" style={{ background: '#00C9A7', color: '#fff' }}>
                                      -{p.pct}%
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-2xl p-5 flex flex-col" style={{ background: '#FFFFFF', border: '1px solid rgba(0,201,167,0.25)', boxShadow: '0 4px 16px rgba(0,201,167,0.08)' }}>
                            <div className="font-display font-bold text-lg mb-0.5" style={{ color: '#00C9A7' }}>{PLAN_NAMES.agency}</div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-text-primary text-2xl font-bold">{PLAN_PERIOD_PRICES.agency[period].perMonth} AZN</span>
                              <span className="text-text-muted text-xs">/ay</span>
                            </div>
                            <p className="text-text-muted text-xs mb-4">{PLAN_PERIOD_PRICES.agency[period].label}</p>
                            <ul className="space-y-1.5 mb-5">
                              {PLAN_FEATURES.agency.map(f => (
                                <li key={f.text} className="flex items-center gap-2 text-xs text-text-secondary">
                                  <f.Icon size={12} strokeWidth={1.8} style={{ color: '#00C9A7', flexShrink: 0 }} /> {f.text}
                                </li>
                              ))}
                            </ul>
                            <button onClick={() => handleUpgrade('agency')} disabled={upgrading}
                              className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2 hover:scale-[1.02]"
                              style={{ background: '#00C9A7', boxShadow: '0 4px 12px rgba(0,201,167,0.3)' }}
                            >
                              {upgrading ? <Loader2 size={14} className="animate-spin" /> : <><span>Agency-ə Keç</span><ArrowRight size={13} strokeWidth={2.5} /></>}
                            </button>
                          </div>
                        </>
                      )}

                      {plan === 'free' && (
                        <>
                          {/* Period toggle */}
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#C0C3D8' }}>Planı Yüksəlt</p>
                            <div className="flex items-center gap-0.5 p-1 rounded-xl" style={{ background: 'rgba(123,110,246,0.07)', border: '1px solid rgba(123,110,246,0.12)' }}>
                              {([
                                { id: 'monthly'   as BillingPeriod, label: 'Aylıq' },
                                { id: 'quarterly' as BillingPeriod, label: 'Rüblük', pct: 15 },
                                { id: 'yearly'    as BillingPeriod, label: 'İllik',  pct: 25 },
                              ]).map(p => (
                                <button key={p.id} onClick={() => setPeriod(p.id)}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
                                  style={{
                                    background: period === p.id ? '#FFFFFF' : 'transparent',
                                    color: period === p.id ? '#7B6EF6' : '#9B9EBB',
                                    boxShadow: period === p.id ? '0 1px 4px rgba(13,13,26,0.08)' : 'none',
                                  }}
                                >
                                  {p.label}
                                  {'pct' in p && (
                                    <span className="text-[9px] font-bold px-1 py-0.5 rounded-full leading-none" style={{ background: '#00C9A7', color: '#fff' }}>
                                      -{p.pct}%
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Pro */}
                            <div className="rounded-2xl overflow-hidden relative"
                              style={{ background: 'linear-gradient(160deg, #7B6EF6 0%, #9B8FF8 100%)', boxShadow: '0 8px 32px rgba(123,110,246,0.25)' }}
                            >
                              <div className="absolute top-3 right-3">
                                <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                                  <Star size={10} strokeWidth={2} fill="currentColor" /> Populyar
                                </span>
                              </div>
                              <div className="p-5 flex flex-col h-full">
                                <div className="font-display font-bold text-lg text-white mb-0.5">{PLAN_NAMES.pro}</div>
                                <div className="flex items-baseline gap-1">
                                  <span className="text-white text-2xl font-bold">{PLAN_PERIOD_PRICES.pro[period].perMonth} AZN</span>
                                  <span className="text-white/60 text-xs">/ay</span>
                                </div>
                                <p className="text-white/60 text-xs mb-4">{PLAN_PERIOD_PRICES.pro[period].label}</p>
                                <ul className="space-y-1.5 flex-1">
                                  {PLAN_FEATURES.pro.map(f => (
                                    <li key={f.text} className="flex items-center gap-2 text-xs text-white/90">
                                      <f.Icon size={12} strokeWidth={1.8} className="flex-shrink-0" /> {f.text}
                                    </li>
                                  ))}
                                </ul>
                                <button onClick={() => handleUpgrade('pro')} disabled={upgrading}
                                  className="w-full mt-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                  style={{ background: '#FFFFFF', color: '#7B6EF6' }}
                                >
                                  {upgrading ? <Loader2 size={14} className="animate-spin" /> : <><span>Pro-ya Keç</span><ArrowRight size={13} strokeWidth={2.5} /></>}
                                </button>
                              </div>
                            </div>

                            {/* Agency */}
                            <div className="rounded-2xl p-5 flex flex-col" style={{ background: '#FFFFFF', border: '1px solid rgba(0,201,167,0.25)' }}>
                              <div className="font-display font-bold text-lg mb-0.5" style={{ color: '#00C9A7' }}>{PLAN_NAMES.agency}</div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-text-primary text-2xl font-bold">{PLAN_PERIOD_PRICES.agency[period].perMonth} AZN</span>
                                <span className="text-text-muted text-xs">/ay</span>
                              </div>
                              <p className="text-text-muted text-xs mb-4">{PLAN_PERIOD_PRICES.agency[period].label}</p>
                              <ul className="space-y-1.5 flex-1">
                                {PLAN_FEATURES.agency.map(f => (
                                  <li key={f.text} className="flex items-center gap-2 text-xs text-text-secondary">
                                    <f.Icon size={12} strokeWidth={1.8} style={{ color: '#00C9A7', flexShrink: 0 }} /> {f.text}
                                  </li>
                                ))}
                              </ul>
                              <button onClick={() => handleUpgrade('agency')} disabled={upgrading}
                                className="w-full mt-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                style={{ background: '#00C9A7' }}
                              >
                                {upgrading ? <Loader2 size={14} className="animate-spin" /> : <><span>Agency-ə Keç</span><ArrowRight size={13} strokeWidth={2.5} /></>}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* ── ACCOUNT ── */}
                  {tab === 'account' && (
                    <div>
                      <h2 className="font-display font-bold text-xl text-text-primary mb-4 sm:mb-6">Hesab</h2>
                      <div className="space-y-4 mb-8">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#9B9EBB' }}>Ad Soyad</label>
                          <div className="flex gap-2">
                            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                              className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                              style={inputStyle}
                              onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                              onBlur={e  => (e.target.style.borderColor = 'rgba(123,110,246,0.15)')}
                            />
                            <button onClick={handleSaveProfile} disabled={saving}
                              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60"
                              style={{ background: '#7B6EF6' }}
                            >
                              {saving ? '...' : 'Saxla'}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#9B9EBB' }}>E-poçt</label>
                          <input type="email" value={profile?.email || ''} readOnly
                            className="w-full rounded-xl px-4 py-3 text-sm"
                            style={{ ...inputStyle, cursor: 'not-allowed', opacity: 0.55 }}
                          />
                          <p className="text-text-muted text-xs mt-1.5">E-poçt ünvanı dəyişdirilə bilməz</p>
                        </div>
                      </div>
                      <div className="rounded-2xl p-5" style={{ background: '#FFFFFF', border: '1px solid rgba(242,92,84,0.18)' }}>
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(242,92,84,0.08)' }}>
                            <AlertTriangle size={16} strokeWidth={2} style={{ color: '#F25C54' }} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-text-primary mb-1 text-sm">Hesabı Sil</h3>
                            <p className="text-text-muted text-xs mb-3">Bu əməliyyat geri qaytarılmazdır.</p>
                            <button onClick={handleDeleteAccount}
                              className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:bg-red-50"
                              style={{ borderColor: 'rgba(242,92,84,0.3)', color: '#F25C54' }}
                            >
                              Hesabı Sil
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
