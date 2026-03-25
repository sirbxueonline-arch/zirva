export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import HistoryTable from '@/components/app/HistoryTable'
import type { Generation, Profile } from '@/types'
import { PLAN_NAMES } from '@/types'
import { scoreColor } from '@/lib/utils'
import { Plus, ChevronRight, Zap, ArrowRight, Search, Camera, FileText, Activity } from 'lucide-react'

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

  const p = profile as Profile | null
  const gens = (generations || []) as Generation[]
  const total = count ?? 0
  const used = p?.generations_used ?? 0
  const limit = p?.generations_limit ?? 5
  const pct = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0
  const usageColor = pct >= 90 ? '#F25C54' : pct >= 70 ? '#F5A623' : '#00C9A7'
  const planKey = p?.plan ?? 'free'
  const planColor = { free: '#9B9EBB', pro: '#7B6EF6', agency: '#00C9A7' }[planKey]

  const today = new Date()
  const months = ['Yanvar','Fevral','Mart','Aprel','May','İyun','İyul','Avqust','Sentyabr','Oktyabr','Noyabr','Dekabr']
  const dayNames = ['Bazar','Bazar ertəsi','Çərşənbə axşamı','Çərşənbə','Cümə axşamı','Cümə','Şənbə']
  const dateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`
  const dayStr = dayNames[today.getDay()]

  const avgScore = gens.filter(g => g.seo_score !== null).length > 0
    ? Math.round(gens.filter(g => g.seo_score !== null).reduce((s, g) => s + (g.seo_score ?? 0), 0) / gens.filter(g => g.seo_score !== null).length)
    : null

  const firstName = p?.full_name?.split(' ')[0] || 'İstifadəçi'

  return (
    <div className="min-h-screen" style={{ background: '#F5F5FF' }}>
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* ── Top bar: greeting + CTA ── */}
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: `${planColor}15`, color: planColor, border: `1px solid ${planColor}25` }}>
                {PLAN_NAMES[planKey as keyof typeof PLAN_NAMES]}
              </span>
              <span className="text-text-muted text-xs">{dateStr} · {dayStr}</span>
            </div>
            <h1 className="font-display font-bold text-4xl text-text-primary leading-tight">
              Salam, {firstName}
            </h1>
          </div>
          <Link
            href="/generate"
            className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white flex-shrink-0 transition-all hover:scale-[1.02]"
            style={{ background: '#7B6EF6', boxShadow: '0 4px 20px rgba(123,110,246,0.28)' }}
          >
            <Plus size={16} strokeWidth={2.5} />
            Yeni Paket
          </Link>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">

          {/* Usage — spans 2 on mobile, 2 on sm */}
          <div className="col-span-2 rounded-2xl p-5 relative overflow-hidden"
            style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.1)', boxShadow: '0 2px 16px rgba(13,13,26,0.05)' }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: '#9B9EBB' }}>Bu ay istifadə</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-bold text-4xl text-text-primary">{used}</span>
                  <span className="text-text-muted text-base font-medium">/ {limit === 999999 ? '∞' : limit}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${usageColor}15` }}>
                <Activity size={18} strokeWidth={2} style={{ color: usageColor }} />
              </div>
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-1.5" style={{ background: 'rgba(123,110,246,0.07)' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: usageColor }} />
            </div>
            <p className="text-xs font-medium" style={{ color: usageColor }}>
              {limit - used > 0 ? `${limit - used} paket qalıb` : 'Limit dolub'}
            </p>
            <div className="absolute right-0 bottom-0 w-20 h-20 rounded-full pointer-events-none" style={{ background: `${usageColor}0A`, filter: 'blur(16px)', transform: 'translate(25%, 25%)' }} />
          </div>

          {/* Total */}
          <div className="rounded-2xl p-5 flex flex-col justify-between"
            style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.1)', boxShadow: '0 2px 16px rgba(13,13,26,0.05)' }}>
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#9B9EBB' }}>Ümumi paket</p>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(123,110,246,0.08)' }}>
                <FileText size={14} strokeWidth={2} style={{ color: '#7B6EF6' }} />
              </div>
            </div>
            <div>
              <div className="font-display font-bold text-4xl text-text-primary mb-0.5">{total}</div>
              <p className="text-xs text-text-muted">generasiya</p>
            </div>
          </div>

          {/* Avg score */}
          <div className="rounded-2xl p-5 flex flex-col justify-between"
            style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.1)', boxShadow: '0 2px 16px rgba(13,13,26,0.05)' }}>
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#9B9EBB' }}>Ort. SEO balı</p>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: avgScore !== null ? `${scoreColor(avgScore)}12` : 'rgba(123,110,246,0.06)' }}>
                <Activity size={14} strokeWidth={2} style={{ color: avgScore !== null ? scoreColor(avgScore) : '#9B9EBB' }} />
              </div>
            </div>
            <div>
              {avgScore !== null ? (
                <>
                  <div className="font-display font-bold text-4xl mb-0.5" style={{ color: scoreColor(avgScore) }}>{avgScore}</div>
                  <p className="text-xs text-text-muted">/ 100 bal</p>
                </>
              ) : (
                <div className="font-display font-bold text-4xl text-text-muted">—</div>
              )}
            </div>
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            {
              icon: <Search size={22} strokeWidth={1.8} />,
              label: 'SEO Paketi',
              sub: 'Google.az-da 1-nci ol',
              href: '/generate',
              color: '#4285F4',
            },
            {
              icon: <Camera size={22} strokeWidth={1.8} />,
              label: 'SMO Paketi',
              sub: 'Bio, hashtag, kontent',
              href: '/smo',
              color: '#E1306C',
            },
            {
              icon: <FileText size={22} strokeWidth={1.8} />,
              label: 'Tarixçə',
              sub: `${total} paket`,
              href: '/history',
              color: '#7B6EF6',
            },
          ].map(a => (
            <Link key={a.href} href={a.href}
              className="group flex items-center gap-4 rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02]"
              style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.1)', boxShadow: '0 2px 12px rgba(13,13,26,0.04)' }}
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                style={{ background: `${a.color}12`, color: a.color }}
              >
                {a.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-text-primary">{a.label}</div>
                <div className="text-xs text-text-muted truncate">{a.sub}</div>
              </div>
              <ChevronRight size={16} strokeWidth={2} className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: '#C0C3D8' }} />
            </Link>
          ))}
        </div>

        {/* ── Upgrade banner (free users) ── */}
        {p?.plan === 'free' && (
          <div className="rounded-2xl p-5 mb-6 flex items-center justify-between gap-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(123,110,246,0.07) 0%, rgba(155,143,248,0.04) 100%)', border: '1px solid rgba(123,110,246,0.18)' }}
          >
            <div className="absolute right-0 top-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'rgba(123,110,246,0.05)', filter: 'blur(32px)', transform: 'translate(30%,-30%)' }} />
            <div className="relative z-10">
              <p className="text-sm font-bold mb-0.5 flex items-center gap-1.5" style={{ color: '#7B6EF6' }}><Zap size={13} strokeWidth={2.5} />Pro plana keçin</p>
              <p className="text-text-muted text-xs">Ayda 50 paket · JSON/HTML ixracı · Rəqib analizi · Prioritet dəstək</p>
            </div>
            <Link href="/settings/billing"
              className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold text-white relative z-10 transition-all hover:scale-[1.03]"
              style={{ background: '#7B6EF6', boxShadow: '0 4px 14px rgba(123,110,246,0.28)' }}
            >
              <span className="flex items-center gap-1.5">Pro <ArrowRight size={14} strokeWidth={2.5} /></span>
            </Link>
          </div>
        )}

        {/* ── Recent generations ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-xl text-text-primary">Son Generasiyalar</h2>
              {total > 0 && <p className="text-text-muted text-xs mt-0.5">Ümumi {total} paket</p>}
            </div>
            {total > 5 && (
              <Link href="/history" className="text-sm font-semibold flex items-center gap-1 transition-colors" style={{ color: '#7B6EF6' }}>
                Hamısı
                <ChevronRight size={14} strokeWidth={2} />
              </Link>
            )}
          </div>
          <HistoryTable generations={gens} />
        </div>

      </div>
    </div>
  )
}
