'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Brand } from '@/types'
import { ADMIN_EMAIL } from '@/types'
import BrandAvatar from '@/components/app/BrandAvatar'

// ─── Toast ───────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 18px',
      borderRadius: '12px',
      backgroundColor: type === 'success' ? '#00C9A7' : '#F25C54',
      color: '#fff',
      fontSize: '14px',
      fontWeight: '600',
      boxShadow: '0 4px 20px rgba(13,13,26,0.15)',
      maxWidth: '320px',
    }}>
      {type === 'success' ? '✓' : '!'} {message}
      <button onClick={onClose} style={{ marginLeft: '8px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: 0 }}>×</button>
    </div>
  )
}

// ─── Toggle ───────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: '48px',
        height: '26px',
        borderRadius: '13px',
        backgroundColor: checked ? '#7B6EF6' : '#D1D5DB',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: 0,
        transition: 'background-color 0.2s',
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
      }}
      aria-checked={checked}
      role="switch"
    >
      <span style={{
        position: 'absolute',
        top: '3px',
        left: checked ? '25px' : '3px',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }} />
    </button>
  )
}

// ─── Inner page (uses useSearchParams) ───────────────────────
function AutopilotPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [testSending, setTestSending] = useState(false)

  const [enabled, setEnabled] = useState(false)
  const [smoEnabled, setSmoEnabled] = useState(false)
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('weekly')
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([])

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type })
  }

  // Detect GSC connection result from URL params
  useEffect(() => {
    const gsc = searchParams.get('gsc')
    if (gsc === 'connected') {
      showToast('Google Search Console uğurla qoşuldu!', 'success')
      router.replace('/autopilot')
    } else if (gsc === 'no-url') {
      showToast('Əvvəlcə brend seçin və saxlayın.', 'error')
      router.replace('/autopilot')
    } else if (gsc === 'error') {
      const msg = searchParams.get('msg')
      showToast(msg ? decodeURIComponent(msg) : 'Google Search Console qoşularkən xəta baş verdi.', 'error')
      router.replace('/autopilot')
    }
  }, [searchParams, router])

  // Load profile
  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data as Profile)
        setEnabled(data.autopilot_enabled ?? false)
        setSmoEnabled(data.autopilot_smo_enabled ?? false)
        setFrequency((data as { autopilot_frequency?: 'weekly' | 'monthly' }).autopilot_frequency ?? 'weekly')

        // Load brands and match to saved autopilot_url
        const brandsRes = await fetch('/api/brands')
        const brandsData = brandsRes.ok ? await brandsRes.json() : null
        const loadedBrands: Brand[] = brandsData?.brands ?? []
        setBrands(loadedBrands)

        if (loadedBrands.length > 0) {
          const savedIds: string[] = (data as { autopilot_brand_ids?: string[] }).autopilot_brand_ids ?? []
          const validIds = loadedBrands.filter(b => savedIds.includes(b.id)).map(b => b.id)
          setSelectedBrandIds(validIds.length > 0 ? validIds : [loadedBrands[0].id])
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleToggle(val: boolean) {
    setEnabled(val)
    setSaving(true)
    try {
      const res = await fetch('/api/autopilot/save', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ autopilot_enabled: val }),
      })
      if (!res.ok) throw new Error()
      showToast(val ? 'SEO hesabatı aktivləşdirildi' : 'SEO hesabatı söndürüldü', 'success')
      setProfile(p => p ? { ...p, autopilot_enabled: val } : p)
    } catch {
      setEnabled(!val)
      showToast('Xəta baş verdi, yenidən cəhd edin', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleFrequencyChange(val: 'weekly' | 'monthly') {
    setFrequency(val)
    setSaving(true)
    try {
      const res = await fetch('/api/autopilot/save', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ autopilot_frequency: val }),
      })
      if (!res.ok) throw new Error()
      setProfile(p => p ? { ...p, autopilot_frequency: val } : p)
    } catch {
      setFrequency(frequency)
      showToast('Xəta baş verdi, yenidən cəhd edin', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleSmoToggle(val: boolean) {
    setSmoEnabled(val)
    setSaving(true)
    try {
      const res = await fetch('/api/autopilot/save', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ autopilot_smo_enabled: val }),
      })
      if (!res.ok) throw new Error()
      showToast(val ? 'SMO hesabatı aktivləşdirildi' : 'SMO hesabatı söndürüldü', 'success')
      setProfile(p => p ? { ...p, autopilot_smo_enabled: val } : p)
    } catch {
      setSmoEnabled(!val)
      showToast('Xəta baş verdi, yenidən cəhd edin', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleBrand(brandId: string) {
    const isSelected = selectedBrandIds.includes(brandId)
    // Must keep at least one brand selected
    if (isSelected && selectedBrandIds.length === 1) return

    const newIds = isSelected
      ? selectedBrandIds.filter(id => id !== brandId)
      : [...selectedBrandIds, brandId]

    setSelectedBrandIds(newIds)
    setSaving(true)

    const firstBrand = brands.find(b => b.id === newIds[0])
    const firstUrl = firstBrand?.website_url ?? ''

    try {
      const res = await fetch('/api/autopilot/save', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ autopilot_brand_ids: newIds, autopilot_url: firstUrl }),
      })
      if (!res.ok) throw new Error()
      setProfile(p => p ? { ...p, autopilot_url: firstUrl } : p)
    } catch {
      setSelectedBrandIds(selectedBrandIds)
      showToast('Xəta baş verdi, yenidən cəhd edin', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDisconnectGSC() {
    if (!confirm('Google Search Console bağlantısını kəsmək istədiyinizə əminsiniz? Avtopilot da söndürüləcək.')) return
    setDisconnecting(true)
    try {
      const res = await fetch('/api/gsc/disconnect', { method: 'POST' })
      if (!res.ok) throw new Error()
      showToast('Google Search Console bağlantısı kəsildi', 'success')
      setProfile(p => p ? { ...p, gsc_site_url: null, gsc_connected_at: null, autopilot_enabled: false } : p)
      setEnabled(false)
    } catch {
      showToast('Xəta baş verdi', 'error')
    } finally {
      setDisconnecting(false)
    }
  }

  async function handleTestEmail() {
    setTestSending(true)
    try {
      const res = await fetch('/api/autopilot/test', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          full_name: profile?.full_name,
          plan: profile?.plan,
          credits_used: profile?.credits_used,
          credits_limit: profile?.credits_limit,
          autopilot_url: profile?.autopilot_url,
          autopilot_next_run: profile?.autopilot_next_run,
          autopilot_smo_enabled: profile?.autopilot_smo_enabled ?? false,
          autopilot_frequency: frequency,
          autopilot_brand_ids: selectedBrandIds.length > 0 ? selectedBrandIds : null,
          gsc_access_token: profile?.gsc_access_token ?? null,
          gsc_refresh_token: profile?.gsc_refresh_token ?? null,
          gsc_site_url: profile?.gsc_site_url ?? null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Xəta baş verdi')
      const result = data.results?.[0]
      if (result?.status === 'sent') {
        showToast('Test emaili göndərildi! Inboxunu yoxla.', 'success')
        // Update credits display locally (runner already deducted in DB)
        const creditCost = frequency === 'monthly' ? 35 : 10
        const nextRun = new Date(); nextRun.setDate(nextRun.getDate() + (frequency === 'monthly' ? 30 : 7))
        setProfile(p => p ? {
          ...p,
          credits_used: (p.credits_used ?? 0) + creditCost,
          autopilot_last_run: new Date().toISOString(),
          autopilot_next_run: nextRun.toISOString(),
        } : p)
      } else if (result?.status === 'skipped_low_credits') {
        showToast('Kredit azdır, email göndərilmədi.', 'error')
      } else if (result?.status === 'skipped_gsc_token_error') {
        showToast('GSC token xətası, email göndərilmədi.', 'error')
      } else {
        showToast(result?.error || 'Email göndərilmədi — statusu yoxla.', 'error')
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Xəta baş verdi', 'error')
    } finally {
      setTestSending(false)
    }
  }

  function formatDate(iso: string | null | undefined) {
    if (!iso) return null
    const d = new Date(iso)
    const months = ['Yanvar','Fevral','Mart','Aprel','May','İyun','İyul','Avqust','Sentyabr','Oktyabr','Noyabr','Dekabr']
    const day = d.getDate()
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    const h = String(d.getHours()).padStart(2, '0')
    const m = String(d.getMinutes()).padStart(2, '0')
    return `${day} ${month} ${year}, ${h}:${m}`
  }

  const isPaid = profile?.plan === 'pro' || profile?.plan === 'agency'
  const gscConnected = !!profile?.gsc_site_url
  const isFullyConfigured = (enabled || smoEnabled) && gscConnected && selectedBrandIds.length > 0

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '300px' }}>
        <div className="w-8 h-8 rounded-full border-[3px] border-transparent border-t-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Page header */}
      <div className="mb-6 sm:mb-7">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl mb-1.5" style={{ color: '#0D0D1A', letterSpacing: '-0.5px' }}>
          Avtopilot
        </h1>
        <p className="text-sm" style={{ color: '#9B9EBB' }}>
          Google Search Console ilə avtomatik hesabatlar alın · <span style={{ color: '#7B6EF6', fontWeight: '600' }}>{frequency === 'monthly' ? '35' : '10'} kredit/hesabat</span>
        </p>
      </div>

      {/* FREE USER: locked */}
      {!isPaid && (
        <div className="rounded-2xl px-6 py-8 sm:py-10 text-center"
          style={{ backgroundColor: '#ffffff', border: '1px solid rgba(123,110,246,0.15)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 text-2xl"
            style={{ backgroundColor: 'rgba(123,110,246,0.08)' }}>
            🔒
          </div>
          <h2 className="font-bold text-xl mb-2.5" style={{ color: '#0D0D1A' }}>
            Pro xüsusiyyəti
          </h2>
          <p className="text-sm mb-6 mx-auto leading-relaxed" style={{ color: '#9B9EBB', maxWidth: '360px' }}>
            Bu xüsusiyyət Pro və Agency planlarında mövcuddur. Hər 3 gündə bir avtomatik SEO hesabatı alın.
          </p>
          <Link href="/settings/billing"
            className="inline-block px-7 py-3 rounded-xl font-bold text-sm text-white"
            style={{ backgroundColor: '#7B6EF6' }}>
            Yüksəlt →
          </Link>
        </div>
      )}

      {/* PAID USER: full UI */}
      {isPaid && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Active status banner */}
          {isFullyConfigured && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3.5 rounded-xl"
              style={{ backgroundColor: 'rgba(0,201,167,0.08)', border: '1px solid rgba(0,201,167,0.2)' }}>
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#00C9A7' }} />
                <span className="text-sm font-semibold" style={{ color: '#00C9A7' }}>Avtopilot aktivdir</span>
              </div>
              {profile.autopilot_next_run && (
                <span className="text-xs" style={{ color: '#9B9EBB' }}>
                  Növbəti: {formatDate(profile.autopilot_next_run)}
                </span>
              )}
            </div>
          )}

          {/* Missing requirements warning */}
          {(enabled || smoEnabled) && (!gscConnected || selectedBrandIds.length === 0) && (
            <div className="px-4 py-3.5 rounded-xl"
              style={{ backgroundColor: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.25)' }}>
              <p className="text-sm font-bold mb-1.5" style={{ color: '#F5A623' }}>Avtopilot hələ aktiv deyil</p>
              <ul className="text-sm pl-4 space-y-0.5" style={{ color: '#5A5D7A' }}>
                {selectedBrandIds.length === 0 && <li>Ən azı bir brend seçin</li>}
                {!gscConnected && <li>Google Search Console-u qoşun</li>}
              </ul>
            </div>
          )}

          {/* SEO + SMO Toggle cards */}
          <div className="rounded-2xl px-4 sm:px-6 py-4 sm:py-5"
            style={{ backgroundColor: '#ffffff', border: '1px solid rgba(123,110,246,0.12)' }}>
            <div className="flex items-center justify-between gap-4">
              <p className="font-bold text-sm sm:text-base" style={{ color: '#0D0D1A' }}>SEO Hesabatı</p>
              <Toggle checked={enabled} onChange={handleToggle} disabled={saving} />
            </div>
          </div>

          <div className="rounded-2xl px-4 sm:px-6 py-4 sm:py-5"
            style={{ backgroundColor: '#ffffff', border: '1px solid rgba(123,110,246,0.12)' }}>
            <div className="flex items-center justify-between gap-4">
              <p className="font-bold text-sm sm:text-base" style={{ color: '#0D0D1A' }}>SMO Hesabatı</p>
              <Toggle checked={smoEnabled} onChange={handleSmoToggle} disabled={saving} />
            </div>
          </div>

          {/* Frequency picker */}
          <div className="rounded-2xl px-4 sm:px-6 py-4 sm:py-5"
            style={{ backgroundColor: '#ffffff', border: '1px solid rgba(123,110,246,0.12)' }}>
            <p className="font-bold text-sm sm:text-base mb-3" style={{ color: '#0D0D1A' }}>Hesabat Tezliyi</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { val: 'weekly' as const,  label: 'Həftəlik', sub: '10 kredit/hesabat' },
                { val: 'monthly' as const, label: 'Aylıq',    sub: '35 kredit/hesabat' },
              ]).map(({ val, label, sub }) => {
                const active = frequency === val
                return (
                  <button key={val} onClick={() => !saving && handleFrequencyChange(val)} disabled={saving}
                    className="rounded-xl py-3 px-4 text-left transition-all"
                    style={{
                      border: active ? '1.5px solid #7B6EF6' : '1px solid rgba(123,110,246,0.15)',
                      backgroundColor: active ? 'rgba(123,110,246,0.07)' : '#F5F5FF',
                      opacity: saving ? 0.6 : 1,
                    }}>
                    <p className="text-sm font-bold mb-0.5" style={{ color: active ? '#7B6EF6' : '#0D0D1A' }}>{label}</p>
                    <p className="text-xs" style={{ color: '#9B9EBB' }}>{sub}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Brand multi-select card */}
          <div className="rounded-2xl px-4 sm:px-6 py-4 sm:py-5"
            style={{ backgroundColor: '#ffffff', border: '1px solid rgba(123,110,246,0.12)' }}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="font-bold text-sm sm:text-base mb-0.5" style={{ color: '#0D0D1A' }}>Brendlər</p>
                <p className="text-xs sm:text-sm" style={{ color: '#9B9EBB' }}>Hansı saytlar üçün hesabat alırsınız</p>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full flex-shrink-0"
                style={{ backgroundColor: 'rgba(123,110,246,0.1)', color: '#7B6EF6', border: '1px solid rgba(123,110,246,0.2)' }}>
                {frequency === 'monthly' ? '35' : '10'} kredit
              </span>
            </div>

            {brands.length === 0 ? (
              <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: 'rgba(123,110,246,0.04)', border: '1px dashed rgba(123,110,246,0.2)', textAlign: 'center' as const }}>
                <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: '600', color: '#0D0D1A' }}>Hələ brend yoxdur</p>
                <Link href="/brands" style={{ fontSize: '13px', color: '#7B6EF6', fontWeight: '600', textDecoration: 'none' }}>Brend yarat →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {brands.map((b) => {
                  const isSelected = selectedBrandIds.includes(b.id)

                  return (
                    <button
                      key={b.id}
                      onClick={() => handleToggleBrand(b.id)}
                      disabled={saving}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: isSelected ? '1.5px solid #7B6EF6' : '1px solid rgba(123,110,246,0.12)',
                        backgroundColor: isSelected ? 'rgba(123,110,246,0.06)' : '#F5F5FF',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        textAlign: 'left' as const,
                        width: '100%',
                        transition: 'all 0.15s',
                        opacity: saving ? 0.7 : 1,
                      }}
                    >
                      {/* Checkbox */}
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        border: isSelected ? 'none' : '2px solid rgba(123,110,246,0.25)',
                        backgroundColor: isSelected ? '#7B6EF6' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {isSelected && (
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>

                      <BrandAvatar brand={b} size={28} />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#0D0D1A' }}>{b.name}</p>
                        {b.website_url && (
                          <p style={{ margin: 0, fontSize: '12px', color: '#9B9EBB', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                            {b.website_url.replace(/^https?:\/\//, '')}
                          </p>
                        )}
                      </div>

                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* GSC card */}
          <div className="rounded-2xl px-4 sm:px-6 py-4 sm:py-5"
            style={{ backgroundColor: '#ffffff', border: '1px solid rgba(123,110,246,0.12)' }}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm sm:text-base mb-1" style={{ color: '#0D0D1A' }}>
                  Google Search Console
                </p>
                {gscConnected ? (
                  <>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: 'rgba(0,201,167,0.1)', color: '#00C9A7', border: '1px solid rgba(0,201,167,0.2)' }}>
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#00C9A7' }} />
                        Qoşulub
                      </span>
                    </div>
                    <p className="mt-2 text-xs sm:text-sm truncate" style={{ color: '#9B9EBB' }}>{profile.gsc_site_url}</p>
                    {profile.gsc_connected_at && (
                      <p className="mt-0.5 text-xs" style={{ color: '#C0C3D8' }}>
                        Qoşulma tarixi: {formatDate(profile.gsc_connected_at)}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed" style={{ color: '#9B9EBB' }}>
                    SEO məlumatlarını analiz etmək üçün GSC-yə qoşulun
                  </p>
                )}
              </div>

              <div className="flex-shrink-0">
                {gscConnected ? (
                  <button
                    onClick={handleDisconnectGSC}
                    disabled={disconnecting}
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 w-full sm:w-auto"
                    style={{ border: '1px solid rgba(242,92,84,0.3)', backgroundColor: 'transparent', color: '#F25C54' }}
                  >
                    {disconnecting ? 'Kəsilir...' : 'Bağlantını kəs'}
                  </button>
                ) : profile?.autopilot_url ? (
                  <Link
                    href="/api/gsc/auth"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white w-full sm:w-auto"
                    style={{ backgroundColor: '#7B6EF6' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google Search Console-u Qoş
                  </Link>
                ) : (
                  <div className="px-4 py-2.5 rounded-xl text-xs font-semibold text-center"
                    style={{ backgroundColor: 'rgba(123,110,246,0.08)', color: '#9B9EBB', border: '1px dashed rgba(123,110,246,0.2)' }}>
                    Əvvəlcə URL daxil edin
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Run info card */}
          {(profile?.autopilot_last_run || profile?.autopilot_next_run) && (
            <div className="rounded-2xl px-4 sm:px-6 py-4 sm:py-5"
              style={{ backgroundColor: '#ffffff', border: '1px solid rgba(123,110,246,0.12)' }}>
              <p className="font-bold text-sm mb-3" style={{ color: '#0D0D1A' }}>Hesabat Tarixi</p>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {profile.autopilot_last_run && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#9B9EBB' }}>Son hesabat</p>
                    <p className="text-sm font-medium" style={{ color: '#0D0D1A' }}>{formatDate(profile.autopilot_last_run)}</p>
                  </div>
                )}
                {profile.autopilot_next_run && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#9B9EBB' }}>Növbəti hesabat</p>
                    <p className="text-sm font-medium" style={{ color: '#0D0D1A' }}>{formatDate(profile.autopilot_next_run)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Admin: test email button */}
          {profile?.email === ADMIN_EMAIL && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4"
              style={{ borderTop: '1px dashed rgba(123,110,246,0.15)' }}>
              <div>
                <p className="text-xs font-bold mb-0.5" style={{ color: '#9B9EBB' }}>Admin · Test</p>
                <p className="text-xs" style={{ color: '#C0C3D8' }}>Bu düyməni basaraq özünə test emaili göndər</p>
              </div>
              <button
                onClick={handleTestEmail}
                disabled={testSending}
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-70 flex-shrink-0"
                style={{
                  border: '1px dashed rgba(123,110,246,0.3)',
                  backgroundColor: testSending ? 'rgba(123,110,246,0.06)' : 'rgba(123,110,246,0.08)',
                  color: '#7B6EF6',
                }}
              >
                {testSending ? 'Göndərilir...' : '📧 Test Emaili Göndər'}
              </button>
            </div>
          )}

        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

    </div>
  )
}

// ─── Page wrapper with Suspense ───────────────────────────────
export default function AutopilotPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center" style={{ minHeight: '300px' }}>
        <div className="w-8 h-8 rounded-full border-[3px] border-transparent border-t-primary animate-spin" />
      </div>
    }>
      <AutopilotPageInner />
    </Suspense>
  )
}
