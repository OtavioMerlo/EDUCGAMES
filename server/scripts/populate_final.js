const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('⚡ Adicionando ÚLTIMOS itens lendários...');

  const items = [
    {
      title: 'Gohan SSJ1',
      description: 'A primeira transformação de Gohan em Super Saiyajin, treinada na Sala do Tempo. O despertar da coragem do jovem guerreiro.',
      emoji: '👦', price: 4000, stock: -1, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #4c1d95, #7c3aed, #fbbf24)',
      imageUrl: '/acessorios/gonhassj1.png',
    },
    {
      title: 'Goku Base',
      description: 'O visual clássico de Son Goku. Simplicidade e poder em um guerreiro que nunca desiste de seus sonhos.',
      emoji: '🟠', price: 3000, stock: -1, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #ea580c, #f97316, #fbbf24)',
      imageUrl: '/acessorios/goku.png',
    },
    {
      title: 'Goku God Full',
      description: 'A forma completa do Deus Super Saiyajin. Aura divina vermelha que traz serenidade e um poder que desafia os limites do universo.',
      emoji: '🏮', price: 6500, stock: -1, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #7f1d1d, #dc2626, #fca5a5)',
      imageUrl: '/acessorios/gokugod.png',
    },
    {
      title: 'Goku SSJ1 Full',
      description: 'A transformação lendária que mudou a história. O Super Saiyajin clássico com toda sua aura dourada e poder explosivo.',
      emoji: '⚡', price: 5000, stock: -1, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #713f12, #ca8a04, #fef08a)',
      imageUrl: '/acessorios/ssj1 goku.png',
    },
    {
      title: 'Sasuke Uchiha',
      description: 'O último sobrevivente do clã Uchiha. Estilo, vingança e o poder do Sharingan unidos em um ninja sem igual.',
      emoji: '🦅', price: 7800, stock: 10, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #1e1b4b, #312e81, #c084fc)',
      imageUrl: '/acessorios/sasuke.png',
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

  // Update Chapéu do Hokage to legendary/image if it exists
  const hokage = await prisma.reward.findFirst({ where: { title: 'Chapéu do Hokage' } });
  if (hokage) {
    await prisma.reward.update({
      where: { id: hokage.id },
      data: { imageUrl: '/acessorios/chapeu do hokage.png', rarity: 'EPIC', category: 'ACCESSORY' }
    });
    console.log('  🔄 Chapéu do Hokage (atualizado para imagem)');
  } else {
    await prisma.reward.create({
      data: {
        title: 'Chapéu do Hokage',
        description: 'O chapéu usado pelo líder da Vila da Folha. Um símbolo de respeito e responsabilidade máxima.',
        emoji: '🏮', price: 3500, stock: -1, category: 'ACCESSORY', rarity: 'EPIC',
        bgGradient: 'linear-gradient(135deg, #7f1d1d, #ef4444, #ffffff)',
        imageUrl: '/acessorios/chapeu do hokage.png',
      }
    });
    console.log('  ✅ 🏮 Chapéu do Hokage');
  }

  console.log('\n🎉 Todos os itens foram sincronizados!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
