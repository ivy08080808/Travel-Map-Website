import { travelogues } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import { getDb } from '@/lib/mongodb';

export async function generateStaticParams() {
  return travelogues.map((travelogue) => ({
    id: travelogue.id,
  }));
}

async function getTravelogueData(id: string) {
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

    // 讀取 HTML 內容（從文件系統）
    let content = null;
    try {
      const filePath = path.join(
        process.cwd(),
        'content',
        'travelogues',
        `${id}.html`
      );
      content = await fs.readFile(filePath, 'utf-8');
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
    ? displayCoverImage
    : displayCoverImage?.startsWith('/')
    ? displayCoverImage
    : `/images/${displayCoverImage}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/Travelogues"
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Back to Travelogues
        </Link>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 封面圖片 */}
          <div className="relative h-96 w-full bg-gray-200">
            {displayCoverImage ? (
              <Image
                src={imageUrl}
                alt={travelogue.title}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-t-lg"
                unoptimized={isCloudinaryUrl}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-400 to-indigo-600">
                <span className="text-white text-6xl font-bold opacity-50">
                  {travelogue.title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-4xl font-bold text-gray-900">
                {travelogue.title}
              </h1>
              <span className="text-lg text-gray-500">{travelogue.date}</span>
            </div>

            {/* 文章內容 */}
            {content ? (
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="prose max-w-none">
                <p className="text-xl text-gray-700 leading-relaxed">
                  {travelogue.description}
                </p>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}

