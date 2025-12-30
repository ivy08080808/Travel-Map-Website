import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { isAdmin } from '@/lib/auth';

// GET: 獲取 daily life 的文字內容
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

    if (item) {
      return NextResponse.json({
        title: item.title,
        description: item.description,
        date: item.date,
        category: item.category || null,
      });
    }

    return NextResponse.json({ title: null, description: null, date: null, category: null });
  } catch (error: any) {
    console.error('Error fetching daily life:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch daily life' },
      { status: 500 }
    );
  }
}

// PUT: 更新 daily life 的文字內容
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { title, description, date, category } = await request.json();

    if (!title || !description || !date) {
      return NextResponse.json(
        { error: 'title, description, and date are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const updateData: any = {
      title,
      description,
      date,
      updatedAt: new Date(),
    };
    
    if (category) {
      updateData.category = category;
    }

    const result = await db.collection('dailyLife').updateOne(
      { id: params.id },
      {
        $set: updateData,
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      title,
      description,
      date,
      category: category || null,
    });
  } catch (error: any) {
    console.error('Error updating daily life:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update daily life' },
      { status: 500 }
    );
  }
}










