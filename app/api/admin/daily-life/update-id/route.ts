import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { isAdmin } from '@/lib/auth';

// POST: 更新 daily life 的 ID
export async function POST(request: NextRequest) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { oldId, newId } = await request.json();

    if (!oldId || !newId) {
      return NextResponse.json(
        { error: 'oldId and newId are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    // 查找舊的項目
    const oldItem = await db.collection('dailyLife').findOne({ id: oldId });
    
    if (!oldItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // 檢查新 ID 是否已存在
    const existingItem = await db.collection('dailyLife').findOne({ id: newId });
    if (existingItem) {
      return NextResponse.json(
        { error: 'New ID already exists' },
        { status: 400 }
      );
    }

    // 更新 ID 和 route
    const result = await db.collection('dailyLife').updateOne(
      { id: oldId },
      {
        $set: {
          id: newId,
          route: `/daily-life/${newId}`,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `ID updated from ${oldId} to ${newId}`,
    });
  } catch (error: any) {
    console.error('Error updating daily life ID:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update ID' },
      { status: 500 }
    );
  }
}

