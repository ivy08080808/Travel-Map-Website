// 恢复 Norwegian Wood 的脚本
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

async function restoreNorwegianWood() {
  if (!uri) {
    console.error('请设置 MONGODB_URI 环境变量');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('已连接到 MongoDB\n');

    const db = client.db();
    const collection = db.collection('dailyLife');

    // 检查是否已存在
    const existing = await collection.findOne({ 
      id: 'daily-life-Norwegian-Wood' 
    });

    if (existing && !existing.deleted) {
      console.log('✅ Norwegian Wood 已存在，无需恢复');
      console.log('ID:', existing.id);
      console.log('Title:', existing.title);
      return;
    }

    // 如果存在但被标记为删除，先删除
    if (existing) {
      await collection.deleteOne({ id: 'daily-life-Norwegian-Wood' });
      console.log('已清除旧的删除标记');
    }

    // 创建新的记录
    const newItem = {
      id: 'daily-life-Norwegian-Wood',
      title: 'Norwegian Wood',
      description: 'Toru, a serious young college student in Tokyo, is devoted to Naoko, a beautiful and introspective young woman, but their mutual passion is marked by the tragic death of their best friend years before. As Naoko retreats further into her own world, Toru finds himself drawn to a fiercely independent and sexually liberated young woman.',
      author: 'novel by Haruki Murakami',
      category: 'reading',
      route: '/daily-life/daily-life-Norwegian-Wood',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await collection.insertOne(newItem);
    console.log('✅ 成功恢复 Norwegian Wood');
    console.log('ID:', newItem.id);
    console.log('Title:', newItem.title);
    console.log('Category:', newItem.category);
    console.log('Author:', newItem.author);
  } catch (error) {
    console.error('恢复失败:', error);
  } finally {
    await client.close();
    console.log('\n已断开 MongoDB 连接');
  }
}

restoreNorwegianWood();

