'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ScoreCircle from './ScoreCircle'
import { ToastContainer } from '@/components/shared/Toast'
import ConfirmModal from '@/components/shared/ConfirmModal'
import type { Generation, SEOPackage } from '@/types'
import { flowLabel, flowBadgeColor, formatDate, scoreColor } from '@/lib/utils'
import { Lightbulb, RotateCcw, ChevronRight, Code2, CheckCircle2 } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

interface ToastItem { id: string; message: string; type?: 'success' | 'error' | 'info' }
type ResultTab = 'az' | 'ru' | 'schema' | 'tips' | 'content' | 'install'

function CopyButton({ text, small }: { text: string; small?: boolean }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <motion.button
      onClick={copy}
      whileTap={{ scale: 0.94 }}
      className={`flex items-center gap-1.5 font-medium transition-all rounded-lg ${small ? 'text-xs px-2.5 py-1' : 'text-xs px-3 py-1.5'}`}
      style={{
        background: copied ? 'rgba(0,201,167,0.1)' : 'rgba(123,110,246,0.08)',
        border: `1px solid ${copied ? 'rgba(0,201,167,0.3)' : 'rgba(123,110,246,0.2)'}`,
        color: copied ? '#00C9A7' : '#7B6EF6',
      }}
    >
      {copied ? (
        <><svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> Kopyalandı</>
      ) : (
        <><svg width="11" height="11" viewBox="0 0 12 12" fill="none"><rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 4V2.5A1.5 1.5 0 0 1 5.5 1H9.5A1.5 1.5 0 0 1 11 2.5V7A1.5 1.5 0 0 1 9.5 8.5H8" stroke="currentColor" strokeWidth="1.2"/></svg> Kopyala</>
      )}
    </motion.button>
  )
}

function TagCard({ label, value, charMin, charMax, mono, hint }: { label: string; value: string; charMin?: number; charMax?: number; mono?: boolean; hint?: string }) {
  const len = value?.length ?? 0
  const overLimit = charMax ? len > charMax : false
  const underLimit = charMin ? len < charMin : false
  const warn = charMax ? len >= charMax - 5 && len <= charMax : false
  const countColor = overLimit || underLimit ? '#F25C54' : warn ? '#F5A623' : '#00C9A7'

  return (
    <div
      className="rounded-xl border p-4 group"
      style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', boxShadow: '0 1px 4px rgba(13,13,26,0.04)' }}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9B9EBB' }}>{label}</span>
          {hint && <p className="text-xs mt-0.5" style={{ color: '#C0C3D8' }}>{hint}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {charMin && charMax && (
            <span
              className="text-xs font-mono"
              style={{ color: countColor }}
              title={overLimit ? `Limit aşıldı (${len}/${charMax})` : underLimit ? `Çox qısadır (${len}/${charMin}–${charMax})` : `${len} simvol`}
            >
              {len}/{charMax}
            </span>
          )}
          <CopyButton text={value} small />
        </div>
      </div>
      <p className={`text-text-primary text-sm leading-relaxed ${mono ? 'font-mono text-xs' : ''}`}>{value || '—'}</p>
      {charMin && charMax && (
        <div className="mt-2.5 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(123,110,246,0.08)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min((len / charMax) * 100, 100)}%`, background: countColor }}
          />
        </div>
      )}
    </div>
  )
}

type Platform = 'html' | 'wordpress' | 'webflow' | 'shopify' | 'wix' | 'javascript' | 'react'

const PLATFORM_ICONS: Record<Platform, { src: string; srcActive: string }> = {
  html:       { src: 'https://cdn.simpleicons.org/html5/E34F26',      srcActive: 'https://cdn.simpleicons.org/html5/FFFFFF'      },
  wordpress:  { src: 'https://cdn.simpleicons.org/wordpress/21759B',  srcActive: 'https://cdn.simpleicons.org/wordpress/FFFFFF'  },
  webflow:    { src: 'https://cdn.simpleicons.org/webflow/146EF5',    srcActive: 'https://cdn.simpleicons.org/webflow/FFFFFF'    },
  shopify:    { src: 'https://cdn.simpleicons.org/shopify/96BF48',    srcActive: 'https://cdn.simpleicons.org/shopify/FFFFFF'    },
  wix:        { src: 'https://cdn.simpleicons.org/wix/FAAD4D',        srcActive: 'https://cdn.simpleicons.org/wix/FFFFFF'        },
  javascript: { src: 'https://cdn.simpleicons.org/javascript/F7DF1E', srcActive: 'https://cdn.simpleicons.org/javascript/FFFFFF' },
  react:      { src: 'https://cdn.simpleicons.org/react/61DAFB',      srcActive: 'https://cdn.simpleicons.org/react/FFFFFF'      },
}

