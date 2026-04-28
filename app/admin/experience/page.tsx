'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Experience } from '@/lib/data';

function ExperienceAdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') as 'work' | 'exchange' | null;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState<'work' | 'exchange'>(categoryParam || 'work');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setFilterCategory(categoryParam);
    }
  }, [categoryParam]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/session', {
        credentials: 'include',
      });
      if (response.ok) {
        setIsAuthenticated(true);
        fetchExperiences();
      } else {
        setIsAuthenticated(false);
        router.push('/admin');
      }
    } catch (error) {
      setIsAuthenticated(false);
      router.push('/admin');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/admin/experience');
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      } else {
        setError('Failed to load experiences');
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setError('Failed to load experiences');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這個經驗嗎？')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/experience/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchExperiences();
      } else {
        alert('刪除失敗');
      }
    } catch (error) {
      alert('刪除失敗');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">管理 Experience</h1>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              返回管理面板
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {filterCategory === 'work' ? '管理工作經驗' : '管理交換經驗'}
            </h2>
            <div className="flex gap-2">
              <Link
                href="/admin/experience?category=work"
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filterCategory === 'work'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                工作經驗
              </Link>
              <Link
                href="/admin/experience?category=exchange"
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filterCategory === 'exchange'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                交換經驗
              </Link>
              <Link
                href={`/admin/experience/new?category=${filterCategory}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                新增 {filterCategory === 'work' ? '工作經驗' : '交換經驗'}
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Filter experiences */}
          {(() => {
            const filteredExperiences = experiences.filter(exp => {
              if (filterCategory === 'work') return exp.category === 'work' || !exp.category;
              if (filterCategory === 'exchange') return exp.category === 'exchange';
              return false;
            });

            if (filteredExperiences.length === 0) {
              return (
                <div className="text-center py-8 text-gray-500">
                  {filterCategory === 'work' ? '還沒有工作經驗' : '還沒有交換經驗'}
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExperiences.map((experience) => (
                  <div
                    key={experience.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        {experience.role && (
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {experience.role}
                          </h3>
                        )}
                        {experience.organization && (
                          <p className="text-sm text-gray-600 mb-2">{experience.organization}</p>
                        )}
                        {experience.startDate && (
                          <p className="text-xs text-gray-500 mb-1">
                            {experience.startDate} {experience.endDate ? `- ${experience.endDate}` : '- Present'}
                          </p>
                        )}
                      </div>
                      {experience.category && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {experience.category === 'work' ? '工作' : '交換'}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Link
                        href={`/admin/experience/${experience.id}`}
                        className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 text-center"
                      >
                        編輯
                      </Link>
                      <button
                        onClick={() => handleDelete(experience.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

export default function ExperienceAdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">載入中...</div>
      </div>
    }>
      <ExperienceAdminContent />
    </Suspense>
  );
}

