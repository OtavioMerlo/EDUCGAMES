const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🍃 Injetando cosméticos de Naruto e acessórios de anime...');

  const narutoAuras = [
    // ── NARUTO CHAKRA MODES ──
    {
      title: 'Modo Chakra Básico',
      description: 'O chakra azul e laranja de Naruto Uzumaki em sua forma clássica. Aura bicolor com partículas suaves.',
      emoji: '🌀', price: 200, stock: -1, category: 'COSMETIC', rarity: 'COMMON',
      bgGradient: 'linear-gradient(135deg,#1a3a6e,#3b8beb)'
    },
    {
      title: 'Modo Kurama',
      description: 'O poder do Kyuubi fluindo através do seu corpo! Chamas douradas intensas com 9 caudas vibrando ao redor.',
      emoji: '🦊', price: 700, stock: -1, category: 'COSMETIC', rarity: 'RARE',
      bgGradient: 'linear-gradient(135deg,#8b4500,#f4a742)'
    },
    {
      title: 'Modo Kurama Completo',
      description: 'A forma energética completa do Bijuu! Uma explosão de chakra dourado puro capaz de mover montanhas.',
      emoji: '💥', price: 1200, stock: -1, category: 'COSMETIC', rarity: 'EPIC',
      bgGradient: 'linear-gradient(135deg,#3a1a00,#ffaa00)'
    },
    {
      title: 'Modo Sábio',
      description: 'O jutsu lendário ensinado pelos sapos de Myobokuzan. Energia natural em harmonia perfeita.',
      emoji: '🍃', price: 650, stock: -1, category: 'COSMETIC', rarity: 'RARE',
      bgGradient: 'linear-gradient(135deg,#1a2a10,#8bc34a)'
    },
    {
      title: 'Modo Sábio dos Seis Caminhos',
      description: 'O poder conferido pelo Sábio dos Seis Caminhos. Seis orbes negras flutuam ao redor do usuário. Aura divina dourada.',
      emoji: '✨', price: 2000, stock: -1, category: 'COSMETIC', rarity: 'EPIC',
      bgGradient: 'linear-gradient(135deg,#2a2520,#ffeec0)'
    },
    {
      title: 'Modo Rinnegan',
      description: 'Os olhos do Deus. Chakra roxo etéreo com anéis de distorção espacial girando ao redor do avatar.',
      emoji: '👁️', price: 1500, stock: -1, category: 'COSMETIC', rarity: 'EPIC',
      bgGradient: 'linear-gradient(135deg,#150a20,#7b2fbe)'
    },
    {
      title: 'Modo Kurama + Sábio',
      description: 'A combinação mais poderosa da série! Chakra dourado misturado com energia natural. Um modo híbrido devastador.',
      emoji: '⚡', price: 3000, stock: 20, category: 'COSMETIC', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg,#2a1a05,#ffcc00,#8bc34a)'
    },
    {
      title: 'Modo Baryon',
      description: 'O modo mais perigoso de Naruto. Vida sendo consumida a cada segundo. Chamas vermelhas que piscam com raiva.',
      emoji: '💀', price: 5000, stock: 5, category: 'COSMETIC', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg,#1a0000,#e03030)'
    },
    {
      title: 'Modo Akatsuki',
      description: 'A estética sombria da organização criminosa mais temida. Chakra negro com nuvens vermelhas sutis.',
      emoji: '☁️', price: 900, stock: -1, category: 'COSMETIC', rarity: 'EPIC',
      bgGradient: 'linear-gradient(135deg,#0a0008,#1a0a10)'
    },

    // ── ACESSÓRIOS DE ANIME ──
    {
      title: 'Headband Konoha',
      description: 'A faixa dos ninja de Konoha. Metálica com o símbolo da Vila Oculta da Folha. Um clássico!',
      emoji: '🎌', price: 150, stock: -1, category: 'ACCESSORY', rarity: 'COMMON',
      bgGradient: 'linear-gradient(135deg,#1a2a3a,#4a9eff)'
    },
    {
      title: 'Headband Akatsuki',
      description: 'A faixa de ninja com o símbolo de sua vila natal riscado. Símbolo de traição e poder supremo.',
      emoji: '🖤', price: 400, stock: -1, category: 'ACCESSORY', rarity: 'RARE',
      bgGradient: 'linear-gradient(135deg,#0a0000,#cc2222)'
    },
    {
      title: 'Óculos Estilosos',
      description: 'Armação preta estilo anime. Discreta mas elegante, perfeita para quem quer parecer inteligente.',
      emoji: '🕶️', price: 300, stock: -1, category: 'ACCESSORY', rarity: 'RARE',
      bgGradient: 'linear-gradient(135deg,#111,#333)'
    },
    {
      title: 'Chapéu de Hokage',
      description: 'O chapéu cônico do líder máximo de Konoha! Com o kanji "Fogo" bordado em vermelho.',
      emoji: '🎩', price: 800, stock: -1, category: 'ACCESSORY', rarity: 'EPIC',
      bgGradient: 'linear-gradient(135deg,#f0f0f0,#c0392b)'
    },
    {
      title: 'Coroa Lendária',
      description: 'Uma coroa dourada que brilha com chakra. Exclusiva dos maiores lendas da plataforma.',
      emoji: '👑', price: 2500, stock: 10, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg,#3a2000,#fbbf24)'
    },
    {
      title: 'Chapéu de Samurai',
      description: 'Um chapéu cônico de palha ao estilo dos guerreiros errantes do Vento. Simples, mas marcante.',
      emoji: '🎌', price: 180, stock: -1, category: 'ACCESSORY', rarity: 'COMMON',
      bgGradient: 'linear-gradient(135deg,#3a2a10,#8b6a30)'
    },
  ];

  for (const item of narutoAuras) {
    // Verificar se já existe para não duplicar
    const exists = await prisma.reward.findFirst({ where: { title: item.title } });
    if (!exists) {
      await prisma.reward.create({ data: item });
      console.log(`  ✅ ${item.emoji} ${item.title} (${item.rarity})`);
    } else {
      console.log(`  ⏭️  ${item.title} já existe, pulando.`);
    }
  }

  console.log('\n🎉 Cosméticos de Naruto e acessórios adicionados com sucesso!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
