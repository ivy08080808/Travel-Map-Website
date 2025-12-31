// 完整删除 Lego Date 的脚本（包括创建删除标记）
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const fs = require('fs').promises;
const path = require('path');

async function deleteLegoDateComplete() {
  if (!uri) {
    console.error('请设置 MONGODB_URI 环境变量');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  const id = 'lego-date';

  try {
    await client.connect();
    console.log('已连接到 MongoDB\n');

    const db = client.db();
    const collection = db.collection('dailyLife');

    // 1. 检查并删除 MongoDB 中的记录
    const existingItem = await collection.findOne({ id });
    if (existingItem) {
      await collection.deleteOne({ id });
      console.log('✅ 已删除 MongoDB 中的记录');
    } else {
      // 创建删除标记，确保不会从 data.ts 显示
      const existingMarker = await collection.findOne({ id, deleted: true });
      if (!existingMarker) {
        await collection.insertOne({
          id,
          deleted: true,
          deletedAt: new Date()
        });
        console.log('✅ 已创建删除标记');
      } else {
        console.log('✅ 删除标记已存在');
      }
    }

    // 2. 删除内容文件
    const contentDir = path.join(process.cwd(), 'content', 'daily-life');
    const possibleFiles = [
      `${id}.html`,
      `${id}.en.html`,
      `${id}.zh.html`,
    ];

    for (const fileName of possibleFiles) {
      try {
        const filePath = path.join(contentDir, fileName);
        await fs.unlink(filePath);
        console.log(`✅ 已删除内容文件: ${fileName}`);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.error(`❌ 删除文件失败 ${fileName}:`, error.message);
        }
      }
    }

    // 3. 删除图片文件夹
    const imagesDir = path.join(process.cwd(), 'public', 'images', id);
    try {
      const stats = await fs.stat(imagesDir);
      if (stats.isDirectory()) {
        const files = await fs.readdir(imagesDir);
        for (const file of files) {
          await fs.unlink(path.join(imagesDir, file));
          console.log(`✅ 已删除图片: ${id}/${file}`);
        }
        await fs.rmdir(imagesDir);
        console.log(`✅ 已删除图片文件夹: ${id}/`);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(`❌ 删除图片文件夹失败:`, error.message);
      }
    }

    console.log('\n✅ Lego Date 已完全删除');
  } catch (error) {
    console.error('删除失败:', error);
  } finally {
    await client.close();
    console.log('\n已断开 MongoDB 连接');
  }
}

deleteLegoDateComplete();

