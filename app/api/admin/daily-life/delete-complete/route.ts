import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { isAdmin } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

// POST: 完整刪除 daily life（包括數據庫、內容文件、圖片）
export async function POST(request: NextRequest) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const deletedItems: string[] = [];
    const deletedFiles: string[] = [];
    const errors: string[] = [];

    // 1. 刪除 MongoDB 中的記錄（支持多種 ID 格式）
    try {
      // 嘗試多種可能的 ID 格式
      const possibleIds = [
        id,
        id.replace(/%20/g, ' '), // URL 解碼的空格
        id.replace(/ /g, '-'), // 空格轉換為連字符
        id.replace(/-/g, ' '), // 連字符轉換為空格
        decodeURIComponent(id), // 完整 URL 解碼
      ];
      
      // 去重
      const uniqueIds = [...new Set(possibleIds)];
      
      // 查找所有匹配的記錄（通過 ID 或標題）
      const allMatchingItems = await db.collection('dailyLife').find({
        $or: [
          { id: { $in: uniqueIds } },
          { id: { $regex: 'Norwegian.*Wood|Wood.*Norwegian', $options: 'i' } },
          { title: { $regex: 'Norwegian.*Wood|Wood.*Norwegian', $options: 'i' } }
        ]
      }).toArray();
      
      if (allMatchingItems.length > 0) {
        const idsToDelete = allMatchingItems.map(item => item.id);
        const result = await db.collection('dailyLife').deleteMany({
          id: { $in: idsToDelete }
        });
        deletedItems.push(`Deleted ${result.deletedCount} MongoDB record(s): ${idsToDelete.join(', ')}`);
        
        // 也刪除所有可能的刪除標記
        await db.collection('dailyLife').deleteMany({
          id: { $in: idsToDelete },
          deleted: true
        });
      } else {
        // 如果沒找到，檢查是否有刪除標記
        for (const checkId of uniqueIds) {
          const marker = await db.collection('dailyLife').findOne({ id: checkId, deleted: true });
          if (marker) {
            await db.collection('dailyLife').deleteOne({ id: checkId, deleted: true });
            deletedItems.push(`MongoDB deletion marker: ${checkId}`);
          }
        }
      }
    } catch (error: any) {
      errors.push(`Failed to delete MongoDB record: ${error.message}`);
    }

    // 2. 刪除內容文件（HTML）- 支持多種 ID 格式
    const contentDir = path.join(process.cwd(), 'content', 'daily-life');
    const decodedId = decodeURIComponent(id);
    const possibleIds = [
      id,
      decodedId,
      id.replace(/%20/g, ' '),
      id.replace(/ /g, '-'),
      id.replace(/-/g, ' '),
    ];
    const uniqueIds = [...new Set(possibleIds)];
    
    const possibleFiles: string[] = [];
    uniqueIds.forEach(pid => {
      possibleFiles.push(
        `${pid}.html`,
        `${pid}.en.html`,
        `${pid}.zh.html`,
        `daily-life-${pid}.html`,
        `daily-life-${pid}.en.html`,
        `daily-life-${pid}.zh.html`,
      );
    });

    for (const fileName of possibleFiles) {
      try {
        const filePath = path.join(contentDir, fileName);
        await fs.access(filePath);
        await fs.unlink(filePath);
        deletedFiles.push(`Content file: ${fileName}`);
      } catch (error: any) {
        if (error.code !== 'ENOENT') {
          errors.push(`Failed to delete ${fileName}: ${error.message}`);
        }
      }
    }

    // 3. 刪除相關圖片文件夾（如果存在）
    const imagesDir = path.join(process.cwd(), 'public', 'images', id);
    try {
      const stats = await fs.stat(imagesDir);
      if (stats.isDirectory()) {
        // 刪除文件夾中的所有文件
        const files = await fs.readdir(imagesDir);
        for (const file of files) {
          try {
            await fs.unlink(path.join(imagesDir, file));
            deletedFiles.push(`Image: ${id}/${file}`);
          } catch (error: any) {
            errors.push(`Failed to delete image ${file}: ${error.message}`);
          }
        }
        // 刪除空文件夾
        await fs.rmdir(imagesDir);
        deletedFiles.push(`Image directory: ${id}/`);
      }
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        errors.push(`Failed to delete image directory: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      id,
      deletedItems,
      deletedFiles,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully deleted ${id} and all related files`
    });
  } catch (error: any) {
    console.error('Error deleting daily life completely:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete daily life' },
      { status: 500 }
    );
  }
}

