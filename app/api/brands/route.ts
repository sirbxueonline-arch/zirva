import { createClient } from '@/lib/supabase/server'
import { BRAND_LIMITS } from '@/types'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ brands: data })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // Check brand limit
  const { data: profile } = await supabase.from('profiles').select('plan, brands_limit').eq('id', user.id).single()
  const limit = profile?.brands_limit ?? BRAND_LIMITS[profile?.plan ?? 'free']
  const { count } = await supabase.from('brands').select('id', { count: 'exact', head: true }).eq('user_id', user.id)
  if ((count ?? 0) >= limit) {
    return Response.json({ error: 'Brend limitinə çatdınız. Planı yüksəldin.', upgrade: true }, { status: 403 })
  }

  const body = await req.json()
  const { data, error } = await supabase.from('brands').insert({
    user_id:       user.id,
    name:          body.name,
    website_url:   body.website_url   || null,
    instagram_url: body.instagram_url || null,
    tiktok_url:    body.tiktok_url    || null,
    facebook_url:  body.facebook_url  || null,
    category:      body.category      || null,
    city:          body.city          || null,
    description:   body.description   || null,
  }).select().single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ brand: data })
}

export async function PUT(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data, error } = await supabase.from('brands').update({
    name:          body.name,
    website_url:   body.website_url   || null,
    instagram_url: body.instagram_url || null,
    tiktok_url:    body.tiktok_url    || null,
    facebook_url:  body.facebook_url  || null,
    category:      body.category      || null,
    city:          body.city          || null,
    description:   body.description   || null,
    updated_at:    new Date().toISOString(),
  }).eq('id', body.id).eq('user_id', user.id).select().single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ brand: data })
}

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return Response.json({ error: 'ID tələb olunur' }, { status: 400 })

  const { error } = await supabase.from('brands').delete().eq('id', id).eq('user_id', user.id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
