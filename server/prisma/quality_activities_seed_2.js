const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📚 Gerando a segunda leva de atividades de ALTA QUALIDADE...');

  const teacher = await prisma.user.findFirst({ where: { role: 'TEACHER' } });
  if (!teacher) return;

  const activities = [
    // MATEMÁTICA
    {
      title: '📊 Estatística: Média e Mediana',
      description: 'Entenda como analisar conjuntos de dados.',
      type: 'QUIZ', difficulty: 'MEDIUM', subject: 'Matemática', xpReward: 150, coinReward: 70, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'st1', text: 'Qual a média aritmética dos números 5, 10 e 15?', options: ['5', '10', '15', '30'], correctAnswer: '10' },
          { id: 'st2', text: 'Em uma sequência ordenada, o termo central é chamado de:', options: ['Média', 'Moda', 'Mediana', 'Amplitude'], correctAnswer: 'Mediana' }
        ]
      })
    },
    // GEOGRAFIA
    {
      title: '🌎 Geografia: Continentes e Oceanos',
      description: 'Localize-se no mapa mundi.',
      type: 'QUIZ', difficulty: 'EASY', subject: 'Geografia', xpReward: 100, coinReward: 50, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'ge1', text: 'Qual o maior continente do mundo?', options: ['África', 'América', 'Ásia', 'Europa'], correctAnswer: 'Ásia' },
          { id: 'ge2', text: 'Qual oceano banha a costa do Brasil?', options: ['Pacífico', 'Índico', 'Atlântico', 'Ártico'], correctAnswer: 'Atlântico' }
        ]
      })
    },
    {
      title: '🌳 Meio Ambiente: Sustentabilidade',
      description: 'A importância da preservação para o futuro.',
      type: 'QUIZ', difficulty: 'EASY', subject: 'Geografia', xpReward: 120, coinReward: 60, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'ma1', text: 'Qual o significado dos 3 "R"s da sustentabilidade?', options: ['Rápido, Raro e Rico', 'Reduzir, Reutilizar e Reciclar', 'Rua, Rio e Rocha', 'Reler, Refazer e Reagir'], correctAnswer: 'Reduzir, Reutilizar e Reciclar' },
          { id: 'ma2', text: 'O que causa o aquecimento global excessivo?', options: ['Plantio de árvores', 'Emissão de gases estufa', 'Uso de energia solar', 'Reciclagem de papel'], correctAnswer: 'Emissão de gases estufa' }
        ]
      })
    },
    // CIÊNCIAS
    {
      title: '🦴 Anatomia: O Esqueleto Humano',
      description: 'Conheça a estrutura que sustenta seu corpo.',
      type: 'QUIZ', difficulty: 'MEDIUM', subject: 'Ciências', xpReward: 140, coinReward: 70, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'an1', text: 'Qual o maior osso do corpo humano?', options: ['Rádio', 'Úmero', 'Fêmur', 'Tíbia'], correctAnswer: 'Fêmur' },
          { id: 'an2', text: 'Quantos ossos tem, em média, um adulto humano?', options: ['100', '206', '300', '500'], correctAnswer: '206' }
        ]
      })
    },
    {
      title: '💧 O Ciclo da Água',
      description: 'Evaporação, Condensação e Precipitação.',
      type: 'QUIZ', difficulty: 'EASY', subject: 'Ciências', xpReward: 100, coinReward: 50, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'ca1', text: 'Como se chama o processo da água virando vapor?', options: ['Solidificação', 'Fusão', 'Evaporação', 'Condensação'], correctAnswer: 'Evaporação' },
          { id: 'ca2', text: 'A formação das nuvens ocorre através da:', options: ['Precipitação', 'Condensação', 'Infiltração', 'Transpiração'], correctAnswer: 'Condensação' }
        ]
      })
    },
    // ARTE
    {
      title: '🎨 Arte: Cores e Sensações',
      description: 'Cores primárias, secundárias e frias.',
      type: 'QUIZ', difficulty: 'EASY', subject: 'Artes', xpReward: 90, coinReward: 45, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'ar1', text: 'Quais são as cores primárias?', options: ['Verde, Laranja e Roxo', 'Vermelho, Amarelo e Azul', 'Preto e Branco', 'Rosa e Marrom'], correctAnswer: 'Vermelho, Amarelo e Azul' },
          { id: 'ar2', text: 'Qual cor obtemos misturando Amarelo e Azul?', options: ['Laranja', 'Verde', 'Roxo', 'Cinza'], correctAnswer: 'Verde' }
        ]
      })
    },
    // QUÍMICA (Adicionando nova matéria)
    {
      title: '🧪 Química: Tabela Periódica',
      description: 'Elementos químicos e seus símbolos.',
      type: 'QUIZ', difficulty: 'MEDIUM', subject: 'Química', xpReward: 180, coinReward: 90, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'qu1', text: 'Qual o símbolo químico do Ouro?', options: ['Ou', 'Au', 'Ag', 'Fe'], correctAnswer: 'Au' },
          { id: 'qu2', text: 'O que representa o símbolo "H" na tabela?', options: ['Hélio', 'Mercúrio', 'Hidrogênio', 'Hósmio'], correctAnswer: 'Hidrogênio' }
        ]
      })
    },
    // FILOSOFIA
    {
      title: '🤔 Filosofia: O Mito da Caverna',
      description: 'Platão e a busca pelo conhecimento real.',
      type: 'QUIZ', difficulty: 'HARD', subject: 'Filosofia', xpReward: 250, coinReward: 125, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'f1', text: 'Quem escreveu a alegoria do Mito da Caverna?', options: ['Sócrates', 'Aristóteles', 'Platão', 'Descartes'], correctAnswer: 'Platão' },
          { id: 'f2', text: 'O que as sombras na caverna representam?', options: ['A verdade absoluta', 'A luz do sol', 'As aparências e o senso comum', 'O futuro'], correctAnswer: 'As aparências e o senso comum' }
        ]
      })
    },
    // ATUALIDADES / TECNOLOGIA
    {
      title: '🤖 Inteligência Artificial: O que é?',
      description: 'Entenda os conceitos básicos de IA.',
      type: 'QUIZ', difficulty: 'MEDIUM', subject: 'Tecnologia', xpReward: 160, coinReward: 80, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'ia1', text: 'O que significa a sigla IA?', options: ['Internet Aberta', 'Informação Agrupada', 'Inteligência Artificial', 'Interface Ativa'], correctAnswer: 'Inteligência Artificial' },
          { id: 'ia2', text: 'Qual o objetivo principal da IA?', options: ['Substituir todos os humanos', 'Simular processos de inteligência humana em máquinas', 'Aumentar o preço dos PCs', 'Criar robôs de brinquedo'], correctAnswer: 'Simular processos de inteligência humana em máquinas' }
        ]
      })
    }
  ];

  for (const act of activities) {
    await prisma.activity.create({ data: act });
  }

  console.log(`✅ Mais ${activities.length} atividades criadas!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
