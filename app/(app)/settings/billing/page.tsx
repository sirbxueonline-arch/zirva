'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, BillingPeriod } from '@/types'
import { PLAN_NAMES, PLAN_PRICES, PLAN_PERIOD_PRICES } from '@/types'
import {
  Package,
  Globe,
  Languages,
  ClipboardList,
  Download,
  Search,
  Zap,
  CheckCircle,
  Plug,
  BarChart2,
  Target,
  Star,
  ArrowRight,
  Lock,
  type LucideIcon,
} from 'lucide-react'

interface PlanFeature { Icon: LucideIcon; text: string; locked?: boolean }

const PLAN_FEATURES: Record<string, PlanFeature[]> = {
  free: [
    { Icon: Package,       text: 'Ayda 5 SEO paketi' },
    { Icon: Globe,         text: 'Yalnız URL axışı' },
    { Icon: Languages,     text: 'Yalnız Azərbaycan dili' },
    { Icon: ClipboardList, text: 'Yalnız başlıq + meta (3 açar söz)' },
    { Icon: Lock,          text: 'OG / Twitter teqləri yoxdur', locked: true },
    { Icon: Lock,          text: 'Schema Markup yoxdur', locked: true },
    { Icon: Lock,          text: 'Hreflang yoxdur', locked: true },
    { Icon: Lock,          text: 'Rəqib analizi yoxdur', locked: true },
    { Icon: Lock,          text: 'İxrac (JSON/HTML) yoxdur', locked: true },
  ],
  pro: [
    { Icon: Globe,         text: '10 brend' },
    { Icon: Package,       text: 'Ayda 50 SEO paketi' },
    { Icon: Globe,         text: 'Bütün axışlar (URL, sosial, manual)' },
    { Icon: Languages,     text: 'AZ + RU teqləri' },
    { Icon: ClipboardList, text: 'Tam teq paketi (8 açar söz)' },
    { Icon: CheckCircle,   text: 'OG + Twitter + Hreflang teqləri' },
    { Icon: CheckCircle,   text: 'Schema Markup (JSON-LD)' },
    { Icon: Search,        text: 'Rəqib analizi + üstələmə tövsiyələri' },
    { Icon: Download,      text: 'JSON / HTML ixracı' },
    { Icon: Zap,           text: 'Prioritet dəstək' },
  ],
  agency: [
    { Icon: Globe,         text: '20 brend' },
    { Icon: Package,       text: 'Ayda 300 SEO paketi' },
    { Icon: CheckCircle,   text: 'Pro-nun hər şeyi' },
    { Icon: Globe,         text: 'Çoxlu sayt idarəetməsi' },
    { Icon: Plug,          text: 'API girişi (tezliklə)' },
    { Icon: BarChart2,     text: 'Xüsusi hesabat' },
    { Icon: Target,        text: 'Fərdi onboarding' },
  ],
}

const PERIODS: { id: BillingPeriod; label: string; badge?: string }[] = [
  { id: 'monthly',   label: 'Aylıq' },
  { id: 'quarterly', label: 'Rüblük', badge: '15% endirim' },
  { id: 'yearly',    label: 'İllik',  badge: '25% endirim' },
]

