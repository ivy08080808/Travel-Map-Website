import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { isAdmin } from '@/lib/auth';

// GET: 獲取 travelogue 的文字內容
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

    if (travelogue) {
      return NextResponse.json({
        title: travelogue.title,
        description: travelogue.description,
        date: travelogue.date,
      });
    }

    return NextResponse.json({ title: null, description: null, date: null });
  } catch (error: any) {
    console.error('Error fetching travelogue:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch travelogue' },
      { status: 500 }
    );
  }
}

// PUT: 更新 travelogue 的文字內容
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { title, description, date } = await request.json();

    if (!title || !description || !date) {
      return NextResponse.json(
        { error: 'title, description, and date are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const result = await db.collection('travelogues').updateOne(
      { id: params.id },
      {
        $set: {
          title,
          description,
          date,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      title,
      description,
      date,
    });
  } catch (error: any) {
    console.error('Error updating travelogue:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update travelogue' },
      { status: 500 }
    );
  }
}

