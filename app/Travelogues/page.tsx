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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
          {t.pages.travelogues.title}
        </h1>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          {t.pages.travelogues.description}
        </p>
        
        {/* Travelogue Carousel at the top */}
        <div className="mb-6">
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
