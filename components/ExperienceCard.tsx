'use client';

import Image from 'next/image';
import { Experience } from '@/lib/data';

interface ExperienceCardProps {
  experience: Experience;
  isHovered?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
}

export default function ExperienceCard({ experience, isHovered = false, onHoverChange }: ExperienceCardProps) {
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

  const handleMouseEnter = () => {
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    onHoverChange?.(false);
  };

  return (
    <>
      {/* Placeholder to maintain layout when card floats */}
      <div 
        className={isHovered ? 'opacity-0' : 'opacity-100'}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
              <p className="text-gray-600 line-clamp-3 mb-4">{experience.description}</p>
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

      {/* Floating card in center when hovered */}
      {isHovered && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto pointer-events-auto"
          >
            {experience.coverImage && (
              <div className="relative h-64 w-full">
                <Image
                  src={experience.coverImage}
                  alt={experience.title || experience.role || 'Experience'}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
            )}
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {experience.role && (
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {experience.role}
                    </h3>
                  )}
                  {experience.organization && (
                    <p className="text-xl text-gray-700 mb-2">{experience.organization}</p>
                  )}
                  {experience.location && (
                    <p className="text-base text-gray-500 mb-2">{experience.location}</p>
                  )}
                </div>
              </div>
              {experience.startDate && (
                <p className="text-base text-gray-500 mb-4">{dateRange}</p>
              )}
              {experience.description && (
                <div className="mb-6">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
                    {experience.description}
                  </p>
                </div>
              )}
              {experience.skills && experience.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {experience.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

