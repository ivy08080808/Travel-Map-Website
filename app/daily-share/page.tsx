'use client';

import { useState, useEffect } from 'react';
import { DailyLife } from '@/lib/data';
import DailyLifeCard from '@/components/DailyLifeCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n';

export default function DailySharePage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [dailyShare, setDailyShare] = useState<DailyLife[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDailyShare();
  }, []);

  const fetchDailyShare = async () => {
    try {
      const response = await fetch('/api/daily-life');
      if (response.ok) {
        const data = await response.json();
        // Filter only daily share (category === 'daily' || !category)
        const filtered = data.filter((item: DailyLife) => item.category === 'daily' || !item.category);
        // Sort by date (newest first)
        const sorted = filtered.sort((a: DailyLife, b: DailyLife) => {
          if (!a.date && !b.date) return 0;
          if (!a.date) return 1;
          if (!b.date) return -1;
          return b.date.localeCompare(a.date);
        });
        setDailyShare(sorted);
      }
    } catch (error) {
      console.error('Error fetching daily share:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-gray-500">{language === 'zh' ? '載入中...' : 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
          {t.pages.dailyLife.dailyShare}
        </h1>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          {t.pages.dailyLife.dailyShareDesc}
        </p>

        {/* Daily Share Cards */}
        {dailyShare.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            {dailyShare.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-80">
                <DailyLifeCard dailyLife={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 italic text-lg">
              {language === 'zh' ? '還沒有日常分享' : 'No daily shares yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

