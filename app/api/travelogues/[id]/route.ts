import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

// GET: 獲取 travelogue 的完整數據（公開 API）
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const travelogue = await db.collection('travelogues').findOne({
      id: params.id,
    });

    if (travelogue) {
      return NextResponse.json({
        title: travelogue.title,
        description: travelogue.description,
        date: travelogue.date,
        coverImage: travelogue.coverImage,
      });
    }

    return NextResponse.json(null);
  } catch (error: any) {
    console.error('Error fetching travelogue:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch travelogue' },
      { status: 500 }
    );
  }
}

