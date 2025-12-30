import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { isAdmin } from '@/lib/auth';

// GET: 獲取單一經驗（管理端）
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
    const experience = await db.collection('experience').findOne({
      id: params.id,
    });

    if (experience) {
      return NextResponse.json(experience);
    }

    return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}

// PUT: 更新經驗
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      organization,
      role,
      startDate,
      endDate,
      location,
      description,
      skills,
      images,
      type,
      category,
      coverImage,
    } = body;

    // All fields are optional now

    const db = await getDb();
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Only include fields that are provided
    if (title !== undefined) updateData.title = title || null;
    if (organization !== undefined) updateData.organization = organization || null;
    if (role !== undefined) updateData.role = role || null;
    if (startDate !== undefined) updateData.startDate = startDate || null;
    if (endDate !== undefined) updateData.endDate = endDate || null;
    if (location !== undefined) updateData.location = location || null;
    if (description !== undefined) updateData.description = description || null;
    if (skills !== undefined) updateData.skills = skills || [];
    if (images !== undefined) updateData.images = images || [];
    if (type !== undefined) updateData.type = type || null;
    if (category !== undefined) updateData.category = category || null;
    if (coverImage !== undefined) updateData.coverImage = coverImage || null;

    const result = await db.collection('experience').updateOne(
      { id: params.id },
      {
        $set: updateData,
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      ...updateData,
    });
  } catch (error: any) {
    console.error('Error updating experience:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update experience' },
      { status: 500 }
    );
  }
}

// DELETE: 刪除經驗
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
    const result = await db.collection('experience').deleteOne({
      id: params.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting experience:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete experience' },
      { status: 500 }
    );
  }
}

