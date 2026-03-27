'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ToastContainer } from '@/components/shared/Toast'
import type { Generation, SMOResult } from '@/types'
import { formatDate, scoreColor } from '@/lib/utils'
import {
  Users, Hash, Calendar, FileText, Sparkles,
  ChevronLeft, Copy, Check, Clock, Target,
} from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

interface ToastItem { id: string; message: string; type?: 'success' | 'error' | 'info' }
type Tab = 'ad_audience' | 'hashtags' | 'content_calendar' | 'content_templates'

function CopyButton({ text, small }: { text: string; small?: boolean }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }
  return (
    <motion.button onClick={copy} whileTap={{ scale: 0.94 }}
      className={`flex items-center gap-1.5 font-medium transition-all rounded-lg ${small ? 'text-xs px-2.5 py-1' : 'text-xs px-3 py-1.5'}`}
      style={{ background: copied ? 'rgba(0,201,167,0.1)' : 'rgba(0,201,167,0.08)', border: `1px solid ${copied ? 'rgba(0,201,167,0.3)' : 'rgba(0,201,167,0.2)'}`, color: '#00C9A7' }}
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
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(0,201,167,0.1)" strokeWidth="8" />
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

const TABS: { id: Tab; label: string; Icon: typeof Users }[] = [
  { id: 'ad_audience',       label: 'Auditoriya',  Icon: Users    },
  { id: 'hashtags',          label: 'Hashteqlər',  Icon: Hash     },
  { id: 'content_calendar',  label: 'Təqvim',      Icon: Calendar },
  { id: 'content_templates', label: 'Şablonlar',   Icon: FileText },
]

export default function SMOResultCard({ generation }: { generation: Generation }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('ad_audience')
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const smo = generation.output_data as SMOResult

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

  const scoreBreakdown = smo.score_breakdown ? [
    { label: 'Auditoriya dəqiqliyi', val: smo.score_breakdown.audience_clarity,     max: 25 },
    { label: 'Hashteq strategiyası', val: smo.score_breakdown.hashtag_strategy,     max: 25 },
    { label: 'Kontent ardıcıllığı',  val: smo.score_breakdown.content_consistency,  max: 25 },
    { label: 'Cəlbetmə potensialı',  val: smo.score_breakdown.engagement_potential, max: 25 },
  ] : []

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={id => setToasts(p => p.filter(t => t.id !== id))} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Hero */}
        <motion.div
          className="rounded-2xl p-6 mb-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F0FFF8 50%, #F5F5FF 100%)', border: '1px solid rgba(0,201,167,0.15)', boxShadow: '0 4px 24px rgba(0,201,167,0.08)' }}
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={SPRING}
        >
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'rgba(0,201,167,0.06)', filter: 'blur(40px)', transform: 'translate(30%,-30%)' }} />

          <div className="flex flex-col sm:flex-row sm:items-start gap-5 relative z-10">
            <ScoreRing score={smo.score ?? 0} />

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(0,201,167,0.1)', color: '#00C9A7', border: '1px solid rgba(0,201,167,0.2)' }}>
                  <Sparkles size={11} strokeWidth={2} /> SMO
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${scoreColor(smo.score ?? 0)}12`, color: scoreColor(smo.score ?? 0), border: `1px solid ${scoreColor(smo.score ?? 0)}30` }}>
                  {(smo.score ?? 0) >= 75 ? 'Əla' : (smo.score ?? 0) >= 50 ? 'Orta' : 'Zəif'}
                </span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-primary mb-1">{generation.business_name}</h1>
              <p className="text-text-muted text-sm mb-4">{formatDate(generation.created_at)}</p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-5">
                {[
                  { label: 'Əsas hashteq', val: smo.hashtags?.main_set?.length ?? 0 },
                  { label: 'Kontent şablonu', val: smo.content_templates?.templates?.length ?? 0 },
                  { label: 'Kontent həftəsi', val: smo.content_calendar?.weeks?.length ?? 0 },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-text-muted text-xs">{s.label}</div>
                    <div className="text-text-primary text-sm font-bold">{s.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score breakdown */}
            {scoreBreakdown.length > 0 && (
              <div className="hidden sm:block space-y-2 w-52 flex-shrink-0">
                {scoreBreakdown.map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...SPRING, delay: i * 0.07 }}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-muted truncate pr-2">{item.label}</span>
                      <span className="font-mono font-semibold flex-shrink-0" style={{ color: scoreColor((item.val / item.max) * 100) }}>{item.val}/{item.max}</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(0,201,167,0.08)' }}>
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
        <motion.div className="flex gap-1 mb-5 p-1 rounded-xl overflow-x-auto scrollbar-hide"
          style={{ background: 'rgba(0,201,167,0.06)' }}
          initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.1 }}
        >
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap"
              style={{
                background: activeTab === tab.id ? '#FFFFFF' : 'transparent',
                color: activeTab === tab.id ? '#00C9A7' : '#9B9EBB',
                boxShadow: activeTab === tab.id ? '0 1px 4px rgba(0,201,167,0.12)' : 'none',
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

            {/* AD AUDIENCE TAB */}
            {activeTab === 'ad_audience' && smo.ad_audience && (
              <div className="space-y-4">
                {/* Primary audience */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.15)' }}>
                  <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: 'rgba(123,110,246,0.08)', background: 'rgba(123,110,246,0.03)' }}>
                    <Target size={14} strokeWidth={1.8} style={{ color: '#7B6EF6' }} />
                    <span className="text-sm font-semibold text-text-primary">Əsas Hədəf Auditoriya</span>
                  </div>
                  <div className="p-5 grid sm:grid-cols-2 gap-4">
                    {[
                      ['Yaş aralığı', smo.ad_audience.primary_audience?.age_range],
                      ['Cins',        smo.ad_audience.primary_audience?.gender],
                      ['Məkan',       smo.ad_audience.primary_audience?.location],
                    ].map(([k, v]) => v ? (
                      <div key={k}>
                        <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#9B9EBB' }}>{k}</div>
                        <div className="text-sm font-medium text-text-primary">{v}</div>
                      </div>
                    ) : null)}
                    {smo.ad_audience.primary_audience?.interests?.length > 0 && (
                      <div className="sm:col-span-2">
                        <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9B9EBB' }}>Maraqlar</div>
                        <div className="flex flex-wrap gap-1.5">
                          {smo.ad_audience.primary_audience.interests.map((int, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-full font-medium"
                              style={{ background: 'rgba(123,110,246,0.08)', color: '#7B6EF6', border: '1px solid rgba(123,110,246,0.15)' }}>
                              {int}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {smo.ad_audience.primary_audience?.behaviors?.length > 0 && (
                      <div className="sm:col-span-2">
                        <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9B9EBB' }}>Davranışlar</div>
                        <div className="flex flex-wrap gap-1.5">
                          {smo.ad_audience.primary_audience.behaviors.map((b, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-full font-medium"
                              style={{ background: 'rgba(0,201,167,0.08)', color: '#00C9A7', border: '1px solid rgba(0,201,167,0.15)' }}>
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pain points */}
                {smo.ad_audience.pain_points?.length > 0 && (
                  <div className="rounded-2xl border p-5" style={{ background: '#FFFFFF', borderColor: 'rgba(242,92,84,0.15)' }}>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#9B9EBB' }}>Problemlər / Ağrı Nöqtələri</div>
                    <ul className="space-y-2">
                      {smo.ad_audience.pain_points.map((p, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                            style={{ background: 'rgba(242,92,84,0.8)' }}>{i + 1}</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Ad hooks */}
                {smo.ad_audience.ad_hooks?.length > 0 && (
                  <div className="rounded-2xl border p-5" style={{ background: '#FFFFFF', borderColor: 'rgba(0,201,167,0.15)' }}>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#9B9EBB' }}>Reklam Hookları</div>
                    <div className="space-y-2">
                      {smo.ad_audience.ad_hooks.map((hook, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl text-sm"
                          style={{ background: 'rgba(0,201,167,0.04)', border: '1px solid rgba(0,201,167,0.1)' }}>
                          <span className="text-[#00C9A7] font-bold flex-shrink-0">{i + 1}.</span>
                          <span className="text-text-primary italic">&ldquo;{hook}&rdquo;</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ad copies */}
                {smo.ad_audience.ad_copies?.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9B9EBB' }}>Reklam Mətnləri</div>
                    {smo.ad_audience.ad_copies.map((ad, i) => (
                      <div key={i} className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)' }}>
                        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(123,110,246,0.08)', background: 'rgba(123,110,246,0.03)' }}>
                          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#7B6EF6' }}>{ad.platform}</span>
                          <CopyButton text={`${ad.headline}\n\n${ad.body}\n\n${ad.cta}`} small />
                        </div>
                        <div className="p-4 space-y-2">
                          <div>
                            <span className="text-xs text-text-muted">Başlıq: </span>
                            <span className="text-sm font-semibold text-text-primary">{ad.headline}</span>
                          </div>
                          <div>
                            <span className="text-xs text-text-muted">Mətn: </span>
                            <span className="text-sm text-text-primary">{ad.body}</span>
                          </div>
                          <div>
                            <span className="text-xs text-text-muted">CTA: </span>
                            <span className="text-sm font-bold" style={{ color: '#00C9A7' }}>{ad.cta}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* HASHTAGS TAB */}
            {activeTab === 'hashtags' && smo.hashtags && (
              <div className="space-y-4">
                {/* Meta info */}
                {(smo.hashtags.best_time || smo.hashtags.total_reach_estimate) && (
                  <div className="flex flex-wrap gap-3">
                    {smo.hashtags.best_time && (
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
                        style={{ background: 'rgba(0,201,167,0.06)', border: '1px solid rgba(0,201,167,0.12)', color: '#00C9A7' }}>
                        <Clock size={14} strokeWidth={1.8} />
                        <span className="font-medium">Ən yaxşı vaxt: {smo.hashtags.best_time}</span>
                      </div>
                    )}
                    {smo.hashtags.total_reach_estimate && (
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
                        style={{ background: 'rgba(123,110,246,0.06)', border: '1px solid rgba(123,110,246,0.12)', color: '#7B6EF6' }}>
                        <Users size={14} strokeWidth={1.8} />
                        <span className="font-medium">Təxmini çatış: {smo.hashtags.total_reach_estimate}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Hashtag sets */}
                {[
                  { key: 'main_set',  label: 'Əsas Postlar üçün',  color: '#7B6EF6', tags: smo.hashtags.main_set },
                  { key: 'reel_set',  label: 'Reels üçün',         color: '#E1306C', tags: smo.hashtags.reel_set },
                  { key: 'story_set', label: 'Story üçün',         color: '#F5A623', tags: smo.hashtags.story_set },
                ].map(({ key, label, color, tags }) => tags?.length > 0 ? (
                  <motion.div key={key} className="rounded-2xl border p-5" style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.1)' }}
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                        <span className="font-semibold text-text-primary text-sm">{label}</span>
                        <span className="text-xs text-text-muted">{tags.length} hashteq</span>
                      </div>
                      <CopyButton text={tags.map(h => `#${h.replace(/^#/, '')}`).join(' ')} small />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map(tag => (
                        <span key={tag}
                          className="text-xs px-2.5 py-1.5 rounded-full font-medium cursor-pointer transition-all hover:scale-105"
                          style={{ background: `${color}10`, border: `1px solid ${color}25`, color }}
                          onClick={() => { navigator.clipboard.writeText(`#${tag.replace(/^#/, '')}`); addToast('Kopyalandı!') }}
                        >
                          #{tag.replace(/^#/, '')}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ) : null)}
              </div>
            )}

            {/* CONTENT CALENDAR TAB */}
            {activeTab === 'content_calendar' && smo.content_calendar && (
              <div className="space-y-4">
                {/* Month theme + frequency */}
                <div className="rounded-2xl border p-4" style={{ background: 'linear-gradient(135deg, rgba(245,166,35,0.06), rgba(0,201,167,0.04))', borderColor: 'rgba(245,166,35,0.15)' }}>
                  <div className="flex flex-wrap gap-4">
                    {smo.content_calendar.month_theme && (
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#9B9EBB' }}>Ay Mövzusu</div>
                        <div className="text-sm font-bold text-text-primary">{smo.content_calendar.month_theme}</div>
                      </div>
                    )}
                    {smo.content_calendar.posting_frequency && (
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#9B9EBB' }}>Tezlik</div>
                        <div className="text-sm font-bold text-text-primary">{smo.content_calendar.posting_frequency}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Weeks */}
                {smo.content_calendar.weeks?.map((week, wi) => (
                  <motion.div key={wi} className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: 'rgba(245,166,35,0.12)' }}
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: wi * 0.07 }}
                  >
                    <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: 'rgba(245,166,35,0.08)', background: 'rgba(245,166,35,0.04)' }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: '#F5A623' }}>{week.week}</div>
                      <div>
                        <span className="text-sm font-semibold text-text-primary">{week.week}. Həftə</span>
                        {week.focus && <span className="text-xs text-text-muted ml-2">— {week.focus}</span>}
                      </div>
                    </div>
                    <div className="divide-y" style={{ borderColor: 'rgba(245,166,35,0.06)' }}>
                      {week.posts?.map((post, pi) => (
                        <div key={pi} className="flex items-start gap-3 px-5 py-3">
                          <div className="flex-shrink-0 pt-0.5">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={{ background: 'rgba(245,166,35,0.08)', color: '#F5A623' }}>
                              {post.day}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-bold px-1.5 py-0.5 rounded"
                                style={{ background: 'rgba(123,110,246,0.08)', color: '#7B6EF6' }}>
                                {post.format}
                              </span>
                              <span className="text-sm font-medium text-text-primary truncate">{post.topic}</span>
                            </div>
                            {post.caption_hint && (
                              <p className="text-xs text-text-muted italic">{post.caption_hint}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* CONTENT TEMPLATES TAB */}
            {activeTab === 'content_templates' && smo.content_templates?.templates?.length > 0 && (
              <div className="space-y-4">
                {smo.content_templates.templates.map((tpl, i) => (
                  <motion.div key={i} className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: 'rgba(66,133,244,0.12)' }}
                    initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: i * 0.06 }}
                  >
                    <div className="flex items-center justify-between px-5 py-3 border-b"
                      style={{ borderColor: 'rgba(66,133,244,0.08)', background: 'rgba(66,133,244,0.03)' }}>
                      <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#4285F4' }}>{tpl.category}</span>
                      <CopyButton text={`${tpl.hook}\n\n${tpl.example}\n\n${tpl.cta}`} small />
                    </div>
                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wide mr-2" style={{ color: '#9B9EBB' }}>Hook:</span>
                        <span className="text-sm font-semibold text-text-primary italic">&ldquo;{tpl.hook}&rdquo;</span>
                      </div>
                      {tpl.body_structure && (
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wide mr-2" style={{ color: '#9B9EBB' }}>Struktur:</span>
                          <span className="text-sm text-text-secondary">{tpl.body_structure}</span>
                        </div>
                      )}
                      {tpl.example && (
                        <div className="rounded-xl p-3" style={{ background: 'rgba(66,133,244,0.04)', border: '1px solid rgba(66,133,244,0.1)' }}>
                          <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#4285F4' }}>Nümunə</div>
                          <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">{tpl.example}</p>
                        </div>
                      )}
                      {tpl.cta && (
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wide mr-2" style={{ color: '#9B9EBB' }}>CTA:</span>
                          <span className="text-sm font-bold" style={{ color: '#00C9A7' }}>{tpl.cta}</span>
                        </div>
                      )}
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
          style={{ background: 'rgba(255,255,255,0.95)', borderColor: 'rgba(0,201,167,0.15)', boxShadow: '0 8px 32px rgba(0,201,167,0.1)' }}
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.2 }}
        >
          <Link href="/smo" className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all hover:bg-surface-hover"
            style={{ borderColor: 'rgba(123,110,246,0.2)', color: '#5A5D7A' }}>
            <ChevronLeft size={15} strokeWidth={2} /> Geri
          </Link>
          <div className="flex-1" />
          <button onClick={() => router.push('/smo')}
            className="flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: '#00C9A7', boxShadow: '0 3px 12px rgba(0,201,167,0.25)' }}
          >
            <Sparkles size={14} strokeWidth={2} /> Yenidən yarat
          </button>
          <button onClick={handleDelete} className="py-2.5 px-4 rounded-xl text-sm font-medium transition-all hover:bg-red-50" style={{ color: '#F25C54' }}>
            Sil
          </button>
        </motion.div>
      </div>
    </>
  )
}
