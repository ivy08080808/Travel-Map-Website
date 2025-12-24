import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// GET: 公開 API，讀取 HTML 文件內容
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(
      process.cwd(),
      'content',
      'travelogues',
      `${params.id}.html`
    );

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return NextResponse.json({ content });
    } catch (error: any) {
      // 文件不存在，返回 null
      if (error.code === 'ENOENT') {
        return NextResponse.json({ content: null });
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Error reading content file:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to read content file' },
      { status: 500 }
    );
  }
}

