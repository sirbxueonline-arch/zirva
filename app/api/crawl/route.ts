import { createClient } from '@/lib/supabase/server'
import { crawlURL } from '@/lib/crawler'
import { z } from 'zod'

const schema = z.object({ url: z.string().url() })

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'İcazəsiz giriş' }, { status: 401 })

    const body = await req.json()
    const rawUrl: string = body.url ?? ''
    const normalizedUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`
    const { url } = schema.parse({ ...body, url: normalizedUrl })

    const result = await crawlURL(url)
    return Response.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Naməlum xəta'
    return Response.json({ error: `Sayt əldə edilə bilmədi: ${message}` }, { status: 400 })
  }
}
