import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

// GET: 獲取 daily life 的文字內容（公開 API）
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const item = await db.collection('dailyLife').findOne({
      id: params.id,
    });

    if (item) {
      return NextResponse.json({
        title: item.title,
        description: item.description,
        date: item.date || null,
        author: item.author || null,
        category: item.category || null,
        coverImage: item.coverImage,
        images: item.images || null,
      });
    }

    return NextResponse.json({ title: null, description: null, date: null, author: null, category: null, coverImage: null, images: null });
  } catch (error: any) {
    console.error('Error fetching daily life:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch daily life' },
      { status: 500 }
    );
  }
}












