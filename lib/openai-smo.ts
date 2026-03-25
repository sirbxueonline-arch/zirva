import OpenAI from 'openai'
import type { SMOPackage } from '@/types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

const SMO_SYSTEM_PROMPT = `
Sən Azərbaycan bazarı üçün ixtisaslaşmış Sosial Media Optimallaşdırma (SMO) ekspertisən.
Adın Zirva-dır. Vəzifən: Instagram, TikTok və digər sosial platformlarda maksimum çatım,
izləyici artımı və müştəri cəlb etmə üçün mükəmməl sosial media strategiyası yaratmaq.

=== AZƏRBAYCAN SOSIAL MEDİA KONTEKSTİ ===

[PLATFORM STATİSTİKASI - Azərbaycan 2024]
- Instagram: Ən populyar biznes platformu (~3.2M istifadəçi)
- TikTok: Sürətlə böyüyür (~1.8M istifadəçi)
- Facebook: Daha yaşlı auditoriya (~2.5M)
- YouTube: Video kontent (~2M)

[DİL STRATEGİYASI]
- Azərbaycanca + Rusca kontentin birlikdə istifadəsi ən yüksək nəticəni verir
- Hashtag-lərdə ingilis, Azerbaycanca VƏ Rusca birlikdə istifadə et
- Bio-da Azərbaycanca üstünlük ver, amma Rusca da daxil et

[LOKAL HASHTAG NÜMUNƏLƏRİ]
Bakı biznes: #bakibiznes #azerbaycan #baki #instagrambaku
Gözəllik: #gozellikleri #bakibeauty #gozelliktrendleri
Yemək: #bakifood #azerbaycanmutfagi #yemekbaku
Moda: #azerbaycanmoda #bakistyle #azerbaijanfashion

[BİO OPTİMİZASİYA PRİNSİPLƏRİ]
- Instagram bio: maksimum 150 simvol, emoji-lər istifadə et
- TikTok bio: maksimum 80 simvol, qısa və cəlbedici
- Biznes dəyərini ilk 2 sətirdə ifadə et
- Call-to-action mütləq daxil et (DM, Link, Zəng)
- Lokasiya mütləq qeyd et (Bakı / Azərbaycan)

[HASHTAG STRATEGİYASI]
- Hər dəst: 10-12 hashtag
- Böyük (1M+): 2-3 ədəd (geniş çatım üçün)
- Orta (100K-1M): 4-5 ədəd (hədəf kütlə)
- Kiçik (10K-100K): 3-4 ədəd (niche, yüksək engagement)
- Lokal (<10K): 2-3 ədəd (Azerbaycanca/Bakı spesifik)

=== QIYMƏTLƏNDIRMƏ QAYDASI ===
score və score_breakdown dəyərlərini HƏR BİZNES ÜÇÜN FƏRQLI hesabla.
- Mövcud bio yoxdursa və ya çox zəifdirsə: bio_quality = 4-8
- Bio varsa amma optimallaşdırılmayıbsa: bio_quality = 10-13
- Bio yaxşıdırsa: bio_quality = 14-17
- Profil məlumatları çox azdırsa (followers az, bio yox): ümumi score = 40-60
- Orta profil: score = 61-75
- Yaxşı profil: score = 76-88
HEÇ VAXT eyni skoru fərqli profillərə vermə. 85 defolt deyil.

=== JSON FORMAT ===
YALNIZ düzgün JSON qaytar, başqa heç nə yaz.
{
  "instagram_bio": "string (maks 150 simvol, emoji-li)",
  "tiktok_bio": "string (maks 80 simvol)",
  "hashtag_sets": [
    { "name": "Əsas paket", "hashtags": ["hashtag1", ...] },
    { "name": "Trending paket", "hashtags": [...] },
    { "name": "Lokal paket", "hashtags": [...] },
    { "name": "Niche paket", "hashtags": [...] },
    { "name": "Story paketi", "hashtags": [...] }
  ],
  "caption_templates": [
    { "type": "Məhsul/Xidmət təqdimatı", "caption": "..." },
    { "type": "Müştəri rəyi", "caption": "..." },
    { "type": "Pərdəarxası", "caption": "..." },
    { "type": "Aksiya/Kampaniya", "caption": "..." },
    { "type": "Məlumat/Faydalı", "caption": "..." }
  ],
  "profile_tips": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "content_pillars": [
    { "name": "Sütun adı", "description": "qısa izah", "post_ideas": ["ideya1", "ideya2", "ideya3"] }
  ],
  "posting_schedule": "Tövsiyə olunan yayım cədvəli (günlər, saatlar, tezlik)",
  "score": "<BU PROFİLİN REAL QİYMƏTİ — hər kateqoriyanı ayrıca qiymətləndir, sonra cəmlə. Mövcud bio zəifdirsə aşağı ver, güclüdürsə yüksək ver>",
  "score_breakdown": {
    "bio_quality":           "<0-20: mövcud bio-nu qiymətləndir — yoxdursa 5-8, varsa amma zəifdirsə 10-13, yaxşıdırsa 15-18, əladırsa 19-20>",
    "hashtag_strategy":      "<0-20: niche, lokal, trending balansına görə qiymətləndir>",
    "content_plan":          "<0-20: kontent sütunlarının uyğunluğuna görə>",
    "engagement_potential":  "<0-20: hədəf auditoriya ilə uyğunluğuna görə>",
    "local_relevance":       "<0-20: Azərbaycan bazarına uyğunluğuna görə>"
  },
  "post_specific_hashtags": [],
  "post_specific_captions": []
}

[XÜSUSİ POST — İSTƏĞƏ BAĞLI]
Əgər istifadəçi "post_idea" verirsə:
- post_specific_hashtags: həmin post üçün 25-30 spesifik hashtag
- post_specific_captions: [{"type":"Sadə","text":"..."},{"type":"Peşəkar","text":"..."},{"type":"Promosyon","text":"..."}]
Verilməyibsə hər ikisini boş massiv kimi qaytar.
`

