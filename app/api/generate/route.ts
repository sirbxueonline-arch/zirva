import { createClient } from '@/lib/supabase/server'
import {
  generateSEOPackage,
  buildURLPrompt,
  buildSocialPrompt,
  buildManualPrompt,
} from '@/lib/openai'
import { z } from 'zod'

// ─── Zod schemas per flow type ─────────────────────────────

const urlSchema = z.object({
  flow_type:        z.literal('url'),
  url:              z.string().url(),
  title:            z.string().optional(),
  meta_description: z.string().nullable().optional(),
  headings:         z.array(z.string()).optional(),
  preview_text:     z.string().optional(),
  post_idea:        z.string().optional(),
})

const socialSchema = z.object({
  flow_type: z.literal('social'),
  username:  z.string().min(1),
  platform:  z.enum(['instagram', 'tiktok']),
  category:  z.string().min(1),
  city:      z.string().min(1),
  post_idea: z.string().optional(),
})

const manualSchema = z.object({
  flow_type:     z.literal('manual'),
  business_name: z.string().min(1),
  services:      z.string().optional(),
  city:          z.string().min(1),
  keywords:      z.string().optional(),
  competitors:   z.string().optional(),
  post_idea:     z.string().optional(),
})

const bodySchema = z.discriminatedUnion('flow_type', [urlSchema, socialSchema, manualSchema])

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'İcazəsiz giriş' }, { status: 401 })

    // Get profile — auto-create if missing (e.g. trigger didn't fire)
    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      const { data: newProfile } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email ?? '',
          full_name: user.user_metadata?.full_name ?? '',
          plan: 'free',
          generations_used: 0,
          generations_limit: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()
      profile = newProfile
    }

    if (!profile) return Response.json({ error: 'Profil yaradıla bilmədi' }, { status: 500 })

    if (profile.generations_used >= profile.generations_limit) {
      return Response.json(
        { error: 'Aylıq limitiniz dolub. Pro plana keçin.' },
        { status: 403 }
      )
    }

    // Validate input
    const raw = await req.json()
    if (raw.flow_type === 'url' && raw.url && !/^https?:\/\//i.test(raw.url)) {
      raw.url = `https://${raw.url}`
    }
    const body = bodySchema.parse(raw)

    // Build prompt
    let prompt = ''
    let businessName = ''

    if (body.flow_type === 'url') {
      prompt = buildURLPrompt({
        url:              body.url,
        title:            body.title || '',
        meta_description: body.meta_description ?? null,
        headings:         body.headings || [],
        preview_text:     body.preview_text || '',
        post_idea:        body.post_idea,
      })
      businessName = body.url
    } else if (body.flow_type === 'social') {
      prompt = buildSocialPrompt({ ...body, post_idea: body.post_idea })
      businessName = `@${body.username} (${body.category})`
    } else {
      prompt = buildManualPrompt({ ...body, services: body.services ?? '', post_idea: body.post_idea })
      businessName = body.business_name
    }

    // Generate SEO package via OpenAI
    const seoPackage = await generateSEOPackage(prompt)

    // Save to generations table
    const { data: generation, error: insertError } = await supabase
      .from('generations')
      .insert({
        user_id:       user.id,
        flow_type:     body.flow_type,
        input_data:    body,
        output_data:   seoPackage,
        business_name: businessName,
        seo_score:     seoPackage.seo_score,
        title_tag_az:  seoPackage.title_tag_az,
        meta_desc_az:  seoPackage.meta_description_az,
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Increment usage counter
    await supabase
      .from('profiles')
      .update({ generations_used: profile.generations_used + 1 })
      .eq('id', user.id)

    return Response.json({ id: generation.id, ...seoPackage })
  } catch (err) {
    console.error('Generate error:', err)
    const message = err instanceof Error ? err.message : 'Naməlum xəta'
    return Response.json(
      { error: `Xəta baş verdi: ${message}` },
      { status: 500 }
    )
  }
}

// DELETE — remove a generation
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return Response.json({ error: 'ID tələb olunur' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'İcazəsiz giriş' }, { status: 401 })

    const { error } = await supabase
      .from('generations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: 'Silmə zamanı xəta baş verdi' }, { status: 500 })
  }
}
