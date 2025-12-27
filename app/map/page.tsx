'use client';

import TravelMap from "@/components/TravelMap";
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n';

export default function MapPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
          {t.pages.map.title}
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
          {t.pages.map.description}
        </p>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <TravelMap />
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t.pages.map.countries}</h3>
            <p className="text-gray-600">{t.pages.map.countriesDesc}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t.pages.map.km}</h3>
            <p className="text-gray-600">{t.pages.map.kmDesc}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t.pages.map.peaks}</h3>
            <p className="text-gray-600">{t.pages.map.peaksDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
