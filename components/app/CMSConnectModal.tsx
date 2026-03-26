'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe, KeyRound, CheckCircle2, AlertCircle, ExternalLink, Loader2, Trash2 } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 30 }

interface Connection {
  site_url:   string
  site_name:  string
  status:     string
  created_at: string
  cms_type?:  string
}

type Platform = 'ghost' | 'webflow' | 'shopify' | 'wix'

const PLATFORM_CONFIG: Record<Platform, {
  label:   string
  color:   string
  bgColor: string
  fields:  { key: 'site_url' | 'username' | 'app_password'; label: string; placeholder: string; type: string; icon: 'globe' | 'key'; help?: string; helpUrl?: string }[]
  icon:    React.ReactNode
}> = {
  ghost: {
    label: 'Ghost', color: '#15171A', bgColor: '#15171A0D',
    // eslint-disable-next-line @next/next/no-img-element
    icon: <img src="https://cdn.simpleicons.org/ghost/15171A" alt="Ghost" width={22} height={22} style={{ objectFit: 'contain' }} />,
    fields: [
      { key: 'site_url',    label: 'Ghost Sayt URL-i', placeholder: 'https://blog.saytiniz.az',  type: 'url',      icon: 'globe' },
      { key: 'app_password', label: 'Content API Key', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxx',  type: 'password', icon: 'key',
        help: 'Necə əldə etmək olar?', helpUrl: '/help/ghost' },
    ],
  },
  webflow: {
    label: 'Webflow', color: '#146EF5', bgColor: '#146EF50D',
    // eslint-disable-next-line @next/next/no-img-element
    icon: <img src="https://cdn.simpleicons.org/webflow/146EF5" alt="Webflow" width={22} height={22} style={{ objectFit: 'contain' }} />,
    fields: [
      { key: 'app_password', label: 'API Token', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', type: 'password', icon: 'key',
        help: 'Necə əldə etmək olar?', helpUrl: '/help/webflow' },
    ],
  },
  shopify: {
    label: 'Shopify', color: '#96BF48', bgColor: '#96BF480D',
    // eslint-disable-next-line @next/next/no-img-element
    icon: <img src="https://cdn.simpleicons.org/shopify/96BF48" alt="Shopify" width={22} height={22} style={{ objectFit: 'contain' }} />,
    fields: [
      { key: 'site_url',    label: 'Mağaza URL-i',       placeholder: 'mystore.myshopify.com', type: 'url',      icon: 'globe' },
      { key: 'app_password', label: 'Admin Access Token', placeholder: 'shpat_xxxxxxxxxxxx',   type: 'password', icon: 'key',
        help: 'Necə əldə etmək olar?', helpUrl: '/help/shopify' },
    ],
  },
  wix: {
    label: 'Wix', color: '#FAAD4D', bgColor: '#FAAD4D0D',
    // eslint-disable-next-line @next/next/no-img-element
    icon: <img src="https://cdn.simpleicons.org/wix/FAAD4D" alt="Wix" width={22} height={22} style={{ objectFit: 'contain' }} />,
    fields: [
      { key: 'app_password', label: 'API Key',  placeholder: 'IST.eyJhbGci...', type: 'password', icon: 'key',
        help: 'Necə əldə etmək olar?', helpUrl: '/help/wix' },
      { key: 'username',     label: 'Site ID',  placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', type: 'text', icon: 'globe' },
    ],
  },
}

interface Props {
  platform:  Platform
  open:      boolean
  onClose:   () => void
  existing:  Connection | null
  onSaved:   (conn: Connection) => void
  onDeleted: () => void
}

export default function CMSConnectModal({ platform, open, onClose, existing, onSaved, onDeleted }: Props) {
  const config = PLATFORM_CONFIG[platform]
  const [values,   setValues]   = useState<Record<string, string>>({})
  const [loading,  setLoading]  = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      const init: Record<string, string> = {}
      config.fields.forEach(f => { init[f.key] = f.key === 'site_url' ? (existing?.site_url ?? '') : '' })
      setValues(init)
      setError('')
      setSuccess(false)
    }
  }, [open, existing])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  async function handleConnect() {
    for (const f of config.fields) {
      if (!values[f.key]?.trim()) { setError('Bütün sahələri doldurun'); return }
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/cms', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ cms_type: platform, ...values }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Xəta baş verdi'); return }
      setSuccess(true)
      setTimeout(() => {
        onSaved({ site_url: values.site_url || '', site_name: data.site_name, status: 'connected', created_at: new Date().toISOString(), cms_type: platform })
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
      await fetch(`/api/cms?cms_type=${platform}`, { method: 'DELETE' })
      onDeleted()
      onClose()
    } finally { setDeleting(false) }
  }

  const inputCls   = 'w-full rounded-xl px-4 py-3 text-sm outline-none transition-all'
  const inputStyle = { background: '#F5F5FF', border: '1px solid rgba(123,110,246,0.2)', color: '#0D0D1A' }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: 'rgba(13,13,26,0.5)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { if (e.target === overlayRef.current) onClose() }}
          >
            <motion.div
              className="w-full max-w-md rounded-3xl overflow-hidden"
              style={{ background: '#FFFFFF', boxShadow: '0 24px 80px rgba(13,13,26,0.2)' }}
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ ...SPRING }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(123,110,246,0.08)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: config.bgColor }}>
                    {config.icon}
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base" style={{ color: '#0D0D1A' }}>
                      {existing ? `${config.label} Bağlantısı` : `${config.label} Bağla`}
                    </h2>
                    <p className="text-xs" style={{ color: '#9B9EBB' }}>
                      {existing ? existing.site_name || existing.site_url : 'Birbaşa nəşr edin'}
                    </p>
                  </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-gray-100">
                  <X size={16} strokeWidth={2} style={{ color: '#9B9EBB' }} />
                </button>
              </div>

              <div className="px-6 py-5">
                {/* Connected badge */}
                {existing && !success && (
                  <div className="mb-5 rounded-2xl p-4 flex items-center gap-3" style={{ background: 'rgba(0,201,167,0.06)', border: '1px solid rgba(0,201,167,0.2)' }}>
                    <CheckCircle2 size={18} strokeWidth={2} style={{ color: '#00C9A7', flexShrink: 0 }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#0D0D1A' }}>Bağlı — {existing.site_name || existing.site_url}</p>
                      <p className="text-xs" style={{ color: '#9B9EBB' }}>Yeni bağlantı üçün formu doldurun</p>
                    </div>
                  </div>
                )}

                {/* Success */}
                {success ? (
                  <motion.div className="py-6 text-center" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...SPRING }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(0,201,167,0.1)' }}>
                      <CheckCircle2 size={32} strokeWidth={2} style={{ color: '#00C9A7' }} />
                    </div>
                    <p className="font-display font-bold text-lg mb-1" style={{ color: '#0D0D1A' }}>Uğurla bağlandı!</p>
                    <p className="text-sm" style={{ color: '#9B9EBB' }}>Məqalələriniz artıq birbaşa nəşr ediləcək</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {config.fields.map(field => (
                      <div key={field.key}>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9B9EBB' }}>{field.label}</label>
                          {field.help && field.helpUrl && (
                            <a href={field.helpUrl} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs hover:opacity-80" style={{ color: '#7B6EF6' }}
                            >
                              {field.help} <ExternalLink size={11} strokeWidth={2} />
                            </a>
                          )}
                        </div>
                        <div className="relative">
                          {field.icon === 'globe'
                            ? <Globe    size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9B9EBB' }} />
                            : <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9B9EBB' }} />
                          }
                          <input
                            type={field.type}
                            value={values[field.key] ?? ''}
                            onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && handleConnect()}
                            placeholder={field.placeholder}
                            className={inputCls + ' pl-9'}
                            style={inputStyle}
                            onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                            onBlur={e  => (e.target.style.borderColor = 'rgba(123,110,246,0.2)')}
                          />
                        </div>
                      </div>
                    ))}

                    <AnimatePresence>
                      {error && (
                        <motion.div className="flex items-center gap-2 rounded-xl px-4 py-3"
                          style={{ background: 'rgba(242,92,84,0.07)', border: '1px solid rgba(242,92,84,0.2)' }}
                          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        >
                          <AlertCircle size={15} strokeWidth={2} style={{ color: '#F25C54', flexShrink: 0 }} />
                          <p className="text-sm" style={{ color: '#F25C54' }}>{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button onClick={handleConnect} disabled={loading}
                      className="w-full py-3.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                      style={{ background: '#7B6EF6', boxShadow: '0 4px 16px rgba(123,110,246,0.3)' }}
                    >
                      {loading ? <><Loader2 size={16} strokeWidth={2} className="animate-spin" /> Yoxlanılır...</> : 'Yoxla və Bağla'}
                    </button>

                    {existing && (
                      <button onClick={handleDisconnect} disabled={deleting}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 hover:bg-red-50"
                        style={{ color: '#F25C54', border: '1px solid rgba(242,92,84,0.2)' }}
                      >
                        {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} strokeWidth={2} />}
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
