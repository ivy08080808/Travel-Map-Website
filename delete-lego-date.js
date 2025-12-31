// 完整删除 Lego Date 的脚本
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

async function deleteLegoDate() {
  if (!uri) {
    console.error('请设置 MONGODB_URI 环境变量');
    console.error('运行方式: MONGODB_URI="your_connection_string" node delete-lego-date.js');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('已连接到 MongoDB\n');

    const db = client.db();
    const collection = db.collection('dailyLife');

    // 查找所有包含 "Lego" 或 "Date" 的项目
    const items = await collection.find({
      $or: [
        { title: { $regex: 'Lego', $options: 'i' } },
        { title: { $regex: 'Date', $options: 'i' } },
        { id: { $regex: 'lego', $options: 'i' } },
        { id: { $regex: 'date', $options: 'i' } },
        { id: { $regex: 'Lego', $options: 'i' } },
        { id: { $regex: 'Date', $options: 'i' } }
      ]
    }).toArray();

    if (items.length === 0) {
      console.log('没有找到 Lego Date 相关的项目');
      
      // 检查删除标记
      const markers = await collection.find({
        $or: [
          { id: { $regex: 'lego', $options: 'i' } },
          { id: { $regex: 'date', $options: 'i' } }
        ],
        deleted: true
      }).toArray();
      
      if (markers.length > 0) {
        console.log(`找到 ${markers.length} 个删除标记，正在删除...`);
        const markerResult = await collection.deleteMany({
          $or: [
            { id: { $regex: 'lego', $options: 'i' } },
            { id: { $regex: 'date', $options: 'i' } }
          ],
          deleted: true
        });
        console.log(`已删除 ${markerResult.deletedCount} 个删除标记`);
      }
      
      return;
    }

    console.log(`找到 ${items.length} 个项目:`);
    items.forEach(item => {
      console.log(`  - ID: ${item.id}`);
      console.log(`    Title: ${item.title || 'N/A'}`);
      console.log(`    Category: ${item.category || 'N/A'}`);
      console.log(`    Deleted: ${item.deleted || false}`);
      console.log('');
    });

    // 删除所有匹配的项目（包括删除标记）
    const result = await collection.deleteMany({
      $or: [
        { title: { $regex: 'Lego', $options: 'i' } },
        { title: { $regex: 'Date', $options: 'i' } },
        { id: { $regex: 'lego', $options: 'i' } },
        { id: { $regex: 'date', $options: 'i' } },
        { id: { $regex: 'Lego', $options: 'i' } },
        { id: { $regex: 'Date', $options: 'i' } }
      ]
    });

    console.log(`\n✅ 成功删除 ${result.deletedCount} 个项目`);
    
    // 再次检查是否还有残留
    const remaining = await collection.find({
      $or: [
        { title: { $regex: 'Lego', $options: 'i' } },
        { title: { $regex: 'Date', $options: 'i' } },
        { id: { $regex: 'lego', $options: 'i' } },
        { id: { $regex: 'date', $options: 'i' } }
      ]
    }).toArray();
    
    if (remaining.length > 0) {
      console.log(`\n⚠️  警告: 仍有 ${remaining.length} 个相关项目未删除`);
      remaining.forEach(item => {
        console.log(`  - ID: ${item.id}, Title: ${item.title}`);
      });
    } else {
      console.log('\n✅ 所有 Lego Date 相关记录已完全删除');
    }
  } catch (error) {
    console.error('删除失败:', error);
  } finally {
    await client.close();
    console.log('\n已断开 MongoDB 连接');
  }
}

deleteLegoDate();

