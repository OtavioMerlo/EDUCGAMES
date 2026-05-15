const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧬 Gerando atividades de Biologia e Física...');

  const teacher = await prisma.user.findFirst({ where: { role: 'TEACHER' } });
  if (!teacher) return;

  const scienceActivities = [
    // BIOLOGIA
    {
      title: '🧬 Genética: Leis de Mendel',
      description: 'Entenda como as características são passadas de pais para filhos.',
      type: 'QUIZ', difficulty: 'HARD', subject: 'Biologia', xpReward: 250, coinReward: 120, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Quem é considerado o "Pai da Genética"?', options: ['Darwin', 'Mendel', 'Einstein', 'Newton'], correctAnswer: 'Mendel' },
          { id: 'q2', text: 'O que é um gene dominante?', options: ['Aquele que nunca aparece', 'Aquele que se manifesta mesmo em dose simples', 'Aquele que só aparece em dose dupla', 'Um tipo de vírus'], correctAnswer: 'Aquele que se manifesta mesmo em dose simples' }
        ]
      })
    },
    {
      title: '🌿 Botânica: Fotossíntese',
      description: 'Como as plantas transformam luz em energia?',
      type: 'QUIZ', difficulty: 'MEDIUM', subject: 'Biologia', xpReward: 150, coinReward: 75, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Qual gás as plantas absorvem na fotossíntese?', options: ['Oxigênio', 'Gás Carbônico', 'Nitrogênio', 'Hidrogênio'], correctAnswer: 'Gás Carbônico' },
          { id: 'q2', text: 'Qual a principal fonte de energia para a fotossíntese?', options: ['Água', 'Adubo', 'Luz Solar', 'Vento'], correctAnswer: 'Luz Solar' }
        ]
      })
    },
    {
      title: '🔬 Citologia: A Célula',
      description: 'Conheça as organelas e suas funções vitais.',
      type: 'QUIZ', difficulty: 'MEDIUM', subject: 'Biologia', xpReward: 150, coinReward: 75, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Qual organela é a "central de energia" da célula?', options: ['Núcleo', 'Ribossomo', 'Mitocôndria', 'Lisossomo'], correctAnswer: 'Mitocôndria' },
          { id: 'q2', text: 'Onde fica o DNA da célula eucarionte?', options: ['No citoplasma', 'No núcleo', 'Na membrana', 'Nos cílios'], correctAnswer: 'No núcleo' }
        ]
      })
    },
    // FÍSICA
    {
      title: '🍎 Leis de Newton: Inércia',
      description: 'Entenda por que as coisas continuam em movimento.',
      type: 'QUIZ', difficulty: 'EASY', subject: 'Física', xpReward: 100, coinReward: 50, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Qual a 1ª Lei de Newton?', options: ['Ação e Reação', 'Inércia', 'Força = Massa x Aceleração', 'Gravidade'], correctAnswer: 'Inércia' },
          { id: 'q2', text: 'Se a força resultante é zero, o objeto pode estar parado?', options: ['Sim', 'Não', 'Só se for leve', 'Só no vácuo'], correctAnswer: 'Sim' }
        ]
      })
    },
    {
      title: '⚡ Eletricidade: Circuitos',
      description: 'Como a corrente elétrica flui nos aparelhos?',
      type: 'QUIZ', difficulty: 'MEDIUM', subject: 'Física', xpReward: 180, coinReward: 90, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Qual a unidade de medida da corrente elétrica?', options: ['Volt', 'Ohm', 'Ampere', 'Watt'], correctAnswer: 'Ampere' },
          { id: 'q2', text: 'O que acontece em um curto-circuito?', options: ['A luz brilha mais', 'A resistência fica infinita', 'A corrente aumenta muito', 'A bateria carrega'], correctAnswer: 'A corrente aumenta muito' }
        ]
      })
    },
    {
      title: '🚀 Relatividade de Einstein',
      description: 'O tempo e o espaço são relativos.',
      type: 'QUIZ', difficulty: 'HARD', subject: 'Física', xpReward: 300, coinReward: 150, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'Qual a fórmula mais famosa de Einstein?', options: ['F=ma', 'E=mc²', 'V=d/t', 'P=UI'], correctAnswer: 'E=mc²' },
          { id: 'q2', text: 'Segundo a relatividade, o que acontece com o tempo perto de grandes massas?', options: ['Passa mais rápido', 'Para', 'Passa mais devagar', 'Não muda'], correctAnswer: 'Passa mais devagar' }
        ]
      })
    },
    {
      title: '🌈 Óptica: Reflexão da Luz',
      description: 'Por que vemos as cores e como os espelhos funcionam?',
      type: 'QUIZ', difficulty: 'MEDIUM', subject: 'Física', xpReward: 150, coinReward: 70, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'q1', text: 'A luz branca é a soma de todas as cores?', options: ['Sim', 'Não', 'Só o azul e vermelho', 'Depende do espelho'], correctAnswer: 'Sim' },
          { id: 'q2', text: 'Qual fenômeno explica o arco-íris?', options: ['Reflexão', 'Refração e Dispersão', 'Difração', 'Sombra'], correctAnswer: 'Refração e Dispersão' }
        ]
      })
    }
  ];

  for (const act of scienceActivities) {
    await prisma.activity.create({ data: act });
  }

  console.log('✅ Biologia e Física adicionadas com sucesso!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
