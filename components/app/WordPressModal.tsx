'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe, KeyRound, CheckCircle2, AlertCircle, ExternalLink, Loader2, Trash2 } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 30 }

interface Connection {
  site_url:  string
  site_name: string
  status:    string
  created_at: string
}

interface Props {
  open:       boolean
  onClose:    () => void
  existing:   Connection | null
  onSaved:    (conn: Connection) => void
  onDeleted:  () => void
}

export default function WordPressModal({ open, onClose, existing, onSaved, onDeleted }: Props) {
  const [siteUrl,     setSiteUrl]     = useState('')
  const [username,    setUsername]    = useState('')
  const [appPassword, setAppPassword] = useState('')
  const [loading,     setLoading]     = useState(false)
  const [deleting,    setDeleting]    = useState(false)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Reset form when opened
  useEffect(() => {
    if (open) {
      setSiteUrl(existing?.site_url ?? '')
      setUsername('')
      setAppPassword('')
      setError('')
      setSuccess(false)
    }
  }, [open, existing])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  async function handleConnect() {
    if (!siteUrl.trim() || !username.trim() || !appPassword.trim()) {
      setError('Bütün sahələri doldurun')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/cms', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ site_url: siteUrl, username, app_password: appPassword }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Xəta baş verdi'); return }
      setSuccess(true)
      setTimeout(() => {
        onSaved({ site_url: siteUrl, site_name: data.site_name, status: 'connected', created_at: new Date().toISOString() })
        onClose()
      }, 1400)
    } catch {
      setError('Şəbəkə xətası — internet bağlantınızı yoxlayın')
    } finally {
      setLoading(false)
    }
  }

  async function handleDisconnect() {
    setDeleting(true)
    try {
      await fetch('/api/cms', { method: 'DELETE' })
      onDeleted()
      onClose()
    } finally {
      setDeleting(false)
    }
  }

  const inputCls = "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
  const inputStyle = { background: '#F5F5FF', border: '1px solid rgba(123,110,246,0.2)', color: '#0D0D1A' }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(13,13,26,0.45)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => { if (e.target === overlayRef.current) onClose() }}
          >
            {/* Modal */}
            <motion.div
              className="w-full max-w-md rounded-3xl overflow-hidden"
              style={{ background: '#FFFFFF', boxShadow: '0 24px 80px rgba(13,13,26,0.2)' }}
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              exit={{   scale: 0.94, opacity: 0, y: 16  }}
              transition={{ ...SPRING }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(123,110,246,0.08)' }}>
                <div className="flex items-center gap-3">
                  {/* WordPress logo */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#21759B12' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#21759B">
                      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 19.5C6.761 21.5 2.5 17.239 2.5 12S6.761 2.5 12 2.5 21.5 6.761 21.5 12 17.239 21.5 12 21.5zM3.61 12c0 3.485 2.026 6.504 4.972 7.986L4.389 9.121A8.389 8.389 0 003.61 12zm14.455-.826c0-1.088-.39-1.841-.725-2.426-.445-.724-.863-1.337-.863-2.061 0-.808.612-1.56 1.476-1.56.039 0 .076.005.113.007A8.385 8.385 0 0012 3.611a8.38 8.38 0 00-7.07 3.875c.199.006.386.01.546.01 .887 0 2.26-.108 2.26-.108.457-.027.511.644.054.697 0 0-.459.054-.97.081l3.087 9.185 1.855-5.562-1.32-3.623c-.456-.027-.889-.081-.889-.081-.456-.027-.402-.724.054-.697 0 0 1.4.108 2.234.108.887 0 2.26-.108 2.26-.108.457-.027.511.644.055.697 0 0-.46.054-.971.081l3.064 9.11.846-2.827c.366-.172.624-1.064.624-1.604zM12.388 12.9l-2.544 7.393a8.405 8.405 0 004.912-.127 .743.743 0 01-.059-.114L12.388 12.9zm7.143-4.725a8.39 8.39 0 01.058 1.029c0 1.015-.19 2.156-.759 3.583l-3.048 8.812A8.39 8.39 0 0019.531 8.175z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base" style={{ color: '#0D0D1A' }}>
                      {existing ? 'WordPress Bağlantısı' : 'WordPress Bağla'}
                    </h2>
                    <p className="text-xs" style={{ color: '#9B9EBB' }}>
                      {existing ? existing.site_name || existing.site_url : 'Saytınıza birbaşa nəşr edin'}
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-100">
                  <X size={16} strokeWidth={2} style={{ color: '#9B9EBB' }} />
                </button>
              </div>

              <div className="px-6 py-5">
                {/* Connected state */}
                {existing && !success && (
                  <div className="mb-5 rounded-2xl p-4 flex items-center gap-3" style={{ background: 'rgba(0,201,167,0.06)', border: '1px solid rgba(0,201,167,0.2)' }}>
                    <CheckCircle2 size={18} strokeWidth={2} style={{ color: '#00C9A7', flexShrink: 0 }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#0D0D1A' }}>Bağlı — {existing.site_name || existing.site_url}</p>
                      <p className="text-xs" style={{ color: '#9B9EBB' }}>Yeni bağlantı üçün aşağıdakı formu doldurun</p>
                    </div>
                  </div>
                )}

                {/* Success state */}
                {success ? (
                  <motion.div
                    className="py-6 text-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ ...SPRING }}
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(0,201,167,0.1)' }}>
                      <CheckCircle2 size={32} strokeWidth={2} style={{ color: '#00C9A7' }} />
                    </div>
                    <p className="font-display font-bold text-lg mb-1" style={{ color: '#0D0D1A' }}>Uğurla bağlandı!</p>
                    <p className="text-sm" style={{ color: '#9B9EBB' }}>Məqalələriniz artıq birbaşa nəşr ediləcək</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {/* Site URL */}
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#9B9EBB' }}>
                        WordPress Sayt URL-i
                      </label>
                      <div className="relative">
                        <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9B9EBB' }} />
                        <input
                          type="url"
                          value={siteUrl}
                          onChange={e => setSiteUrl(e.target.value)}
                          placeholder="https://saytiniz.az"
                          className={inputCls + ' pl-9'}
                          style={inputStyle}
                          onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                          onBlur={e  => (e.target.style.borderColor = 'rgba(123,110,246,0.2)')}
                        />
                      </div>
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#9B9EBB' }}>
                        WordPress İstifadəçi Adı
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="admin"
                        className={inputCls}
                        style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                        onBlur={e  => (e.target.style.borderColor = 'rgba(123,110,246,0.2)')}
                      />
                    </div>

                    {/* App Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9B9EBB' }}>
                          Application Password
                        </label>
                        <a
                          href="/help/wordpress"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs transition-colors hover:opacity-80"
                          style={{ color: '#7B6EF6' }}
                        >
                          Necə yaradılır? <ExternalLink size={11} strokeWidth={2} />
                        </a>
                      </div>
                      <div className="relative">
                        <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9B9EBB' }} />
                        <input
                          type="password"
                          value={appPassword}
                          onChange={e => setAppPassword(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleConnect()}
                          placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                          className={inputCls + ' pl-9'}
                          style={inputStyle}
                          onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                          onBlur={e  => (e.target.style.borderColor = 'rgba(123,110,246,0.2)')}
                        />
                      </div>
                      <p className="text-xs mt-1.5" style={{ color: '#C0C3D8' }}>
                        WordPress Admin → İstifadəçilər → Profil → Application Passwords
                      </p>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          className="flex items-center gap-2 rounded-xl px-4 py-3"
                          style={{ background: 'rgba(242,92,84,0.07)', border: '1px solid rgba(242,92,84,0.2)' }}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          <AlertCircle size={15} strokeWidth={2} style={{ color: '#F25C54', flexShrink: 0 }} />
                          <p className="text-sm" style={{ color: '#F25C54' }}>{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Connect button */}
                    <button
                      onClick={handleConnect}
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                      style={{ background: '#7B6EF6', boxShadow: '0 4px 16px rgba(123,110,246,0.3)' }}
                    >
                      {loading
                        ? <><Loader2 size={16} strokeWidth={2} className="animate-spin" /> Yoxlanılır...</>
                        : 'Yoxla və Bağla'
                      }
                    </button>

                    {/* Disconnect */}
                    {existing && (
                      <button
                        onClick={handleDisconnect}
                        disabled={deleting}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 hover:bg-red-50"
                        style={{ color: '#F25C54', border: '1px solid rgba(242,92,84,0.2)' }}
                      >
                        {deleting
                          ? <Loader2 size={14} className="animate-spin" />
                          : <Trash2 size={14} strokeWidth={2} />
                        }
                        Bağlantını Sil
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
