const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('⚡ Adicionando Transformações do VEGETA...');

  const items = [
    {
      title: 'Vegeta SSJ1',
      description: 'O Príncipe dos Saiyajins em sua forma Super Saiyajin. Puro orgulho e determinação em um poder dourado.',
      emoji: '👑', price: 5000, stock: -1, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6, #fbbf24)',
      imageUrl: '/acessorios/vegetassj1.png',
    },
    {
      title: 'Vegeta Blue',
      description: 'O poder divino de Vegeta. A forma Super Saiyajin Blue que demonstra o controle perfeito do Príncipe sobre o chakra divino.',
      emoji: '💙', price: 6500, stock: -1, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #1e3a8a, #2563eb, #60a5fa)',
      imageUrl: '/acessorios/vegetassj-blue.png',
    },
    {
      title: 'Vegeta God',
      description: 'A elegância e o poder do Deus Super Saiyajin aplicados por Vegeta. Uma aura carmesim de divindade.',
      emoji: '🔴', price: 6000, stock: -1, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #450a0a, #dc2626, #fca5a5)',
      imageUrl: '/acessorios/ssj-god.png',
    },
    {
      title: 'Majin Vegeta',
      description: 'Vegeta sob o controle de Babidi, liberando todo o seu mal interior para uma luta final. O "M" na testa é a marca do seu sacrifício.',
      emoji: '👿', price: 7800, stock: 10, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #1e1b4b, #4338ca, #1e293b)',
      imageUrl: '/acessorios/majin-vegeta.png',
    },
    {
      title: 'Vegeta Ultra Ego',
      description: 'A forma suprema de Vegeta, o Ultra Ego. Um poder que cresce com o dano recebido, emanando uma aura roxa de destruição.',
      emoji: '💜', price: 9500, stock: 5, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #2e1065, #7e22ce, #c084fc)',
      imageUrl: '/acessorios/ultra-egoo.png',
    }
  ];

  for (const item of items) {
    const exists = await prisma.reward.findFirst({ where: { title: item.title } });
    if (!exists) {
      await prisma.reward.create({ data: item });
      console.log(`  ✅ ${item.emoji} ${item.title}`);
    } else {
      await prisma.reward.update({ where: { id: exists.id }, data: { imageUrl: item.imageUrl } });
      console.log(`  🔄 ${item.title} (atualizado)`);
    }
  }

  // Update Gohan Beast image to the correct one
  const gohanBeast = await prisma.reward.findFirst({ where: { title: 'Gohan Beast' } });
  if (gohanBeast) {
    await prisma.reward.update({
      where: { id: gohanBeast.id },
      data: { imageUrl: '/acessorios/gohanbeast.png' }
    });
    console.log('  🔄 Gohan Beast (imagem corrigida para gohanbeast.png)');
  }

  console.log('\n🎉 Transformações do Vegeta adicionadas!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
