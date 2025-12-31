'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DailyLifeContentProps {
  id: string;
  defaultContent: string | null;
}

export default function DailyLifeContent({ id, defaultContent }: DailyLifeContentProps) {
  const { language } = useLanguage();
  const [content, setContent] = useState<string | null>(defaultContent);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        // 嘗試獲取語言特定版本的內容
        const response = await fetch(`/api/daily-life/${id}/content?lang=${language}`);
        if (response.ok) {
          const data = await response.json();
          setContent(data.content);
        } else {
          // 如果獲取失敗，使用默認內容
          setContent(defaultContent);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        setContent(defaultContent);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [id, language, defaultContent]);

  if (isLoading) {
    return (
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-500">{language === 'zh' ? '載入中...' : 'Loading...'}</p>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <div
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

