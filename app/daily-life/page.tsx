'use client';

import { useState, useEffect } from 'react';
import { DailyLife } from '@/lib/data';
import DailyLifeCard from '@/components/DailyLifeCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n';

export default function DailyLifePage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [dailyLifeItems, setDailyLifeItems] = useState<DailyLife[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDailyLife();
  }, []);

  const fetchDailyLife = async () => {
    try {
      const response = await fetch('/api/daily-life');
      if (response.ok) {
        const data = await response.json();
        setDailyLifeItems(data);
      }
    } catch (error) {
      console.error('Error fetching daily life:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter by category first
  const readingNotes = dailyLifeItems.filter(item => item.category === 'reading');
  const dailyShare = dailyLifeItems.filter(item => item.category === 'daily' || !item.category);
  
  // Sort daily share by date (newest first)
  const sortedDailyShare = dailyShare.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
          {t.pages.dailyLife.title}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 text-center max-w-3xl mx-auto">
          {t.pages.dailyLife.description}
        </p>

        {/* Reading Notes Section */}
        <section className="mb-12 sm:mb-16">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
            {/* 標題在左邊 (移動端在上方) */}
            <div className="flex-shrink-0 w-full md:w-48 lg:w-64">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {t.pages.dailyLife.readingNotes}
              </h2>
              <p className="text-sm text-gray-600">
                {t.pages.dailyLife.readingNotesDesc}
              </p>
            </div>
            {/* 卡片在右邊，可以橫向滾動 (移動端在下方) */}
            <div className="flex-1 w-full md:w-auto overflow-x-auto scrollbar-hide">
              {readingNotes.length > 0 ? (
                <div className="flex gap-4 sm:gap-6 pb-4">
                  {readingNotes.map((item) => (
                    <div key={item.id} className="flex-shrink-0 w-72 sm:w-80">
                      <DailyLifeCard dailyLife={item} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic py-8">{language === 'zh' ? '還沒有讀書心得' : 'No reading notes yet'}</p>
              )}
            </div>
          </div>
        </section>

        {/* Daily Share Section */}
        <section>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
            {/* 標題在左邊 (移動端在上方) */}
            <div className="flex-shrink-0 w-full md:w-48 lg:w-64">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {t.pages.dailyLife.dailyShare}
              </h2>
              <p className="text-sm text-gray-600">
                {t.pages.dailyLife.dailyShareDesc}
              </p>
            </div>
            {/* 卡片在右邊，可以橫向滾動 (移動端在下方) */}
            <div className="flex-1 w-full md:w-auto overflow-x-auto scrollbar-hide">
              {sortedDailyShare.length > 0 ? (
                <div className="flex gap-4 sm:gap-6 pb-4">
                  {sortedDailyShare.map((item) => (
                    <div key={item.id} className="flex-shrink-0 w-72 sm:w-80">
                      <DailyLifeCard dailyLife={item} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic py-8">{language === 'zh' ? '還沒有日常分享' : 'No daily shares yet'}</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


