'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Experience } from '@/lib/data';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    } catch {
      return dateString;
    }
  };

  const dateRange = experience.startDate
    ? (experience.endDate
        ? `${formatDate(experience.startDate)} - ${formatDate(experience.endDate)}`
        : `${formatDate(experience.startDate)} - Present`)
    : '';

  const typeLabels: Record<string, string> = {
    internship: '實習',
    volunteer: '志工',
    selection: '徵選選上',
    other: '其他',
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background overlay when hovered */}
      {isHovered && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Card */}
      <div className="bg-white rounded-lg shadow-md overflow-visible hover:shadow-lg transition-all relative z-50">
        {experience.coverImage && (
          <div className="relative h-48 w-full">
            <Image
              src={experience.coverImage}
              alt={experience.title || experience.role || 'Experience'}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              {experience.role && (
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {experience.role}
                </h3>
              )}
              {experience.organization && (
                <p className="text-lg text-gray-700 mb-2">{experience.organization}</p>
              )}
              {experience.location && (
                <p className="text-sm text-gray-500 mb-2">{experience.location}</p>
              )}
            </div>
          </div>
          {experience.startDate && (
            <p className="text-sm text-gray-500 mb-3">{dateRange}</p>
          )}
          {experience.description && (
            <div className="mb-4 relative">
              {!isHovered ? (
                <p className="text-gray-600 line-clamp-3">{experience.description}</p>
              ) : (
                <div 
                  className="absolute bg-white rounded-lg shadow-2xl p-8 z-[60] border border-gray-200 transition-all duration-300"
                  style={{
                    width: 'min(calc(100vw - 4rem), 900px)',
                    left: '50%',
                    transform: 'translateX(-50%) translateY(-20px)',
                    top: '100%',
                    marginTop: '12px',
                    maxHeight: '60vh',
                    overflowY: 'auto',
                  }}
                >
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
                    {experience.description}
                  </p>
                </div>
              )}
            </div>
          )}
          {experience.skills && experience.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {experience.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                >
                  {skill}
                </span>
              ))}
              {experience.skills.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-500">
                  +{experience.skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

