'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n';

export default function Hero() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section 
      className="relative bg-cover bg-center bg-no-repeat min-h-screen hero-bg-fixed py-12 sm:py-16 md:py-32"
      style={{
        backgroundImage: 'url(/images/hero-background.jpg)',
      }}
    >
      {/* 半透明覆盖层 - 50% 透明度 */}
      <div className="absolute inset-0 bg-white opacity-50"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left">
          <h1 
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6"
            style={{ 
              fontFamily: 'Times New Roman, Times, serif',
              color: '#000000',
              opacity: 1,
            }}
          >
            {t.hero.title}
          </h1>
          <h2 
            className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 sm:mb-8"
            style={{ 
              fontFamily: 'Times New Roman, Times, serif',
              color: '#000000',
              opacity: 1,
            }}
          >
            {t.hero.subtitle}
          </h2>
          <p 
            className="text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed"
            style={{ 
              fontFamily: 'Times New Roman, Times, serif',
              color: '#000000',
              opacity: 1,
            }}
          >
              {t.hero.description}
              <br /><br />
              {t.hero.description2}
              <br /><br />
              {t.hero.description3}
            </p>
        </div>
      </div>
    </section>
  );
}
