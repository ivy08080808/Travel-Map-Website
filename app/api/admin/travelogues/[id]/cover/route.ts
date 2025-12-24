import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { isAdmin } from '@/lib/auth';

// GET: 獲取 travelogue 的封面圖片
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

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

// PUT: 更新 travelogue 的封面圖片
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { coverImage } = await request.json();

    if (!coverImage) {
      return NextResponse.json(
        { error: 'coverImage is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const result = await db.collection('travelogues').updateOne(
      { id: params.id },
      {
        $set: {
          coverImage,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      coverImage,
    });
  } catch (error: any) {
    console.error('Error updating travelogue cover:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update cover image' },
      { status: 500 }
    );
  }
}

