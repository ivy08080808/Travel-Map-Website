import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

// GET: 獲取所有經驗（公開 API）
export async function GET(request: NextRequest) {
  try {
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

