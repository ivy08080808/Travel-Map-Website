import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { isAdmin } from '@/lib/auth';

// GET: 獲取經驗的封面圖片
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
    const experience = await db.collection('experience').findOne({
      id: params.id,
    });

    if (experience && experience.coverImage) {
      return NextResponse.json({ coverImage: experience.coverImage });
    }

    return NextResponse.json({ coverImage: null });
  } catch (error: any) {
    console.error('Error fetching experience cover:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch cover image' },
      { status: 500 }
    );
  }
}

// PUT: 更新經驗的封面圖片
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
    const result = await db.collection('experience').updateOne(
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
    console.error('Error updating experience cover:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update cover image' },
      { status: 500 }
    );
  }
}







