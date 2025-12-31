import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { isAdmin } from '@/lib/auth';

// POST: 通過標題刪除 daily life
export async function POST(request: NextRequest) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { title } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'title is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    // 查找所有匹配標題的項目（支持部分匹配）
    const items = await db.collection('dailyLife').find({
      title: { $regex: title, $options: 'i' },
      deleted: { $ne: true }
    }).toArray();

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'No items found with that title', title },
        { status: 404 }
      );
    }

    // 刪除所有匹配的項目
    const result = await db.collection('dailyLife').deleteMany({
      title: { $regex: title, $options: 'i' },
      deleted: { $ne: true }
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      items: items.map(item => ({ id: item.id, title: item.title }))
    });
  } catch (error: any) {
    console.error('Error deleting daily life by title:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete daily life' },
      { status: 500 }
    );
  }
}

