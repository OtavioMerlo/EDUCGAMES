const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🎯 Adicionando mais missões diárias...');

  const extraMissions = [
    { title: 'Madrugador Focado', description: 'Conclua 1 atividade antes das 09:00', emoji: '☕', type: 'ACTIVITIES', targetValue: 1, xpReward: 100, coinReward: 50 },
    { title: 'Maratona de Estudos', description: 'Conclua 5 atividades em um dia', emoji: '🏃‍♂️', type: 'ACTIVITIES', targetValue: 5, xpReward: 300, coinReward: 150 },
    { title: 'Mestre da Persistência', description: 'Ganhe 500 XP hoje', emoji: '🛡️', type: 'XP', targetValue: 500, xpReward: 200, coinReward: 100 },
    { title: 'Conhecimento Diverso', description: 'Conclua atividades de 2 matérias diferentes hoje', emoji: '🧪', type: 'ACTIVITIES', targetValue: 2, xpReward: 120, coinReward: 60 },
  ];

  for (const m of extraMissions) {
    await prisma.dailyMission.create({ data: m });
  }

  console.log('✅ Missões diárias adicionadas!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
