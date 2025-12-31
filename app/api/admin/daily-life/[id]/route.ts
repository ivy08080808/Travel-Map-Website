import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { isAdmin } from '@/lib/auth';

// GET: 獲取 daily life 的文字內容
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Handle params as Promise (Next.js 15+) or object (Next.js 14)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;
    
    console.log(`[GET /api/admin/daily-life/[id]] Looking for daily life with id: "${id}"`);

    const db = await getDb();
    const item = await db.collection('dailyLife').findOne({
      id,
    });
    
    if (item) {
      console.log(`[GET /api/admin/daily-life/[id]] Found item:`, { 
        id: item.id, 
        title: item.title,
        category: item.category 
      });
    } else {
      console.log(`[GET /api/admin/daily-life/[id]] Item not found in MongoDB with id: "${id}"`);
      // 列出所有 dailyLife 的 ID 以便调试
      const allItems = await db.collection('dailyLife').find({}).toArray();
      console.log(`[GET /api/admin/daily-life/[id]] All dailyLife IDs in database:`, 
        allItems.map(i => ({ id: i.id, title: i.title, deleted: i.deleted }))
      );
    }

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
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Handle params as Promise (Next.js 15+) or object (Next.js 14)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    const { title, description, date, author, category } = await request.json();

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
      { id },
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
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Handle params as Promise (Next.js 15+) or object (Next.js 14)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const db = await getDb();
    
    // First check if the item exists in MongoDB
    const item = await db.collection('dailyLife').findOne({ id });
    
    if (!item) {
      // Item not in MongoDB - it might be from data.ts
      // Create a deletion marker in MongoDB to hide it from the list
      console.log(`Daily Life with id "${id}" not found in MongoDB, creating deletion marker`);
      
      // Check if deletion marker already exists
      const existingMarker = await db.collection('dailyLife').findOne({ id, deleted: true });
      
      if (!existingMarker) {
        // Create a deletion marker
        await db.collection('dailyLife').insertOne({
          id,
          deleted: true,
          deletedAt: new Date(),
        });
        console.log(`Created deletion marker for Daily Life with id "${id}"`);
      }
      
      return NextResponse.json({ 
        success: true, 
        id,
        message: 'Item marked as deleted (was not in database, likely from data.ts)'
      });
    }

    // Item exists in MongoDB, delete it
    const result = await db.collection('dailyLife').deleteOne({ id });

    if (result.deletedCount === 0) {
      console.log(`Failed to delete Daily Life with id "${id}"`);
      return NextResponse.json(
        { error: 'Failed to delete Daily Life', id },
        { status: 500 }
      );
    }

    console.log(`Successfully deleted Daily Life with id "${id}"`);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Error deleting daily life:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete daily life' },
      { status: 500 }
    );
  }
}










