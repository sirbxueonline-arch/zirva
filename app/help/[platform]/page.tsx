import { notFound } from 'next/navigation'
import CloseButton from './CloseButton'

const GUIDES: Record<string, {
  title: string
  subtitle: string
  color: string
  bg: string
  icon: string
  steps: { heading: string; body: string; note?: string }[]
}> = {
  wordpress: {
    title: 'WordPress Application Password',
    subtitle: 'WordPress saytınızı Zirva-ya bağlamaq üçün addım-addım təlimat',
    color: '#21759B',
    bg: 'rgba(33,117,155,0.08)',
    icon: 'https://cdn.simpleicons.org/wordpress/21759B',
    steps: [
      {
        heading: 'WordPress Admin-ə daxil olun',
        body: 'saytiniz.com/wp-admin ünvanını açın və hesabınıza giriş edin.',
      },
      {
        heading: 'İstifadəçi profilinizi açın',
        body: 'Sol menyudan "Users" → "Profile" bölməsinə keçin. Yaxud sağ üst küncdəki adınıza klikləyin → "Edit Profile".',
      },
      {
        heading: '"Application Passwords" bölməsini tapın',
        body: 'Profil səhifəsini aşağı diyirləyin. "Application Passwords" bölməsini tapın.',
        note: 'Bu bölmə yalnız HTTPS saytlarda görünür. HTTP saytlarda aktiv olmur.',
      },
      {
        heading: 'Yeni şifrə yaradın',
        body: '"New Application Password Name" sahəsinə ad yazın (məs. "Zirva") → "Add New Application Password" düyməsini basın.',
      },
      {
        heading: 'Şifrəni kopyalayın',
        body: 'Yaradılan şifrəni kopyalayın və Zirva-dakı "Application Password" sahəsinə yapışdırın.',
        note: 'Şifrə yalnız bir dəfə göstərilir! Mütləq kopyalayıb saxlayın.',
      },
    ],
  },

  ghost: {
    title: 'Ghost Content API Key',
    subtitle: 'Ghost blogunuzu Zirva-ya bağlamaq üçün addım-addım təlimat',
    color: '#15171A',
    bg: 'rgba(21,23,26,0.06)',
    icon: 'https://cdn.simpleicons.org/ghost/15171A',
    steps: [
      {
        heading: 'Ghost Admin panelinizə daxil olun',
        body: 'Brauzerinizdə saytiniz.com/ghost ünvanını açın və hesabınıza giriş edin.',
      },
      {
        heading: 'Settings → Integrations bölməsinə keçin',
        body: 'Sol menyunun aşağısından "Settings" düyməsini basın, sonra "Integrations" bölməsini seçin.',
      },
      {
        heading: 'Yeni inteqrasiya əlavə edin',
        body: '"Add custom integration" düyməsini basın. İnteqrasiyaya istənilən ad verin (məs. "Zirva").',
      },
      {
        heading: 'Content API Key-i kopyalayın',
        body: 'Açılan pəncərədə "Content API Key" sahəsini tapın. Yanındakı kopyalama ikonuna basın.',
        note: 'Admin API Key deyil, məhz Content API Key lazımdır.',
      },
      {
        heading: 'Zirva-ya yapışdırın',
        body: 'Kopyaladığınız key-i Zirva-dakı "Content API Key" sahəsinə yapışdırın.',
      },
    ],
  },

  webflow: {
    title: 'Webflow API Token',
    subtitle: 'Webflow saytınızı Zirva-ya bağlamaq üçün addım-addım təlimat',
    color: '#146EF5',
    bg: 'rgba(20,110,245,0.08)',
    icon: 'https://cdn.simpleicons.org/webflow/146EF5',
    steps: [
      {
        heading: 'Webflow-a daxil olun',
        body: 'webflow.com saytında hesabınıza giriş edin.',
      },
      {
        heading: 'Workspace Settings-ə keçin',
        body: 'Sağ üst küncdəki profil şəklinizə klikləyin → "Workspace Settings" seçin.',
      },
      {
        heading: '"Integrations" tabını açın',
        body: 'Parametrlər səhifəsinin yuxarısındakı "Integrations" tabına keçin.',
      },
      {
        heading: 'API Access token yaradın',
        body: '"API Access" bölməsini tapın → "Generate API token" düyməsini basın. Tokena ad verin (məs. "Zirva") və icazələri seçin.',
        note: 'CMS məzmununu idarə etmək üçün "CMS" icazəsini aktiv edin.',
      },
      {
        heading: 'Tokeni kopyalayın',
        body: 'Yaradılan tokeni kopyalayın və Zirva-dakı "API Token" sahəsinə yapışdırın.',
        note: 'Token yalnız bir dəfə göstərilir!',
      },
    ],
  },

  shopify: {
    title: 'Shopify Admin Access Token',
    subtitle: 'Shopify mağazanızı Zirva-ya bağlamaq üçün addım-addım təlimat',
    color: '#96BF48',
    bg: 'rgba(150,191,72,0.08)',
    icon: 'https://cdn.simpleicons.org/shopify/96BF48',
    steps: [
      {
        heading: 'Shopify Admin-ə daxil olun',
        body: 'maganiz.myshopify.com/admin ünvanında hesabınıza giriş edin.',
      },
      {
        heading: 'Settings → Apps and sales channels',
        body: 'Sol aşağıdakı "Settings" düyməsini basın, sonra "Apps and sales channels" seçin.',
      },
      {
        heading: '"Develop apps" bölməsinə keçin',
        body: 'Açılan səhifənin sağ üst hissəsindəki "Develop apps" düyməsini basın.',
        note: 'Bu bölmə aktiv deyilsə, əvvəlcə developer rejimini aktivləşdirməlisiniz.',
      },
      {
        heading: 'Yeni app yaradın',
        body: '"Create an app" düyməsini basın. App-a ad verin (məs. "Zirva") və "Create app" ilə təsdiqləyin.',
      },
      {
        heading: 'API Permissions konfiqurasiya edin',
        body: '"Configuration" tabına keçin → "Admin API integration" bölməsindən lazımi icazələri seçin: read_content, write_content.',
      },
      {
        heading: 'Access Token əldə edin',
        body: '"API credentials" tabına keçin → "Install app" düyməsini basın → "Admin API access token" göstəriləcək. Kopyalayın.',
        note: 'Token yalnız bir dəfə göstərilir. Mütləq kopyalayıb saxlayın.',
      },
    ],
  },

  wix: {
    title: 'Wix API Key və Site ID',
    subtitle: 'Wix saytınızı Zirva-ya bağlamaq üçün addım-addım təlimat',
    color: '#FAAD4D',
    bg: 'rgba(250,173,77,0.08)',
    icon: 'https://cdn.simpleicons.org/wix/FAAD4D',
    steps: [
      {
        heading: 'Wix hesabınıza daxil olun',
        body: 'manage.wix.com saytında hesabınıza giriş edin.',
      },
      {
        heading: 'API Keys bölməsinə keçin',
        body: 'Saytınızı seçin → sol menyudan "Settings" → "API Keys" bölməsinə keçin.',
      },
      {
        heading: 'Yeni API Key yaradın',
        body: '"+ Generate API Key" düyməsini basın. Key-ə ad verin (məs. "Zirva") və lazımi icazələri seçin.',
        note: '"All site permissions" seçmək ən rahatıdır.',
      },
      {
        heading: 'API Key-i kopyalayın',
        body: 'Yaradılan API Key-i kopyalayın və Zirva-dakı "API Key" sahəsinə yapışdırın.',
      },
      {
        heading: 'Site ID-ni tapın',
        body: 'Brauzerinizdə saytınızın dashboard URL-inə baxın: manage.wix.com/dashboard/SITE_ID/... — bu hissə sizin Site ID-nizdir.',
        note: 'Alternativ olaraq: Settings → General Info → "Site ID" bölməsindən kopyalaya bilərsiniz.',
      },
    ],
  },
}