function PlatformIcon({ id, active }: { id: Platform; active: boolean }) {
  const icon = PLATFORM_ICONS[id]
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={active ? icon.srcActive : icon.src} alt={id} width={16} height={16} style={{ objectFit: 'contain', flexShrink: 0 }} />
}

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'html',       label: 'HTML'       },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'react',      label: 'React'      },
  { id: 'wordpress',  label: 'WordPress'  },
  { id: 'webflow',    label: 'Webflow'    },
  { id: 'shopify',    label: 'Shopify'    },
  { id: 'wix',        label: 'Wix'        },
]

function InstallTab({ seo, isPro, addToast }: { seo: SEOPackage; isPro: boolean; addToast: (msg: string, type?: 'success'|'error'|'info') => void }) {
  const [platform, setPlatform] = useState<Platform>('html')
  const [copied, setCopied] = useState(false)

  const headCode = `<!-- Zirva SEO Teqləri -->
<title>${seo.title_tag_az}</title>
<meta name="description" content="${seo.meta_description_az}">
<meta name="robots" content="${seo.robots}">
<link rel="canonical" href="${seo.canonical_url}">

<!-- Open Graph -->
<meta property="og:title" content="${seo.og_title}">
<meta property="og:description" content="${seo.og_description}">
<meta property="og:type" content="${seo.og_type}">

<!-- Twitter Card -->
<meta name="twitter:card" content="${seo.twitter_card}">
<meta name="twitter:title" content="${seo.twitter_title}">
<meta name="twitter:description" content="${seo.twitter_description}">
${seo.hreflang?.map(h => `<link rel="alternate" hreflang="${h.lang}" href="${h.url}">`).join('\n')}

<!-- Schema.org -->
<script type="application/ld+json">
${JSON.stringify(seo.schema_markup, null, 2)}
</script>`

  async function copyCode() {
    await navigator.clipboard.writeText(headCode)
    setCopied(true)
    addToast('Kod kopyalandı!', 'success')
    setTimeout(() => setCopied(false), 2500)
  }

  const STEPS: Record<Platform, { step: string; desc: string }[]> = {
    html: [
      { step: '1. index.html faylını açın',         desc: 'Saytınızın əsas HTML faylını redaktor ilə açın.' },
      { step: '2. <head> teqini tapın',              desc: 'Faylda <head> ... </head> bölməsini tapın.' },
      { step: '3. Kodu yapışdırın',                  desc: 'Aşağıdakı kodu </head> teqindən əvvəl əlavə edin.' },
      { step: '4. Faylı saxlayın və yükləyin',       desc: 'Dəyişiklikləri saxlayın və servera yükləyin.' },
    ],
    wordpress: [
      { step: '1. "SEOPress" və ya "Rank Math" quraşdırın', desc: 'WordPress idarə panelinə daxil olun → Plaginlər → Yeni əlavə et.' },
      { step: '2. Plagin parametrlərinə keçin',             desc: 'Plagin quraşdırıldıqdan sonra açın və sayt URL-inizi daxil edin.' },
      { step: '3. YA DA manual üsul:',                      desc: 'Görünüş → Tema Redaktoru → header.php faylını açın.' },
      { step: '4. Kodu </head> dan əvvəl yapışdırın',       desc: 'Aşağıdakı kodu kopyalayın və </head> teqindən əvvəl əlavə edin.' },
    ],
    webflow: [
      { step: '1. Webflow Designer\'ı açın',              desc: 'Layihənizə daxil olun.' },
      { step: '2. Layihə Parametrlərinə keçin',           desc: 'Sol panel → Pages → Öz səhifənizi seçin → Page Settings.' },
      { step: '3. "Custom Code" bölməsini tapın',         desc: '"Head Code" sahəsinə gedin.' },
      { step: '4. Kodu yapışdırın və Publish edin',       desc: 'Aşağıdakı kodu kopyalayıb ora yapışdırın, sonra Publish edin.' },
    ],
    shopify: [
      { step: '1. Shopify Admin panelini açın',           desc: 'Online Store → Themes → Edit Code.' },
      { step: '2. theme.liquid faylını tapın',            desc: 'Layout qovluğunda theme.liquid faylını seçin.' },
      { step: '3. </head> teqini axtarın',                desc: 'Ctrl+F ilə </head> yazın.' },
      { step: '4. Kodu yapışdırın və yadda saxlayın',     desc: 'Aşağıdakı kodu </head> dan əvvəl əlavə edin, Save edin.' },
    ],
    wix: [
      { step: '1. Wix Editor\'ı açın',                   desc: 'Saytınıza daxil olun → Edit Site.' },
      { step: '2. Wix SEO Settings\'ə keçin',            desc: 'Sol panel → SEO Tools → Edit SEO Tags.' },
      { step: '3. Custom Meta Tags əlavə edin',           desc: 'Advanced SEO bölməsindən custom teqlər əlavə edin.' },
      { step: '4. Embed Code istifadə edin',              desc: 'Add → Embed → Custom Code → Head bölməsinə yapışdırın.' },
    ],
    javascript: [
      { step: '1. HTML faylınızı açın',                  desc: 'Layihənizdəki əsas index.html faylını açın.' },
      { step: '2. <head> teqini tapın',                  desc: '<head>...</head> bölməsini tapın.' },
      { step: '3. Kodu birbaşa yapışdırın',              desc: 'Aşağıdakı HTML teqlərini </head>-dən əvvəl əlavə edin. Vanilla JS üçün əlavə kitabxana lazım deyil.' },
      { step: '4. Faylı saxlayın',                       desc: 'Dəyişiklikləri saxlayın, brauzerdə yeniləyin.' },
    ],
    react: [
      { step: '1. react-helmet-async quraşdırın',        desc: 'Terminal: npm install react-helmet-async' },
      { step: '2. App.jsx / main.jsx-ə HelmetProvider əlavə edin', desc: 'import { HelmetProvider } from "react-helmet-async" — root komponenti HelmetProvider ilə əhatə edin.' },
      { step: '3. Səhifə komponentinizdə Helmet istifadə edin',    desc: 'import { Helmet } from "react-helmet-async" — aşağıdakı teqləri <Helmet> içinə köçürün.' },
      { step: '4. Next.js istifadə edirsinizsə',         desc: 'react-helmet əvəzinə next/head-dən <Head> komponenti istifadə edin — eyni teqlər keçərlidir.' },
    ],
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(123,110,246,0.07), rgba(123,110,246,0.03))', border: '1px solid rgba(123,110,246,0.15)' }}>
        <div className="flex items-center gap-3 mb-1">
          <Code2 size={18} strokeWidth={1.8} style={{ color: '#7B6EF6' }} />
          <h3 className="font-bold text-text-primary">Saytınıza tətbiq edin</h3>
        </div>
        <p className="text-sm text-text-muted ml-8">Aşağıdakı kodu saytınızın <code className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(123,110,246,0.12)', color: '#7B6EF6' }}>&lt;head&gt;</code> bölməsinə yapışdırın — Google-da indexlənmə başlayacaq.</p>
      </div>

      {/* Platform selector */}
      <div className="flex gap-2 flex-wrap">
        {PLATFORMS.map(p => (
          <button key={p.id} onClick={() => setPlatform(p.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: platform === p.id ? '#7B6EF6' : 'rgba(123,110,246,0.07)',
              color: platform === p.id ? '#FFFFFF' : '#5A5D7A',
              border: `1px solid ${platform === p.id ? '#7B6EF6' : 'rgba(123,110,246,0.15)'}`,
            }}
          >
            <PlatformIcon id={p.id} active={platform === p.id} />
            {p.label}
          </button>
        ))}
      </div>

      {/* Steps */}
      <div className="rounded-xl border p-5 space-y-3" style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)' }}>
        <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#9B9EBB' }}>Addım-addım təlimat</h4>
        {STEPS[platform].map((s, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white mt-0.5" style={{ background: '#7B6EF6' }}>{i + 1}</div>
            <div>
              <div className="text-sm font-semibold text-text-primary">{s.step}</div>
              <div className="text-xs text-text-muted mt-0.5">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Code block */}
      <div className="rounded-xl border overflow-hidden" style={{ background: '#0D0D1A', borderColor: 'rgba(123,110,246,0.2)' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-xs font-mono ml-2" style={{ color: 'rgba(255,255,255,0.4)' }}>head-teqlər.html</span>
          </div>
          <button onClick={copyCode}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: copied ? 'rgba(0,201,167,0.2)' : 'rgba(123,110,246,0.25)', color: copied ? '#00C9A7' : '#C4BDFA' }}
          >
            {copied ? <><CheckCircle2 size={12} strokeWidth={2.5} /> Kopyalandı!</> : <>📋 Kopyala</>}
          </button>
        </div>
        <pre className="text-xs leading-relaxed overflow-x-auto p-5 font-mono" style={{ color: '#C4BDFA', maxHeight: 340 }}>
          {headCode}
        </pre>
      </div>

      {/* Tip */}
      <div className="flex gap-3 p-4 rounded-xl" style={{ background: 'rgba(245,166,35,0.07)', border: '1px solid rgba(245,166,35,0.2)' }}>
        <Lightbulb size={16} strokeWidth={1.8} className="flex-shrink-0 mt-0.5" style={{ color: '#F5A623' }} />
        <p className="text-xs text-text-secondary leading-relaxed">
          Kodu əlavə etdikdən sonra <strong>Google Search Console</strong>-da URL-i inspect edin və indeksləməni tələb edin. 24-48 saat ərzində nəticə görünəcək.
        </p>
      </div>
    </div>
  )
}

