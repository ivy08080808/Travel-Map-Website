import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { dailyLife } from '@/lib/data';

// GET: 獲取所有 Daily Life（公開 API）
export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const dbItems = await db.collection('dailyLife').find({}).toArray();

    // 合併 MongoDB 中的數據和 data.ts 中的默認數據
    const existingIds = new Set(dbItems.map(item => item.id));
    const allItems = [
      // 先添加 data.ts 中的項目（如果 MongoDB 中有更新版本，會被覆蓋）
      ...dailyLife.map((item) => {
        const dbItem = dbItems.find((db) => db.id === item.id);
        if (dbItem) {
          return {
            ...item,
            ...dbItem,
            // 確保覆蓋 MongoDB 中的值
            title: dbItem.title || item.title,
            description: dbItem.description || item.description,
            date: dbItem.date || item.date,
            author: dbItem.author || null,
            category: dbItem.category || item.category || null,
            coverImage: dbItem.coverImage || item.coverImage,
          };
        }
        return item;
      }),
      // 添加只在 MongoDB 中的新項目（不在 data.ts 中）
      ...dbItems
        .filter(item => !dailyLife.find(dl => dl.id === item.id))
        .map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          date: item.date || null,
          author: item.author || null,
          category: item.category || null,
          coverImage: item.coverImage || null,
          route: item.route || `/daily-life/${item.id}`,
        }))
    ];

    return NextResponse.json(allItems);
  } catch (error: any) {
    console.error('Error fetching daily life:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch daily life' },
      { status: 500 }
    );
  }
}

