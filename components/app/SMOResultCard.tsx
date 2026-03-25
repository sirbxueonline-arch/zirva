'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ToastContainer } from '@/components/shared/Toast'
import type { Generation, SMOPackage } from '@/types'
import { formatDate, scoreColor } from '@/lib/utils'
import {
  Camera,
  Music,
  User,
  Hash,
  PenLine,
  BarChart2,
  Calendar,
  Sparkles,
  ChevronLeft,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

interface ToastItem { id: string; message: string; type?: 'success' | 'error' | 'info' }
type Tab = 'bio' | 'hashtags' | 'captions' | 'strategy'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }
  return (
    <motion.button onClick={copy} whileTap={{ scale: 0.94 }}
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
      style={{ background: copied ? 'rgba(0,201,167,0.1)' : 'rgba(123,110,246,0.08)', border: `1px solid ${copied ? 'rgba(0,201,167,0.3)' : 'rgba(123,110,246,0.2)'}`, color: copied ? '#00C9A7' : '#7B6EF6' }}
    >
      {copied
        ? <><Check size={11} strokeWidth={2.5} /> Kopyalandı</>
        : <><Copy size={11} strokeWidth={1.8} /> Kopyala</>
      }
    </motion.button>
  )
}

function ScoreRing({ score }: { score: number }) {
  const col = scoreColor(score)
  const r = 36; const circ = 2 * Math.PI * r
  const dash = circ - (score / 100) * circ
  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(123,110,246,0.1)" strokeWidth="8" />
        <motion.circle cx="48" cy="48" r={r} fill="none" stroke={col} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: dash }} transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-2xl" style={{ color: col }}>{score}</span>
        <span className="text-text-muted text-xs">/100</span>
      </div>
    </div>
  )
}

