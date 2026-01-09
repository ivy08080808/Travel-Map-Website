'use client';

import { useRef, useEffect, useState } from 'react';
import { Experience } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { convertCloudinaryUrlToWebFormat } from '@/lib/cloudinary';

interface ExperienceCarouselProps {
  experiences: Experience[];
  title: string;
  description: string;
}

export default function ExperienceCarousel({ experiences, title, description }: ExperienceCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [cardLeft, setCardLeft] = useState(0);
  const [cardTop, setCardTop] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const calculatePosition = () => {
      if (!titleRef.current || !containerRef.current) return;

      const titleRect = titleRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const mobile = viewportWidth < 768;
      setIsMobile(mobile);

      // 🎯 Y：對齊標題文字頂端，往上調 100px (移動端減少)
      const topOffset = mobile ? -60 : -100;
      setCardTop(titleRect.top - containerRect.top + topOffset);

      // 🎯 X：響應式左邊距和右邊距
      if (mobile) {
        // 移動端：使用容器的實際寬度，確保不超出邊界
        const containerPadding = 16; // px-4 = 16px
        const CARD_WIDTH = containerRect.width - (containerPadding * 2);
        setCardWidth(CARD_WIDTH);
        // 左對齊，考慮容器的 padding
        setCardLeft(containerPadding);
      } else {
        // 桌面端：左邊向右移動 30% viewport，右邊保持 10% viewport
        const LEFT_OFFSET = viewportWidth * 0.3;
        const RIGHT_MARGIN = viewportWidth * 0.1;
        const CARD_WIDTH = viewportWidth - LEFT_OFFSET - RIGHT_MARGIN;
        setCardWidth(CARD_WIDTH);
        // 计算相对于容器的 left 位置
        const absoluteLeft = LEFT_OFFSET;
        setCardLeft(absoluteLeft - containerRect.left);
      }
    };

    // 延遲，確保字體與 layout 穩定
    const timeoutId = setTimeout(calculatePosition, 100);
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
    };
  }, []);
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    } catch {
      return dateString;
    }
  };

  if (experiences.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#F9FAFB] pt-12 sm:pt-16 md:pt-24 pb-2 md:pb-4 relative">
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* 标题区域 - 在左侧，z-index 高，确保在卡片前方 */}
        <div className="relative z-30">
          <div className="flex-shrink-0">
            <h2 
              ref={titleRef}
              className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-500" 
              style={{ fontFamily: 'Times New Roman, Times, serif' }}
            >
              {title}
            </h2>
            <Link
              href="/experience"
              className="inline-block text-gray-900 hover:text-gray-700 font-medium border-b-2 border-gray-900 hover:border-gray-700 transition-colors mt-3 sm:mt-4 text-sm sm:text-base"
              style={{ fontFamily: 'Times New Roman, Times, serif' }}
            >
              Discover more →
            </Link>
          </div>
        </div>

        {/* 横向滚动容器 - 绝对定位，在标题后方（z-index 低） */}
        <div className="relative w-full" style={{ minHeight: '170px' }}>
          {/* 卡片容器 - 最底层（z-0），宽度为屏幕宽度 2/3，y 轴与标题顶部对齐 */}
          {cardWidth > 0 && (
            <div 
              className="absolute z-0 transition-all duration-300"
              style={{
                left: `${cardLeft}px`,
                width: `${cardWidth}px`,
                top: `${cardTop}px`,
              }}
            >
              {/* 左侧渐变遮罩 - 響應式寬度，z-10，在卡片上方 */}
              <div
                className="absolute inset-y-0 left-0 z-10 pointer-events-none"
                style={{
                  width: isMobile ? '60px' : '120px',
                  background: 'linear-gradient(to right, rgba(249, 250, 251, 1) 0%, rgba(249, 250, 251, 0) 100%)',
                }}
              />

              {/* 右侧渐变遮罩 - 響應式寬度，z-10，在卡片上方 */}
              <div
                className="absolute inset-y-0 right-0 z-10 pointer-events-none"
                style={{
                  width: isMobile ? '60px' : '120px',
                  background: 'linear-gradient(to left, rgba(249, 250, 251, 1) 0%, rgba(249, 250, 251, 0) 100%)',
                }}
              />

              {/* 卡片滚动容器 */}
              <div 
                className="overflow-x-auto scrollbar-hide"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <div className={`flex ${isMobile ? 'gap-4' : 'gap-6'}`} style={{ width: 'max-content' }}>
                  {experiences.map((experience) => {
                    const dateRange = experience.startDate
                      ? (experience.endDate
                          ? `${formatDate(experience.startDate)} - ${formatDate(experience.endDate)}`
                          : `${formatDate(experience.startDate)} - Present`)
                      : '';

                    const displayCoverImage = experience.coverImage;
                    const isCloudinaryUrl = displayCoverImage?.startsWith('http') || displayCoverImage?.includes('cloudinary');
                    const imageUrl = displayCoverImage
                      ? (isCloudinaryUrl
                          ? convertCloudinaryUrlToWebFormat(displayCoverImage)
                          : displayCoverImage.startsWith('/')
                          ? displayCoverImage
                          : `/images/${displayCoverImage}`)
                      : null;

                    return (
                      <div
                        key={experience.id}
                        className="flex-shrink-0 bg-white rounded-lg shadow-md overflow-hidden"
                        style={{ width: isMobile ? '280px' : '400px' }}
                      >
                        {imageUrl && (
                          <div className={`relative w-full ${isMobile ? 'h-48' : 'h-64'}`}>
                            <Image
                              src={imageUrl}
                              alt={experience.role || experience.title || 'Experience'}
                              fill
                              className="object-cover"
                              unoptimized={isCloudinaryUrl}
                            />
                          </div>
                        )}
                        <div className={isMobile ? 'p-4' : 'p-6'}>
                          {experience.role && (
                            <h3 className={`font-bold text-gray-900 mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                              {experience.role}
                            </h3>
                          )}
                          {experience.organization && (
                            <p className={`text-gray-700 mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>{experience.organization}</p>
                          )}
                          {dateRange && (
                            <p className="text-sm text-gray-500 mb-2">{dateRange}</p>
                          )}
                          {experience.description && (
                            <p className={`text-gray-600 line-clamp-3 mb-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                              {experience.description}
                            </p>
                          )}
                          <Link
                            href={`/experience#${experience.id}`}
                            className={`inline-block text-gray-900 hover:text-gray-700 font-medium border-b-2 border-gray-900 hover:border-gray-700 transition-colors ${isMobile ? 'text-xs' : 'text-sm'}`}
                          >
                            Discover more
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

