import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'İcazəsiz giriş' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('generations_used, generations_limit, plan')
      .eq('id', user.id)
      .single()

    if (!profile) return Response.json({ error: 'Profil tapılmadı' }, { status: 404 })

    const { count } = await supabase
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    return Response.json({
      used:  profile.generations_used,
      limit: profile.generations_limit,
      plan:  profile.plan,
      total: count ?? 0,
    })
  } catch {
    return Response.json({ error: 'Xəta baş verdi' }, { status: 500 })
  }
}
