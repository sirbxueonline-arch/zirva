'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ToastContainer } from '@/components/shared/Toast'
import type { Profile } from '@/types'
import { PLAN_NAMES, PLAN_PRICES } from '@/types'
import Link from 'next/link'
import { CreditCard, ChevronRight, AlertTriangle } from 'lucide-react'

interface ToastItem { id: string; message: string; type?: 'success' | 'error' | 'info' }

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const supabase = createClient()

  function addToast(message: string, type: ToastItem['type'] = 'success') {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
  }

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data as Profile)
        setFullName(data.full_name || '')
      }
    }
    fetchProfile()
  }, [])

  async function handleSaveName() {
    if (!profile) return
    setLoading(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', profile.id)
    addToast(error ? 'Saxlanma zamanı xəta baş verdi' : 'Dəyişikliklər saxlandı!', error ? 'error' : 'success')
    setLoading(false)
  }

  async function handleDeleteAccount() {
    const confirm1 = prompt('Hesabı silmək üçün "sil" yazın:')
    if (confirm1 !== 'sil') return
    addToast('Hesab silmə tələbi göndərildi. Dəstək komandası ilə əlaqə saxlayın.', 'info')
  }

  const planKey = profile?.plan ?? 'free'
  const planColor = { free: '#9B9EBB', pro: '#7B6EF6', agency: '#00C9A7' }[planKey]
  const avatarLetter = (profile?.full_name || profile?.email || '?')[0].toUpperCase()

  const inputStyle = {
    background: '#FFFFFF',
    border: '1px solid rgba(123,110,246,0.18)',
    color: '#0D0D1A',
    boxShadow: '0 1px 3px rgba(13,13,26,0.04)',
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={id => setToasts(prev => prev.filter(t => t.id !== id))} />

      <div className="px-6 py-10 max-w-2xl mx-auto">

        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-text-primary mb-1">Parametrlər</h1>
          <p className="text-text-muted text-sm">Hesab məlumatlarınızı idarə edin</p>
        </div>

        {/* Profile hero */}
        <div className="rounded-2xl p-6 mb-4"
          style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.12)', boxShadow: '0 2px 16px rgba(13,13,26,0.05)' }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)' }}
            >
              {avatarLetter}
            </div>
            <div className="min-w-0">
              <div className="text-text-primary font-bold text-lg truncate">{profile?.full_name || 'İstifadəçi'}</div>
              <div className="text-text-muted text-sm truncate">{profile?.email}</div>
              <span className="inline-flex items-center mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: `${planColor}15`, color: planColor, border: `1px solid ${planColor}30` }}
              >
                {PLAN_NAMES[planKey as keyof typeof PLAN_NAMES]} · {PLAN_PRICES[planKey as keyof typeof PLAN_PRICES]}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-widest mb-2">Ad Soyad</label>
              <div className="flex gap-2">
                <input
                  type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(123,110,246,0.18)')}
                />
                <button onClick={handleSaveName} disabled={loading}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 hover:scale-[1.02]"
                  style={{ background: '#7B6EF6' }}
                >
                  {loading ? '...' : 'Saxla'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-widest mb-2">E-poçt</label>
              <input
                type="email" value={profile?.email || ''} readOnly
                className="w-full rounded-xl px-4 py-3 text-sm"
                style={{ ...inputStyle, cursor: 'not-allowed', opacity: 0.55 }}
              />
              <p className="text-text-muted text-xs mt-1.5">E-poçt ünvanı dəyişdirilə bilməz</p>
            </div>
          </div>
        </div>

        {/* Billing shortcut */}
        <Link href="/settings/billing"
          className="flex items-center gap-4 rounded-2xl p-5 mb-4 group transition-all hover:scale-[1.01]"
          style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.12)', boxShadow: '0 2px 16px rgba(13,13,26,0.05)' }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(123,110,246,0.1)' }}>
            <CreditCard size={18} strokeWidth={2} style={{ color: '#7B6EF6' }} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-text-primary">Abunəlik & Billing</div>
            <div className="text-xs text-text-muted">Plan dəyişdirin, ödəniş tarixçəsini görün</div>
          </div>
          <ChevronRight size={16} strokeWidth={2} className="flex-shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: '#C0C3D8' }} />
        </Link>

        {/* Danger zone */}
        <div className="rounded-2xl p-6"
          style={{ background: '#FFFFFF', border: '1px solid rgba(242,92,84,0.18)', boxShadow: '0 2px 16px rgba(13,13,26,0.04)' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(242,92,84,0.08)' }}>
              <AlertTriangle size={18} strokeWidth={2} style={{ color: '#F25C54' }} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary mb-1">Hesabı Sil</h3>
              <p className="text-text-muted text-sm mb-4">Bu əməliyyat geri qaytarılmazdır — bütün məlumatlarınız silinəcək.</p>
              <button onClick={handleDeleteAccount}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-red-50"
                style={{ borderColor: 'rgba(242,92,84,0.3)', color: '#F25C54' }}
              >
                Hesabı Sil
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
