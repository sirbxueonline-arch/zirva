import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-primary text-sm hover:underline mb-8 block">← Geri</Link>

        <h1 className="font-display font-bold text-4xl text-text-primary mb-2">İstifadə Şərtləri</h1>
        <p className="text-text-muted text-sm mb-12">Son yenilənmə: 1 Yanvar 2025</p>

        <div className="space-y-8 text-text-secondary leading-relaxed">
          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">1. Xidmət haqqında</h2>
            <p>
              Zirva Azərbaycan bazarı üçün süni intellekt əsaslı SEO teq generatoru
              xidmətidir. Xidmətdən istifadə etməklə bu şərtləri qəbul etmiş olursunuz.
              Şərtlərə razı olmasanız, xidmətdən istifadə etməyin.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">2. Hesab Məsuliyyəti</h2>
            <p>
              Hesabınızın təhlükəsizliyi sizin məsuliyyətinizdədir. Şifrənizi heç kimlə
              paylaşmayın. Hesabınızda baş verən hər hansı icazəsiz fəaliyyəti dərhal
              bizə bildirin. Bir hesab yalnız bir nəfər tərəfindən istifadə edilə bilər
              (Agency planı istisna olmaqla).
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">3. İstifadə Qaydaları</h2>
            <p>Aşağıdakılar qadağandır:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Zərərli, yanıltıcı və ya qeyri-qanuni məzmun yaratmaq</li>
              <li>Xidməti avtomatlaşdırılmış alətlərlə suistifadə etmək</li>
              <li>API-ı icazəsiz şəkildə geri mühəndislik etmək</li>
              <li>Digər istifadəçilərin məlumatlarına icazəsiz daxil olmaq</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">4. Ödəniş və Abunəlik</h2>
            <p>
              Ödənişlər Stripe vasitəsilə həyata keçirilir. Abunəliklər aylıq olaraq
              yenilənir. İstənilən vaxt ləğv edə bilərsiniz — cari dövr bitənə qədər
              xidmətdən istifadə edə bilərsiniz. Geri ödəmə yalnız ilk 7 gün ərzində
              mümkündür.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">5. Məzmun Hüquqları</h2>
            <p>
              Zirva tərəfindən yaradan SEO məzmunu sizin mülkiyyətinizdir. Zirva
              xidmətin təkmilləşdirilməsi məqsədilə anonimləşdirilmiş istifadə
              statistikasından yararlanır. Şəxsi məlumatlarınız məzmun modellərin
              öyrədilməsi üçün istifadə edilmir.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">6. Məsuliyyətin Məhdudlaşdırılması</h2>
            <p>
              Zirva SEO nəticələrini zəmanət vermir. Süni intellekt tərəfindən
              yaradılan məzmun tövsiyə xarakteri daşıyır. Xidmət "olduğu kimi"
              təqdim edilir, zəmanətsiz. Zirva-nın məsuliyyəti ödənilmiş abunəlik
              məbləği ilə məhdudlaşır.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">7. Dəyişikliklər</h2>
            <p>
              Bu şərtlər əvvəlcədən bildiriş olmadan dəyişdirilə bilər. Mühüm
              dəyişikliklər e-poçt vasitəsilə bildirilir. Xidmətdən istifadəyə
              davam etməklə yeni şərtləri qəbul etmiş sayılırsınız.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-xl text-text-primary mb-3">8. Əlaqə</h2>
            <p>
              Suallarınız üçün{' '}
              <a href="mailto:hello@tryzirva.com" className="text-primary hover:underline">
                hello@tryzirva.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
