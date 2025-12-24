import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

// GET: 讀取 HTML 文件內容
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

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
      // 文件不存在，返回空內容
      if (error.code === 'ENOENT') {
        return NextResponse.json({ content: '' });
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

// PUT: 保存 HTML 文件內容
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { content } = await request.json();

    if (content === undefined) {
      return NextResponse.json(
        { error: 'content is required' },
        { status: 400 }
      );
    }

    const dirPath = path.join(process.cwd(), 'content', 'travelogues');
    const filePath = path.join(dirPath, `${params.id}.html`);

    // 確保目錄存在
    await fs.mkdir(dirPath, { recursive: true });

    // 寫入文件
    await fs.writeFile(filePath, content, 'utf-8');

    return NextResponse.json({
      success: true,
      content,
    });
  } catch (error: any) {
    console.error('Error writing content file:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to write content file' },
      { status: 500 }
    );
  }
}

