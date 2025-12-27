'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n';

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-400">
          {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}

