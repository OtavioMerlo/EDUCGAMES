const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Expandindo conteúdo para a feira...');

  // ── NEW ACHIEVEMENTS ──
  const newAchievements = [
    { id: 'ExploradorGlobal', title: 'Explorador Global', description: 'Conclua atividades de 5 matérias diferentes', emoji: '🌍', rarity: 'RARE', condition: 'XP', conditionValue: 0, xpBonus: 500 },
    { id: 'Inabalavel30', title: 'Veterano Inabalável', description: 'Mantenha uma ofensiva de 30 dias', emoji: '🔥', rarity: 'LEGENDARY', condition: 'STREAK', conditionValue: 30, xpBonus: 5000 },
    { id: 'Magnata', title: 'Magnata da Educação', description: 'Acumule 10.000 moedas', emoji: '💎', rarity: 'LEGENDARY', condition: 'COINS', conditionValue: 10000, xpBonus: 2000 },
    { id: 'Socialite', title: 'Estrela Social', description: 'Consiga 50 amigos na plataforma', emoji: '⭐', rarity: 'EPIC', condition: 'XP', conditionValue: 0, xpBonus: 1000 },
    { id: 'NotaDez', title: 'Perfeccionista', description: 'Consiga nota máxima em 10 atividades seguidas', emoji: '💯', rarity: 'EPIC', condition: 'XP', conditionValue: 0, xpBonus: 1500 },
    { id: 'Madrugador', title: 'Madrugador', description: 'Conclua uma atividade antes das 7h da manhã', emoji: '🌅', rarity: 'COMMON', condition: 'XP', conditionValue: 0, xpBonus: 200 },
    { id: 'CorujaNoturna', title: 'Coruja Noturna', description: 'Conclua uma atividade após a meia-noite', emoji: '🦉', rarity: 'COMMON', condition: 'XP', conditionValue: 0, xpBonus: 200 },
    { id: 'Colecionador', title: 'Colecionador', description: 'Possua 10 itens da loja ao mesmo tempo', emoji: '📦', rarity: 'RARE', condition: 'XP', conditionValue: 0, xpBonus: 800 },
  ];

  for (const a of newAchievements) {
    await prisma.achievement.upsert({
      where: { id: a.id },
      update: a,
      create: a
    });
  }

  // Pegar um professor existente para ser o criador
  const teacher = await prisma.user.findFirst({ where: { role: 'TEACHER' } });
  if (!teacher) {
    console.error('❌ Erro: Nenhum professor encontrado para associar as atividades.');
    return;
  }

  // ── NEW ACTIVITIES ──
  const newActivities = [
    // GEOGRAFIA
    {
      title: 'Capitais do Mundo',
      description: 'Você conhece as capitais dos países mais famosos?',
      type: 'QUIZ', difficulty: 'MEDIUM', subject: 'Geografia', xpReward: 150, coinReward: 70, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Qual a capital da França?', options: ['Londres', 'Paris', 'Berlim', 'Madrid'], correctAnswer: 'Paris' },
          { id: 'q2', text: 'Tóquio é a capital de qual país?', options: ['China', 'Coreia do Sul', 'Japão', 'Tailândia'], correctAnswer: 'Japão' },
          { id: 'q3', text: 'Qual a capital da Argentina?', options: ['Santiago', 'Montevidéu', 'Buenos Aires', 'Lima'], correctAnswer: 'Buenos Aires' }
        ]
      })
    },
    // INGLÊS
    {
      title: 'English Basics: Greetings',
      description: 'Aprenda a cumprimentar as pessoas em inglês.',
      type: 'QUIZ', difficulty: 'EASY', subject: 'Inglês', xpReward: 100, coinReward: 50, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Como se diz "Bom dia" em inglês?', options: ['Good night', 'Good morning', 'Good afternoon', 'Hello'], correctAnswer: 'Good morning' },
          { id: 'q2', text: 'O que significa "How are you"?', options: ['Quem é você?', 'Onde você está?', 'Como vai você?', 'Qual seu nome?'], correctAnswer: 'Como vai você?' }
        ]
      })
    },
    // ARTES
    {
      title: 'Mestres da Pintura',
      description: 'Identifique os autores de obras famosas.',
      type: 'QUIZ', difficulty: 'HARD', subject: 'Artes', xpReward: 250, coinReward: 120, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Quem pintou a "Mona Lisa"?', options: ['Van Gogh', 'Picasso', 'Leonardo da Vinci', 'Dalí'], correctAnswer: 'Leonardo da Vinci' },
          { id: 'q2', text: 'Qual desses artistas é famoso por pintar girassóis?', options: ['Claude Monet', 'Vincent van Gogh', 'Renoir', 'Rembrandt'], correctAnswer: 'Vincent van Gogh' }
        ]
      })
    },
    // TECNOLOGIA
    {
      title: 'Hardware: O que tem dentro do PC?',
      description: 'Entenda os componentes básicos de um computador.',
      type: 'QUIZ', difficulty: 'MEDIUM', subject: 'Tecnologia', xpReward: 180, coinReward: 90, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Qual componente é considerado o "cérebro" do computador?', options: ['Memória RAM', 'HD', 'Processador (CPU)', 'Placa de Vídeo'], correctAnswer: 'Processador (CPU)' },
          { id: 'q2', text: 'Onde os arquivos ficam salvos permanentemente?', options: ['Teclado', 'Monitor', 'HD ou SSD', 'Mouse'], correctAnswer: 'HD ou SSD' }
        ]
      })
    },
    // CIÊNCIAS
    {
      title: 'O Corpo Humano: Órgãos Vitais',
      description: 'Teste seus conhecimentos sobre como nosso corpo funciona.',
      type: 'QUIZ', difficulty: 'MEDIUM', subject: 'Ciências', xpReward: 160, coinReward: 80, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Qual órgão é responsável por bombear o sangue?', options: ['Pulmão', 'Fígado', 'Coração', 'Estômago'], correctAnswer: 'Coração' },
          { id: 'q2', text: 'Onde ocorre a maior parte da nossa respiração?', options: ['Rins', 'Pulmões', 'Intestino', 'Cérebro'], correctAnswer: 'Pulmões' }
        ]
      })
    },
  ];

  for (const act of newActivities) {
    await prisma.activity.create({ data: act });
  }

  console.log('✅ Conteúdo expandido com sucesso! Boa sorte na feira! 🍀');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
