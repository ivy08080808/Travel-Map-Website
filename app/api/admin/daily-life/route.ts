import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { isAdmin } from '@/lib/auth';
import { dailyLife } from '@/lib/data';

// GET: 獲取所有 Daily Life（管理端）
export async function GET(request: NextRequest) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

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
            images: dbItem.images || null,
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
          images: item.images || null,
          route: item.route || `/daily-life/${item.id}`,
        }))
    ];

    // Sort by date (newest first)
    const sortedItems = allItems.sort((a, b) => {
      const aDate = a.date || '';
      const bDate = b.date || '';
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return bDate.localeCompare(aDate);
    });

    return NextResponse.json(sortedItems);
  } catch (error: any) {
    console.error('Error fetching daily life:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch daily life' },
      { status: 500 }
    );
  }
}

// POST: 創建新的 Daily Life
export async function POST(request: NextRequest) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      id,
      title,
      description,
      date,
      author,
      category,
      coverImage,
      images,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }

    if (!title || !description) {
      return NextResponse.json(
        { error: 'title and description are required' },
        { status: 400 }
      );
    }

    // 根據分類驗證必填項
    if (category === 'reading') {
      if (!author) {
        return NextResponse.json(
          { error: 'author is required for reading category' },
          { status: 400 }
        );
      }
    } else {
      if (!date) {
        return NextResponse.json(
          { error: 'date is required for daily category' },
          { status: 400 }
        );
      }
    }

    // Validate images if provided
    if (images !== undefined) {
      if (!Array.isArray(images) || !images.every(img => typeof img === 'string')) {
        return NextResponse.json(
          { error: 'images must be an array of strings' },
          { status: 400 }
        );
      }
    }

    const db = await getDb();
    const dailyLifeItem: any = {
      id,
      title,
      description,
      category: category || null,
      coverImage: coverImage || null,
      images: images || null,
      route: `/daily-life/${id}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (category === 'reading') {
      dailyLifeItem.author = author;
    } else {
      dailyLifeItem.date = date;
    }

    await db.collection('dailyLife').insertOne(dailyLifeItem);

    return NextResponse.json({ success: true, dailyLife: dailyLifeItem });
  } catch (error: any) {
    console.error('Error creating daily life:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create daily life' },
      { status: 500 }
    );
  }
}