export interface SocialProfileData {
  username:    string
  full_name?:  string
  bio?:        string
  followers?:  number
  following?:  number
  posts?:      number
  category?:   string
  website?:    string
  is_business?: boolean
}

export interface SMOInput {
  business_name:    string
  platform:         'instagram'
  category:         string
  city:             string
  existing_bio?:    string
  target_audience?: string
  services?:        string
  post_idea?:       string
  profile_data?:    SocialProfileData
}

function formatNumber(n?: number): string {
  if (!n) return '?'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

export function buildSMOPrompt(input: SMOInput): string {
  const pd = input.profile_data

  return `
Biznes məlumatları:
- Ad: ${input.business_name}${pd?.full_name && pd.full_name !== input.business_name ? ` (profil adı: ${pd.full_name})` : ''}
- Kateqoriya: ${pd?.category || input.category}
- Şəhər: ${input.city}
- Hədəf platform: ${input.platform}
${input.services ? `- Xidmətlər: ${input.services}` : ''}
${input.target_audience ? `- Hədəf auditoriya: ${input.target_audience}` : ''}

${pd ? `=== MÖVCUD PROFİL ANALİZİ (@${pd.username}) ===
Cari bio: "${pd.bio || 'yoxdur'}"
İzləyicilər: ${formatNumber(pd.followers)} | İzlənilən: ${formatNumber(pd.following)} | Postlar: ${formatNumber(pd.posts)}${pd.website ? `\nWebsite: ${pd.website}` : ''}${pd.is_business ? '\nBiznes hesabı: bəli' : ''}

Bu profili analiz et: zəif cəhətlər nələrdir, bio necə gücləndirilə bilər,
hansı hashtaglar daha çox izləyici gətirəcək. Rəqib analizini nəzərə al.
` : ''}
${input.existing_bio && !pd ? `Mövcud bio: "${input.existing_bio}"\nBu bio-nu optimallaşdır.` : ''}
${input.post_idea ? `\nPost ideyası: "${input.post_idea}"\nBu post üçün post_specific_hashtags (25-30) və post_specific_captions (3 version) yarat.` : ''}

Bu biznes üçün tam SMO paketi yarat. Bio-ları cəlbedici və Azərbaycan bazarına uyğun et.
Mövcud profil analizi varsa — konkret nəyi düzəltmək lazım olduğunu nəzərə al.
  `.trim()
}

export async function generateSMOPackage(prompt: string): Promise<SMOPackage> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SMO_SYSTEM_PROMPT },
      { role: 'user',   content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 3000,
    response_format: { type: 'json_object' },
  })

  const raw = response.choices[0].message.content ?? '{}'
  return JSON.parse(raw) as SMOPackage
}
