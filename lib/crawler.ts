import * as cheerio from 'cheerio'

export interface CrawlResult {
  url: string
  title: string
  meta_description: string | null
  headings: string[]
  preview_text: string
}

export async function crawlURL(url: string): Promise<CrawlResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Zirva SEO Bot/1.0)',
      },
    })
    clearTimeout(timeout)

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const html = await res.text()
    const $ = cheerio.load(html)

    const title            = $('title').first().text().trim()
    const meta_description = $('meta[name="description"]').attr('content') ?? null
    const headings         = $('h1, h2, h3').map((_, el) => $(el).text().trim()).get().slice(0, 5)
    const preview_text     = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 500)

    return { url, title, meta_description, headings, preview_text }
  } finally {
    clearTimeout(timeout)
  }
}
