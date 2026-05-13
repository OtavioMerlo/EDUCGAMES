const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🏆 Criando conquistas épicas...');

  const achievements = [
    // ── PROGRESSÃO DE NÍVEL ──
    {
      title: 'Primeiros Passos',
      description: 'Alcance o nível 5 para começar sua jornada.',
      emoji: '🌱', rarity: 'COMMON', condition: 'LEVEL', conditionValue: 5,
      xpBonus: 100, coinBonus: 50
    },
    {
      title: 'Estudante Dedicado',
      description: 'Alcance o nível 10 e mostre que você leva a sério.',
      emoji: '📚', rarity: 'COMMON', condition: 'LEVEL', conditionValue: 10,
      xpBonus: 250, coinBonus: 100
    },
    {
      title: 'Mestre do Conhecimento',
      description: 'Alcance o nível 25. Você já é uma referência!',
      emoji: '🎓', rarity: 'RARE', condition: 'LEVEL', conditionValue: 25,
      xpBonus: 1000, coinBonus: 500
    },
    {
      title: 'Lenda do EducaGames',
      description: 'Alcance o nível 50. Seu nome será lembrado!',
      emoji: '👑', rarity: 'EPIC', condition: 'LEVEL', conditionValue: 50,
      xpBonus: 5000, coinBonus: 2000
    },
    {
      title: 'Divindade Suprema',
      description: 'Alcance o nível 100. Você atingiu o ápice do intelecto.',
      emoji: '✨', rarity: 'LEGENDARY', condition: 'LEVEL', conditionValue: 100,
      xpBonus: 20000, coinBonus: 10000
    },

    // ── ATIVIDADES ──
    {
      title: 'Curioso',
      description: 'Complete suas primeiras 5 atividades.',
      emoji: '🔎', rarity: 'COMMON', condition: 'ACTIVITIES', conditionValue: 5,
      xpBonus: 50, coinBonus: 20
    },
    {
      title: 'Maratonista de Estudos',
      description: 'Complete 50 atividades. Nada te para!',
      emoji: '🏃', rarity: 'RARE', condition: 'ACTIVITIES', conditionValue: 50,
      xpBonus: 500, coinBonus: 300
    },
    {
      title: 'Enciclopédia Humana',
      description: 'Complete 200 atividades. Seu cérebro é uma máquina!',
      emoji: '🧠', rarity: 'EPIC', condition: 'ACTIVITIES', conditionValue: 200,
      xpBonus: 2500, coinBonus: 1500
    },

    // ── ECONOMIA ──
    {
      title: 'Poupador',
      description: 'Acumule 1.000 moedas.',
      emoji: '💰', rarity: 'COMMON', condition: 'COINS', conditionValue: 1000,
      xpBonus: 100, coinBonus: 0
    },
    {
      title: 'Rico!',
      description: 'Acumule 10.000 moedas.',
      emoji: '💎', rarity: 'RARE', condition: 'COINS', conditionValue: 10000,
      xpBonus: 500, coinBonus: 0
    },
    {
      title: 'Magnata da Educação',
      description: 'Acumule 50.000 moedas.',
      emoji: '🏦', rarity: 'EPIC', condition: 'COINS', conditionValue: 50000,
      xpBonus: 2000, coinBonus: 0
    },

    // ── STREAK (CONSTÂNCIA) ──
    {
      title: 'Ritmo Inicial',
      description: 'Mantenha uma ofensiva de 3 dias seguidos.',
      emoji: '🔥', rarity: 'COMMON', condition: 'STREAK', conditionValue: 3,
      xpBonus: 150, coinBonus: 75
    },
    {
      title: 'Hábito de Ferro',
      description: 'Mantenha uma ofensiva de 7 dias seguidos.',
      emoji: '🛡️', rarity: 'RARE', condition: 'STREAK', conditionValue: 7,
      xpBonus: 500, coinBonus: 250
    },
    {
      title: 'Inabalável',
      description: 'Mantenha uma ofensiva de 30 dias seguidos.',
      emoji: '🏔️', rarity: 'EPIC', condition: 'STREAK', conditionValue: 30,
      xpBonus: 3000, coinBonus: 1000
    },

    // ── ESPECIAIS (ANIME STYLE) ──
    {
      title: 'Despertar do Poder',
      description: 'Equipe sua primeira aura ou acessório lendário.',
      emoji: '⚡', rarity: 'EPIC', condition: 'SPECIAL', conditionValue: 1,
      xpBonus: 1000, coinBonus: 500
    },
    {
      title: 'Colecionador de Relíquias',
      description: 'Possua 10 itens lendários no inventário.',
      emoji: '🎒', rarity: 'LEGENDARY', condition: 'SPECIAL', conditionValue: 10,
      xpBonus: 10000, coinBonus: 5000
    }
  ];

  for (const ach of achievements) {
    const exists = await prisma.achievement.findFirst({ where: { title: ach.title } });
    if (!exists) {
      await prisma.achievement.create({ data: ach });
      console.log(`  ✅ ${ach.emoji} ${ach.title}`);
    } else {
      await prisma.achievement.update({ where: { id: exists.id }, data: ach });
      console.log(`  🔄 ${ach.title} (atualizada)`);
    }
  }

  console.log('\n🎉 Conquistas criadas com sucesso!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
