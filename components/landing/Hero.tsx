'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'

/* ─── Google SERP mini-mockup ─────────────────────── */
function GoogleResult({ rank, title, url, desc, highlight }: {
  rank: number; title: string; url: string; desc: string; highlight?: boolean
}) {
  return (
    <div className={`rounded-xl p-3 transition-all ${highlight ? 'ring-2 ring-[#7B6EF6]/60' : ''}`}
      style={{ background: highlight ? 'rgba(123,110,246,0.08)' : 'transparent' }}>
      <div className="flex items-start gap-2.5">
        <span className="text-xs font-bold mt-0.5 w-4 flex-shrink-0"
          style={{ color: highlight ? '#7B6EF6' : '#9B9EBB' }}>
          {rank}
        </span>
        <div className="min-w-0">
          <div className="text-xs text-[#4B5563] truncate mb-0.5">{url}</div>
          <div className="text-sm font-semibold leading-tight mb-1 truncate"
            style={{ color: highlight ? '#1a1aff' : '#1a0dab' }}>
            {title}
          </div>
          <div className="text-xs leading-relaxed line-clamp-2" style={{ color: '#4B5563' }}>
            {desc}
          </div>
          {highlight && (
            <div className="flex items-center gap-1 mt-1.5">
              <CheckCircle size={10} style={{ color: '#7B6EF6' }} />
              <span className="text-[10px] font-semibold" style={{ color: '#7B6EF6' }}>Zirva ilə optimallaşdırılıb</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── ChatGPT mini-mockup ─────────────────────────── */
function ChatResult({ name, rec, highlight }: {
  name: string; rec: string; highlight?: boolean
}) {
  return (
    <div className={`flex items-start gap-2.5 rounded-xl p-3 ${highlight ? 'ring-2 ring-[#10A37F]/50' : ''}`}
      style={{ background: highlight ? 'rgba(16,163,127,0.07)' : 'transparent' }}>
      <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
        style={{ background: highlight ? 'rgba(16,163,127,0.2)' : 'rgba(255,255,255,0.08)' }}>
        <span className="text-[9px] font-bold" style={{ color: highlight ? '#10A37F' : '#9B9EBB' }}>
          {highlight ? '★' : '·'}
        </span>
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold mb-0.5" style={{ color: '#E5E7EB' }}>{name}</div>
        <div className="text-xs leading-relaxed" style={{ color: '#9CA3AF' }}>{rec}</div>
        {highlight && (
          <div className="flex items-center gap-1 mt-1.5">
            <CheckCircle size={10} style={{ color: '#10A37F' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#10A37F' }}>AI tərəfindən tövsiyə edilir</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Dual-platform mockup ────────────────────────── */
function DualMockup() {
  return (
    <motion.div
      className="w-full grid md:grid-cols-2 gap-px rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.06)' }}
      initial={{ y: 48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
    >
      {/* Google panel */}
      <div className="p-5" style={{ background: '#FFFFFF' }}>
        {/* Chrome bar */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-[#F25C54]" />
            <div className="w-2 h-2 rounded-full bg-[#F5A623]" />
            <div className="w-2 h-2 rounded-full bg-[#00C9A7]" />
          </div>
          <div className="flex-1 flex items-center gap-1.5 mx-2 rounded px-2 py-1 text-[10px] font-mono"
            style={{ background: '#F3F4F6', color: '#6B7280' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="#6B7280" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Bakıda ən yaxşı restoran
          </div>
        </div>

        {/* Platform label */}
        <div className="flex items-center gap-1.5 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-xs font-semibold text-[#6B7280]">Google Axtarış</span>
        </div>

        <div className="space-y-1">
          <GoogleResult rank={1} highlight
            title="Mey Bistro | Bakının Ən Yaxşı Restoranı"
            url="meybistro.az"
            desc="Bakıda 10 ildir fəaliyyət göstərən milli mətbəx restoranı. Rezervasiya edin →"
          />
          <GoogleResult rank={2}
            title="Çinar Restaurant – Bakı, Neftçilər"
            url="cinar.az"
            desc="Azərbaycanlı mətbəx restoranı. Nizami rayonu, hər gün 10:00–23:00"
          />
          <GoogleResult rank={3}
            title="Old City Baku – Tarixi mərkəzdə nahar"
            url="oldcitybaku.com"
            desc="İçərişəhərdə yerləşən restoran. Milli yemək, şəhər mənzərəsi."
          />
        </div>
      </div>

      {/* ChatGPT panel */}
      <div className="p-5" style={{ background: '#1A1A2E' }}>
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: '#10A37F' }}>
            <svg width="14" height="14" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.212-2.972 10.079 10.079 0 0 0-10.4 4.858 9.963 9.963 0 0 0-6.67 4.792 10.079 10.079 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.212 2.972 10.078 10.078 0 0 0 10.4-4.857 9.966 9.966 0 0 0 6.67-4.793 10.079 10.079 0 0 0-1.24-11.816zM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496zM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103L16.4 33.591a7.504 7.504 0 0 1-10.008-2.585zm-2.455-17.16a7.47 7.47 0 0 1 3.903-3.292A.065.065 0 0 1 7.84 10.6v9.199a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L7.044 23.86a7.504 7.504 0 0 1-3.107-10.014zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l7.694 4.443a7.498 7.498 0 0 1-1.158 13.528v-9.199a1.293 1.293 0 0 0-.293-.202zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l7.584-4.38a7.504 7.504 0 0 1 11.6 4.497zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.501 7.501 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.5v4.999l-4.331 2.5-4.331-2.5V18.226z" fill="white"/>
            </svg>
          </div>
          <span className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>ChatGPT</span>
        </div>

        {/* User message */}
        <div className="mb-3 flex justify-end">
          <div className="text-xs px-3 py-2 rounded-xl max-w-[75%]"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#E5E7EB' }}>
            Bakıda ən yaxşı restoran?
          </div>
        </div>

        {/* AI response */}
        <div className="text-xs mb-3 leading-relaxed" style={{ color: '#9CA3AF' }}>
          Bakıda bir neçə əla restoran var, lakin ən çox tövsiyə edilən:
        </div>

        <div className="space-y-1">
          <ChatResult name="Mey Bistro" highlight
            rec="Milli mətbəx, əla xidmət, Google-da ən yüksək reytinq. Geniş menyu, rezervasiya mümkün."
          />
          <ChatResult name="Çinar Restaurant"
            rec="Rahat atmosfer, mərkəzi yer, yerli yeməklər."
          />
          <ChatResult name="Old City Baku"
            rec="Tarixi mühit, şəhər mənzərəsi, turistlər üçün ideal."
          />
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Main Hero ───────────────────────────────────── */
export default function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section
      className="relative pt-24 pb-0 overflow-hidden"
      style={{ background: '#07071A' }}
    >
      {/* Noise texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Glow orbs */}
      <div className="absolute pointer-events-none"
        style={{ width: 700, height: 700, top: '-20%', left: '50%', transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(123,110,246,0.18) 0%, transparent 65%)',
          filter: 'blur(1px)' }}
      />
      <div className="absolute pointer-events-none"
        style={{ width: 400, height: 400, bottom: '10%', right: '-5%',
          background: 'radial-gradient(circle, rgba(0,201,167,0.1) 0%, transparent 65%)',
          filter: 'blur(1px)' }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">

        {/* Platform pills */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-10"
          initial={{ y: 16, opacity: 0 }}
          animate={mounted ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(66,133,244,0.12)', border: '1px solid rgba(66,133,244,0.25)', color: '#93B8FB' }}>
            <svg width="12" height="12" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </div>
          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.2)' }}>+</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(16,163,127,0.12)', border: '1px solid rgba(16,163,127,0.25)', color: '#6EE7C7' }}>
            <svg width="12" height="12" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.212-2.972 10.079 10.079 0 0 0-10.4 4.858 9.963 9.963 0 0 0-6.67 4.792 10.079 10.079 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.212 2.972 10.078 10.078 0 0 0 10.4-4.857 9.966 9.966 0 0 0 6.67-4.793 10.079 10.079 0 0 0-1.24-11.816zM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496zM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103L16.4 33.591a7.504 7.504 0 0 1-10.008-2.585zm-2.455-17.16a7.47 7.47 0 0 1 3.903-3.292A.065.065 0 0 1 7.84 10.6v9.199a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L7.044 23.86a7.504 7.504 0 0 1-3.107-10.014zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l7.694 4.443a7.498 7.498 0 0 1-1.158 13.528v-9.199a1.293 1.293 0 0 0-.293-.202zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l7.584-4.38a7.504 7.504 0 0 1 11.6 4.497zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.501 7.501 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.5v4.999l-4.331 2.5-4.331-2.5V18.226z" fill="#10A37F"/>
            </svg>
            ChatGPT
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-center font-display font-bold tracking-tight mb-6"
          style={{ fontSize: 'clamp(42px, 6.5vw, 78px)', lineHeight: 1.08, color: '#FFFFFF' }}
          initial={{ y: 24, opacity: 0 }}
          animate={mounted ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        >
          Saytınız Google-da da,{' '}
          <br />
          <span style={{
            background: 'linear-gradient(90deg, #7B6EF6 0%, #A78BFA 45%, #10A37F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            ChatGPT-də də #1
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-center mx-auto mb-10 text-lg leading-relaxed"
          style={{ maxWidth: '52ch', color: 'rgba(255,255,255,0.45)' }}
          initial={{ y: 20, opacity: 0 }}
          animate={mounted ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.22 }}
        >
          URL-i yapışdırın. 30 saniyə ərzində title teq, meta, schema markup
          və hreflang — hər ikisi üçün tam optimallaşdırılmış.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={mounted ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.32 }}
        >
          <Link
            href="/signup"
            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)',
              boxShadow: '0 0 0 1px rgba(123,110,246,0.4), 0 8px 32px rgba(123,110,246,0.35)',
            }}
          >
            Pulsuz Başla
            <ArrowRight size={15} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.01]"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.65)',
            }}
          >
            Necə işləyir?
          </a>
        </motion.div>

        {/* Dual mockup — flush to bottom */}
        <DualMockup />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #07071A)' }}
        />
      </div>
    </section>
  )
}
