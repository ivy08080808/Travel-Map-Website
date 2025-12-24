import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

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

// GET: 獲取所有留言（不需要審核，直接顯示）
export async function GET() {
  try {
    let db;
    try {
      db = await getDb();
    } catch (dbError: any) {
      console.error('Database connection error in GET:', dbError);
      const errorMessage = dbError?.message || 'Unknown error';
      // 檢查是否是 SSL/IP 白名單問題
      if (errorMessage.includes('SSL') || errorMessage.includes('alert')) {
        return NextResponse.json(
          { error: 'Database connection failed. Please check MongoDB Atlas IP whitelist settings.' },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: `Database connection failed: ${errorMessage}` },
        { status: 500 }
      );
    }
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
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST: 創建新留言
export async function POST(request: NextRequest) {
  try {
    // 檢查 MongoDB URI 是否存在
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not set');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, message, parentId } = body;

    // 基本驗證 - 只有留言內容是必填的
    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // 如果提供了電子郵件，則驗證格式
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    // 生成 sessionId 用於追蹤用戶
    const sessionId = uuidv4();

    let db;
    try {
      db = await getDb();
    } catch (dbError: any) {
      console.error('Database connection error:', dbError);
      const errorMessage = dbError?.message || 'Unknown error';
      // 檢查是否是 SSL/IP 白名單問題
      if (errorMessage.includes('SSL') || errorMessage.includes('alert')) {
        return NextResponse.json(
          { error: 'Database connection failed. Please check MongoDB Atlas IP whitelist settings. Make sure your IP address is allowed or add 0.0.0.0/0 to allow all IPs.' },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: `Database connection failed: ${errorMessage}` },
        { status: 500 }
      );
    }

    const newComment: Comment = {
      name: name?.trim() || 'Anonymous',
      email: email?.trim().toLowerCase() || '',
      message: message.trim(),
      createdAt: new Date(),
      parentId: parentId ? new ObjectId(parentId) : null,
      isApproved: true, // 新留言默認直接顯示，不需要審核
      sessionId,
    };

    let result;
    try {
      result = await db.collection<Comment>('comments').insertOne(newComment);
    } catch (insertError: any) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: `Failed to save comment: ${insertError?.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ...newComment,
        _id: result.insertedId.toString(),
        parentId: newComment.parentId?.toString() || null,
        createdAt: newComment.createdAt.toISOString(),
        sessionId, // 返回 sessionId 給客戶端，用於刪除自己的留言
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create comment' },
      { status: 500 }
    );
  }
}

