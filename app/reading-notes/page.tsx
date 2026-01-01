'use client';

import { useState, useEffect } from 'react';
import { DailyLife } from '@/lib/data';
import DailyLifeCard from '@/components/DailyLifeCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n';

export default function ReadingNotesPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [readingNotes, setReadingNotes] = useState<DailyLife[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReadingNotes();
  }, []);

  const fetchReadingNotes = async () => {
    try {
      const response = await fetch('/api/daily-life');
      if (response.ok) {
        const data = await response.json();
        // Filter only reading notes
        const filtered = data.filter((item: DailyLife) => item.category === 'reading');
        setReadingNotes(filtered);
      }
    } catch (error) {
      console.error('Error fetching reading notes:', error);
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
          {t.pages.dailyLife.readingNotes}
        </h1>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          {t.pages.dailyLife.readingNotesDesc}
        </p>

        {/* Reading Notes Cards */}
        {readingNotes.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            {readingNotes.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-80">
                <DailyLifeCard dailyLife={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 italic text-lg">
              {language === 'zh' ? '還沒有讀書心得' : 'No reading notes yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

