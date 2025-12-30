import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { isAdmin } from '@/lib/auth';

// GET: 獲取所有經驗（管理端）
export async function GET(request: NextRequest) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const db = await getDb();
    const experiences = await db.collection('experience').find({}).toArray();

    // Sort by startDate (newest first), handle null/undefined dates
    const sortedExperiences = experiences.sort((a, b) => {
      const aDate = a.startDate || '';
      const bDate = b.startDate || '';
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return bDate.localeCompare(aDate);
    });

    return NextResponse.json(sortedExperiences);
  } catch (error: any) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

// POST: 創建新經驗
export async function POST(request: NextRequest) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      id,
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

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const experience: any = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Only include fields that are provided
    if (title !== undefined) experience.title = title || null;
    if (organization !== undefined) experience.organization = organization || null;
    if (role !== undefined) experience.role = role || null;
    if (startDate !== undefined) experience.startDate = startDate || null;
    if (endDate !== undefined) experience.endDate = endDate || null;
    if (location !== undefined) experience.location = location || null;
    if (description !== undefined) experience.description = description || null;
    if (skills !== undefined) experience.skills = skills || [];
    if (images !== undefined) experience.images = images || [];
    if (type !== undefined) experience.type = type || null;
    if (category !== undefined) experience.category = category || null;
    if (coverImage !== undefined) experience.coverImage = coverImage || null;

    await db.collection('experience').insertOne(experience);

    return NextResponse.json({ success: true, experience });
  } catch (error: any) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create experience' },
      { status: 500 }
    );
  }
}

