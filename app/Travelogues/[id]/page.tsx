import { travelogues } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import { getDb } from '@/lib/mongodb';
import { convertCloudinaryUrlToWebFormat } from '@/lib/cloudinary';
import TravelogueContent from '@/components/TravelogueContent';

export async function generateStaticParams() {
  return travelogues.map((travelogue) => ({
    id: travelogue.id,
  }));
}

async function getTravelogueData(id: string, language: 'en' | 'zh' = 'zh') {
  try {
    // 獲取封面圖片（從 MongoDB）
    let coverImage = null;
    try {
      const db = await getDb();
      const travelogue = await db.collection('travelogues').findOne({ id });
      if (travelogue && travelogue.coverImage) {
        coverImage = travelogue.coverImage;
      }
    } catch (error) {
      console.error('Error fetching cover image from MongoDB:', error);
    }

    // 讀取 HTML 內容（從文件系統）- 優先讀取語言特定版本
    let content = null;
    try {
      // 先嘗試讀取語言特定版本（例如 kyoto-2024-07.en.html）
      const langSpecificPath = path.join(
        process.cwd(),
        'content',
        'travelogues',
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
            'travelogues',
            `${id}.html`
          );
          content = await fs.readFile(defaultPath, 'utf-8');
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
      content,
    };
  } catch (error) {
    console.error('Error fetching travelogue data:', error);
    return {
      coverImage: null,
      content: null,
    };
  }
}

export default async function TravelogueDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const travelogue = travelogues.find((t) => t.id === params.id);

  if (!travelogue) {
    notFound();
  }

  // 獲取動態數據
  const { coverImage, content } = await getTravelogueData(params.id);

  // 優先使用 MongoDB 中的封面圖片，否則使用 data.ts 中的默認值
  const displayCoverImage = coverImage || travelogue.coverImage;

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
      <div className="relative w-full h-[60vh] min-h-[500px] bg-gray-200">
        {displayCoverImage ? (
          <Image
            src={imageUrl}
            alt={travelogue.title}
            fill
            style={{ objectFit: 'cover' }}
            className="opacity-50"
            unoptimized={isCloudinaryUrl}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600">
            <span className="text-white text-6xl font-bold opacity-50">
              {travelogue.title.charAt(0)}
            </span>
          </div>
        )}
        {/* 標題疊加在圖片上，置中下方 */}
        <div className="absolute inset-0 flex items-end justify-center pb-12 opacity-50">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-2">
              {travelogue.title}
            </h1>
            <span className="text-xl text-white/90 drop-shadow-md">
              {travelogue.date}
            </span>
          </div>
        </div>
      </div>

      {/* 文章內容 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-lg p-8">
          <TravelogueContent id={params.id} defaultContent={content} />
          {!content && (
            <div className="prose max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed">
                {travelogue.description}
              </p>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

