'use client';

import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DailyLifeContentProps {
  id: string;
  defaultContent: string | null;
}

export default function DailyLifeContent({ id, defaultContent }: DailyLifeContentProps) {
  const { language } = useLanguage();
  const [content, setContent] = useState<string | null>(defaultContent);
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      // 只有在沒有現有內容時才顯示加載狀態
      setContent((currentContent) => {
        if (!currentContent) {
          setIsLoading(true);
        }
        return currentContent;
      });
      
      try {
        // 嘗試獲取語言特定版本的內容
        const response = await fetch(`/api/daily-life/${id}/content?lang=${language}`);
        if (response.ok) {
          const data = await response.json();
          // 只有當 API 返回實際內容時才更新，否則保持現有內容
          setContent((currentContent) => {
            if (data.content !== null && data.content !== undefined && data.content.trim() !== '') {
              return data.content;
            }
            // 如果 API 返回 null 或空，保持現有內容不變（永遠不清除現有內容）
            return currentContent || defaultContent;
          });
        } else {
          // 如果 API 請求失敗，保持現有內容不變
          setContent((currentContent) => currentContent || defaultContent);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        // 如果出錯，保持現有內容，只有在完全沒有內容時才使用 defaultContent
        setContent((currentContent) => currentContent || defaultContent);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [id, language, defaultContent]);

  // 當內容更新時，重新初始化 carousel
  useEffect(() => {
    if (content && contentRef.current) {
      // 檢查是否有 NTU carousel
      const carousel = contentRef.current.querySelector('#ntu-carousel-1 .slides-container');
      if (carousel) {
        // 延遲一下確保 DOM 已經渲染
        setTimeout(() => {
          // 觸發初始化（如果全局函數存在）
          if (typeof window !== 'undefined' && (window as any).ntuCarousel1Next) {
            // 重新初始化 carousel
            const initNtuCarousel = () => {
              const container = document.querySelector('#ntu-carousel-1 .slider-container');
              const slides = document.querySelector('#ntu-carousel-1 .slides-container');
              if (slides && container) {
                const width = container.offsetWidth || 600;
                const images = slides.querySelectorAll('.ntu-slide-img');
                images.forEach((img: any) => {
                  img.style.width = width + 'px';
                  img.style.height = '450px';
                  img.style.flexShrink = '0';
                  img.style.display = 'block';
                });
                // 重置到第一張
                (window as any).ntuCarousel1GoTo(0);
              }
            };
            initNtuCarousel();
          }
        }, 100);
      }
    }
  }, [content]);

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

  // 移除 script 標籤（因為 carousel 邏輯在 layout.tsx 的全局 script 中處理）
  const contentWithoutScripts = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  return (
    <div
      ref={contentRef}
      className="prose prose-lg max-w-none"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: contentWithoutScripts }}
    />
  );
}

