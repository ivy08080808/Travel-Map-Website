'use client';

import dynamic from 'next/dynamic';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n';
import Link from 'next/link';

const TravelMap = dynamic(() => import('@/components/TravelMap'), {
  ssr: false,
});

export default function TravelMapPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="mb-4 sm:mb-6">
          <Link
            href="/Travelogues"
            className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-2 mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <span>←</span>
            <span>{language === 'zh' ? '返回遊記' : 'Back to Travelogues'}</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            {language === 'zh' ? '旅行地圖' : 'Travel Map'}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl">
            {language === 'zh' 
              ? '探索我的旅程地圖以及我在冒險中訪問過的地方。'
              : "Explore the map of my journeys and places I've visited during my adventures."}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <TravelMap />
        </div>
      </div>
    </div>
  );
}

