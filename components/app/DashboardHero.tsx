'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Sparkles, PenLine, ArrowRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function DashboardHero() {
  const [url, setUrl]       = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSave() {
    const trimmed = url.trim()
    if (!trimmed) { setError('URL daxil edin'); return }
    setSaving(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      let normalized = trimmed
      if (!/^https?:\/\//i.test(normalized)) normalized = 'https://' + normalized
      const { error: dbErr } = await supabase
        .from('profiles')
        .update({ website_url: normalized, updated_at: new Date().toISOString() })
        .eq('id', user.id)
      if (dbErr) { setError('Xəta baş verdi'); return }
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="rounded-2xl p-7 mb-6 border-2 border-dashed relative overflow-hidden"
      style={{ borderColor: 'rgba(123,110,246,0.25)', background: 'rgba(123,110,246,0.03)' }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(123,110,246,0.1)' }}>
          <Globe size={24} strokeWidth={1.8} style={{ color: '#7B6EF6' }} />
        </div>
        <div className="flex-1">
          <h2 className="font-display font-bold text-lg mb-1" style={{ color: '#0D0D1A' }}>
            Saytınızı əlavə edin
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#737599' }}>
            Zirva saytınızı öyrənir, hər gün avtomatik məqalə yazır — siz yatarkən Google-da yuxarı çıxırsınız.
          </p>
        </div>
      </div>

      {/* URL input */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9B9EBB' }} />
          <input
            type="url"
            value={url}
            onChange={e => { setUrl(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="https://saytiniz.az"
            className="w-full rounded-xl pl-9 pr-4 py-3 text-sm outline-none transition-all"
            style={{ background: '#FFFFFF', border: `1px solid ${error ? 'rgba(242,92,84,0.5)' : 'rgba(123,110,246,0.2)'}`, color: '#0D0D1A' }}
            onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
            onBlur={e  => (e.target.style.borderColor = error ? 'rgba(242,92,84,0.5)' : 'rgba(123,110,246,0.2)')}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-60"
          style={{ background: '#7B6EF6', boxShadow: '0 4px 16px rgba(123,110,246,0.28)' }}
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <>Başla <ArrowRight size={15} strokeWidth={2.5} /></>}
        </button>
      </div>
      {error && <p className="text-xs mb-3" style={{ color: '#F25C54' }}>{error}</p>}

      {/* How it works mini */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Globe,    text: 'URL əlavə edin' },
          { icon: Sparkles, text: 'AI saytı öyrənir' },
          { icon: PenLine,  text: 'Hər gün məqalə' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2.5 rounded-xl px-3 py-3"
            style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.1)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(123,110,246,0.08)' }}>
              <Icon size={14} strokeWidth={2} style={{ color: '#7B6EF6' }} />
            </div>
            <span className="text-xs font-medium leading-snug" style={{ color: '#3D4060' }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
