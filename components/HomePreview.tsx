'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Experience, DailyLife } from '@/lib/data';
import { travelogues, Travelogue } from '@/lib/data';
import ExperienceCard from './ExperienceCard';
import TravelogueCard from './TravelogueCard';
import DailyLifeCard from './DailyLifeCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n';

export default function HomePreview() {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [dailyLifeItems, setDailyLifeItems] = useState<DailyLife[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch Experience
      const experienceResponse = await fetch('/api/experience');
      if (experienceResponse.ok) {
        const experienceData = await experienceResponse.json();
        setExperiences(experienceData);
      }

      // Fetch Daily Life
      const dailyLifeResponse = await fetch('/api/daily-life');
      if (dailyLifeResponse.ok) {
        const dailyLifeData = await dailyLifeResponse.json();
        setDailyLifeItems(dailyLifeData);
      }
    } catch (error) {
      console.error('Error fetching preview data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get latest 3 items for each category
  const latestExperiences = experiences.slice(0, 3);
  const latestTravelogues = [...travelogues]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);
  const latestDailyLife = [...dailyLifeItems]
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.localeCompare(a.date);
    })
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Experience Preview */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t.pages.experience.title}
              </h2>
              <Link
                href="/experience"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap"
              >
                {language === 'zh' ? '查看更多 →' : 'View All →'}
              </Link>
            </div>
            <div className="flex-1 space-y-4">
              {latestExperiences.length > 0 ? (
                latestExperiences.map((experience) => (
                  <div key={experience.id} className="h-full">
                    <ExperienceCard experience={experience} />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {language === 'zh' ? '還沒有經歷' : 'No experiences yet'}
                </div>
              )}
            </div>
          </div>

          {/* Travelogues Preview */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t.pages.travelogues.title}
              </h2>
              <Link
                href="/Travelogues"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap"
              >
                {language === 'zh' ? '查看更多 →' : 'View All →'}
              </Link>
            </div>
            <div className="flex-1 space-y-4">
              {latestTravelogues.length > 0 ? (
                latestTravelogues.map((travelogue) => (
                  <div key={travelogue.id} className="h-full">
                    <TravelogueCard travelogue={travelogue} />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {language === 'zh' ? '還沒有遊記' : 'No travelogues yet'}
                </div>
              )}
            </div>
          </div>

          {/* Daily Life Preview */}
          <div className="flex flex-col md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t.pages.dailyLife.title}
              </h2>
              <Link
                href="/daily-life"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap"
              >
                {language === 'zh' ? '查看更多 →' : 'View All →'}
              </Link>
            </div>
            <div className="flex-1 space-y-4">
              {latestDailyLife.length > 0 ? (
                latestDailyLife.map((item) => (
                  <div key={item.id} className="h-full">
                    <DailyLifeCard dailyLife={item} />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {language === 'zh' ? '還沒有日常分享' : 'No daily life entries yet'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

