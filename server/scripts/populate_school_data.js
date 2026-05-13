const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📚 Gerando carga acadêmica massiva...');

  const teacher = await prisma.user.findFirst({ where: { role: 'TEACHER' } });
  if (!teacher) {
    console.error('❌ Erro: Professor não encontrado.');
    return;
  }

  const schoolActivities = [
    // --- BIOLOGIA ---
    {
      title: '🧬 Citologia: A Célula',
      description: 'Identifique as organelas celulares e suas funções básicas.',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      subject: 'Biologia',
      xpReward: 160,
      coinReward: 80,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Qual organela é responsável pela respiração celular?', options: ['Ribossomo', 'Mitocôndria', 'Complexo de Golgi', 'Lisossomo'], correctAnswer: 'Mitocôndria' },
          { id: 'q2', text: 'Onde fica armazenado o DNA na célula eucarionte?', options: ['Citoplasma', 'Núcleo', 'Membrana', 'Vacúolo'], correctAnswer: 'Núcleo' }
        ]
      })
    },
    {
      title: '🌿 Fotossíntese',
      description: 'Como as plantas transformam luz em energia?',
      type: 'QUIZ',
      difficulty: 'MEDIUM',
      subject: 'Biologia',
      xpReward: 180,
      coinReward: 90,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Qual pigmento capta a luz solar?', options: ['Hemoglobina', 'Clorofila', 'Melanina', 'Caroteno'], correctAnswer: 'Clorofila' },
          { id: 'q2', text: 'O que as plantas liberam durante a fotossíntese?', options: ['Oxigênio', 'Gás Carbônico', 'Nitrogênio', 'Hidrogênio'], correctAnswer: 'Oxigênio' }
        ]
      })
    },

    // --- QUÍMICA ---
    {
      title: '⚗️ Tabela Periódica',
      description: 'Reconheça os elementos e suas propriedades.',
      type: 'QUIZ',
      difficulty: 'HARD',
      subject: 'Química',
      xpReward: 220,
      coinReward: 110,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Qual é o símbolo químico do Ouro?', options: ['Ag', 'Fe', 'Au', 'Pb'], correctAnswer: 'Au' },
          { id: 'q2', text: 'Qual destes é um gás nobre?', options: ['Oxigênio', 'Hélio', 'Cloro', 'Sódio'], correctAnswer: 'Hélio' },
          { id: 'q3', text: 'Qual o elemento mais abundante no universo?', options: ['Oxigênio', 'Carbono', 'Hidrogênio', 'Nitrogênio'], correctAnswer: 'Hidrogênio' }
        ]
      })
    },
    {
      title: '💧 Estados da Matéria',
      description: 'Mudanças físicas da matéria.',
      type: 'TRUE_FALSE',
      difficulty: 'EASY',
      subject: 'Química',
      xpReward: 100,
      coinReward: 50,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'A passagem do estado sólido para o líquido chama-se fusão.', correctAnswer: 'TRUE' },
          { id: 'q2', text: 'A sublimação é a passagem do líquido para o gasoso.', correctAnswer: 'FALSE' }
        ]
      })
    },

    // --- MATEMÁTICA ---
    {
      title: '📐 Geometria: Triângulos',
      description: 'Cálculos de área e Teorema de Pitágoras.',
      type: 'QUIZ',
      difficulty: 'HARD',
      subject: 'Matemática',
      xpReward: 250,
      coinReward: 125,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Em um triângulo retângulo, a soma dos quadrados dos catetos é igual ao quadrado da...?', options: ['Base', 'Altura', 'Hipotenusa', 'Área'], correctAnswer: 'Hipotenusa' },
          { id: 'q2', text: 'Qual a área de um triângulo de base 10 e altura 5?', options: ['25', '50', '15', '100'], correctAnswer: '25' }
        ]
      })
    },
    {
      title: '📈 Equações de 1º Grau',
      description: 'Encontre o valor de X.',
      type: 'QUIZ',
      difficulty: 'MEDIUM',
      subject: 'Matemática',
      xpReward: 150,
      coinReward: 75,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Se 2x + 10 = 20, qual o valor de x?', options: ['5', '10', '15', '2'], correctAnswer: '5' },
          { id: 'q2', text: 'Se 3x - 9 = 0, qual o valor de x?', options: ['3', '6', '9', '0'], correctAnswer: '3' }
        ]
      })
    },

    // --- PORTUGUÊS ---
    {
      title: '✍️ Figuras de Linguagem',
      description: 'Identifique metáforas, hipérboles e outras figuras.',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      subject: 'Português',
      xpReward: 140,
      coinReward: 70,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: '"Estou morrendo de fome" é um exemplo de:', options: ['Metáfora', 'Hipérbole', 'Ironia', 'Eufemismo'], correctAnswer: 'Hipérbole' },
          { id: 'q2', text: '"Aquele rapaz é um gato" é um exemplo de:', options: ['Metáfora', 'Personificação', 'Pleonasmo', 'Antítese'], correctAnswer: 'Metáfora' }
        ]
      })
    },
    {
      title: '📖 Literatura Brasileira: Modernismo',
      description: 'Conheça os grandes autores da Semana de Arte Moderna.',
      type: 'QUIZ',
      difficulty: 'HARD',
      subject: 'Português',
      xpReward: 210,
      coinReward: 105,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Quem escreveu "Macunaíma"?', options: ['Machado de Assis', 'Mário de Andrade', 'Oswald de Andrade', 'Manuel Bandeira'], correctAnswer: 'Mário de Andrade' },
          { id: 'q2', text: 'Em que ano ocorreu a Semana de Arte Moderna?', options: ['1922', '1930', '1900', '1945'], correctAnswer: '1922' }
        ]
      })
    },

    // --- FÍSICA ---
    {
      title: '🍎 Leis de Newton',
      description: 'Os princípios fundamentais da dinâmica.',
      type: 'QUIZ',
      difficulty: 'HARD',
      subject: 'Física',
      xpReward: 240,
      coinReward: 120,
      createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Qual lei diz que "toda ação gera uma reação de mesma intensidade"?', options: ['1ª Lei', '2ª Lei', '3ª Lei', 'Lei da Gravidade'], correctAnswer: '3ª Lei' },
          { id: 'q2', text: 'A tendência de um corpo de permanecer em repouso é a...?', options: ['Força', 'Velocidade', 'Inércia', 'Aceleração'], correctAnswer: 'Inércia' }
        ]
      })
    }
  ];

  for (const act of schoolActivities) {
    await prisma.activity.create({ data: act });
  }

  console.log('✅ Carga acadêmica injetada com sucesso!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