export default function BillingPage() {
  const [profile, setProfile]   = useState<Profile | null>(null)
  const [loading, setLoading]   = useState(false)
  const [period, setPeriod]     = useState<BillingPeriod>('monthly')
  const supabase = createClient()

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) setProfile(data as Profile)
    }
    fetchProfile()
  }, [])

  async function handleUpgrade(plan: 'pro' | 'agency') {
    setLoading(true)
    try {
      const res = await fetch('/api/dodo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, period }),
      })
      const { url, error } = await res.json()
      if (error) { alert(error); return }
      if (url) window.location.href = url
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    if (!confirm('Abunəliyi ləğv etmək istədiyinizə əminsiniz? Hazırkı dövr bitənə qədər giriş davam edəcək.')) return
    setLoading(true)
    try {
      const res = await fetch('/api/dodo/portal', { method: 'POST' })
      const { success, error } = await res.json()
      if (error) { alert(error); return }
      if (success) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
          if (data) setProfile(data as Profile)
        }
        alert('Abunəlik ləğv edildi. Mövcud dövr bitənə qədər giriş davam edəcək.')
      }
    } finally {
      setLoading(false)
    }
  }

  const plan      = profile?.plan ?? 'free'
  const used      = profile?.generations_used ?? 0
  const limit     = profile?.generations_limit ?? 5
  const pct       = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0
  const usageColor = pct >= 90 ? '#F25C54' : pct >= 70 ? '#F5A623' : '#00C9A7'
  const planColor  = { free: '#9B9EBB', pro: '#7B6EF6', agency: '#00C9A7' }[plan] ?? '#9B9EBB'

  const proPrices    = PLAN_PERIOD_PRICES.pro[period]
  const agencyPrices = PLAN_PERIOD_PRICES.agency[period]

  return (
    <div className="px-4 sm:px-6 py-8 sm:py-10 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-text-primary mb-1">Abunəlik</h1>
        <p className="text-text-muted text-sm">Plan və ödəniş məlumatlarınız</p>
      </div>

      {/* Current plan card */}
      <div className="rounded-2xl p-6 mb-8 relative overflow-hidden"
        style={{ background: '#FFFFFF', border: `1px solid ${planColor}25`, boxShadow: `0 4px 24px ${planColor}10` }}
      >
        <div className="absolute right-0 top-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: `${planColor}06`, filter: 'blur(40px)', transform: 'translate(30%,-30%)' }} />

        <div className="flex items-start justify-between mb-5 relative z-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: '#9B9EBB' }}>Cari plan</p>
            <div className="flex items-baseline gap-3">
              <span className="font-display font-bold text-3xl" style={{ color: planColor }}>
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

        {/* Usage */}
        <div className="mb-5 relative z-10">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-text-muted">Bu ay istifadə</span>
            <span className="text-xs font-semibold" style={{ color: usageColor }}>{used} / {limit === 999999 ? '∞' : limit}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(123,110,246,0.07)' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: usageColor }} />
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-1.5 relative z-10">
          {PLAN_FEATURES[plan]?.map(f => (
            <div key={f.text} className="flex items-center gap-2 text-sm py-1" style={{ color: f.locked ? '#C5C7D8' : undefined }}>
              <f.Icon size={15} strokeWidth={1.8} className="flex-shrink-0" style={{ color: f.locked ? '#D0D2E0' : planColor }} />
              <span className={f.locked ? 'line-through' : ''}>{f.text}</span>
            </div>
          ))}
        </div>

        {plan !== 'free' && (
          <div className="mt-5 pt-5 border-t relative z-10 flex items-center justify-between" style={{ borderColor: 'rgba(123,110,246,0.1)' }}>
            <div className="text-xs text-text-muted">
              {profile?.subscription_status === 'cancelled'
                ? 'Abunəlik ləğv edilib — dövr bitənə qədər giriş var'
                : profile?.subscription_status === 'on_hold'
                ? 'Ödəniş uğursuz — abunəlik gözlətmədədir'
                : 'Abunəlik aktiv'}
            </div>
            {profile?.subscription_status !== 'cancelled' && (
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:bg-red-50 disabled:opacity-50"
                style={{ borderColor: 'rgba(242,92,84,0.3)', color: '#F25C54' }}
              >
                Ləğv Et
              </button>
            )}
          </div>
        )}
      </div>

      {/* Upgrade section */}
      {plan === 'free' && (
        <>
          {/* What you're missing */}
          <div className="rounded-2xl p-5 mb-6" style={{ background: 'rgba(242,92,84,0.05)', border: '1px solid rgba(242,92,84,0.18)' }}>
            <p className="text-sm font-bold mb-3" style={{ color: '#F25C54' }}>🔒 Pulsuz planda bu xüsusiyyətlər yoxdur:</p>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {[
                'OG teqləri (Facebook / WhatsApp paylaşımı)',
                'Twitter Card teqləri',
                'Hreflang (çoxdilli hədəfləmə)',
                'Schema Markup / JSON-LD',
                'Rusca teqlər (35% axtarış auditoriyası)',
                'Rəqib analizi və üstələmə tövsiyələri',
                '8 açar söz (yalnız 3 verilir)',
                'JSON / HTML ixracı',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-xs" style={{ color: '#8B5E5B' }}>
                  <Lock size={11} strokeWidth={2.5} className="flex-shrink-0" style={{ color: '#F25C54' }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Billing period toggle */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">Planı Yüksəlt</p>
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(123,110,246,0.07)', border: '1px solid rgba(123,110,246,0.12)' }}>
              {PERIODS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id)}
                  className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={{
                    background: period === p.id ? '#FFFFFF' : 'transparent',
                    color: period === p.id ? '#7B6EF6' : '#9B9EBB',
                    boxShadow: period === p.id ? '0 1px 4px rgba(13,13,26,0.08)' : 'none',
                  }}
                >
                  {p.label}
                  {p.badge && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                      style={{ background: '#00C9A7', color: '#fff' }}
                    >
                      -{p.badge.split('%')[0]}%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">

            {/* Pro */}
            <div className="rounded-2xl overflow-hidden relative"
              style={{ background: 'linear-gradient(160deg, #7B6EF6 0%, #9B8FF8 100%)', boxShadow: '0 8px 40px rgba(123,110,246,0.3)' }}
            >
              <div className="absolute top-4 right-4">
                <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                  <Star size={11} strokeWidth={2} fill="currentColor" /> Populyar
                </span>
              </div>
              <div className="p-6">
                <div className="font-display font-bold text-xl text-white mb-1">{PLAN_NAMES.pro}</div>
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-white text-3xl font-bold">{proPrices.perMonth} AZN</span>
                  <span className="text-white/60 text-sm">/ay</span>
                </div>
                <p className="text-white/60 text-xs mb-5">{proPrices.label}{period !== 'monthly' ? ` · cəmi ${proPrices.total} AZN` : ''}</p>
                <ul className="space-y-2 mb-6">
                  {PLAN_FEATURES.pro.map(f => (
                    <li key={f.text} className="flex items-center gap-2 text-sm text-white/90">
                      <f.Icon size={14} strokeWidth={1.8} className="flex-shrink-0 text-white/80" />
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleUpgrade('pro')} disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-60 hover:scale-[1.02]"
                  style={{ background: '#FFFFFF', color: '#7B6EF6' }}
                >
                  {loading ? 'Yüklənir...' : <span className="flex items-center justify-center gap-2">Pro-ya Keç <ArrowRight size={14} strokeWidth={2.5} /></span>}
                </button>
              </div>
            </div>

            {/* Agency */}
            <div className="rounded-2xl p-6"
              style={{ background: '#FFFFFF', border: '1px solid rgba(0,201,167,0.25)', boxShadow: '0 4px 20px rgba(0,201,167,0.08)' }}
            >
              <div className="font-display font-bold text-xl mb-1" style={{ color: '#00C9A7' }}>{PLAN_NAMES.agency}</div>
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-text-primary text-3xl font-bold">{agencyPrices.perMonth} AZN</span>
                <span className="text-text-muted text-sm">/ay</span>
              </div>
              <p className="text-text-muted text-xs mb-5">{agencyPrices.label}{period !== 'monthly' ? ` · cəmi ${agencyPrices.total} AZN` : ''}</p>
              <ul className="space-y-2 mb-6">
                {PLAN_FEATURES.agency.map(f => (
                  <li key={f.text} className="flex items-center gap-2 text-sm text-text-secondary">
                    <f.Icon size={14} strokeWidth={1.8} className="flex-shrink-0" style={{ color: '#00C9A7' }} />
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => handleUpgrade('agency')} disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-60 hover:scale-[1.02] text-white"
                style={{ background: '#00C9A7' }}
              >
                {loading ? 'Yüklənir...' : <span className="flex items-center justify-center gap-2">Agency-ə Keç <ArrowRight size={14} strokeWidth={2.5} /></span>}
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  )
}
