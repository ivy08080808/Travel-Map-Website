import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

// GET: 獲取單一經驗（公開 API）
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const experience = await db.collection('experience').findOne({
      id: params.id,
    });

    if (experience) {
      return NextResponse.json(experience);
    }

    return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}



