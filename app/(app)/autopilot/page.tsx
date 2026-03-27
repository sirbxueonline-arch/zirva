'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

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

  const [enabled, setEnabled] = useState(false)
  const [url, setUrl] = useState('')
  const [urlSaved, setUrlSaved] = useState(false)

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
    } else if (gsc === 'error') {
      showToast('Google Search Console qoşularkən xəta baş verdi.', 'error')
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
        setUrl(data.autopilot_url ?? '')
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
      showToast(val ? 'Avtopilot aktivləşdirildi' : 'Avtopilot söndürüldü', 'success')
      setProfile(p => p ? { ...p, autopilot_enabled: val } : p)
    } catch {
      setEnabled(!val)
      showToast('Xəta baş verdi, yenidən cəhd edin', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveUrl() {
    setSaving(true)
    try {
      const res = await fetch('/api/autopilot/save', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ autopilot_url: url }),
      })
      if (!res.ok) throw new Error()
      showToast('URL yadda saxlandı', 'success')
      setUrlSaved(true)
      setProfile(p => p ? { ...p, autopilot_url: url } : p)
      setTimeout(() => setUrlSaved(false), 2000)
    } catch {
      showToast('URL saxlanılmadı, yenidən cəhd edin', 'error')
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

  function formatDate(iso: string | null | undefined) {
    if (!iso) return null
    const d = new Date(iso)
    return d.toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const isPaid = profile?.plan === 'pro' || profile?.plan === 'agency'
  const gscConnected = !!profile?.gsc_site_url
  const isFullyConfigured = enabled && gscConnected && !!profile?.autopilot_url

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid rgba(123,110,246,0.2)', borderTopColor: '#7B6EF6', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Page header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: '800', color: '#0D0D1A', letterSpacing: '-0.5px' }}>
          Avtopilot
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#9B9EBB' }}>
          Google Search Console ilə avtomatik SEO hesabatları alın
        </p>
      </div>

      {/* FREE USER: locked */}
      {!isPaid && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid rgba(123,110,246,0.15)',
          borderRadius: '16px',
          padding: '36px 32px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            backgroundColor: 'rgba(123,110,246,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '28px',
          }}>
            🔒
          </div>
          <h2 style={{ margin: '0 0 10px', fontSize: '20px', fontWeight: '700', color: '#0D0D1A' }}>
            Pro xüsusiyyəti
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#9B9EBB', lineHeight: '1.6', maxWidth: '380px', marginLeft: 'auto', marginRight: 'auto' }}>
            Bu xüsusiyyət Pro və Agency planlarında mövcuddur. Hər 3 gündə bir avtomatik SEO hesabatı alın.
          </p>
          <Link href="/settings/billing" style={{
            display: 'inline-block',
            padding: '12px 28px',
            backgroundColor: '#7B6EF6',
            color: '#ffffff',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '15px',
            textDecoration: 'none',
          }}>
            Yüksəlt →
          </Link>
        </div>
      )}

      {/* PAID USER: full UI */}
      {isPaid && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Active status banner */}
          {isFullyConfigured && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 18px',
              backgroundColor: 'rgba(0,201,167,0.08)',
              border: '1px solid rgba(0,201,167,0.2)',
              borderRadius: '12px',
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00C9A7', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#00C9A7' }}>Avtopilot aktivdir</span>
              {profile.autopilot_next_run && (
                <span style={{ fontSize: '13px', color: '#9B9EBB', marginLeft: 'auto' }}>
                  Növbəti: {formatDate(profile.autopilot_next_run)}
                </span>
              )}
            </div>
          )}

          {/* Missing requirements warning */}
          {enabled && (!gscConnected || !profile?.autopilot_url) && (
            <div style={{
              padding: '14px 18px',
              backgroundColor: 'rgba(245,166,35,0.08)',
              border: '1px solid rgba(245,166,35,0.25)',
              borderRadius: '12px',
            }}>
              <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: '700', color: '#F5A623' }}>
                Avtopilot hələ aktiv deyil
              </p>
              <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: '13px', color: '#5A5D7A', lineHeight: '1.7' }}>
                {!profile?.autopilot_url && <li>Saytınızın URL-ini daxil edin</li>}
                {!gscConnected && <li>Google Search Console-u qoşun</li>}
              </ul>
            </div>
          )}

          {/* Toggle card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(123,110,246,0.12)',
            borderRadius: '16px',
            padding: '20px 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <p style={{ margin: '0 0 3px', fontSize: '15px', fontWeight: '700', color: '#0D0D1A' }}>
                  Avtomatik hesabat
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: '#9B9EBB' }}>
                  Hər 3 gündə bir email hesabat alın (5 kredit/hesabat)
                </p>
              </div>
              <Toggle checked={enabled} onChange={handleToggle} disabled={saving} />
            </div>
          </div>

          {/* Site URL card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(123,110,246,0.12)',
            borderRadius: '16px',
            padding: '20px 24px',
          }}>
            <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '700', color: '#0D0D1A' }}>
              Saytınızın URL-i
            </p>
            <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#9B9EBB' }}>
              Hesabatda göstəriləcək saytın ünvanı
            </p>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(123,110,246,0.2)',
                  fontSize: '14px',
                  color: '#0D0D1A',
                  backgroundColor: '#F5F5FF',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSaveUrl}
                disabled={saving || !url.trim()}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: urlSaved ? '#00C9A7' : '#7B6EF6',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: saving || !url.trim() ? 'not-allowed' : 'pointer',
                  opacity: saving || !url.trim() ? 0.6 : 1,
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap' as const,
                }}
              >
                {urlSaved ? 'Saxlandı ✓' : 'Saxla'}
              </button>
            </div>
          </div>

          {/* GSC card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(123,110,246,0.12)',
            borderRadius: '16px',
            padding: '20px 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' as const }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 3px', fontSize: '15px', fontWeight: '700', color: '#0D0D1A' }}>
                  Google Search Console
                </p>
                {gscConnected ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(0,201,167,0.1)',
                        color: '#00C9A7',
                        fontSize: '12px',
                        fontWeight: '600',
                        border: '1px solid rgba(0,201,167,0.2)',
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00C9A7', display: 'inline-block' }} />
                        Qoşulub
                      </span>
                    </div>
                    <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#9B9EBB' }}>
                      {profile.gsc_site_url}
                    </p>
                    {profile.gsc_connected_at && (
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#C0C3D8' }}>
                        Qoşulma tarixi: {formatDate(profile.gsc_connected_at)}
                      </p>
                    )}
                  </>
                ) : (
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9B9EBB', lineHeight: '1.5' }}>
                    SEO məlumatlarını analiz etmək üçün GSC-yə qoşulun
                  </p>
                )}
              </div>

              <div style={{ flexShrink: 0 }}>
                {gscConnected ? (
                  <button
                    onClick={handleDisconnectGSC}
                    disabled={disconnecting}
                    style={{
                      padding: '9px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(242,92,84,0.3)',
                      backgroundColor: 'transparent',
                      color: '#F25C54',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: disconnecting ? 'not-allowed' : 'pointer',
                      opacity: disconnecting ? 0.6 : 1,
                    }}
                  >
                    {disconnecting ? 'Kəsilir...' : 'Bağlantını kəs'}
                  </button>
                ) : (
                  <Link
                    href="/api/gsc/auth"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '10px',
                      backgroundColor: '#7B6EF6',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      textDecoration: 'none',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google Search Console-u Qoş
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Run info card */}
          {(profile?.autopilot_last_run || profile?.autopilot_next_run) && (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid rgba(123,110,246,0.12)',
              borderRadius: '16px',
              padding: '18px 24px',
            }}>
              <p style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '700', color: '#0D0D1A' }}>
                Hesabat Tarixi
              </p>
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' as const }}>
                {profile.autopilot_last_run && (
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: '600', color: '#9B9EBB', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
                      Son hesabat
                    </p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#0D0D1A', fontWeight: '500' }}>
                      {formatDate(profile.autopilot_last_run)}
                    </p>
                  </div>
                )}
                {profile.autopilot_next_run && (
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: '600', color: '#9B9EBB', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
                      Növbəti hesabat
                    </p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#0D0D1A', fontWeight: '500' }}>
                      {formatDate(profile.autopilot_next_run)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

// ─── Page wrapper with Suspense ───────────────────────────────
export default function AutopilotPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid rgba(123,110,246,0.2)', borderTopColor: '#7B6EF6', animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <AutopilotPageInner />
    </Suspense>
  )
}
