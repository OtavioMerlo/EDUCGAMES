const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('💎 Adicionando novos acessórios e auras de heróis...');

  const items = [
    // AURAS
    {
      title: 'Aura Banguela',
      description: 'O poder da Fúria da Noite emanando do seu ser.',
      category: 'COSMETIC', rarity: 'LEGENDARY', price: 2500, emoji: '🐲',
      imageUrl: '/acessorios/banguela.png', bgGradient: 'linear-gradient(135deg, #1e1b4b, #581c87)'
    },
    {
      title: 'Aura Arqueiro Verde',
      description: 'A precisão e determinação do vigilante de Star City.',
      category: 'COSMETIC', rarity: 'EPIC', price: 1800, emoji: '🏹',
      imageUrl: '/acessorios/arqueiro_verde.png', bgGradient: 'linear-gradient(135deg, #064e3b, #15803d)'
    },
    {
      title: 'Aura Iron Man',
      description: 'Protocolo Stark ativado. Energia total nos repulsores.',
      category: 'COSMETIC', rarity: 'LEGENDARY', price: 3000, emoji: '🤖',
      imageUrl: '/acessorios/ironman.png', bgGradient: 'linear-gradient(135deg, #7f1d1d, #eab308)'
    },
    // ACESSÓRIOS
    {
      title: 'Banguela',
      description: 'Tenha o seu próprio Fúria da Noite te acompanhando.',
      category: 'ITEM', rarity: 'LEGENDARY', price: 2000, emoji: '🐉',
      imageUrl: '/acessorios/banguela.png', bgGradient: 'linear-gradient(135deg, #000, #312e81)'
    },
    {
      title: 'Banguela Fúria',
      description: 'Banguela em modo de ataque total!',
      category: 'ITEM', rarity: 'LEGENDARY', price: 2200, emoji: '🔥',
      imageUrl: '/acessorios/banguela2.png', bgGradient: 'linear-gradient(135deg, #000, #701a75)'
    },
    {
      title: 'Arqueiro Verde',
      description: 'O traje completo do Arqueiro Verde.',
      category: 'ITEM', rarity: 'EPIC', price: 1500, emoji: '🏹',
      imageUrl: '/acessorios/arqueiro_verde.png', bgGradient: 'linear-gradient(135deg, #14532d, #16a34a)'
    },
    {
      title: 'Iron Man Clássico',
      description: 'A armadura clássica que deu início a tudo.',
      category: 'ITEM', rarity: 'LEGENDARY', price: 2800, emoji: '⚙️',
      imageUrl: '/acessorios/ironman.png', bgGradient: 'linear-gradient(135deg, #450a0a, #ca8a04)'
    },
    {
      title: 'Iron Man Mark 85',
      description: 'A tecnologia nano-robótica definitiva de Tony Stark.',
      category: 'ITEM', rarity: 'LEGENDARY', price: 3500, emoji: '💎',
      imageUrl: '/acessorios/ironman2.png', bgGradient: 'linear-gradient(135deg, #7f1d1d, #dc2626)'
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

  console.log(`✅ ${items.length} novos itens de heróis adicionados à loja!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
