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

// DELETE: 管理員刪除留言（需要管理員權限）
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid comment ID' },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    // 刪除留言及其所有回覆
    const result = await db.collection<Comment>('comments').deleteMany({
      $or: [
        { _id: new ObjectId(id) },
        { parentId: new ObjectId(id) },
      ],
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}

