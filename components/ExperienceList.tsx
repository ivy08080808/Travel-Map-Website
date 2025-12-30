'use client';

import { useState, useEffect } from 'react';
import { Experience } from '@/lib/data';
import ExperienceCard from './ExperienceCard';

interface ExperienceListProps {
  limit?: number;
}

export default function ExperienceList({ limit }: ExperienceListProps = {}) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="text-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const displayExperiences = limit ? experiences.slice(0, limit) : experiences;

  if (displayExperiences.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">No experiences yet.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {displayExperiences.map((experience) => (
        <ExperienceCard key={experience.id} experience={experience} />
      ))}
    </div>
  );
}


