'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n';

export default function Hero() {
  const { language } = useLanguage();
  const t = translations[language];

  // 背景圖片路徑 - 可以放在 public/images/ 或使用 Cloudinary URL
  const backgroundImage = '/images/hero-background.jpg'; // 請替換為你的照片路徑

  return (
    <section 
      className="relative bg-cover bg-center bg-no-repeat min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* 半透明遮罩層，確保文字可讀性 */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left">
          <h1 className="sticky top-0 z-20 text-4xl md:text-6xl font-bold text-gray-900 py-6 md:py-8 bg-transparent">
            {t.hero.title}
          </h1>
          <div className="py-8 md:py-12">
            <p className="text-lg md:text-xl text-gray-800 max-w-3xl leading-relaxed font-medium">
              {t.hero.description}
              <br /><br />
              {t.hero.description2}
              <br /><br />
              {t.hero.description3}
              <br /><br />
              {t.hero.description4}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
