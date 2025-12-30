'use client';

import { dailyLife } from '@/lib/data';
import DailyLifeCard from '@/components/DailyLifeCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n';

export default function DailyLifePage() {
  const { language } = useLanguage();
  const t = translations[language];

  // Sort daily life by date (newest first)
  const sortedDailyLife = [...dailyLife].sort((a, b) => {
    return b.date.localeCompare(a.date);
  });

  // Filter by category
  const readingNotes = sortedDailyLife.filter(item => item.category === 'reading');
  const dailyShare = sortedDailyLife.filter(item => item.category === 'daily' || !item.category);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
          {t.pages.dailyLife.title}
        </h1>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          {t.pages.dailyLife.description}
        </p>

        {/* Reading Notes Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.pages.dailyLife.readingNotes}
          </h2>
          <p className="text-gray-600 mb-8">
            {t.pages.dailyLife.readingNotesDesc}
          </p>
          {readingNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {readingNotes.map((item) => (
                <DailyLifeCard key={item.id} dailyLife={item} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">{language === 'zh' ? '還沒有讀書心得' : 'No reading notes yet'}</p>
          )}
        </section>

        {/* Daily Share Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.pages.dailyLife.dailyShare}
          </h2>
          <p className="text-gray-600 mb-8">
            {t.pages.dailyLife.dailyShareDesc}
          </p>
          {dailyShare.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dailyShare.map((item) => (
                <DailyLifeCard key={item.id} dailyLife={item} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">{language === 'zh' ? '還沒有日常分享' : 'No daily shares yet'}</p>
          )}
        </section>
      </div>
    </div>
  );
}


