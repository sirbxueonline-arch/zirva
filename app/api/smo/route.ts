import { createClient } from '@/lib/supabase/server'
import { buildSMOPrompt, generateSMOPackage } from '@/lib/openai'
import { z } from 'zod'

const bodySchema = z.object({
  brand_id: z.string().uuid(),
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'İcazəsiz giriş' }, { status: 401 })

    const raw = await req.json()
    const { brand_id } = bodySchema.parse(raw)

    // Get brand
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('*')
      .eq('id', brand_id)
      .eq('user_id', user.id)
      .single()

    if (brandError || !brand) {
      return Response.json({ error: 'Brend tapılmadı' }, { status: 404 })
    }

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) return Response.json({ error: 'Profil tapılmadı' }, { status: 500 })

    // Credit check
    const creditsUsed  = (profile as Record<string, unknown>).credits_used  as number ?? 0
    const creditsLimit = (profile as Record<string, unknown>).credits_limit as number ?? 25
    if (creditsUsed + 5 > creditsLimit) {
      return Response.json({ error: 'Kreditiniz bitib. Pro plana keçin.' }, { status: 403 })
    }

    // Build prompt and generate
    const prompt = buildSMOPrompt({
      business_name: brand.name,
      website_url:   brand.website_url,
      instagram_url: brand.instagram_url,
      tiktok_url:    brand.tiktok_url,
      facebook_url:  brand.facebook_url,
      category:      brand.category,
      city:          brand.city,
      description:   brand.description,
    })

    const smoPackage = await generateSMOPackage(prompt)

    // Save to generations table
    const { data: generation, error: insertError } = await supabase
      .from('generations')
      .insert({
        user_id:       user.id,
        tool:          'smo',
        flow_type:     'url',
        input_data:    { brand_id, brand_name: brand.name },
        output_data:   smoPackage,
        business_name: brand.name,
        seo_score:     smoPackage.score,
        title_tag_az:  null,
        meta_desc_az:  null,
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Deduct 5 credits
    await supabase
      .from('profiles')
      .update({ credits_used: creditsUsed + 5 })
      .eq('id', user.id)

    return Response.json({ id: generation.id, ...smoPackage })
  } catch (err) {
    console.error('SMO generate error:', err)
    const message = err instanceof Error ? err.message : 'Naməlum xəta'
    return Response.json({ error: `Xəta baş verdi: ${message}` }, { status: 500 })
  }
}