type Props = { params: Promise<{ platform: string }> }

export default async function HelpPage({ params }: Props) {
  const { platform } = await params
  const guide = GUIDES[platform]
  if (!guide) notFound()

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F5F5FF 0%, #FFFFFF 60%)', fontFamily: "'Outfit', system-ui, sans-serif" }}>

      {/* Top nav */}
      <nav style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(123,110,246,0.1)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', gap: 8, position: 'sticky', top: 0, zIndex: 10 }}>
        <a href="/" style={{ fontWeight: 800, fontSize: 16, color: '#7B6EF6', textDecoration: 'none', letterSpacing: '-0.02em' }}>Zirva</a>
        <span style={{ color: '#D0D3E8', fontSize: 16 }}>/</span>
        <span style={{ fontSize: 13, color: '#9B9EBB' }}>Kömək</span>
        <span style={{ color: '#D0D3E8', fontSize: 16 }}>/</span>
        <span style={{ fontSize: 13, color: '#5A5D7A', fontWeight: 600 }}>{guide.title}</span>
      </nav>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Hero card */}
        <div style={{ borderRadius: 28, overflow: 'hidden', marginBottom: 32, boxShadow: '0 8px 40px rgba(13,13,26,0.08)' }}>
          <div style={{ background: guide.bg, padding: '32px 32px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${guide.color}20`, flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={guide.icon} alt={guide.title} width={36} height={36} style={{ objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: guide.color, marginBottom: 6, opacity: 0.8 }}>Bağlantı bələdçisi</div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D0D1A', margin: 0, lineHeight: 1.2 }}>{guide.title}</h1>
              <p style={{ fontSize: 14, color: '#737599', margin: '6px 0 0', lineHeight: 1.5 }}>{guide.subtitle}</p>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: guide.color, opacity: 0.5 }} />
            <span style={{ fontSize: 13, color: '#9B9EBB' }}>{guide.steps.length} addım</span>
            <span style={{ fontSize: 13, color: '#D0D3E8', margin: '0 4px' }}>·</span>
            <span style={{ fontSize: 13, color: '#9B9EBB' }}>~5 dəqiqə</span>
          </div>
        </div>

        {/* Steps */}
        <div style={{ position: 'relative' }}>
          {/* Connector line */}
          <div style={{ position: 'absolute', left: 19, top: 28, bottom: 28, width: 2, background: 'linear-gradient(to bottom, rgba(123,110,246,0.15), rgba(123,110,246,0.04))', borderRadius: 2 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {guide.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                {/* Step number */}
                <div style={{ width: 40, height: 40, borderRadius: 14, background: i === 0 ? guide.color : '#FFFFFF', border: `2px solid ${i === 0 ? guide.color : 'rgba(123,110,246,0.12)'}`, color: i === 0 ? '#FFFFFF' : guide.color, fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, boxShadow: i === 0 ? `0 4px 12px ${guide.color}30` : 'none' }}>
                  {i + 1}
                </div>

                {/* Card */}
                <div style={{ flex: 1, background: '#FFFFFF', borderRadius: 20, padding: '18px 22px', boxShadow: '0 2px 16px rgba(13,13,26,0.05)', border: '1px solid rgba(123,110,246,0.06)', marginBottom: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#0D0D1A', marginBottom: 6 }}>{step.heading}</div>
                  <div style={{ fontSize: 14, color: '#5A5D7A', lineHeight: 1.65 }}>{step.body}</div>
                  {step.note && (
                    <div style={{ marginTop: 12, fontSize: 13, color: guide.color, background: guide.bg, borderRadius: 10, padding: '10px 14px', lineHeight: 1.55, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ flexShrink: 0 }}>💡</span>
                      <span>{step.note}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Done / close */}
        <div style={{ marginTop: 36, textAlign: 'center' }}>
          <CloseButton />
        </div>

      </div>
    </div>
  )
}
