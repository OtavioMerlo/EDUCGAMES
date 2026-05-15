const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔥 Iniciando geração massiva de atividades...');

  const teacher = await prisma.user.findFirst({ where: { role: 'TEACHER' } });
  if (!teacher) {
    console.error('❌ Erve: Nenhum professor encontrado.');
    return;
  }

  const subjects = [
    { name: 'Matemática', icons: '🔢', topics: ['Soma', 'Subtração', 'Multiplicação', 'Divisão', 'Frações', 'Geometria', 'Lógica', 'Álgebra'] },
    { name: 'Português', icons: '📚', topics: ['Gramática', 'Ortografia', 'Leitura', 'Literatura', 'Verbos', 'Substantivos', 'Adjetivos', 'Pontuação'] },
    { name: 'História', icons: '⏳', topics: ['Brasil Colônia', 'Império', 'República', 'Guerra Mundial', 'Antiguidade', 'Egito Antigo', 'Roma', 'Grécia'] },
    { name: 'Geografia', icons: '🗺️', topics: ['Clima', 'Relevo', 'População', 'Estados do Brasil', 'Continentes', 'Meio Ambiente', 'Globalização'] },
    { name: 'Ciências', icons: '🧪', topics: ['Corpo Humano', 'Plantas', 'Animais', 'Ecossistema', 'Sistema Solar', 'Água', 'Solo', 'Energia'] },
    { name: 'Inglês', icons: '🇬🇧', topics: ['Vocabulary', 'Verb to Be', 'Present Simple', 'Colors', 'Numbers', 'Family', 'Food', 'Travel'] },
    { name: 'Artes', icons: '🎨', topics: ['Cores Primárias', 'Desenho', 'Pintura', 'Escultura', 'Artistas Famosos', 'Modernismo', 'Renascimento'] },
    { name: 'Tecnologia', icons: '💻', topics: ['Internet', 'Hardware', 'Software', 'Redes Sociais', 'Programação Básica', 'Segurança Digital'] },
    { name: 'Educação Física', icons: '⚽', topics: ['Esportes', 'Saúde', 'Alongamento', 'Regras do Futebol', 'Basquete', 'Vôlei', 'Atletismo'] }
  ];

  const difficulties = ['EASY', 'MEDIUM', 'HARD'];
  const newActivities = [];

  for (const sub of subjects) {
    for (const topic of sub.topics) {
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      newActivities.push({
        title: `${sub.icons} ${topic}: Desafio ${Math.floor(Math.random() * 100)}`,
        description: `Teste seus conhecimentos sobre ${topic} nesta atividade de ${sub.name}.`,
        type: 'QUIZ',
        difficulty,
        subject: sub.name,
        xpReward: difficulty === 'EASY' ? 100 : difficulty === 'MEDIUM' ? 150 : 250,
        coinReward: difficulty === 'EASY' ? 50 : difficulty === 'MEDIUM' ? 75 : 120,
        createdBy: teacher.id,
        content: JSON.stringify({
          questions: [
            { id: 'q1', text: `Pergunta sobre ${topic} 1?`, options: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correctAnswer: 'Opção A' },
            { id: 'q2', text: `Pergunta sobre ${topic} 2?`, options: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correctAnswer: 'Opção B' }
          ]
        })
      });
    }
  }

  console.log(`📦 Gerando ${newActivities.length} atividades...`);

  // Batch create to be faster
  await prisma.activity.createMany({
    data: newActivities
  });

  console.log('✅ Geração concluída! O banco agora está lotado de desafios.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