export default function SMOResultCard({ generation }: { generation: Generation }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('bio')
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const smo = generation.output_data as unknown as SMOPackage

  function addToast(msg: string, type: ToastItem['type'] = 'success') {
    const id = Math.random().toString(36).slice(2)
    setToasts(p => [...p, { id, message: msg, type }])
  }

  async function handleDelete() {
    if (!confirm('Bu paketi silmək istədiyinizə əminsiniz?')) return
    const res = await fetch(`/api/generate?id=${generation.id}`, { method: 'DELETE' })
    if (res.ok) router.push('/history')
    else addToast('Silmə xətası', 'error')
  }

  const TABS: { id: Tab; label: string; Icon: typeof User }[] = [
    { id: 'bio',      label: 'Bio',        Icon: User },
    { id: 'hashtags', label: 'Hashtaglar', Icon: Hash },
    { id: 'captions', label: 'Kaptionlar', Icon: PenLine },
    { id: 'strategy', label: 'Strategiya', Icon: BarChart2 },
  ]

  const scoreBreakdown = smo.score_breakdown ? [
    { label: 'Bio keyfiyyəti',        val: smo.score_breakdown.bio_quality,          max: 20 },
    { label: 'Hashtag strategiyası',  val: smo.score_breakdown.hashtag_strategy,     max: 20 },
    { label: 'Kontent planı',         val: smo.score_breakdown.content_plan,         max: 20 },
    { label: 'Engagement potensialı', val: smo.score_breakdown.engagement_potential, max: 20 },
    { label: 'Lokal uyğunluq',        val: smo.score_breakdown.local_relevance,      max: 20 },
  ] : []

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={id => setToasts(p => p.filter(t => t.id !== id))} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Hero */}
        <motion.div
          className="rounded-2xl p-6 mb-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F8 50%, #F5F5FF 100%)', border: '1px solid rgba(225,48,108,0.12)', boxShadow: '0 4px 24px rgba(225,48,108,0.07)' }}
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={SPRING}
        >
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'rgba(225,48,108,0.05)', filter: 'blur(40px)', transform: 'translate(30%,-30%)' }} />

          <div className="flex flex-col sm:flex-row sm:items-start gap-5 relative z-10">
            <ScoreRing score={smo.score ?? 0} />

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(225,48,108,0.1)', color: '#E1306C', border: '1px solid rgba(225,48,108,0.2)' }}>
                  <Camera size={11} strokeWidth={2} /> SMO
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${scoreColor(smo.score ?? 0)}12`, color: scoreColor(smo.score ?? 0), border: `1px solid ${scoreColor(smo.score ?? 0)}30` }}>
                  {(smo.score ?? 0) >= 75 ? 'Əla' : (smo.score ?? 0) >= 50 ? 'Orta' : 'Zəif'}
                </span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-primary mb-1">{generation.business_name}</h1>
              <p className="text-text-muted text-sm mb-4">{formatDate(generation.created_at)}</p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-5">
                {[
                  { label: 'Hashtag dəsti', val: smo.hashtag_sets?.length ?? 0 },
                  { label: 'Caption şablonu', val: smo.caption_templates?.length ?? 0 },
                  { label: 'Kontent sütunu', val: smo.content_pillars?.length ?? 0 },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-text-muted text-xs">{s.label}</div>
                    <div className="text-text-primary text-sm font-bold">{s.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score breakdown mini */}
            {scoreBreakdown.length > 0 && (
              <div className="hidden sm:block space-y-2 w-52 flex-shrink-0">
                {scoreBreakdown.map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...SPRING, delay: i * 0.07 }}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-muted truncate pr-2">{item.label}</span>
                      <span className="font-mono font-semibold flex-shrink-0" style={{ color: scoreColor((item.val / item.max) * 100) }}>{item.val}/{item.max}</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(123,110,246,0.08)' }}>
                      <motion.div className="h-full rounded-full" style={{ background: scoreColor((item.val / item.max) * 100) }}
                        initial={{ width: '0%' }} animate={{ width: `${(item.val / item.max) * 100}%` }}
                        transition={{ ...SPRING, delay: i * 0.07 + 0.3 }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: 'rgba(123,110,246,0.06)' }}
          initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.1 }}
        >
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                color: activeTab === tab.id ? '#7B6EF6' : '#9B9EBB',
                boxShadow: activeTab === tab.id ? '0 1px 4px rgba(123,110,246,0.12)' : 'none',
              }}
            >
              <tab.Icon size={14} strokeWidth={activeTab === tab.id ? 2.2 : 1.8} className="hidden sm:block" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -6, opacity: 0 }} transition={SPRING}>

            {/* BIO TAB */}
            {activeTab === 'bio' && (
              <div className="space-y-4">
                {/* Camera bio */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: 'rgba(225,48,108,0.15)', boxShadow: '0 2px 12px rgba(225,48,108,0.06)' }}>
                  <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(225,48,108,0.1)', background: 'rgba(225,48,108,0.03)' }}>
                    <div className="flex items-center gap-2">
                      <Camera size={16} strokeWidth={1.8} style={{ color: '#E1306C' }} />
                      <span className="text-sm font-semibold text-text-primary">Camera Bio</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(225,48,108,0.1)', color: '#E1306C' }}>maks 150 simvol</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono" style={{ color: (smo.instagram_bio?.length ?? 0) > 150 ? '#F25C54' : '#00C9A7' }}>
                        {smo.instagram_bio?.length ?? 0}/150
                      </span>
                      <CopyButton text={smo.instagram_bio ?? ''} />
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-text-primary text-sm leading-relaxed whitespace-pre-line">{smo.instagram_bio}</p>
                  </div>
                </div>

                {/* TikTok bio */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: 'rgba(1,1,1,0.1)', boxShadow: '0 2px 12px rgba(1,1,1,0.04)' }}>
                  <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(1,1,1,0.06)', background: 'rgba(1,1,1,0.02)' }}>
                    <div className="flex items-center gap-2">
                      <Music size={16} strokeWidth={1.8} style={{ color: '#333' }} />
                      <span className="text-sm font-semibold text-text-primary">TikTok Bio</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(1,1,1,0.07)', color: '#333' }}>maks 80 simvol</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono" style={{ color: (smo.tiktok_bio?.length ?? 0) > 80 ? '#F25C54' : '#00C9A7' }}>
                        {smo.tiktok_bio?.length ?? 0}/80
                      </span>
                      <CopyButton text={smo.tiktok_bio ?? ''} />
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-text-primary text-sm leading-relaxed whitespace-pre-line">{smo.tiktok_bio}</p>
                  </div>
                </div>

                {/* Profile tips */}
                {smo.profile_tips?.length > 0 && (
                  <div className="rounded-2xl border p-5" style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', boxShadow: '0 2px 12px rgba(13,13,26,0.04)' }}>
                    <h3 className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: '#9B9EBB' }}>Profil Optimallaşdırma Tövsiyələri</h3>
                    <ul className="space-y-3">
                      {smo.profile_tips.map((tip, i) => (
                        <li key={i} className="flex gap-3 text-sm text-text-secondary">
                          <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #E1306C, #7B6EF6)' }}>{i + 1}</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* HASHTAGS TAB */}
            {activeTab === 'hashtags' && (
              <div className="space-y-4">
                {/* Specific post hashtags */}
                {(smo.post_specific_hashtags?.length ?? 0) > 0 && (
                  <motion.div className="rounded-2xl border p-5" style={{ background: 'rgba(225,48,108,0.03)', borderColor: 'rgba(225,48,108,0.2)', boxShadow: '0 2px 12px rgba(225,48,108,0.06)' }}
                    initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={SPRING}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: '#E1306C' }}>
                          <Sparkles size={14} strokeWidth={2} />
                        </div>
                        <div>
                          <span className="font-semibold text-text-primary text-sm">Xüsusi Post Hashtagları</span>
                          <span className="text-xs text-text-muted ml-2">{smo.post_specific_hashtags!.length} hashtag</span>
                        </div>
                      </div>
                      <CopyButton text={smo.post_specific_hashtags!.map(h => `#${h.replace(/^#/, '')}`).join(' ')} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {smo.post_specific_hashtags!.map(tag => (
                        <span key={tag}
                          className="text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer transition-all hover:scale-105"
                          style={{ background: 'rgba(225,48,108,0.08)', border: '1px solid rgba(225,48,108,0.2)', color: '#E1306C' }}
                          onClick={() => { navigator.clipboard.writeText(`#${tag.replace(/^#/, '')}`); addToast('Kopyalandı!') }}
                        >
                          #{tag.replace(/^#/, '')}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {smo.hashtag_sets?.map((set, i) => (
                  <motion.div key={i} className="rounded-2xl border p-5" style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', boxShadow: '0 2px 12px rgba(13,13,26,0.04)' }}
                    initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: i * 0.06 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ background: `hsl(${i * 50 + 240}, 70%, 60%)` }}>{i + 1}</div>
                        <span className="font-semibold text-text-primary text-sm">{set.name}</span>
                        <span className="text-xs text-text-muted">{set.hashtags.length} hashtag</span>
                      </div>
                      <CopyButton text={set.hashtags.map(h => `#${h.replace(/^#/, '')}`).join(' ')} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {set.hashtags.map(tag => (
                        <span key={tag}
                          className="text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer transition-all hover:scale-105"
                          style={{ background: 'rgba(123,110,246,0.07)', border: '1px solid rgba(123,110,246,0.15)', color: '#7B6EF6' }}
                          onClick={() => { navigator.clipboard.writeText(`#${tag.replace(/^#/, '')}`); addToast('Kopyalandı!') }}
                        >
                          #{tag.replace(/^#/, '')}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* CAPTIONS TAB */}
            {activeTab === 'captions' && (
              <div className="space-y-4">
                {/* Specific post captions */}
                {(smo.post_specific_captions?.length ?? 0) > 0 && (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: '#E1306C' }}>
                        <Sparkles size={10} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-semibold text-text-primary">Xüsusi Post Kaptionları</span>
                    </div>
                    {smo.post_specific_captions!.map((cap, i) => (
                      <motion.div key={i} className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: 'rgba(225,48,108,0.15)', boxShadow: '0 2px 12px rgba(225,48,108,0.06)' }}
                        initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: i * 0.06 }}
                      >
                        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(225,48,108,0.1)', background: 'rgba(225,48,108,0.03)' }}>
                          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#E1306C' }}>{cap.type}</span>
                          <CopyButton text={cap.text} />
                        </div>
                        <div className="p-5"><p className="text-text-primary text-sm leading-relaxed whitespace-pre-line">{cap.text}</p></div>
                      </motion.div>
                    ))}
                    <div className="h-px my-2" style={{ background: 'rgba(123,110,246,0.1)' }} />
                  </>
                )}

                {smo.caption_templates?.map((tpl, i) => (
                  <motion.div key={i} className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', boxShadow: '0 2px 12px rgba(13,13,26,0.04)' }}
                    initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: i * 0.06 }}
                  >
                    <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(123,110,246,0.08)', background: 'rgba(123,110,246,0.03)' }}>
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#7B6EF6' }}>{tpl.type}</span>
                      <CopyButton text={tpl.caption} />
                    </div>
                    <div className="p-5">
                      <p className="text-text-primary text-sm leading-relaxed whitespace-pre-line">{tpl.caption}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* STRATEGY TAB */}
            {activeTab === 'strategy' && (
              <div className="space-y-4">
                {/* Posting schedule */}
                {smo.posting_schedule && (
                  <div className="rounded-2xl border p-5" style={{ background: 'linear-gradient(135deg, rgba(123,110,246,0.06), rgba(0,201,167,0.04))', borderColor: 'rgba(123,110,246,0.15)', boxShadow: '0 2px 12px rgba(13,13,26,0.04)' }}>
                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#9B9EBB' }}>
                      <Calendar size={13} strokeWidth={1.8} /> Yayım Cədvəli
                    </h3>
                    <p className="text-text-primary text-sm leading-relaxed">{smo.posting_schedule}</p>
                  </div>
                )}

                {/* Content pillars */}
                {smo.content_pillars?.map((pillar, i) => (
                  <motion.div key={i} className="rounded-2xl border p-5" style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', boxShadow: '0 2px 12px rgba(13,13,26,0.04)' }}
                    initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: i * 0.07 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-sm" style={{ background: `hsl(${i * 60 + 240}, 65%, 60%)` }}>{i + 1}</div>
                      <div>
                        <div className="font-semibold text-text-primary text-sm">{pillar.name}</div>
                        <div className="text-text-muted text-xs">{pillar.description}</div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1.5 pl-11">
                      {pillar.post_ideas?.map((idea, j) => (
                        <div key={j} className="flex items-start gap-2 text-xs text-text-secondary">
                          <ArrowRight size={12} strokeWidth={2} className="text-primary flex-shrink-0 mt-0.5" />
                          {idea}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Bottom bar */}
        <motion.div
          className="sticky bottom-4 mt-8 flex items-center gap-2 p-3 rounded-2xl border backdrop-blur-xl"
          style={{ background: 'rgba(255,255,255,0.95)', borderColor: 'rgba(123,110,246,0.15)', boxShadow: '0 8px 32px rgba(123,110,246,0.1)' }}
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.2 }}
        >
          <Link href="/smo" className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all hover:bg-surface-hover" style={{ borderColor: 'rgba(123,110,246,0.2)', color: '#5A5D7A' }}>
            <ChevronLeft size={15} strokeWidth={2} />
            Geri
          </Link>
          <div className="flex-1" />
          <button onClick={() => router.push('/smo')}
            className="flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #E1306C, #7B6EF6)' }}
          >
            Yenidən yarat
          </button>
          <button onClick={handleDelete} className="py-2.5 px-4 rounded-xl text-sm font-medium transition-all hover:bg-red-50" style={{ color: '#F25C54' }}>
            Sil
          </button>
        </motion.div>
      </div>
    </>
  )
}
