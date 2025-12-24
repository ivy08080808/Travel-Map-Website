import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { isAdmin } from '@/lib/auth';

export interface Comment {
  _id?: ObjectId;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  parentId?: ObjectId | null;
  isApproved: boolean;
  sessionId: string;
}

// GET: 獲取所有留言（需要管理員權限）
export async function GET() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const db = await getDb();
    const comments = await db
      .collection<Comment>('comments')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // 轉換 ObjectId 為字符串以便序列化
    const serializedComments = comments.map((comment) => ({
      ...comment,
      _id: comment._id?.toString(),
      parentId: comment.parentId?.toString() || null,
      createdAt: comment.createdAt.toISOString(),
    }));

    return NextResponse.json(serializedComments, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}


