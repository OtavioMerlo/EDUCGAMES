const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌌 Adicionando Auras Premium (Sayajin Style)...');

  const items = [
    {
      title: 'Aura Ultra Ego',
      description: 'O poder da destruição absoluta. Energia magenta e chamas puras.',
      category: 'COSMETIC', rarity: 'LEGENDARY', price: 4000, emoji: '👿',
      imageUrl: '/acessorios/ultra-egoo.png', bgGradient: 'linear-gradient(135deg, #4c0519, #7c3aed)'
    },
    {
      title: 'Aura Beast Gohan',
      description: 'O despertar da fera interior. Brilho prateado e raios púrpuras.',
      category: 'COSMETIC', rarity: 'LEGENDARY', price: 4500, emoji: '🧬',
      imageUrl: '/acessorios/gohanbeast.png', bgGradient: 'linear-gradient(135deg, #1e1b4b, #e2e8f0)'
    },
    {
      title: 'Aura Black Cosmic',
      description: 'O vazio do espaço e o brilho das estrelas. Velocidade e elegância.',
      category: 'COSMETIC', rarity: 'LEGENDARY', price: 5000, emoji: '🌌',
      imageUrl: '/acessorios/sasuke.png', bgGradient: 'linear-gradient(135deg, #020617, #facc15)'
    }
  ];

  for (const item of items) {
    const existing = await prisma.reward.findFirst({ where: { title: item.title } });
    if (existing) {
      await prisma.reward.update({
        where: { id: existing.id },
        data: { ...item, isActive: true, stock: -1 }
      });
    } else {
      await prisma.reward.create({
        data: { ...item, isActive: true, stock: -1 }
      });
    }
  }

  console.log(`✅ ${items.length} novas auras PREMIUM adicionadas à loja!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
