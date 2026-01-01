'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Experience, Travelogue, DailyLife } from '@/lib/data';
import { convertCloudinaryUrlToWebFormat } from '@/lib/cloudinary';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n';

interface HomeSectionPreviewProps {
  title: string;
  description: string;
  link: string;
  linkText?: string;
  // 可以是 Experience, Travelogue, 或 DailyLife
  item?: Experience | Travelogue | DailyLife | null;
  isLoading?: boolean;
}

export default function HomeSectionPreview({
  title,
  description,
  link,
  linkText,
  item,
  isLoading = false,
}: HomeSectionPreviewProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const displayLinkText = linkText || (language === 'zh' ? '探索更多' : 'Discover more');

  // State for dynamic data from MongoDB
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [dynamicTitle, setDynamicTitle] = useState<string | null>(null);
  const [dynamicDescription, setDynamicDescription] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  // 判断类型：Experience 有 organization 或 role 字段
  const isExperience = (item: any): item is Experience => {
    return item && ('organization' in item || 'role' in item || 'type' in item);
  };

  // 判断是否是 Travelogue
  // Travelogue 有 route 字段，但没有 category 字段
  const isTravelogue = (item: any): item is Travelogue => {
    return item && 'id' in item && 'route' in item && !isExperience(item) && !('category' in item) && !('author' in item);
  };

  // 判断是否是 DailyLife
  // DailyLife 可能有 category 或 author 字段
  const isDailyLife = (item: any): item is DailyLife => {
    return item && 'id' in item && ('category' in item || 'author' in item || (item.route && item.route.startsWith('/daily-life')));
  };

  // Fetch dynamic data from MongoDB for Travelogue or DailyLife
  useEffect(() => {
    if (!item || isExperience(item)) {
      return; // Experience doesn't need MongoDB fetch
    }

    setIsFetching(true);
    
    if (isTravelogue(item)) {
      // Fetch Travelogue data
      const travelogueItem = item as Travelogue;
      fetch(`/api/travelogues/${travelogueItem.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            if (data.coverImage) setCoverImage(data.coverImage);
            if (data.title) setDynamicTitle(data.title);
            if (data.description) setDynamicDescription(data.description);
          }
          setIsFetching(false);
        })
        .catch(() => {
          setIsFetching(false);
        });
    } else if (isDailyLife(item)) {
      // Fetch DailyLife data
      const dailyLifeItem = item as DailyLife;
      fetch(`/api/daily-life/${dailyLifeItem.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            if (data.coverImage) setCoverImage(data.coverImage);
            if (data.title) setDynamicTitle(data.title);
            if (data.description) setDynamicDescription(data.description);
          }
          setIsFetching(false);
        })
        .catch(() => {
          setIsFetching(false);
        });
    }
  }, [item]);

  // 获取封面图片
  const getCoverImage = () => {
    if (!item) return null;
    
    // Experience
    if (isExperience(item)) {
      return item.coverImage || null;
    }
    
    // Travelogue 或 DailyLife - 优先使用 MongoDB 数据
    const image = coverImage || (item as Travelogue | DailyLife).coverImage;
    if (!image) return null;
    
    // Check if it's a Cloudinary URL or local path
    const isCloudinaryUrl = image.startsWith('http') || image.includes('cloudinary');
    if (isCloudinaryUrl) {
      return convertCloudinaryUrlToWebFormat(image);
    }
    return image.startsWith('/') ? image : `/images/${image}`;
  };

  // 获取标题
  const getTitle = () => {
    if (!item) return null;
    
    if (isExperience(item)) {
      return item.role || item.title || item.organization || null;
    }
    
    // 优先使用 MongoDB 数据
    return dynamicTitle || (item as Travelogue | DailyLife).title;
  };

  // 获取描述
  const getDescription = () => {
    if (!item) return null;
    
    // 优先使用 MongoDB 数据
    return dynamicDescription || (item as Experience | Travelogue | DailyLife).description;
  };

  const displayCoverImage = getCoverImage();
  const itemTitle = getTitle();
  const itemDescription = getDescription();

  if (isLoading || isFetching) {
    return (
      <section className="bg-[#F9FAFB] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-500">{language === 'zh' ? '載入中...' : 'Loading...'}</div>
          </div>
        </div>
      </section>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <section className="bg-[#F9FAFB] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 - 与 Hero 对齐 */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-500" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
            {title}
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
            {description}
          </p>
        </div>

        {/* 移动端：垂直布局 */}
        <div className="md:hidden space-y-6">
          {/* 图片 */}
          {displayCoverImage && (
            <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={displayCoverImage}
                alt={itemTitle || title}
                fill
                className="object-cover"
                unoptimized={displayCoverImage.includes('cloudinary') || displayCoverImage.startsWith('http')}
              />
            </div>
          )}
          
          {/* 文字内容 */}
          <div className="space-y-4">
            <div>
              {itemTitle && (
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {itemTitle}
                </h3>
              )}
              {itemDescription && (
                <p className="text-lg text-gray-600 leading-relaxed mb-6" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                  {itemDescription}
                </p>
              )}
            </div>
            <Link
              href={link}
              className="inline-block text-gray-900 hover:text-gray-700 font-medium border-b-2 border-gray-900 hover:border-gray-700 transition-colors"
            >
              {displayLinkText} →
            </Link>
          </div>
        </div>

        {/* 桌面端：左右布局 */}
        <div className="hidden md:flex items-center gap-12 lg:gap-16">
          {/* 左侧：图片 */}
          {displayCoverImage && (
            <div className="flex-1 relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={displayCoverImage}
                alt={itemTitle || title}
                fill
                className="object-cover"
                unoptimized={displayCoverImage.includes('cloudinary') || displayCoverImage.startsWith('http')}
              />
            </div>
          )}
          
          {/* 右侧：文字内容 */}
          <div className="flex-1 space-y-6">
            <div>
              {itemTitle && (
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  {itemTitle}
                </h3>
              )}
              {itemDescription && (
                <p className="text-xl text-gray-600 leading-relaxed mb-8" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
                  {itemDescription}
                </p>
              )}
            </div>
            <Link
              href={link}
              className="inline-block text-gray-900 hover:text-gray-700 font-medium border-b-2 border-gray-900 hover:border-gray-700 transition-colors text-lg"
            >
              {displayLinkText} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

