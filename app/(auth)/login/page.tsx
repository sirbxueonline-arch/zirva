'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

const SPRING_SMOOTH = { type: 'spring' as const, stiffness: 200, damping: 25 }

// useSearchParams must live inside a Suspense boundary in Next.js 15
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const [mode, setMode] = useState<'password' | 'magic'>('password')

  const supabase = createClient()

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('E-poçt və ya şifrə yanlışdır')
      setLoading(false)
    } else {
      router.push(redirectTo)
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setError('Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.')
    } else {
      setMagicSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 relative overflow-hidden">
      {/* Orbs */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 500, height: 500, background: 'rgba(123,110,246,0.10)', top: '-10%', left: '-8%', filter: 'blur(70px)' }}
        animate={{ x: [-60, 60, -60], y: [-40, 40, -40] }}
        transition={{ duration: 22, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 350, height: 350, background: 'rgba(0,201,167,0.12)', bottom: '5%', right: '-5%', filter: 'blur(55px)' }}
        animate={{ x: [50, -50, 50], y: [30, -60, 30] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />

      {/* Card */}
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={SPRING_SMOOTH}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="font-display font-bold text-3xl text-primary">
            Zirva
          </Link>
          <h1 className="text-text-primary font-display font-bold text-2xl mt-6 mb-2">
            Hesabınıza Daxil Olun
          </h1>
          <p className="text-text-secondary text-sm">
            Zirva ilə Google.az-da zirvəyə çatın
          </p>
        </div>

        <div
          className="rounded-2xl border p-8"
          style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.15)' }}
        >
          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border text-text-primary text-sm font-medium transition-all duration-200 hover:bg-surface-hover mb-6"
            style={{ borderColor: 'rgba(123,110,246,0.25)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ilə Daxil Ol
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(123,110,246,0.15)' }} />
            <span className="text-text-muted text-xs">və ya</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(123,110,246,0.15)' }} />
          </div>

          {/* Mode toggle */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setMode('password')}
              className="flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200"
              style={{
                background: mode === 'password' ? 'rgba(123,110,246,0.12)' : 'transparent',
                border: `1px solid ${mode === 'password' ? '#7B6EF6' : 'rgba(123,110,246,0.15)'}`,
                color: mode === 'password' ? '#7B6EF6' : '#5A5D7A',
              }}
            >
              Şifrə ilə
            </button>
            <button
              onClick={() => setMode('magic')}
              className="flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200"
              style={{
                background: mode === 'magic' ? 'rgba(123,110,246,0.12)' : 'transparent',
                border: `1px solid ${mode === 'magic' ? '#7B6EF6' : 'rgba(123,110,246,0.15)'}`,
                color: mode === 'magic' ? '#7B6EF6' : '#5A5D7A',
              }}
            >
              Sehrli link
            </button>
          </div>

          {magicSent ? (
            <div
              className="rounded-lg p-4 text-center text-sm"
              style={{ background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.25)', color: '#00C9A7' }}
            >
              ✉️ Sehrli link e-poçtunuza göndərildi!
            </div>
          ) : (
            <form onSubmit={mode === 'password' ? handleEmailLogin : handleMagicLink} className="space-y-4">
              <div>
                <label className="block text-text-secondary text-xs mb-1.5">E-poçt ünvanı</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg px-4 py-3 text-sm text-text-primary outline-none transition-all duration-200"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(123,110,246,0.2)',
                    color: '#0D0D1A',
                    boxShadow: '0 1px 3px rgba(13,13,26,0.05)',
                  }}
                  placeholder="siz@example.com"
                  onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(123,110,246,0.15)')}
                />
              </div>

              {mode === 'password' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-text-secondary text-xs">Şifrə</label>
                    <button type="button" className="text-primary text-xs hover:underline">
                      Şifrəni unutdunuz?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg px-4 py-3 text-sm text-text-primary outline-none transition-all duration-200"
                    style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.2)', boxShadow: '0 1px 3px rgba(13,13,26,0.05)' }}
                    placeholder="••••••••"
                    onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(123,110,246,0.15)')}
                  />
                </div>
              )}

              {error && (
                <div className="text-error text-xs py-2 px-3 rounded-lg" style={{ background: 'rgba(242,92,84,0.1)' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-60"
              >
                {loading ? 'Yüklənir...' : mode === 'password' ? 'Daxil Ol' : 'Şifrəsiz daxil ol (sehrli link)'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-text-muted text-sm mt-6">
          Hesabınız yoxdur?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Qeydiyyatdan keçin →
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
