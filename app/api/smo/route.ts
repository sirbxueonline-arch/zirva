import { createClient } from '@/lib/supabase/server'
import { generateSMOPackage, buildSMOPrompt } from '@/lib/openai-smo'
import { z } from 'zod'

const profileDataSchema = z.object({
  username:    z.string(),
  full_name:   z.string().optional(),
  bio:         z.string().optional(),
  followers:   z.number().optional(),
  following:   z.number().optional(),
  posts:       z.number().optional(),
  category:    z.string().optional(),
  website:     z.string().optional(),
  is_business: z.boolean().optional(),
}).optional()

const schema = z.object({
  business_name:   z.string().min(1),
  platform:        z.enum(['instagram']),
  category:        z.string().min(1),
  city:            z.string().min(1),
  existing_bio:    z.string().optional(),
  target_audience: z.string().optional(),
  services:        z.string().optional(),
  post_idea:       z.string().optional(),
  profile_data:    profileDataSchema,
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'İcazəsiz giriş' }, { status: 401 })

    let { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (!profile) {
      const { data: np } = await supabase.from('profiles').upsert({
        id: user.id, email: user.email ?? '', full_name: user.user_metadata?.full_name ?? '',
        plan: 'free', generations_used: 0, generations_limit: 5,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }).select().single()
      profile = np
    }
    if (!profile) return Response.json({ error: 'Profil yaradıla bilmədi' }, { status: 500 })

    if (profile.generations_used >= profile.generations_limit) {
      return Response.json({ error: 'Aylıq limitiniz dolub. Pro plana keçin.' }, { status: 403 })
    }

    // SMO is Pro+ only
    const isPaidPlan = profile.plan === 'pro' || profile.plan === 'agency'
    if (!isPaidPlan) {
      return Response.json(
        { error: 'SMO Paketi yalnız Pro və Agency planlarında mövcuddur.', upgrade: true },
        { status: 403 }
      )
    }

    const body = schema.parse(await req.json())
    const prompt = buildSMOPrompt(body)
    const smoPackage = await generateSMOPackage(prompt)

    const { data: generation, error: insertError } = await supabase
      .from('generations')
      .insert({
        user_id:       user.id,
        flow_type:     'social',
        input_data:    { ...body, _type: 'smo' },
        output_data:   smoPackage,
        business_name: body.business_name,
        seo_score:     smoPackage.score,
        title_tag_az:  smoPackage.instagram_bio,
        meta_desc_az:  smoPackage.tiktok_bio,
      })
      .select()
      .single()

    if (insertError) {
      console.error('SMO insert error:', insertError)
      throw new Error((insertError as { message?: string }).message ?? JSON.stringify(insertError))
    }

    await supabase.from('profiles')
      .update({ generations_used: profile.generations_used + 1 })
      .eq('id', user.id)

    return Response.json({ id: generation.id, ...smoPackage })
  } catch (err) {
    console.error('SMO error:', err)
    const message = err instanceof Error ? err.message : JSON.stringify(err)
    return Response.json({ error: message }, { status: 500 })
  }
}
