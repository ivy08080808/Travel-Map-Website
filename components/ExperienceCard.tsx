'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Experience } from '@/lib/data';

interface ExperienceCardProps {
  experience: Experience;
  isHovered?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
}

export default function ExperienceCard({ experience, isHovered = false, onHoverChange }: ExperienceCardProps) {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [lineClamp, setLineClamp] = useState<number>(3);
  const [isMobile, setIsMobile] = useState(false);
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

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onHoverChange?.(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // 点击背景关闭
    if (e.target === e.currentTarget) {
      onHoverChange?.(false);
    }
  };

  // 检测是否为移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 檢測文本實際行數並動態調整 line-clamp
  useEffect(() => {
    if (!descriptionRef.current || !experience.description || isHovered) return;

    const checkTextOverflow = () => {
      const element = descriptionRef.current;
      if (!element) return;

      // 創建一個臨時元素來測量實際文本高度
      const tempElement = document.createElement('div');
      const styles = window.getComputedStyle(element);
      
      // 複製所有相關樣式到臨時元素
      tempElement.style.position = 'absolute';
      tempElement.style.visibility = 'hidden';
      tempElement.style.width = styles.width;
      tempElement.style.fontSize = styles.fontSize;
      tempElement.style.fontFamily = styles.fontFamily;
      tempElement.style.fontWeight = styles.fontWeight;
      tempElement.style.lineHeight = styles.lineHeight;
      tempElement.style.padding = styles.padding;
      tempElement.style.boxSizing = styles.boxSizing;
      tempElement.style.whiteSpace = 'normal';
      tempElement.style.wordWrap = 'break-word';
      tempElement.textContent = experience.description || '';
      
      document.body.appendChild(tempElement);
      
      // 獲取單行高度（測量單行文本高度，這樣最準確）
      // 使用一個足夠寬的測試字符串來確保只佔一行
      tempElement.textContent = 'M';
      const oneLineHeight = tempElement.scrollHeight;
      
      // 恢復完整文本
      tempElement.textContent = experience.description || '';
      const fullHeight = tempElement.scrollHeight;
      
      // 計算實際行數
      const actualLines = Math.ceil(fullHeight / oneLineHeight);
      
      // 清理臨時元素
      document.body.removeChild(tempElement);
      
      // 根據實際行數設置 line-clamp
      // 如果實際行數 ≤ 3行，line-clamp = 實際行數
      // 如果實際行數 > 3行，line-clamp = 3
      if (actualLines <= 3) {
        setLineClamp(actualLines);
      } else {
        setLineClamp(3);
      }
    };

    // 延遲執行以確保 DOM 已渲染
    const timeoutId = setTimeout(checkTextOverflow, 100);
    
    // 監聽窗口大小變化
    window.addEventListener('resize', checkTextOverflow);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkTextOverflow);
    };
  }, [experience.description, isHovered]);

  return (
    <>
      {/* Placeholder to maintain layout when card floats */}
      <div 
        className={isHovered ? 'opacity-0' : 'opacity-100 h-full flex flex-col'}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
          {experience.coverImage && (
            <div className="relative h-48 w-full flex-shrink-0">
              <Image
                src={experience.coverImage}
                alt={experience.title || experience.role || 'Experience'}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-6 flex flex-col flex-grow">
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
              <p 
                ref={descriptionRef}
                className="text-gray-600 mb-4 flex-grow overflow-hidden"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: lineClamp,
                  WebkitBoxOrient: 'vertical',
                  lineClamp: lineClamp,
                }}
              >
                {experience.description}
              </p>
            )}
            {experience.skills && experience.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-auto">
                {experience.skills.slice(0, 2).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {skill}
                  </span>
                ))}
                {experience.skills.length > 2 && (
                  <span className="px-2 py-1 text-xs text-gray-500">
                    +{experience.skills.length - 2} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating card in center when hovered */}
      {isHovered && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          {/* 背景遮罩層：只負責變暗 + blur 背後 */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-md"
            onClick={handleBackdropClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />

          {/* 這層用來做「可捲時仍置中」 */}
          <div 
            className={`relative z-[101] flex min-h-full items-center justify-center ${
              isMobile ? 'pt-12 pb-4 px-4' : 'p-4'
            }`}
            onClick={handleBackdropClick}
          >
            <div
              className={`bg-white rounded-lg shadow-2xl max-w-4xl w-full overflow-y-auto ${
                isMobile 
                  ? 'max-h-[calc(100vh-4rem)] mt-8' 
                  : 'max-h-[calc(100vh-2rem)]'
              }`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 关闭按钮 */}
              <div className="sticky top-0 z-10 flex justify-end p-2 bg-white rounded-t-lg border-b border-gray-100">
                <button
                  onClick={handleClose}
                  className="p-1 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  aria-label="Close"
                >
                  <svg 
                    className="w-5 h-5 text-gray-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              </div>

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
              <div className={`${isMobile ? 'p-4' : 'p-8'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {experience.role && (
                      <h3 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-2`}>
                        {experience.role}
                      </h3>
                    )}
                    {experience.organization && (
                      <p className={`${isMobile ? 'text-lg' : 'text-xl'} text-gray-700 mb-2`}>
                        {experience.organization}
                      </p>
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
                    <p className={`text-gray-700 whitespace-pre-wrap leading-relaxed ${isMobile ? 'text-base' : 'text-lg'}`}>
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
        </div>
      )}
    </>
  );
}

