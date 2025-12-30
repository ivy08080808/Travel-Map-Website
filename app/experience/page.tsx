'use client';

import { useState, useEffect } from 'react';
import { Experience } from '@/lib/data';
import ExperienceCard from '@/components/ExperienceCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n';

export default function ExperiencePage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/experience');
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      } else {
        setError('Failed to load experiences');
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setError('Failed to load experiences');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Filter experiences by category
  let workExperiences = experiences.filter(exp => exp.category === 'work' || !exp.category);
  const exchangeExperiences = experiences.filter(exp => exp.category === 'exchange');

  // Custom sort for work experiences: HR intern before Team Manager
  workExperiences = workExperiences.sort((a, b) => {
    // Check if either is HR intern or Team Manager
    const aIsHR = a.role?.toLowerCase().includes('hr intern') || a.organization?.toLowerCase().includes('dreamore');
    const bIsHR = b.role?.toLowerCase().includes('hr intern') || b.organization?.toLowerCase().includes('dreamore');
    const aIsTeamManager = a.role?.toLowerCase().includes('team manager') || a.organization?.toLowerCase().includes('taipei medical');
    const bIsTeamManager = b.role?.toLowerCase().includes('team manager') || b.organization?.toLowerCase().includes('taipei medical');

    // If one is HR intern and the other is Team Manager, HR intern comes first
    if (aIsHR && bIsTeamManager) return -1;
    if (aIsTeamManager && bIsHR) return 1;

    // Otherwise, sort by startDate (newest first)
    const aDate = a.startDate || '';
    const bDate = b.startDate || '';
    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;
    return bDate.localeCompare(aDate);
  });

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Blurred background layer when card is hovered */}
      {hoveredCardId && (
        <div 
          className="fixed inset-0 z-40 backdrop-blur-sm pointer-events-none"
          style={{ WebkitBackdropFilter: 'blur(4px)', backdropFilter: 'blur(4px)' }}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-30">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
          {t.pages.experience.title}
        </h1>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          {t.pages.experience.description}
        </p>

        {/* Work Experience Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {language === 'zh' ? '工作經驗' : 'Work Experience'}
          </h2>
          <p className="text-gray-600 mb-8">
            {language === 'zh' 
              ? '我的工作經驗、實習和志工活動'
              : 'My work experience, internships, and volunteer activities'}
          </p>
          {workExperiences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workExperiences.map((experience) => (
                <ExperienceCard 
                  key={experience.id} 
                  experience={experience}
                  isHovered={hoveredCardId === experience.id}
                  onHoverChange={(isHovered) => setHoveredCardId(isHovered ? experience.id : null)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              {language === 'zh' ? '還沒有工作經驗' : 'No work experience yet'}
            </p>
          )}
        </section>

        {/* Exchange Experience Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {language === 'zh' ? '交換經驗' : 'Exchange Experience'}
          </h2>
          <p className="text-gray-600 mb-8">
            {language === 'zh' 
              ? '我的交換學生經驗'
              : 'My exchange student experiences'}
          </p>
          {exchangeExperiences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {exchangeExperiences.map((experience) => (
                <ExperienceCard 
                  key={experience.id} 
                  experience={experience}
                  isHovered={hoveredCardId === experience.id}
                  onHoverChange={(isHovered) => setHoveredCardId(isHovered ? experience.id : null)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              {language === 'zh' ? '還沒有交換經驗' : 'No exchange experience yet'}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

