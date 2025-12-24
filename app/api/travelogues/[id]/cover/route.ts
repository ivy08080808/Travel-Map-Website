import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

// GET: 獲取 travelogue 的封面圖片（公開 API）
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const travelogue = await db.collection('travelogues').findOne({
      id: params.id,
    });

    if (travelogue && travelogue.coverImage) {
      return NextResponse.json({ coverImage: travelogue.coverImage });
    }

    return NextResponse.json({ coverImage: null });
  } catch (error: any) {
    console.error('Error fetching travelogue cover:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch cover image' },
      { status: 500 }
    );
  }
}

