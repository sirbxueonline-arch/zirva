export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Generation, Profile } from '@/types'
import { PLAN_NAMES } from '@/types'
import {
  Plus, ChevronRight, Zap, ArrowRight, FileText, TrendingUp,
  Globe, PenLine, Sparkles, CalendarDays, BarChart3,
} from 'lucide-react'
import DashboardHero from '@/components/app/DashboardHero'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: generations }, { count }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('generations').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(5),
    supabase.from('generations').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  const p     = profile as Profile | null
  const gens  = (generations || []) as Generation[]
  const total = count ?? 0
  const used  = p?.generations_used ?? 0
  const limit = p?.generations_limit ?? 5
  const pct   = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0
  const remaining  = Math.max(limit - used, 0)
  const usageColor = pct >= 90 ? '#F25C54' : pct >= 70 ? '#F5A623' : '#7B6EF6'
  const planKey    = p?.plan ?? 'free'
  const planColor  = ({ free: '#9B9EBB', pro: '#7B6EF6', agency: '#00C9A7' } as Record<string,string>)[planKey] ?? '#9B9EBB'

  const today     = new Date()
  const months    = ['Yanvar','Fevral','Mart','Aprel','May','İyun','İyul','Avqust','Sentyabr','Oktyabr','Noyabr','Dekabr']
  const dayNames  = ['Bazar','Bazar ertəsi','Çərşənbə axşamı','Çərşənbə','Cümə axşamı','Cümə','Şənbə']
  const dateStr   = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`
  const dayStr    = dayNames[today.getDay()]
  const firstName = p?.full_name?.split(' ')[0] || 'İstifadəçi'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const websiteUrl = (p as any)?.website_url as string | null | undefined

  const avgScore = gens.filter(g => g.seo_score !== null).length > 0
    ? Math.round(gens.filter(g => g.seo_score !== null).reduce((s, g) => s + (g.seo_score ?? 0), 0) / gens.filter(g => g.seo_score !== null).length)
    : null

  const scoreColor = avgScore === null ? '#9B9EBB' : avgScore >= 80 ? '#00C9A7' : avgScore >= 60 ? '#F5A623' : '#F25C54'

  return (
    <div className="min-h-screen" style={{ background: '#F5F5FF' }}>
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* ── Greeting ── */}
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${planColor}18`, color: planColor, border: `1px solid ${planColor}28` }}>
                {PLAN_NAMES[planKey as keyof typeof PLAN_NAMES]}
              </span>
              <span className="text-xs" style={{ color: '#9B9EBB' }}>{dateStr} · {dayStr}</span>
            </div>
            <h1 className="font-display font-bold text-4xl leading-tight" style={{ color: '#0D0D1A' }}>
              Salam, {firstName} 👋
            </h1>
          </div>
          <Link
            href="/generate"
            className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white flex-shrink-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: '#7B6EF6', boxShadow: '0 4px 20px rgba(123,110,246,0.3)' }}
          >
            <Plus size={16} strokeWidth={2.5} />
            Yeni Məqalə
          </Link>
        </div>

        {/* ── Hero: Website status ── */}
        {websiteUrl ? (
          <div
            className="rounded-2xl p-6 mb-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #7B6EF6 0%, #9B8FF8 100%)', boxShadow: '0 8px 32px rgba(123,110,246,0.28)' }}
          >
            <div className="absolute right-0 top-0 w-64 h-64 rounded-full pointer-events-none opacity-10"
              style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                  <span className="text-white/70 text-xs font-medium">Avtomatik nəşr aktiv</span>
                </div>
                <h2 className="font-display font-bold text-xl text-white mb-1">Hər gün yeni məqalə</h2>
                <p className="text-white/60 text-sm">{websiteUrl}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="font-display font-bold text-2xl text-white">{used}</div>
                  <div className="text-white/60 text-xs">Bu ay</div>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="text-center">
                  <div className="font-display font-bold text-2xl text-white">{total}</div>
                  <div className="text-white/60 text-xs">Ümumi</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <DashboardHero />
        )}

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">

          {/* Monthly usage */}
          <div className="col-span-2 rounded-2xl p-5 relative overflow-hidden"
            style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.1)', boxShadow: '0 2px 16px rgba(13,13,26,0.05)' }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#9B9EBB' }}>Bu ay nəşr edildi</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-bold text-4xl" style={{ color: '#0D0D1A' }}>{used}</span>
                  <span className="text-base font-medium" style={{ color: '#9B9EBB' }}>/ {limit} məqalə</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${usageColor}12` }}>
                <CalendarDays size={18} strokeWidth={2} style={{ color: usageColor }} />
              </div>
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-1.5" style={{ background: 'rgba(123,110,246,0.08)' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: usageColor }} />
            </div>
            <p className="text-xs font-semibold" style={{ color: usageColor }}>
              {remaining > 0 ? `${remaining} məqalə qalıb` : 'Aylıq limit dolub'}
            </p>
          </div>

          {/* Total articles */}
          <div className="rounded-2xl p-5 flex flex-col justify-between"
            style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.1)', boxShadow: '0 2px 16px rgba(13,13,26,0.05)' }}>
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9B9EBB' }}>Ümumi məqalə</p>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(123,110,246,0.08)' }}>
                <FileText size={14} strokeWidth={2} style={{ color: '#7B6EF6' }} />
              </div>
            </div>
            <div>
              <div className="font-display font-bold text-4xl mb-0.5" style={{ color: '#0D0D1A' }}>{total}</div>
              <p className="text-xs" style={{ color: '#9B9EBB' }}>yazılmış</p>
            </div>
          </div>

          {/* Avg SEO score */}
          <div className="rounded-2xl p-5 flex flex-col justify-between"
            style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.1)', boxShadow: '0 2px 16px rgba(13,13,26,0.05)' }}>
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9B9EBB' }}>Ort. SEO balı</p>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${scoreColor}12` }}>
                <BarChart3 size={14} strokeWidth={2} style={{ color: scoreColor }} />
              </div>
            </div>
            <div>
              {avgScore !== null ? (
                <>
                  <div className="font-display font-bold text-4xl mb-0.5" style={{ color: scoreColor }}>{avgScore}</div>
                  <p className="text-xs" style={{ color: '#9B9EBB' }}>/100 bal</p>
                </>
              ) : (
                <div className="font-display font-bold text-4xl" style={{ color: '#9B9EBB' }}>—</div>
              )}
            </div>
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { icon: <PenLine size={20} strokeWidth={1.8} />,   label: 'Yeni Məqalə',   sub: 'AI ilə kontent yarat',    href: '/generate',         color: '#7B6EF6' },
            { icon: <TrendingUp size={20} strokeWidth={1.8} />, label: 'SEO Analizi',   sub: 'Sayt balınızı yoxlayın', href: '/generate',         color: '#00C9A7' },
            { icon: <FileText size={20} strokeWidth={1.8} />,   label: 'Məqalələr',     sub: `${total} yazılmış`,       href: '/history',          color: '#4285F4' },
          ].map(a => (
            <Link key={a.href + a.label} href={a.href}
              className="group flex items-center gap-4 rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02]"
              style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.08)', boxShadow: '0 2px 12px rgba(13,13,26,0.04)' }}
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${a.color}12`, color: a.color }}>
                {a.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold" style={{ color: '#0D0D1A' }}>{a.label}</div>
                <div className="text-xs truncate" style={{ color: '#9B9EBB' }}>{a.sub}</div>
              </div>
              <ChevronRight size={16} strokeWidth={2} className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: '#C0C3D8' }} />
            </Link>
          ))}
        </div>

        {/* ── Upgrade banner (free users) ── */}
        {p?.plan === 'free' && (
          <div
            className="rounded-2xl p-5 mb-6 flex items-center justify-between gap-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(123,110,246,0.07) 0%, rgba(155,143,248,0.03) 100%)', border: '1px solid rgba(123,110,246,0.18)' }}
          >
            <div className="absolute right-0 top-0 w-48 h-48 rounded-full pointer-events-none opacity-50"
              style={{ background: 'rgba(123,110,246,0.04)', filter: 'blur(32px)', transform: 'translate(30%,-30%)' }} />
            <div className="relative z-10">
              <p className="text-sm font-bold mb-0.5 flex items-center gap-1.5" style={{ color: '#7B6EF6' }}>
                <Zap size={13} strokeWidth={2.5} /> Pro plana keçin
              </p>
              <p className="text-xs" style={{ color: '#9B9EBB' }}>
                Ayda 50 məqalə · Hər gün avtomatik nəşr · Prioritet dəstək
              </p>
            </div>
            <Link
              href="/settings/billing"
              className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold text-white relative z-10 transition-all hover:scale-[1.03] flex items-center gap-1.5"
              style={{ background: '#7B6EF6', boxShadow: '0 4px 14px rgba(123,110,246,0.28)' }}
            >
              Pro <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        )}

        {/* ── Recent articles ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-xl" style={{ color: '#0D0D1A' }}>Son Məqalələr</h2>
              {total > 0 && <p className="text-xs mt-0.5" style={{ color: '#9B9EBB' }}>Ümumi {total} məqalə yazılıb</p>}
            </div>
            {total > 5 && (
              <Link href="/history" className="text-sm font-semibold flex items-center gap-1 transition-colors" style={{ color: '#7B6EF6' }}>
                Hamısı <ChevronRight size={14} strokeWidth={2} />
              </Link>
            )}
          </div>

          {total === 0 ? (
            /* Empty state */
            <div
              className="rounded-2xl p-10 text-center"
              style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.1)' }}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(123,110,246,0.08)' }}>
                <PenLine size={24} strokeWidth={1.8} style={{ color: '#7B6EF6' }} />
              </div>
              <h3 className="font-display font-bold text-lg mb-2" style={{ color: '#0D0D1A' }}>
                Hələ heç bir məqalə yoxdur
              </h3>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: '#737599' }}>
                İlk məqaləni yaradın — Zirva saytınızı öyrənir<br />
                və ən effektiv kontent yazır.
              </p>
              <Link
                href="/generate"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
                style={{ background: '#7B6EF6', boxShadow: '0 4px 16px rgba(123,110,246,0.28)' }}
              >
                <Plus size={15} strokeWidth={2.5} /> İlk məqaləni yarat
              </Link>
            </div>
          ) : (
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.08)', boxShadow: '0 2px 16px rgba(13,13,26,0.04)' }}
            >
              {gens.map((g, i) => (
                <Link
                  key={g.id}
                  href={`/result/${g.id}`}
                  className="group flex items-center gap-4 px-5 py-4 transition-all hover:bg-[#F5F5FF]"
                  style={{ borderTop: i > 0 ? '1px solid rgba(123,110,246,0.06)' : 'none' }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: g.flow_type === 'social' ? 'rgba(225,48,108,0.08)' : 'rgba(123,110,246,0.08)' }}>
                    {g.flow_type === 'social'
                      ? <TrendingUp size={16} strokeWidth={2} style={{ color: '#E1306C' }} />
                      : <FileText size={16} strokeWidth={2} style={{ color: '#7B6EF6' }} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate mb-0.5" style={{ color: '#0D0D1A' }}>
                      {g.title_tag_az || g.business_name || 'Məqalə'}
                    </div>
                    <div className="text-xs" style={{ color: '#9B9EBB' }}>
                      {new Date(g.created_at).toLocaleDateString('az-AZ', { day: 'numeric', month: 'long' })}
                    </div>
                  </div>
                  {g.seo_score !== null && (
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0"
                      style={{
                        background: g.seo_score >= 80 ? 'rgba(0,201,167,0.1)' : g.seo_score >= 60 ? 'rgba(245,166,35,0.1)' : 'rgba(242,92,84,0.1)',
                        color:      g.seo_score >= 80 ? '#00C9A7' : g.seo_score >= 60 ? '#F5A623' : '#F25C54',
                      }}
                    >
                      {g.seo_score}
                    </span>
                  )}
                  <ChevronRight size={15} strokeWidth={2} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#7B6EF6' }} />
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
