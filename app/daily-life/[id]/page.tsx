import { dailyLife } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { promises as fs } from 'fs';
import path from 'path';
import { getDb } from '@/lib/mongodb';
import { convertCloudinaryUrlToWebFormat } from '@/lib/cloudinary';
import DailyLifeContent from '@/components/DailyLifeContent';

export async function generateStaticParams() {
  // 在構建時，如果沒有 MongoDB URI，只返回 data.ts 中的項目
  if (!process.env.MONGODB_URI) {
    return dailyLife.map((item) => ({
      id: item.id,
    }));
  }

  try {
    const db = await getDb();
    const dbItems = await db.collection('dailyLife').find({}).toArray();
    const dbIds = dbItems.map(item => ({ id: item.id }));
    const staticIds = dailyLife.map(item => ({ id: item.id }));
    
    // 合併 data.ts 和 MongoDB 中的 ID
    const allIds = [...staticIds];
    dbIds.forEach(dbId => {
      if (!allIds.find(id => id.id === dbId.id)) {
        allIds.push(dbId);
      }
    });
    
    return allIds;
  } catch (error) {
    console.error('Error generating static params:', error);
    // 如果出錯，至少返回 data.ts 中的項目
    return dailyLife.map((item) => ({
      id: item.id,
    }));
  }
}

async function getDailyLifeData(id: string, language: 'en' | 'zh' = 'zh') {
  try {
    // 獲取封面圖片（從 MongoDB）
    let coverImage = null;
    let title = null;
    let description = null;
    let date = null;
    let author = null;
    let category = null;
    
    // 只有在有 MongoDB URI 時才嘗試連接
    if (process.env.MONGODB_URI) {
      try {
        const db = await getDb();
        const item = await db.collection('dailyLife').findOne({ id });
        if (item) {
          if (item.coverImage) coverImage = item.coverImage;
          if (item.title) title = item.title;
          if (item.description) description = item.description;
          if (item.date) date = item.date;
          if (item.author) author = item.author;
          if (item.category) category = item.category;
        }
      } catch (error) {
        console.error('Error fetching daily life data from MongoDB:', error);
      }
    }

    // 讀取 HTML 內容（從文件系統）- 優先讀取語言特定版本
    let content = null;
    try {
      // 先嘗試讀取語言特定版本（例如 daily-life-123.en.html）
      const langSpecificPath = path.join(
        process.cwd(),
        'content',
        'daily-life',
        `${id}.${language}.html`
      );
      try {
        content = await fs.readFile(langSpecificPath, 'utf-8');
      } catch (error: any) {
        // 如果語言特定版本不存在，嘗試讀取默認版本
        if (error.code === 'ENOENT') {
          const defaultPath = path.join(
            process.cwd(),
            'content',
            'daily-life',
            `${id}.html`
          );
          try {
            content = await fs.readFile(defaultPath, 'utf-8');
          } catch (defaultError: any) {
            if (defaultError.code !== 'ENOENT') {
              console.error('Error reading content file:', defaultError);
            }
          }
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      // 文件不存在是正常的，返回 null
      if (error.code !== 'ENOENT') {
        console.error('Error reading content file:', error);
      }
    }

    return {
      coverImage,
      title,
      description,
      date,
      author,
      category,
      content,
    };
  } catch (error) {
    console.error('Error fetching daily life data:', error);
    return {
      coverImage: null,
      title: null,
      description: null,
      date: null,
      author: null,
      category: null,
      content: null,
    };
  }
}

export default async function DailyLifeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // 先從 MongoDB 獲取數據（默認使用中文）
  const { coverImage, title, description, date, author, category, content } = await getDailyLifeData(params.id, 'zh');
  
  // 如果 MongoDB 中沒有，嘗試從 data.ts 獲取
  const item = dailyLife.find((d) => d.id === params.id);
  
  // 如果 MongoDB 和 data.ts 都沒有，返回 404
  if (!title && !item) {
    notFound();
  }

  // 優先使用 MongoDB 中的數據，否則使用 data.ts 中的默認值
  const displayCoverImage = coverImage || item?.coverImage || null;
  const displayTitle = title || item?.title || '';
  const displayDescription = description || item?.description || '';
  const displayDate = date || item?.date || null;
  const displayAuthor = author || (item as any)?.author || null;
  const displayCategory = category || item?.category || null;

  // Check if coverImage is a Cloudinary URL or local path
  const isCloudinaryUrl =
    displayCoverImage?.startsWith('http') ||
    displayCoverImage?.includes('cloudinary');
  const imageUrl = isCloudinaryUrl
    ? convertCloudinaryUrlToWebFormat(displayCoverImage) // Convert HEIC to JPG for web display
    : displayCoverImage?.startsWith('/')
    ? displayCoverImage
    : `/images/${displayCoverImage}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 封面圖片 - 放在最上面，無框框 */}
      <div className={`relative w-full bg-gray-200 ${displayCategory === 'reading' ? 'h-[80vh] min-h-[600px]' : 'h-[60vh] min-h-[500px]'}`}>
        {displayCoverImage ? (
          <Image
            src={imageUrl}
            alt={displayTitle}
            fill
            style={{ objectFit: displayCategory === 'reading' ? 'contain' : 'cover' }}
            className="opacity-50"
            unoptimized={isCloudinaryUrl}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600">
            <span className="text-white text-6xl font-bold opacity-50">
              {displayTitle.charAt(0)}
            </span>
          </div>
        )}
        {/* 標題疊加在圖片上，置中下方 */}
        <div className="absolute inset-0 flex items-end justify-center pb-12 opacity-50">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-2">
              {displayTitle}
            </h1>
            {displayCategory === 'reading' ? (
              displayAuthor ? (
                <span className="text-xl text-white/90 drop-shadow-md">
                  作者：{displayAuthor}
                </span>
              ) : null
            ) : (
              <span className="text-xl text-white/90 drop-shadow-md">
                {displayDate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 文章內容 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-lg p-8">
          <DailyLifeContent id={params.id} defaultContent={content} />
          {!content && (
            <div className="prose max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed">
                {displayDescription}
              </p>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}












