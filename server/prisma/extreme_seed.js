const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔥 Iniciando geração EXTREMA de atividades...');

  const teacher = await prisma.user.findFirst({ where: { role: 'TEACHER' } });
  if (!teacher) return;

  const subjects = ['Matemática', 'Português', 'História', 'Geografia', 'Ciências', 'Inglês', 'Artes', 'Tecnologia', 'Educação Física'];
  const icons = ['🔢', '📚', '⏳', '🗺️', '🧪', '🇬🇧', '🎨', '💻', '⚽'];
  const difficulties = ['EASY', 'MEDIUM', 'HARD'];
  
  const activities = [];
  for (let i = 1; i <= 200; i++) {
    const subIdx = Math.floor(Math.random() * subjects.length);
    const diff = difficulties[Math.floor(Math.random() * difficulties.length)];
    
    activities.push({
      title: `${icons[subIdx]} Atividade Especial #${i + 100}`,
      description: `Um desafio avançado de ${subjects[subIdx]} para alunos dedicados.`,
      type: 'QUIZ',
      difficulty: diff,
      subject: subjects[subIdx],
      xpReward: diff === 'EASY' ? 100 : diff === 'MEDIUM' ? 150 : 250,
      coinReward: diff === 'EASY' ? 50 : diff === 'MEDIUM' ? 75 : 120,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Pergunta aleatória 1?', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' },
          { id: 'q2', text: 'Pergunta aleatória 2?', options: ['A', 'B', 'C', 'D'], correctAnswer: 'B' }
        ]
      })
    });
  }

  await prisma.activity.createMany({ data: activities });
  console.log('✅ Mais 200 atividades adicionadas ao sistema!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
