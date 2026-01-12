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
        images: item.images || null,
      });
    }

    return NextResponse.json({ title: null, description: null, date: null, author: null, category: null, images: null });
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

    const { title, description, date, author, category, images } = await request.json();

    const db = await getDb();
    const updateData: any = {
      updatedAt: new Date(),
    };

    // 如果只更新 images，不需要验证其他字段
    const isOnlyImagesUpdate = images !== undefined && title === undefined && description === undefined;

    if (!isOnlyImagesUpdate) {
      // 如果不是只更新 images，则需要验证必填字段
      if (!title || !description) {
        return NextResponse.json(
          { error: 'title and description are required' },
          { status: 400 }
        );
      }

      updateData.title = title;
      updateData.description = description;

      // 根據分類驗證必填項
      if (category === 'reading') {
        if (!author) {
          return NextResponse.json(
            { error: 'author is required for reading category' },
            { status: 400 }
          );
        }
        updateData.author = author;
      } else if (category === 'daily') {
        if (!date) {
          return NextResponse.json(
            { error: 'date is required for daily category' },
            { status: 400 }
          );
        }
        updateData.date = date;
      }
      
      if (category) {
        updateData.category = category;
      }
    }
    
    // Validate and update images if provided
    if (images !== undefined) {
      if (Array.isArray(images) && images.every(img => typeof img === 'string')) {
        updateData.images = images;
      } else if (images === null) {
        updateData.images = null;
      } else {
        return NextResponse.json(
          { error: 'images must be an array of strings or null' },
          { status: 400 }
        );
      }
    }

    const result = await db.collection('dailyLife').updateOne(
      { id: params.id },
      {
        $set: updateData,
      },
      { upsert: true }
    );

    // 获取更新后的完整数据
    const updatedItem = await db.collection('dailyLife').findOne({ id: params.id });

    return NextResponse.json({
      success: true,
      title: updatedItem?.title || title || null,
      description: updatedItem?.description || description || null,
      date: updatedItem?.date || date || null,
      author: updatedItem?.author || author || null,
      category: updatedItem?.category || category || null,
      images: updatedItem?.images || images || null,
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










