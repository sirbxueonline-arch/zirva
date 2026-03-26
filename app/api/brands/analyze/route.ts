import { createClient } from '@/lib/supabase/server'
import { crawlURL } from '@/lib/crawler'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { website_url, name } = await req.json()
  if (!website_url && !name) {
    return Response.json({ error: 'URL və ya ad tələb olunur' }, { status: 400 })
  }

  let pageContent = ''

  if (website_url) {
    try {
      const crawl = await crawlURL(website_url)
      pageContent = [
        crawl.title,
        crawl.meta_description,
        ...crawl.headings,
        crawl.preview_text,
      ].filter(Boolean).join('\n')
    } catch {
      // If crawl fails, fall back to name-only analysis
    }
  }

  const context = pageContent
    ? `Sayt adı: ${name || ''}\nSayt məzmunu:\n${pageContent}`
    : `Brend adı: ${name}`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content: `Sən biznes analiz ekspertisən. Verilən sayt məlumatına əsasən aşağıdakı JSON formatında cavab ver:
{
  "category": "Biznesin kateqoriyası (məs: Restoran, Hüquq, Daşınmaz Əmlak, IT Xidmətləri, Tibb, Moda, Avtomobil, Turizm, Təhsil, İnşaat)",
  "city": "Əsas şəhər (yalnız şəhər adı, məs: Bakı, İstanbul, Ankara — əgər müəyyən etmək mümkün deyilsə boş burax)",
  "description": "50-80 sözdən ibarət qısa biznes təsviri Azərbaycan dilində. Xidmətlər, üstünlüklər və hədəf auditoriyasını qeyd et."
}
Yalnız JSON cavab ver, başqa heç nə yazma.`,
      },
      {
        role: 'user',
        content: context,
      },
    ],
  })

  try {
    const raw = completion.choices[0].message.content ?? '{}'
    const json = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim())
    return Response.json({
      category:    json.category    ?? '',
      city:        json.city        ?? '',
      description: json.description ?? '',
    })
  } catch {
    return Response.json({ category: '', city: '', description: '' })
  }
}
