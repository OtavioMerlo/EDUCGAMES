const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Populando banco de dados com conteúdo épico...');

  // 1. Buscar um professor para ser o criador
  const teacher = await prisma.user.findFirst({ where: { role: 'TEACHER' } });
  if (!teacher) {
    console.error('❌ Erro: Crie um professor primeiro!');
    return;
  }

  // ── NOVAS ATIVIDADES ──
  const activities = [
    {
      title: '🌍 Capitais do Mundo',
      description: 'Teste seus conhecimentos sobre as capitais de diversos países.',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      subject: 'Geografia',
      xpReward: 150,
      coinReward: 75,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Qual é a capital da França?', options: ['Londres', 'Paris', 'Berlim', 'Madrid'], correctAnswer: 'Paris' },
          { id: 'q2', text: 'Qual é a capital do Japão?', options: ['Seul', 'Pequim', 'Tóquio', 'Bangcoc'], correctAnswer: 'Tóquio' },
          { id: 'q3', text: 'Qual é a capital da Austrália?', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correctAnswer: 'Canberra' }
        ]
      })
    },
    {
      title: '🇬🇧 English Basics: Verb To Be',
      description: 'Pratique o verbo mais importante da língua inglesa.',
      type: 'QUIZ',
      difficulty: 'EASY',
      subject: 'Inglês',
      xpReward: 120,
      coinReward: 60,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'I ___ a student.', options: ['am', 'is', 'are', 'be'], correctAnswer: 'am' },
          { id: 'q2', text: 'They ___ playing football.', options: ['am', 'is', 'are', 'be'], correctAnswer: 'are' },
          { id: 'q3', text: 'She ___ very happy.', options: ['am', 'is', 'are', 'be'], correctAnswer: 'is' }
        ]
      })
    },
    {
      title: '🧪 O Ciclo da Água',
      description: 'Explique com suas palavras o processo de evaporação e precipitação.',
      type: 'TEXT',
      difficulty: 'MEDIUM',
      subject: 'Ciências',
      xpReward: 200,
      coinReward: 100,
      createdBy: teacher.id,
      content: JSON.stringify({
        instructions: 'Escreva um parágrafo sobre como a água volta para as nuvens.',
        minLength: 50
      })
    },
    {
      title: '🔢 Desafio das Multiplicações',
      description: 'Resolva as operações o mais rápido possível!',
      type: 'QUIZ',
      difficulty: 'MEDIUM',
      subject: 'Matemática',
      xpReward: 180,
      coinReward: 90,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Quanto é 7 x 8?', options: ['48', '54', '56', '64'], correctAnswer: '56' },
          { id: 'q2', text: 'Quanto é 9 x 6?', options: ['45', '54', '63', '72'], correctAnswer: '54' },
          { id: 'q3', text: 'Quanto é 12 x 12?', options: ['124', '144', '164', '184'], correctAnswer: '144' }
        ]
      })
    },
    {
      title: '⚔️ Grandes Guerras: Verdadeiro ou Falso',
      description: 'Teste sua memória histórica sobre os grandes conflitos mundiais.',
      type: 'TRUE_FALSE',
      difficulty: 'HARD',
      subject: 'História',
      xpReward: 250,
      coinReward: 125,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'A Segunda Guerra Mundial terminou em 1945.', correctAnswer: 'TRUE' },
          { id: 'q2', text: 'Napoleão Bonaparte foi um imperador da Inglaterra.', correctAnswer: 'FALSE' },
          { id: 'q3', text: 'O Muro de Berlim caiu em 1989.', correctAnswer: 'TRUE' }
        ]
      })
    },
    {
      title: '🎨 Expressão Artística',
      description: 'Faça um desenho de uma paisagem e envie uma foto.',
      type: 'UPLOAD',
      difficulty: 'EASY',
      subject: 'Artes',
      xpReward: 150,
      coinReward: 200,
      createdBy: teacher.id,
      content: JSON.stringify({
        instructions: 'Desenhe algo que te inspire e faça o upload da imagem.',
        allowedTypes: ['jpg', 'png']
      })
    },
    {
      title: '💻 Lógica de Programação',
      description: 'Entenda os conceitos básicos de algoritmos.',
      type: 'QUIZ',
      difficulty: 'HARD',
      subject: 'Tecnologia',
      xpReward: 300,
      coinReward: 150,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'O que é um "loop" na programação?', options: ['Um erro', 'Uma repetição', 'Uma variável', 'Um comentário'], correctAnswer: 'Uma repetição' },
          { id: 'q2', text: 'Qual destas é uma linguagem de programação?', options: ['HTML', 'Python', 'JSON', 'CSS'], correctAnswer: 'Python' }
        ]
      })
    }
  ];

  for (const act of activities) {
    await prisma.activity.create({ data: act });
  }

  // ── NOVAS CONQUISTAS ──
  const achievements = [
    {
      title: '🎓 Mestre Acadêmico',
      description: 'Conclua 50 atividades com sucesso.',
      emoji: '🎓',
      rarity: 'LEGENDARY',
      condition: 'ACTIVITIES',
      conditionValue: 50,
      xpBonus: 2000,
      coinBonus: 1000
    },
    {
      title: '🔥 Inextinguível',
      description: 'Mantenha um streak de 30 dias.',
      emoji: '🔥',
      rarity: 'LEGENDARY',
      condition: 'STREAK',
      conditionValue: 30,
      xpBonus: 1500,
      coinBonus: 750
    },
    {
      title: '💰 Magnata do Conhecimento',
      description: 'Acumule 5.000 moedas.',
      emoji: '💎',
      rarity: 'EPIC',
      condition: 'COINS',
      conditionValue: 5000,
      xpBonus: 500,
      coinBonus: 0
    },
    {
      title: '🎖️ Veterano de Elite',
      description: 'Alcance o nível 50.',
      emoji: '🎖️',
      rarity: 'LEGENDARY',
      condition: 'LEVEL',
      conditionValue: 50,
      xpBonus: 3000,
      coinBonus: 1500
    },
    {
      title: '⚡ Velocista',
      description: 'Ganhe 1.000 XP em um único dia.',
      emoji: '⚡',
      rarity: 'EPIC',
      condition: 'XP',
      conditionValue: 1000, // Aqui depende da lógica de check diário, mas usaremos como XP total por enquanto
      xpBonus: 500,
      coinBonus: 250
    },
    {
      title: '🤝 Socializador',
      description: 'Complete seu perfil e adicione uma bio.',
      emoji: '👋',
      rarity: 'COMMON',
      condition: 'SPECIAL',
      conditionValue: 1,
      xpBonus: 100,
      coinBonus: 50
    },
    {
      title: '🌈 Colecionador de Auras',
      description: 'Possua 5 auras diferentes em seu inventário.',
      emoji: '🌈',
      rarity: 'EPIC',
      condition: 'SPECIAL',
      conditionValue: 5,
      xpBonus: 1000,
      coinBonus: 500
    }
  ];

  for (const ach of achievements) {
    await prisma.achievement.create({ data: ach });
  }

  // ── NOVAS MISSÕES DIÁRIAS ──
  const dailyMissions = [
    { title: 'Maratona de Quizzes', description: 'Conclua 5 quizzes hoje', emoji: '📝', type: 'QUIZ', targetValue: 5, xpReward: 250, coinReward: 125 },
    { title: 'Explorador', description: 'Ganhe 500 XP hoje', emoji: '🧭', type: 'XP', targetValue: 500, xpReward: 150, coinReward: 75 },
    { title: 'Dedicado', description: 'Conclua 3 atividades de qualquer tipo', emoji: '⭐', type: 'ACTIVITIES', targetValue: 3, xpReward: 100, coinReward: 50 }
  ];

  for (const m of dailyMissions) {
    await prisma.dailyMission.create({ data: m });
  }

  console.log('✅ Banco de dados enriquecido com sucesso!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
