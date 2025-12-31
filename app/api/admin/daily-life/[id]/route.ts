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
        date: item.date || null,
        author: item.author || null,
        category: item.category || null,
      });
    }

    return NextResponse.json({ title: null, description: null, date: null, author: null, category: null });
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

    const { title, description, date, author, category } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'title and description are required' },
        { status: 400 }
      );
    }

    // 根據分類驗證必填項
    if (category === 'reading') {
      if (!author) {
        return NextResponse.json(
          { error: 'author is required for reading category' },
          { status: 400 }
        );
      }
    } else {
      if (!date) {
        return NextResponse.json(
          { error: 'date is required for daily category' },
          { status: 400 }
        );
      }
    }

    const db = await getDb();
    const updateData: any = {
      title,
      description,
      updatedAt: new Date(),
    };
    
    if (category === 'reading') {
      updateData.author = author;
    } else {
      updateData.date = date;
    }
    
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
      date: date || null,
      author: author || null,
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

// DELETE: 刪除 daily life
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const db = await getDb();
    const result = await db.collection('dailyLife').deleteOne({
      id: params.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Daily Life not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting daily life:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete daily life' },
      { status: 500 }
    );
  }
}










