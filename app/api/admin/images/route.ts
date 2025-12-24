import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { isAdmin } from '@/lib/auth';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: 獲取所有圖片
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'travelogues';

    // List all images in the folder
    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by([['created_at', 'desc']])
      .max_results(500)
      .execute();

    const images = result.resources.map((resource: any) => ({
      url: resource.secure_url,
      public_id: resource.public_id,
      width: resource.width,
      height: resource.height,
      format: resource.format,
      created_at: resource.created_at,
    }));

    return NextResponse.json(images);
  } catch (error: any) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

