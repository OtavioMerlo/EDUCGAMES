const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar tabelas na ordem correta para evitar erros de Foreign Key
  await prisma.userMission.deleteMany({});
  await prisma.dailyMission.deleteMany({});
  await prisma.userAchievement.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.purchase.deleteMany({});
  await prisma.reward.deleteMany({});
  await prisma.activitySubmission.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.auditLog.deleteMany({});

  // ── USERS ──
  const studentPw = await bcrypt.hash('student123', 12);
  const teacherPw = await bcrypt.hash('teacher123', 12);
  const adminPw = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@educagames.com' },
    update: {},
    create: { name: 'Admin Sistema', email: 'admin@educagames.com', password: adminPw, role: 'ADMIN', avatarColor: '#7c3aed', xp: 99999, coins: 99999, level: 100 }
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'professor@educagames.com' },
    update: {},
    create: { name: 'Prof. Carlos Silva', email: 'professor@educagames.com', password: teacherPw, role: 'TEACHER', avatarColor: '#22d3ee', xp: 5000, coins: 2000, level: 15 }
  });

  const student = await prisma.user.upsert({
    where: { email: 'aluno@educagames.com' },
    update: {},
    create: { name: 'Aluno Demo', email: 'aluno@educagames.com', password: studentPw, role: 'STUDENT', avatarColor: '#a855f7', xp: 2450, coins: 1250, level: 9, streak: 14 }
  });

  // ── REWARDS ──
  const rewardData = [
    { title: 'Minecraft', description: 'Java & Bedrock Edition — jogue em qualquer plataforma! Após a compra, você receberá uma chave de ativação da Microsoft Store no seu histórico de compras.', emoji: '🟩', price: 800, stock: 50, category: 'GAME', rarity: 'RARE', bgGradient: 'linear-gradient(135deg,#2d5a27,#1a3d15)' },
    { title: 'FC 25', description: 'EA Sports FC 25 — o futebol mais realista do mundo! Resgate via código na sua conta EA App ou Steam.', emoji: '⚽', price: 1200, stock: 30, category: 'GAME', rarity: 'EPIC', bgGradient: 'linear-gradient(135deg,#0a2240,#0d3460)' },
    { title: 'Spotify Premium', description: '1 mês de música ilimitada sem anúncios. Você receberá um link de convite para o plano familiar ou um código pré-pago individual para ativar na sua conta Spotify.', emoji: '🎵', price: 350, stock: -1, category: 'SUBSCRIPTION', rarity: 'RARE', bgGradient: 'linear-gradient(135deg,#1DB954,#158a3e)' },
    { title: 'Netflix', description: '1 mês de streaming com os melhores filmes e séries. O código de acesso ou gift card será enviado para o seu e-mail cadastrado em até 24 horas após o resgate.', emoji: '🎬', price: 500, stock: -1, category: 'SUBSCRIPTION', rarity: 'EPIC', bgGradient: 'linear-gradient(135deg,#E50914,#8b0000)' },
    { title: 'Steam Gift Card R$50', description: 'R$50 em créditos Steam. Adicione fundos à sua carteira Steam e compre qualquer jogo da loja!', emoji: '🎮', price: 600, stock: 100, category: 'GIFT_CARD', rarity: 'EPIC', bgGradient: 'linear-gradient(135deg,#1b2838,#2a475e)' },
    
    // AURAS
    { title: 'Aura Super Saiyajin', description: 'O lendário guerreiro de cabelos dourados. Efeito visual agressivo com chamas amarelas pulsantes.', emoji: '✨', price: 500, stock: -1, category: 'COSMETIC', rarity: 'RARE', bgGradient: 'linear-gradient(135deg,#fbbf24,#f59e0b)' },
    { title: 'Aura Kaioken', description: 'Aumente seu poder ao limite! Chamas vermelhas intensas com distorção de calor.', emoji: '🏮', price: 400, stock: -1, category: 'COSMETIC', rarity: 'RARE', bgGradient: 'linear-gradient(135deg,#ef4444,#b91c1c)' },
    { title: 'Aura SSJ Blue', description: 'O poder dos deuses em suas mãos. Aura azul cintilante com partículas de energia divina.', emoji: '🌊', price: 800, stock: -1, category: 'COSMETIC', rarity: 'EPIC', bgGradient: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' },
    { title: 'Aura Instinto Superior', description: 'O domínio do movimento autônomo. Uma aura prateada etérea e calma.', emoji: '⚪', price: 1500, stock: -1, category: 'COSMETIC', rarity: 'EPIC', bgGradient: 'linear-gradient(135deg,#e2e8f0,#94a3b8)' },
    { title: 'Aura SSJ God', description: 'A aura avermelhada do Deus Super Saiyajin. Poder ardente e majestoso.', emoji: '🔥', price: 700, stock: -1, category: 'COSMETIC', rarity: 'RARE', bgGradient: 'linear-gradient(135deg,#f43f5e,#fb7185)' },
    { title: 'Aura SSJ Rosé', description: 'A aura divina e sombria do Super Saiyajin Rosé. Chamas magenta agressivas.', emoji: '🥀', price: 1100, stock: -1, category: 'COSMETIC', rarity: 'EPIC', bgGradient: 'linear-gradient(135deg,#d946ef,#701a75)' },
    { title: 'Aura Lendário', description: 'O ápice do poder absoluto. Uma aura dourada vibrante com ondas de choque.', emoji: '👑', price: 2500, stock: 5, category: 'COSMETIC', rarity: 'LEGENDARY', bgGradient: 'linear-gradient(135deg,#fbbf24,#7c3aed)' },
    { title: 'Aura Broly Lendário', description: 'Poder bruto e incontrolável! Chamas verdes escuras com brilho esmeralda.', emoji: '🍏', price: 900, stock: -1, category: 'COSMETIC', rarity: 'EPIC', bgGradient: 'linear-gradient(135deg,#22c55e,#15803d)' },
    
    // EFFECTS
    { title: 'Efeito Fogos Artificiais', description: 'Comemore cada vitória com explosões coloridas em seu perfil!', emoji: '🎆', price: 300, stock: -1, category: 'COSMETIC', rarity: 'COMMON', bgGradient: 'linear-gradient(135deg,#ec4899,#be185d)' },
    { title: 'Efeito Confetes', description: 'Uma chuva constante de festa para quem gosta de celebrar.', emoji: '🎊', price: 250, stock: -1, category: 'COSMETIC', rarity: 'COMMON', bgGradient: 'linear-gradient(135deg,#facc15,#ca8a04)' },
    { title: 'Efeito Fogos Azuis', description: 'Explosões de energia ciano que emanam do seu avatar.', emoji: '🎇', price: 300, stock: -1, category: 'COSMETIC', rarity: 'COMMON', bgGradient: 'linear-gradient(135deg,#06b6d4,#0891b2)' },
  ];

  for (const r of rewardData) {
    await prisma.reward.create({ data: r });
  }

  // ── ACHIEVEMENTS ──
  const achievementData = [
    { id: 'Pioneiro', title: 'Pioneiro', description: 'Primeiro login no sistema', emoji: '🚀', rarity: 'COMMON', condition: 'XP', conditionValue: 0, xpBonus: 50 },
    { id: 'PrimeirosPassos', title: 'Primeiros Passos', description: 'Conclua sua primeira atividade', emoji: '👣', rarity: 'COMMON', condition: 'ACTIVITIES', conditionValue: 1, xpBonus: 100 },
    { id: 'Estudioso', title: 'Estudioso', description: 'Conclua 5 atividades', emoji: '📚', rarity: 'RARE', condition: 'ACTIVITIES', conditionValue: 5, xpBonus: 250 },
    { id: 'MestreConhecimento', title: 'Mestre do Conhecimento', description: 'Conclua 20 atividades', emoji: '🧙‍♂️', rarity: 'EPIC', condition: 'ACTIVITIES', conditionValue: 20, xpBonus: 1000 },
    { id: 'SemprePresente', title: 'Sempre Presente', description: 'Mantenha uma ofensiva de 3 dias', emoji: '🔥', rarity: 'COMMON', condition: 'STREAK', conditionValue: 3, xpBonus: 150 },
    { id: 'Inabalavel', title: 'Inabalável', description: 'Mantenha uma ofensiva de 7 dias', emoji: '💎', rarity: 'RARE', condition: 'STREAK', conditionValue: 7, xpBonus: 500 },
    { id: 'Rico', title: 'Rico!', description: 'Acumule 1000 moedas', emoji: '💰', rarity: 'RARE', condition: 'COINS', conditionValue: 1000, xpBonus: 200 },
    { id: 'Nivel10', title: 'Nível 10', description: 'Alcance o nível 10', emoji: '🎖️', rarity: 'RARE', condition: 'LEVEL', conditionValue: 10, xpBonus: 500 },
    { id: 'Nivel25', title: 'Nível 25', description: 'Alcance o nível 25', emoji: '🏆', rarity: 'EPIC', condition: 'LEVEL', conditionValue: 25, xpBonus: 1500 },
    { id: 'Fashionista', title: 'Fashionista', description: 'Compre sua primeira aura', emoji: '✨', rarity: 'RARE', condition: 'XP', conditionValue: 999999, xpBonus: 200 }, // Unlock manually or via special check
  ];

  for (const a of achievementData) {
    await prisma.achievement.create({ data: a });
  }

  // ── UNLOCK ACHIEVEMENTS FOR STUDENT ──
  // Based on student stats: xp: 2450, coins: 1250, level: 9, streak: 14
  const studentAchieves = ['Pioneiro', 'SemprePresente', 'Inabalavel', 'Rico'];
  for (const achId of studentAchieves) {
    await prisma.userAchievement.create({
      data: { userId: student.id, achievementId: achId }
    });
  }

  // ── ACTIVITIES ──
  const activityData = [
    {
      title: 'Desafio de Matemática: Soma e Subtração',
      description: 'Pratique operações básicas de matemática com este quiz divertido.',
      type: 'QUIZ',
      difficulty: 'EASY',
      subject: 'Matemática',
      xpReward: 100,
      coinReward: 50,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Quanto é 15 + 27?', options: ['32', '42', '52', '45'], correctAnswer: '42' },
          { id: 'q2', text: 'Quanto é 100 - 35?', options: ['65', '55', '75', '45'], correctAnswer: '65' },
          { id: 'q3', text: 'Se você tem 3 maçãs e ganha mais 5, quantas tem?', options: ['6', '7', '8', '9'], correctAnswer: '8' }
        ]
      })
    },
    {
      title: 'Sistema Solar: Nossos Planetas',
      description: 'O que você sabe sobre os planetas que orbitam o Sol?',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      subject: 'Ciências',
      xpReward: 150,
      coinReward: 75,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Qual é o maior planeta do Sistema Solar?', options: ['Terra', 'Marte', 'Júpiter', 'Saturno'], correctAnswer: 'Júpiter' },
          { id: 'q2', text: 'Qual planeta é conhecido como o "Planeta Vermelho"?', options: ['Vênus', 'Marte', 'Mercúrio', 'Netuno'], correctAnswer: 'Marte' }
        ]
      })
    },
    {
      title: 'Gramática: Substantivos e Adjetivos',
      description: 'Identifique corretamente as classes gramaticais nas frases.',
      type: 'QUIZ',
      difficulty: 'EASY',
      subject: 'Português',
      xpReward: 100,
      coinReward: 50,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Na frase "O carro azul correu", qual é o adjetivo?', options: ['O', 'carro', 'azul', 'correu'], correctAnswer: 'azul' },
          { id: 'q2', text: 'Qual das palavras abaixo é um substantivo próprio?', options: ['Brasil', 'cidade', 'menino', 'cachorro'], correctAnswer: 'Brasil' }
        ]
      })
    },
    {
      title: 'História do Brasil: O Descobrimento',
      description: 'Teste seus conhecimentos sobre o início da história do nosso país.',
      type: 'QUIZ',
      difficulty: 'MEDIUM',
      subject: 'História',
      xpReward: 200,
      coinReward: 100,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Em que ano os portugueses chegaram ao Brasil?', options: ['1492', '1500', '1600', '1822'], correctAnswer: '1500' },
          { id: 'q2', text: 'Quem era o comandante da frota que chegou ao Brasil?', options: ['Vasco da Gama', 'Pedro Álvares Cabral', 'Américo Vespúcio', 'Cristóvão Colombo'], correctAnswer: 'Pedro Álvares Cabral' }
        ]
      })
    }
  ];

  for (const act of activityData) {
    await prisma.activity.create({ data: act });
  }

  // ── DAILY MISSIONS ──
  const missionData = [
    { title: 'Primeira do Dia', description: 'Conclua 1 atividade hoje', emoji: '🎯', type: 'ACTIVITIES', targetValue: 1, xpReward: 50, coinReward: 25 },
    { title: 'Estudioso Diário', description: 'Conclua 3 atividades hoje', emoji: '📚', type: 'ACTIVITIES', targetValue: 3, xpReward: 150, coinReward: 75 },
    { title: 'Caçador de XP', description: 'Ganhe 300 XP em um dia', emoji: '⚡', type: 'XP', targetValue: 300, xpReward: 100, coinReward: 50 },
    { title: 'Mestre do Quiz', description: 'Conclua 2 quizzes hoje', emoji: '📝', type: 'QUIZ', targetValue: 2, xpReward: 80, coinReward: 40 },
  ];

  for (const m of missionData) {
    await prisma.dailyMission.create({ data: m });
  }

  console.log('✅ Seed concluído! Itens restaurados e todas as tabelas povoadas.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
