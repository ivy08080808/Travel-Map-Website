'use client';

import dynamic from 'next/dynamic';
import TravelogueCarousel from "@/components/TravelogueCarousel";
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n';

// Dynamically import TravelMapPreview with SSR disabled
const TravelMapPreview = dynamic(() => import("@/components/TravelMapPreview"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg shadow-lg h-[600px] flex items-center justify-center">
      <div className="text-gray-500">載入地圖中...</div>
    </div>
  ),
});

export default function TraveloguesPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 text-center" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
          {t.pages.travelogues.title}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 md:mb-12 text-center max-w-3xl mx-auto px-2">
          {t.pages.travelogues.description}
        </p>
        
        {/* Travelogue Carousel at the top */}
        <div className="mb-4 sm:mb-6">
          <TravelogueCarousel />
        </div>

        {/* Map Preview below */}
        <div>
          <TravelMapPreview />
        </div>
      </div>
    </div>
  );
}
