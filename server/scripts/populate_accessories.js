const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('⚡ Adicionando acessórios lendários de anime...');

  const items = [
    // ── CABELOS LEGENDÁRIOS ──
    {
      title: 'Cabelo Super Saiyajin',
      description: 'O cabelo dourado e espetado de Goku em sua forma de Super Saiyajin. Um símbolo de transformação épica que vai além dos limites mortais.',
      emoji: '💛', price: 4500, stock: -1, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #3a2800, #f59e0b, #fde68a)',
      imageUrl: '/acessorios/card_ssj.png',
    },
    {
      title: 'Cabelo Deus Sayajin',
      description: 'O poder divino dos Deuses Saiyajin. Cabelo vermelho flamejante que emana a energia dos deuses — a forma que supera o Super Saiyajin.',
      emoji: '🔴', price: 6000, stock: 15, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #3a0000, #dc2626, #fca5a5)',
      imageUrl: '/acessorios/card_ssj_god.png',
    },
    {
      title: 'Cabelo Sayajin Clássico',
      description: 'O visual selvagem e imponente do Saiyajin em sua forma base. Cabelo preto espetado, denso e poderoso — a marca dos guerreiros de Elite.',
      emoji: '🖤', price: 3000, stock: -1, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #0a0a0a, #374151, #6b7280)',
      imageUrl: '/acessorios/saiajin.png',
    },

    // ── MARCAS E OLHOS ──
    {
      title: 'Marca do Caçador — Tanjiro',
      description: 'A marca de nascença de Tanjiro Kamado, que arde como chamas quando seu poder desperta. Símbolo dos Caçadores de Demônios Marcados.',
      emoji: '🔥', price: 5000, stock: 10, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #1a0000, #7f1d1d, #ef4444)',
      imageUrl: '/acessorios/card_tanjiro.png',
    },
    {
      title: 'Sharingan do Uchiha',
      description: 'O Olho da Cópia dos clãs Uchiha. Vê através das ilusões, copia jutsu e desvenda todos os segredos. Poder que custou sangue e laços.',
      emoji: '👁️', price: 4000, stock: -1, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #1a0000, #b91c1c, #fca5a5)',
      imageUrl: '/acessorios/sharingan.png',
    },
    {
      title: 'Rinnegan-Sharingan Eterno',
      description: 'A combinação mais rara de todos os olhos místicos. O Rinnegan com o padrão do Sharingan — o olho que controla vida, morte e gravidade.',
      emoji: '🌀', price: 8000, stock: 5, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #0d0020, #6d28d9, #c4b5fd)',
      imageUrl: '/acessorios/card_rinesharingan.png',
    },
    {
      title: 'Rinnegan Puro',
      description: 'O olho do Deus — o Rinnegan puro e etéreo. Permite dominar os Seis Caminhos, ressuscitar os mortos e controlar forças cósmicas.',
      emoji: '🔮', price: 6500, stock: 8, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #150030, #7c3aed, #ddd6fe)',
      imageUrl: '/acessorios/rinengan.png',
    },

    // ── SÍMBOLOS E ACESSÓRIOS ──
    {
      title: 'Nuvem da Akatsuki',
      description: 'O emblema da organização criminosa mais temida — a nuvem vermelha na capa negra. Use com sabedoria: este símbolo carrega muito peso.',
      emoji: '☁️', price: 3500, stock: -1, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #0a0000, #450a0a, #991b1b)',
      imageUrl: '/acessorios/akttsuki.png',
    },
    {
      title: 'Bandana de Konoha',
      description: 'A faixa de ninja da Vila da Folha Oculta. Forjada em metal com o símbolo sagrado de Konoha — um emblema de coragem e pertencimento.',
      emoji: '🎖️', price: 2500, stock: -1, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #0c1a2e, #1e3a5f, #60a5fa)',
      imageUrl: '/acessorios/bandana.png',
    },
    {
      title: 'Brincos Potara',
      description: 'Os míticos Potara — os brincos dos Kaioshins que permitem a fusão mais poderosa do universo. Verde esmeralda com energia cósmica irradiando.',
      emoji: '💎', price: 5500, stock: 12, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #052e16, #065f46, #34d399)',
      imageUrl: '/acessorios/brincos do dragao ball.png',
    },
    {
      title: 'Manto Kurama Completo',
      description: 'O manto de chakra chakra dourado de Naruto em modo Kurama Completo. Uma armor espiritual de poder incondicional.',
      emoji: '🦊', price: 7000, stock: 8, category: 'ACCESSORY', rarity: 'LEGENDARY',
      bgGradient: 'linear-gradient(135deg, #3a1a00, #d97706, #fde68a)',
      imageUrl: '/acessorios/naruto chakara.png',
    },
  ];

  for (const item of items) {
    const exists = await prisma.reward.findFirst({ where: { title: item.title } });
    if (!exists) {
      await prisma.reward.create({ data: item });
      console.log(`  ✅ ${item.emoji} ${item.title}`);
    } else {
      // Update imageUrl if already exists
      await prisma.reward.update({ where: { id: exists.id }, data: { imageUrl: item.imageUrl } });
      console.log(`  🔄 ${item.title} (imageUrl atualizado)`);
    }
  }

  console.log('\n🎉 Acessórios lendários adicionados!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
