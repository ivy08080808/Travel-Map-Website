'use client';

import { useState, useEffect } from 'react';
import { Experience, DailyLife, Travelogue, travelogues } from '@/lib/data';
import HomeSectionPreview from './HomeSectionPreview';
import ExperienceCarousel from './ExperienceCarousel';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n';

export default function HomeSections() {
  const { language } = useLanguage();
  const t = translations[language];

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [latestTravelogue, setLatestTravelogue] = useState<Travelogue | null>(null);
  const [latestReadingNote, setLatestReadingNote] = useState<DailyLife | null>(null);
  const [latestDailyShare, setLatestDailyShare] = useState<DailyLife | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch Experience - 获取所有 experiences
      const experienceResponse = await fetch('/api/experience');
      if (experienceResponse.ok) {
        const experienceData = await experienceResponse.json();
        if (experienceData && experienceData.length > 0) {
          setExperiences(experienceData); // 所有 experiences
        }
      }

      // Fetch Travelogues (from static data)
      const sortedTravelogues = [...travelogues]
        .sort((a, b) => b.date.localeCompare(a.date));
      if (sortedTravelogues.length > 0) {
        setLatestTravelogue(sortedTravelogues[0]);
      }

      // Fetch Daily Life (Reading Notes and Daily Share)
      const dailyLifeResponse = await fetch('/api/daily-life');
      if (dailyLifeResponse.ok) {
        const dailyLifeData = await dailyLifeResponse.json();
        
        // Filter Reading Notes
        const readingNotes = dailyLifeData.filter((item: DailyLife) => item.category === 'reading');
        if (readingNotes.length > 0) {
          setLatestReadingNote(readingNotes[0]);
        }
        
        // Filter Daily Share
        const dailyShare = dailyLifeData.filter(
          (item: DailyLife) => item.category === 'daily' || !item.category
        );
        // Sort by date
        const sortedDailyShare = dailyShare.sort((a: DailyLife, b: DailyLife) => {
          if (!a.date && !b.date) return 0;
          if (!a.date) return 1;
          if (!b.date) return -1;
          return b.date.localeCompare(a.date);
        });
        if (sortedDailyShare.length > 0) {
          setLatestDailyShare(sortedDailyShare[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching preview data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Experience Section - 横向卡片布局 */}
      {experiences.length > 0 && (
        <ExperienceCarousel
          experiences={experiences}
          title={t.pages.experience.title}
          description={t.pages.experience.description}
        />
      )}

      {/* Travelogues Section */}
      {latestTravelogue && (
        <HomeSectionPreview
          title={t.pages.travelogues.title}
          description={t.pages.travelogues.description}
          link="/Travelogues"
          item={latestTravelogue}
          isLoading={isLoading}
        />
      )}

      {/* Reading Notes Section */}
      {latestReadingNote && (
        <HomeSectionPreview
          title={t.pages.dailyLife.readingNotes}
          description={t.pages.dailyLife.readingNotesDesc}
          link="/reading-notes"
          item={latestReadingNote}
          isLoading={isLoading}
        />
      )}

      {/* Daily Share Section */}
      {latestDailyShare && (
        <HomeSectionPreview
          title={t.pages.dailyLife.dailyShare}
          description={t.pages.dailyLife.dailyShareDesc}
          link="/daily-share"
          item={latestDailyShare}
          isLoading={isLoading}
        />
      )}
    </>
  );
}


