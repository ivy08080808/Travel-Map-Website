import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { isAdmin } from '@/lib/auth';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'travelogues';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (10MB - Cloudinary free plan limit)
    const maxSize = 10485760; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          error: `File size too large. Got ${file.size}. Maximum is ${maxSize} (10MB). Please compress the image or upgrade your Cloudinary plan.` 
        },
        { status: 400 }
      );
    }

    // Convert File to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: (uploadResult as any).secure_url,
      public_id: (uploadResult as any).public_id,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { public_id } = body;

    if (!public_id) {
      return NextResponse.json(
        { error: 'No public_id provided' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: error?.message || 'Delete failed' },
      { status: 500 }
    );
  }
}

