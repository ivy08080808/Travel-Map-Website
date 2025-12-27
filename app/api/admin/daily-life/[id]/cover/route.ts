import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { isAdmin } from '@/lib/auth';

// GET: 獲取 daily life 的封面圖片
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
    const item = await db.collection('dailyLife').findOne({
      id: params.id,
    });

    if (item && item.coverImage) {
      return NextResponse.json({ coverImage: item.coverImage });
    }

    return NextResponse.json({ coverImage: null });
  } catch (error: any) {
    console.error('Error fetching daily life cover:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch cover image' },
      { status: 500 }
    );
  }
}

// PUT: 更新 daily life 的封面圖片
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
    const result = await db.collection('dailyLife').updateOne(
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
    console.error('Error updating daily life cover:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update cover image' },
      { status: 500 }
    );
  }
}