export default function ResultCard({ generation, isPro }: { generation: Generation; isPro: boolean }) {
  const router = useRouter()
  const [activeTab, setActiveTab]       = useState<ResultTab>('az')
  const [toasts, setToasts]             = useState<ToastItem[]>([])
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting]         = useState(false)
  const seo = generation.output_data

  function addToast(message: string, type: ToastItem['type'] = 'success') {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
  }

  function downloadHTML() {
    const head = `<title>${seo.title_tag_az}</title>
<meta name="description" content="${seo.meta_description_az}">
<meta property="og:title" content="${seo.og_title}">
<meta property="og:description" content="${seo.og_description}">
<meta property="og:type" content="${seo.og_type}">
<meta name="twitter:card" content="${seo.twitter_card}">
<meta name="twitter:title" content="${seo.twitter_title}">
<meta name="twitter:description" content="${seo.twitter_description}">
<link rel="canonical" href="${seo.canonical_url}">
<meta name="robots" content="${seo.robots}">
${seo.hreflang.map(h => `<link rel="alternate" hreflang="${h.lang}" href="${h.url}">`).join('\n')}
<script type="application/ld+json">
${JSON.stringify(seo.schema_markup, null, 2)}
</script>`
    const blob = new Blob([head], { type: 'text/html' })
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'zirva-seo.html' })
    a.click(); URL.revokeObjectURL(a.href)
    addToast('HTML faylı yükləndi')
  }

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(seo, null, 2)], { type: 'application/json' })
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'zirva-seo.json' })
    a.click(); URL.revokeObjectURL(a.href)
    addToast('JSON faylı yükləndi')
  }

  async function handleDelete() {
    setDeleting(true)
    const res = await fetch(`/api/generate?id=${generation.id}`, { method: 'DELETE' })
    if (res.ok) router.push('/history')
    else { addToast('Silmə zamanı xəta baş verdi', 'error'); setDeleting(false); setConfirmDelete(false) }
  }

  const hasContent = (seo.post_hashtags?.length ?? 0) > 0 || (seo.post_captions?.length ?? 0) > 0

  const TABS: { id: ResultTab; label: string }[] = [
    { id: 'az', label: 'Azərbaycanca' },
    ...(isPro ? [{ id: 'ru' as ResultTab, label: 'Rusca' }] : []),
    { id: 'schema', label: 'Schema' },
    { id: 'tips', label: 'Tövsiyələr' },
    ...(hasContent ? [{ id: 'content' as ResultTab, label: '# Kontent' }] : []),
    { id: 'install', label: '⚡ Tətbiq et' },
  ]

  const scoreCol = scoreColor(seo.seo_score)

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={id => setToasts(p => p.filter(t => t.id !== id))} />
      <ConfirmModal
        open={confirmDelete}
        title="Paketi sil"
        message="Bu SEO paketi silinəcək. Bu əməliyyat geri qaytarıla bilməz."
        confirmLabel="Sil"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Hero banner ── */}
        <motion.div
          className="rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5FF 100%)', border: '1px solid rgba(123,110,246,0.15)', boxShadow: '0 4px 24px rgba(123,110,246,0.08)' }}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={SPRING}
        >
          {/* Decorative blob */}
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: `${scoreCol}08`, filter: 'blur(40px)', transform: 'translate(30%, -30%)' }} />

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 relative z-10">
            {/* Score circle */}
            <div className="flex-shrink-0">
              <ScoreCircle score={seo.seo_score} />
            </div>

            <div className="flex-1 min-w-0">
              {/* Business + badge */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: `${flowBadgeColor(generation.flow_type)}15`, color: flowBadgeColor(generation.flow_type), border: `1px solid ${flowBadgeColor(generation.flow_type)}30` }}
                >
                  {flowLabel(generation.flow_type)}
                </span>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${scoreCol}12`, color: scoreCol, border: `1px solid ${scoreCol}30` }}
                >
                  {seo.seo_score >= 75 ? 'Əla' : seo.seo_score >= 50 ? 'Orta' : 'Zəif'}
                </span>
              </div>

              <h1 className="font-display font-bold text-xl sm:text-3xl text-text-primary truncate mb-1">
                {generation.business_name || 'SEO Paketi'}
              </h1>
              <p className="text-text-muted text-sm mb-4">{formatDate(generation.created_at)}</p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-4">
                {[
                  { label: 'Başlıq', val: seo.title_tag_az?.length + ' simvol' },
                  { label: 'Meta', val: seo.meta_description_az?.length + ' simvol' },
                  { label: 'Açar sözlər', val: (seo.keywords_az?.length ?? 0) + ' söz' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-text-muted text-xs">{s.label}</div>
                    <div className="text-text-primary text-sm font-semibold">{s.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons top-right */}
            <div className="flex sm:flex-col gap-2 flex-shrink-0">
              {isPro ? (
                <>
                  <button
                    onClick={downloadHTML}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all hover:bg-surface-hover"
                    style={{ borderColor: 'rgba(123,110,246,0.2)', color: '#5A5D7A', background: '#FFFFFF' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    HTML
                  </button>
                  <button
                    onClick={downloadJSON}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all hover:bg-surface-hover"
                    style={{ borderColor: 'rgba(123,110,246,0.2)', color: '#5A5D7A', background: '#FFFFFF' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    JSON
                  </button>
                </>
              ) : (
                <Link
                  href="/settings/billing"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: 'rgba(123,110,246,0.1)', border: '1px solid rgba(123,110,246,0.25)', color: '#7B6EF6' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Pro — İxrac et
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div
          className="mb-5 p-1 rounded-xl overflow-x-auto scrollbar-hide"
          style={{ background: 'rgba(123,110,246,0.06)' }}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...SPRING, delay: 0.1 }}
        >
          <div className="flex gap-1 min-w-max sm:min-w-0">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-shrink-0 sm:flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 relative whitespace-nowrap"
                style={{
                  background: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                  color: activeTab === tab.id ? '#7B6EF6' : '#9B9EBB',
                  boxShadow: activeTab === tab.id ? '0 1px 4px rgba(123,110,246,0.12)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -6, opacity: 0 }}
            transition={SPRING}
          >
            {activeTab === 'az' && (
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <TagCard label="Başlıq teqi (AZ)" value={seo.title_tag_az} charMin={50} charMax={60} hint="Google axtarışda 60 simvola qədər göstərir" />
                </div>
                <div className="sm:col-span-2">
                  <TagCard label="Meta açıqlama (AZ)" value={seo.meta_description_az} charMin={150} charMax={160} hint="Google 160 simvola qədər göstərir" />
                </div>
                <TagCard label="Canonical URL" value={seo.canonical_url} mono />
                <TagCard label="Robots" value={seo.robots} mono />

                {isPro ? (
                  <>
                    <TagCard label="OG başlıq" value={seo.og_title} charMin={40} charMax={90} hint="Facebook / WhatsApp paylaşımında görünür" />
                    <TagCard label="OG açıqlama" value={seo.og_description} hint="Sosial paylaşım kartının açıqlaması" />
                    <TagCard label="Twitter başlıq" value={seo.twitter_title} charMin={1} charMax={70} hint="Twitter / X kartında görünür" />
                    <TagCard label="Twitter açıqlama" value={seo.twitter_description} hint="Twitter kartının açıqlaması" />
                    {/* Hreflang */}
                    <div
                      className="sm:col-span-2 rounded-xl border p-4"
                      style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', boxShadow: '0 1px 4px rgba(13,13,26,0.04)' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9B9EBB' }}>Hreflang teqləri</span>
                        <CopyButton text={seo.hreflang.map(h => `<link rel="alternate" hreflang="${h.lang}" href="${h.url}">`).join('\n')} small />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {seo.hreflang.map(h => (
                          <span
                            key={h.lang}
                            className="text-xs font-mono px-3 py-1.5 rounded-lg"
                            style={{ background: 'rgba(123,110,246,0.07)', border: '1px solid rgba(123,110,246,0.15)', color: '#7B6EF6' }}
                          >
                            {h.lang}: {h.url}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link href="/settings/billing"
                    className="sm:col-span-2 flex items-center gap-4 p-4 rounded-xl transition-all hover:opacity-90"
                    style={{ background: 'rgba(123,110,246,0.04)', border: '1.5px dashed rgba(123,110,246,0.2)' }}
                  >
                    <span style={{ fontSize: 26 }}>🔒</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#7B6EF6' }}>OG, Twitter və Hreflang teqləri — Pro</p>
                      <p className="text-xs mt-0.5" style={{ color: '#9B9EBB' }}>Sosial media paylaşımları və çoxdilli hədəfləmə üçün Pro planına keçin</p>
                    </div>
                  </Link>
                )}
              </div>
            )}

            {activeTab === 'ru' && (
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <TagCard label="Başlıq teqi (RU)" value={seo.title_tag_ru} charMin={50} charMax={60} hint="Google axtarışda 60 simvola qədər göstərir" />
                </div>
                <div className="sm:col-span-2">
                  <TagCard label="Meta açıqlama (RU)" value={seo.meta_description_ru} charMin={150} charMax={160} hint="Google 160 simvola qədər göstərir" />
                </div>
              </div>
            )}

            {activeTab === 'schema' && (
              isPro ? (
                <div
                  className="rounded-xl border overflow-hidden"
                  style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', boxShadow: '0 1px 4px rgba(13,13,26,0.04)' }}
                >
                  <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(123,110,246,0.08)', background: '#F5F5FF' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      <span className="text-xs font-mono text-text-muted ml-2">schema.json</span>
                    </div>
                    <CopyButton text={JSON.stringify(seo.schema_markup, null, 2)} small />
                  </div>
                  <pre className="font-mono text-xs text-text-secondary overflow-auto max-h-96 p-5 leading-relaxed">
                    {JSON.stringify(seo.schema_markup, null, 2)}
                  </pre>
                </div>
              ) : (
                <Link href="/settings/billing"
                  className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl text-center transition-all hover:opacity-90"
                  style={{ background: 'rgba(123,110,246,0.04)', border: '1.5px dashed rgba(123,110,246,0.2)' }}
                >
                  <span style={{ fontSize: 40 }}>🔒</span>
                  <div>
                    <p className="text-base font-bold" style={{ color: '#7B6EF6' }}>Schema Markup — Pro xüsusiyyəti</p>
                    <p className="text-sm mt-1" style={{ color: '#9B9EBB' }}>Google üçün strukturlu məlumat teqləri Pro planında mövcuddur</p>
                  </div>
                  <span className="text-xs font-semibold px-4 py-2 rounded-xl mt-1" style={{ background: '#7B6EF6', color: '#fff' }}>Pro-ya keçin</span>
                </Link>
              )
            )}

            {activeTab === 'tips' && (
              <div className="space-y-4">
                {/* Keywords */}
                <div className="rounded-xl border p-5" style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', boxShadow: '0 1px 4px rgba(13,13,26,0.04)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9B9EBB' }}>Açar sözlər (AZ)</h3>
                    {!isPro && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(123,110,246,0.1)', color: '#7B6EF6' }}>3 / 8</span>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {seo.keywords_az?.map(kw => (
                      <span key={kw} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: 'rgba(123,110,246,0.08)', border: '1px solid rgba(123,110,246,0.18)', color: '#7B6EF6' }}>
                        {kw}
                      </span>
                    ))}
                    {!isPro && (
                      <Link href="/settings/billing"
                        className="text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:opacity-80"
                        style={{ background: 'rgba(123,110,246,0.04)', border: '1px dashed rgba(123,110,246,0.25)', color: '#9B9EBB' }}
                      >
                        🔒 +5 Pro ilə
                      </Link>
                    )}
                  </div>
                </div>

                {isPro && (
                <div className="rounded-xl border p-5" style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', boxShadow: '0 1px 4px rgba(13,13,26,0.04)' }}>
                  <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#9B9EBB' }}>Açar sözlər (RU)</h3>
                  <div className="flex flex-wrap gap-2">
                    {seo.keywords_ru?.map(kw => (
                      <span key={kw} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: 'rgba(0,201,167,0.07)', border: '1px solid rgba(0,201,167,0.2)', color: '#00C9A7' }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                )}

                <div className="rounded-xl border p-5" style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', boxShadow: '0 1px 4px rgba(13,13,26,0.04)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9B9EBB' }}>Rəqiblər</h3>
                    {!isPro && (
                      <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(123,110,246,0.1)', color: '#7B6EF6' }}>
                        🔒 Pro
                      </span>
                    )}
                  </div>
                  {!isPro ? (
                    <Link href="/settings/billing" className="flex flex-col items-center justify-center gap-2 py-6 rounded-xl text-center transition-all hover:opacity-90"
                      style={{ background: 'rgba(123,110,246,0.04)', border: '1.5px dashed rgba(123,110,246,0.2)' }}>
                      <span style={{ fontSize: 28 }}>🔒</span>
                      <span className="text-sm font-semibold" style={{ color: '#7B6EF6' }}>Rəqib analizi — Pro xüsusiyyəti</span>
                      <span className="text-xs" style={{ color: '#9B9EBB' }}>Pro planına keçin və rəqiblərinizi analiz edin</span>
                    </Link>
                  ) : seo.competitors && seo.competitors.length > 0 ? (
                    <div className="space-y-3">
                      {seo.competitors.map((c, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(123,110,246,0.04)', border: '1px solid rgba(123,110,246,0.1)' }}>
                          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: '#f0f0f8', border: '1px solid rgba(123,110,246,0.12)' }}>
                            <img
                              src={`https://www.google.com/s2/favicons?domain=${c.domain}&sz=32`}
                              alt={c.name}
                              width={20}
                              height={20}
                              onError={e => {
                                const t = e.currentTarget
                                t.style.display = 'none'
                                const fb = t.nextElementSibling as HTMLElement | null
                                if (fb) fb.style.display = 'flex'
                              }}
                            />
                            <span className="hidden w-full h-full items-center justify-center text-xs font-bold text-white rounded-lg" style={{ background: `hsl(${i * 55 + 240}, 65%, 60%)` }}>
                              {c.name[0]}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <span className="text-sm font-semibold text-text-primary">{c.name}</span>
                              <a href={`https://${c.domain}`} target="_blank" rel="noopener noreferrer"
                                className="text-xs font-mono px-2 py-0.5 rounded-full transition-all hover:opacity-80"
                                style={{ background: 'rgba(123,110,246,0.1)', color: '#7B6EF6' }}>
                                {c.domain}
                              </a>
                            </div>
                            <p className="text-xs text-text-muted leading-relaxed">{c.why}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ol className="space-y-3">
                      {seo.competitor_tips?.map((tip, i) => (
                        <li key={i} className="flex gap-3 text-sm text-text-secondary">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white" style={{ background: '#7B6EF6' }}>{i + 1}</span>
                          {tip}
                        </li>
                      ))}
                    </ol>
                  )}
                  {isPro && seo.competitor_tips && seo.competitor_tips.length > 0 && seo.competitors && seo.competitors.length > 0 && (
                    <div className="mt-4 pt-4 border-t space-y-2" style={{ borderColor: 'rgba(123,110,246,0.08)' }}>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9B9EBB' }}>Rəqibləri üstələmək üçün</p>
                      {seo.competitor_tips.map((tip, i) => (
                        <div key={i} className="flex gap-2 text-xs text-text-secondary">
                          <ChevronRight size={12} strokeWidth={2.5} className="flex-shrink-0 mt-0.5" style={{ color: '#7B6EF6' }} />
                          {tip}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border p-5" style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', boxShadow: '0 1px 4px rgba(13,13,26,0.04)' }}>
                  <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#9B9EBB' }}>İnkişaf tövsiyələri</h3>
                  <ol className="space-y-3">
                    {seo.improvement_tips?.map((tip, i) => (
                      <li key={i} className="flex gap-3 text-sm text-text-secondary">
                        <Lightbulb size={15} strokeWidth={1.8} className="flex-shrink-0 mt-0.5" style={{ color: '#F5A623' }} />
                        {tip}
                      </li>
                    ))}
                  </ol>
                  {!isPro && (
                    <Link href="/settings/billing"
                      className="flex items-center gap-3 mt-4 p-3 rounded-xl transition-all hover:opacity-90"
                      style={{ background: 'rgba(123,110,246,0.05)', border: '1px dashed rgba(123,110,246,0.2)' }}
                    >
                      <span style={{ fontSize: 18 }}>🔒</span>
                      <p className="text-xs" style={{ color: '#7B6EF6' }}>
                        <strong>+2 əlavə tövsiyə</strong> Pro planında açılır
                      </p>
                    </Link>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-4">
                {/* Hashtags */}
                {(seo.post_hashtags?.length ?? 0) > 0 && (
                  <div className="rounded-xl border p-5" style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', boxShadow: '0 1px 4px rgba(13,13,26,0.04)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9B9EBB' }}>
                        Post Hashtagları ({seo.post_hashtags!.length})
                      </h3>
                      <CopyButton text={seo.post_hashtags!.map(h => `#${h.replace(/^#/, '')}`).join(' ')} small />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {seo.post_hashtags!.map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer transition-all hover:scale-105"
                          style={{ background: 'rgba(123,110,246,0.08)', border: '1px solid rgba(123,110,246,0.18)', color: '#7B6EF6' }}
                          onClick={() => { navigator.clipboard.writeText(`#${tag.replace(/^#/, '')}`); addToast('Kopyalandı!') }}
                        >
                          #{tag.replace(/^#/, '')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Captions */}
                {(seo.post_captions?.length ?? 0) > 0 && (
                  <div className="space-y-3">
                    {seo.post_captions!.map((cap, i) => (
                      <div key={i} className="rounded-xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', boxShadow: '0 1px 4px rgba(13,13,26,0.04)' }}>
                        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(123,110,246,0.08)', background: 'rgba(123,110,246,0.03)' }}>
                          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#7B6EF6' }}>{cap.type}</span>
                          <CopyButton text={cap.text} small />
                        </div>
                        <div className="p-5">
                          <p className="text-text-primary text-sm leading-relaxed whitespace-pre-line">{cap.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'install' && (
              <InstallTab seo={seo} isPro={isPro} addToast={addToast} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom action bar ── */}
        <motion.div
          className="sticky bottom-4 mt-8 flex flex-wrap items-center gap-2 p-3 rounded-2xl border backdrop-blur-xl"
          style={{ background: 'rgba(255,255,255,0.95)', borderColor: 'rgba(123,110,246,0.18)', boxShadow: '0 8px 32px rgba(123,110,246,0.12)' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...SPRING, delay: 0.2 }}
        >
          <Link
            href="/history"
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all hover:bg-surface-hover"
            style={{ borderColor: 'rgba(123,110,246,0.2)', color: '#5A5D7A' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Tarixçə
          </Link>
          <div className="flex-1" />
          <button
            onClick={() => router.push(`/generate?flow=${generation.flow_type}`)}
            className="flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-medium text-white transition-all"
            style={{ background: '#7B6EF6' }}
          >
            <RotateCcw size={14} strokeWidth={2} />
            Yenidən yarat
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="py-2.5 px-4 rounded-xl text-sm font-medium transition-all hover:bg-red-50"
            style={{ color: '#F25C54' }}
          >
            Sil
          </button>
        </motion.div>
      </div>
    </>
  )
}
