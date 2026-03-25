import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-primary text-sm hover:underline mb-8 block">← Geri</Link>

        <h1 className="font-display font-bold text-4xl text-text-primary mb-2">Məxfilik Siyasəti</h1>
        <p className="text-text-muted text-sm mb-12">Son yenilənmə: 1 Yanvar 2025</p>

        <div className="space-y-8 text-text-secondary leading-relaxed">
          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">1. Toplanan Məlumatlar</h2>
            <p>
              Zirva-ya qeydiyyatdan keçdiyinizdə adınız, e-poçt ünvanınız və şifrəniz
              toplanır. Bundan əlavə, xidmətdən istifadə zamanı yaranan SEO generasiyaları,
              istifadə statistikaları və ödəniş məlumatları (Stripe vasitəsilə) qeydə
              alınır. Şifrə kartı məlumatları heç vaxt bizim serverlərimizdə saxlanmır.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">2. Məlumatların İstifadəsi</h2>
            <p>
              Toplanan məlumatlar yalnız xidmətin göstərilməsi, hesabın idarə edilməsi,
              ödənişlərin emalı və müştəri dəstəyinin həyata keçirilməsi məqsədilə
              istifadə olunur. Məlumatlarınız üçüncü tərəflərlə paylaşılmır, satılmır
              və ya reklam məqsədilə istifadə edilmir.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">3. Məlumat Təhlükəsizliyi</h2>
            <p>
              Bütün məlumatlar SSL/TLS şifrələməsi ilə qorunur. Supabase platforması
              vasitəsilə saxlanan məlumatlar sənaye standartlarına uyğun təhlükəsizlik
              tədbirləri ilə qorunur. Hər istifadəçi yalnız öz məlumatlarına girə bilər
              (Row Level Security).
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">4. Cookies</h2>
            <p>
              Zirva sessiya idarəetməsi üçün zəruri olan cookie fayllarından istifadə
              edir. Analitika cookie faylları istifadə edilmir. Brauzerinizi
              konfiqurasiya edərək cookie fayllarını bloklaya bilərsiniz, lakin bu
              xidmətin işini poza bilər.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">5. Məlumatlarınızın Silinməsi</h2>
            <p>
              Hesabınızı istənilən vaxt parametrlər bölməsindən silə bilərsiniz.
              Hesab silindiyi zaman bütün şəxsi məlumatlarınız və generasiyalarınız
              daimi olaraq silinir. Ödəniş tarixçəsi Stripe-da saxlanır.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">6. Əlaqə</h2>
            <p>
              Məxfilik siyasəti ilə bağlı suallar üçün{' '}
              <a href="mailto:hello@tryzirva.com" className="text-primary hover:underline">
                hello@tryzirva.com
              </a>{' '}
              ünvanına müraciət edə bilərsiniz.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
