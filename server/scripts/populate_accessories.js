const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando povoamento de acessórios lendários...');

  const accessories = [
    { title: 'Superman Smallville v2', file: 'supermansmallville2.png', price: 5000, category: 'ACCESSORY', rarity: 'LEGENDARY' },
    { title: 'Superman Smallville v1', file: 'supermansmallvile.png', price: 4500, category: 'ACCESSORY', rarity: 'LEGENDARY' },
    { title: 'Superman Classic', file: 'superman1.png', price: 4000, category: 'ACCESSORY', rarity: 'LEGENDARY' },
    { title: 'Akatsuki Robe', file: 'akttsuki.png', price: 3000, category: 'ACCESSORY', rarity: 'EPIC' },
    { title: 'Ninja Bandana', file: 'bandana.png', price: 1500, category: 'ACCESSORY', rarity: 'RARE' },
    { title: 'Potara Earrings', file: 'brincos do dragao ball.png', price: 2500, category: 'ACCESSORY', rarity: 'EPIC' },
    { title: 'Goku Hair', file: 'cabelo goku.png', price: 2000, category: 'ACCESSORY', rarity: 'RARE' },
    { title: 'Rine Sharingan', file: 'card_rinesharingan.png', price: 5000, category: 'ACCESSORY', rarity: 'LEGENDARY' },
    { title: 'Tanjiro Haori', file: 'card_tanjiro.png', price: 3500, category: 'ACCESSORY', rarity: 'EPIC' },
    { title: 'Hokage Hat', file: 'chapeu do hokage.png', price: 2800, category: 'ACCESSORY', rarity: 'EPIC' },
    { title: 'Rinengan Eyes', file: 'rinengan.png', price: 4500, category: 'ACCESSORY', rarity: 'LEGENDARY' },
    { title: 'Sharingan Eyes', file: 'sharingan.png', price: 3000, category: 'ACCESSORY', rarity: 'EPIC' },
    { title: 'Ultra Ego', file: 'ultra-egoo.png', price: 5000, category: 'ACCESSORY', rarity: 'LEGENDARY' },
    { title: 'Majin Mark', file: 'majin-vegeta.png', price: 3200, category: 'ACCESSORY', rarity: 'EPIC' },
    { title: 'Gohan Beast Skin', file: 'gohanbeast.png', price: 5000, category: 'ACCESSORY', rarity: 'LEGENDARY' },
  ];

  // Map existing items to their images
  const updates = [
    { title: 'Aura Super Saiyajin', file: 'card_ssj.png', rarity: 'LEGENDARY' },
    { title: 'Aura SSJ God', file: 'card_ssj_god.png', rarity: 'LEGENDARY' },
    { title: 'Aura Instinto Superior', file: 'goku extinto superior completo.png', rarity: 'LEGENDARY' },
    { title: 'Aura SSJ Blue', file: 'gokublue.png', rarity: 'EPIC' },
    { title: 'Aura Kaioken', file: 'deus super sayajin.png', rarity: 'RARE' },
    { title: 'Aura Lendário', file: 'gohan.png', rarity: 'LEGENDARY' },
  ];

  const premiumGradient = 'linear-gradient(135deg, #1C1917 0%, #44403C 50%, #CA8A04 100%)';

  for (const item of accessories) {
    const existing = await prisma.reward.findFirst({ where: { title: item.title } });
    const data = {
      title: item.title,
      description: `Equipe o lendário item ${item.title} e mostre seu poder no EducaGames!`,
      imageUrl: `/acessorios/${item.file}`,
      emoji: '✨',
      price: item.price,
      stock: -1,
      category: item.category,
      rarity: item.rarity,
      bgGradient: item.rarity === 'LEGENDARY' ? premiumGradient : undefined,
    };

    if (existing) {
      await prisma.reward.update({ where: { id: existing.id }, data });
      console.log(`🔄 Updated ${item.title}`);
    } else {
      await prisma.reward.create({ data });
      console.log(`✅ Created ${item.title}`);
    }
  }

  for (const up of updates) {
    const existing = await prisma.reward.findFirst({ where: { title: up.title } });
    if (existing) {
      await prisma.reward.update({
        where: { id: existing.id },
        data: {
          imageUrl: `/acessorios/${up.file}`,
          rarity: up.rarity,
          bgGradient: up.rarity === 'LEGENDARY' ? premiumGradient : existing.bgGradient,
        }
      });
      console.log(`🆙 Refined ${up.title}`);
    }
  }

  console.log('✨ Todos os acessórios foram processados!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
