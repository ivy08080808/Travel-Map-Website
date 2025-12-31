// 删除 Norwegian Wood 的脚本
// 运行: node delete-norwegian-wood.js

const { MongoClient } = require('mongodb');

async function deleteNorwegianWood() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('请设置 MONGODB_URI 环境变量');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('已连接到 MongoDB');

    const db = client.db();
    const collection = db.collection('dailyLife');

    // 查找所有包含 "Norwegian" 或 "Wood" 的项目
    const items = await collection.find({
      $or: [
        { title: { $regex: 'Norwegian', $options: 'i' } },
        { title: { $regex: 'Wood', $options: 'i' } },
        { id: { $regex: 'Norwegian', $options: 'i' } },
        { id: { $regex: 'Wood', $options: 'i' } }
      ],
      deleted: { $ne: true }
    }).toArray();

    if (items.length === 0) {
      console.log('没有找到 Norwegian Wood 相关的项目');
      return;
    }

    console.log(`找到 ${items.length} 个项目:`);
    items.forEach(item => {
      console.log(`  - ID: ${item.id}, Title: ${item.title}`);
    });

    // 删除所有匹配的项目
    const result = await collection.deleteMany({
      $or: [
        { title: { $regex: 'Norwegian', $options: 'i' } },
        { title: { $regex: 'Wood', $options: 'i' } },
        { id: { $regex: 'Norwegian', $options: 'i' } },
        { id: { $regex: 'Wood', $options: 'i' } }
      ],
      deleted: { $ne: true }
    });

    console.log(`\n成功删除 ${result.deletedCount} 个项目`);
  } catch (error) {
    console.error('删除失败:', error);
  } finally {
    await client.close();
    console.log('已断开 MongoDB 连接');
  }
}

deleteNorwegianWood();

