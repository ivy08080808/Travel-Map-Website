'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n';

export default function Hero() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t.hero.title}
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-8">
            {t.hero.subtitle}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
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
