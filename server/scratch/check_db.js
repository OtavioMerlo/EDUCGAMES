const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.count();
  const rewards = await prisma.reward.count();
  const activities = await prisma.activity.count();
  const dailyItems = await prisma.dailyStoreItem.count();
  
  console.log(`Users: ${users}`);
  console.log(`Rewards: ${rewards}`);
  console.log(`Activities: ${activities}`);
  console.log(`DailyStoreItems: ${dailyItems}`);
  
  if (rewards > 0) {
    const sample = await prisma.reward.findFirst();
    console.log('Sample Reward:', sample.title);
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
