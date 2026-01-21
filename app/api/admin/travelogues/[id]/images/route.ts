import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { isAdmin } from '@/lib/auth';

// GET: 獲取 travelogue 的圖片列表（Carousel / Gallery）
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
    const travelogue = await db.collection('travelogues').findOne({ id: params.id });

    return NextResponse.json({
      images: Array.isArray(travelogue?.images) ? travelogue.images : [],
    });
  } catch (error: any) {
    console.error('Error fetching travelogue images:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

// PUT: 更新 travelogue 的圖片列表
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { images } = await request.json();

    if (!Array.isArray(images)) {
      return NextResponse.json(
        { error: 'images must be an array' },
        { status: 400 }
      );
    }

    // Basic validation
    const normalized = images
      .filter((x: any) => typeof x === 'string')
      .map((x: string) => x.trim())
      .filter(Boolean);

    const db = await getDb();
    await db.collection('travelogues').updateOne(
      { id: params.id },
      { $set: { images: normalized, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, images: normalized });
  } catch (error: any) {
    console.error('Error updating travelogue images:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update images' },
      { status: 500 }
    );
  }
}

