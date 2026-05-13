const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('⚡ Adicionando NOVAS transformações lendárias...');

  const items = [
    // ── NOVAS TRANSFORMAÇÕES (BATCH 2) ──
    {
      title: 'Goku Ultra Instinto',
      description: 'O ápice do poder marcial. O corpo se move sozinho, reagindo a cada ameaça com perfeição divina e cabelos prateados.',
      emoji: '⚪', price: 9000, stock: 5, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #f8fafc, #cbd5e1, #94a3b8)',
      imageUrl: '/acessorios/goku extinto superior completo.png',
    },
    {
      title: 'Goku UI Incompleto',
      description: 'O presságio do Instinto Superior. Cabelos pretos com brilho prateado e uma aura de calor intenso que distorce o espaço.',
      emoji: '🌑', price: 7500, stock: -1, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #1e293b, #334155, #64748b)',
      imageUrl: '/acessorios/goku extintosuperior incompleto.png',
    },
    {
      title: 'Goku Blue',
      description: 'A forma Super Saiyajin do Deus Super Saiyajin. Poder divino concentrado em uma aura azul calma e devastadora.',
      emoji: '🟦', price: 5500, stock: -1, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #0c4a6e, #0ea5e9, #7dd3fc)',
      imageUrl: '/acessorios/gokublue.png',
    },
    {
      title: 'Goku Blue Kaioken',
      description: 'A combinação perigosa do SSJ Blue com a técnica Kaioken. Uma aura dupla de azul e vermelho que racha a realidade.',
      emoji: '☄️', price: 6800, stock: 10, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #450a0a, #dc2626, #0ea5e9)',
      imageUrl: '/acessorios/gokubluekaioken.png',
    },
    {
      title: 'Goku SSJ2',
      description: 'O Super Saiyajin que superou os limites. Cabelos mais espetados e relâmpagos constantes que indicam um poder massivo.',
      emoji: '⚡', price: 3500, stock: -1, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #422006, #b45309, #fbbf24)',
      imageUrl: '/acessorios/gokussj2.png',
    },
    {
      title: 'Goku SSJ3',
      description: 'A forma que consome energia vital por poder puro. Cabelos longos e dourados que emanam uma pressão esmagadora.',
      emoji: '🌟', price: 4800, stock: -1, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #78350f, #d97706, #fcd34d)',
      imageUrl: '/acessorios/gokussj3.png',
    },
    {
      title: 'Goku SSJ4',
      description: 'A volta às origens primitivas dos Saiyajins. Pelagem vermelha e cabelos negros, unindo a força do Oozaru com o controle humano.',
      emoji: '🦍', price: 7200, stock: 15, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #450a0a, #991b1b, #111827)',
      imageUrl: '/acessorios/gokussj4.png',
    },
    {
      title: 'Gohan Beast',
      description: 'O despertar da fera interior de Gohan. Cabelos cinzas e olhos vermelhos que representam um potencial latente liberado.',
      emoji: '😈', price: 8500, stock: 5, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #2e1065, #6b21a8, #d8b4fe)',
      imageUrl: '/acessorios/gohan.png',
    },
    {
      title: 'Gohan SSJ2',
      description: 'A clássica forma de Gohan durante os Jogos de Cell. O momento em que a raiva se transformou em poder absoluto.',
      emoji: '🌩️', price: 4200, stock: -1, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #1e1b4b, #3730a3, #818cf8)',
      imageUrl: '/acessorios/gonhassj2.png',
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

  console.log('\n🎉 Novas transformações adicionadas!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
