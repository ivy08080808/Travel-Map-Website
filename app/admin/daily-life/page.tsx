'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DailyLife } from '@/lib/data';

function DailyLifeAdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') as 'daily' | 'reading' | null;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyLifeItems, setDailyLifeItems] = useState<DailyLife[]>([]);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState<'daily' | 'reading'>(categoryParam || 'daily');

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
        fetchDailyLife();
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

  const fetchDailyLife = async () => {
    try {
      const response = await fetch('/api/admin/daily-life');
      if (response.ok) {
        const data = await response.json();
        setDailyLifeItems(data);
      } else {
        setError('Failed to load daily life');
      }
    } catch (error) {
      console.error('Error fetching daily life:', error);
      setError('Failed to load daily life');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這個 Daily Life 嗎？')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/daily-life/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchDailyLife();
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
            <h1 className="text-2xl font-bold text-gray-900">管理 Daily Life</h1>
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
              {filterCategory === 'daily' ? '管理 Daily Share' : '管理 Reading Notes'}
            </h2>
            <div className="flex gap-2">
              <Link
                href="/admin/daily-life?category=daily"
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filterCategory === 'daily'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Daily Share
              </Link>
              <Link
                href="/admin/daily-life?category=reading"
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filterCategory === 'reading'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Reading Notes
              </Link>
              <Link
                href={`/admin/daily-life/new?category=${filterCategory}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                新增 {filterCategory === 'daily' ? 'Daily Share' : 'Reading Notes'}
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Filter daily life items */}
          {(() => {
            const filteredItems = dailyLifeItems.filter((item) => {
              if (filterCategory === 'daily') return item.category === 'daily' || !item.category;
              if (filterCategory === 'reading') return item.category === 'reading';
              return false;
            });

            if (filteredItems.length === 0) {
              return (
                <div className="text-center py-8 text-gray-500">
                  {filterCategory === 'daily' ? '還沒有 Daily Share' : '還沒有 Reading Notes'}
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        {item.category === 'reading' ? (
                          (item as any).author ? (
                            <p className="text-xs text-gray-500 mb-1">作者：{(item as any).author}</p>
                          ) : null
                        ) : (
                          <p className="text-xs text-gray-500 mb-1">{item.date}</p>
                        )}
                      </div>
                      {item.category && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {item.category === 'daily' ? 'Daily Share' : 'Reading Notes'}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Link
                        href={`/admin/daily-life/${item.id}`}
                        className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 text-center"
                      >
                        編輯
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
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

export default function DailyLifeAdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">載入中...</div>
      </div>
    }>
      <DailyLifeAdminContent />
    </Suspense>
  );
}

