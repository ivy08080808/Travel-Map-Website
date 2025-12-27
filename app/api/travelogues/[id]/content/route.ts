import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// GET: 讀取 HTML 文件內容，支持語言參數
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('lang') || 'zh';

    // 先嘗試讀取語言特定版本（例如 kyoto-2024-07.en.html）
    const langSpecificPath = path.join(
      process.cwd(),
      'content',
      'travelogues',
      `${params.id}.${language}.html`
    );

    let content: string | null = null;

    try {
      content = await fs.readFile(langSpecificPath, 'utf-8');
    } catch (error: any) {
      // 如果語言特定版本不存在，嘗試讀取默認版本
      if (error.code === 'ENOENT') {
        const defaultPath = path.join(
          process.cwd(),
          'content',
          'travelogues',
          `${params.id}.html`
        );
        try {
          content = await fs.readFile(defaultPath, 'utf-8');
        } catch (defaultError: any) {
          if (defaultError.code === 'ENOENT') {
            return NextResponse.json({ content: null });
          }
          throw defaultError;
        }
      } else {
        throw error;
      }
    }

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('Error reading content file:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to read content file' },
      { status: 500 }
    );
  }
}
