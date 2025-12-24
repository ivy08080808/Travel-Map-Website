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

// PATCH: 編輯留言（檢查 sessionId）
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { sessionId, name, email, message } = body;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid comment ID' },
        { status: 400 }
      );
    }

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

    const db = await getDb();
    const comment = await db
      .collection<Comment>('comments')
      .findOne({ _id: new ObjectId(id) });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // 檢查是否是留言作者（通過 sessionId）
    const isOwner = comment.sessionId === sessionId;

    if (!isOwner) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // 更新留言
    const updateData: Partial<Comment> = {
      message: message.trim(),
    };

    if (name !== undefined) {
      updateData.name = name?.trim() || 'Anonymous';
    }

    if (email !== undefined) {
      updateData.email = email?.trim().toLowerCase() || '';
    }

    await db.collection<Comment>('comments').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    const updatedComment = await db
      .collection<Comment>('comments')
      .findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      ...updatedComment,
      _id: updatedComment!._id?.toString(),
      parentId: updatedComment!.parentId?.toString() || null,
      createdAt: updatedComment!.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

// DELETE: 刪除留言（檢查 sessionId 或管理員權限）
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { sessionId } = body;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid comment ID' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const comment = await db
      .collection<Comment>('comments')
      .findOne({ _id: new ObjectId(id) });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // 檢查是否是管理員
    const admin = await isAdmin();

    // 檢查是否是留言作者（通過 sessionId）
    const isOwner = comment.sessionId === sessionId;

    if (!admin && !isOwner) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // 刪除留言及其所有回覆
    await db.collection<Comment>('comments').deleteMany({
      $or: [
        { _id: new ObjectId(id) },
        { parentId: new ObjectId(id) },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}

