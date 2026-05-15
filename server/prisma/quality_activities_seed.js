const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📚 Gerando atividades de ALTA QUALIDADE com perguntas reais...');

  const teacher = await prisma.user.findFirst({ where: { role: 'TEACHER' } });
  if (!teacher) return;

  const activities = [
    // MATEMÁTICA
    {
      title: '🔢 Matemática: Equações do 1º Grau',
      description: 'Aprenda a encontrar o valor de X em problemas fundamentais.',
      type: 'QUIZ', difficulty: 'EASY', subject: 'Matemática', xpReward: 120, coinReward: 60, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'm1', text: 'Qual o valor de x na equação 2x + 4 = 12?', options: ['x = 2', 'x = 4', 'x = 6', 'x = 8'], correctAnswer: 'x = 4' },
          { id: 'm2', text: 'Se 3x - 5 = 10, qual o valor de x?', options: ['x = 3', 'x = 5', 'x = 15', 'x = 2'], correctAnswer: 'x = 5' }
        ]
      })
    },
    {
      title: '📐 Geometria: Áreas de Figuras Planas',
      description: 'Calcule a área de quadrados, triângulos e retângulos.',
      type: 'QUIZ', difficulty: 'MEDIUM', subject: 'Matemática', xpReward: 180, coinReward: 90, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'g1', text: 'Qual a área de um triângulo com base 10cm e altura 5cm?', options: ['50 cm²', '25 cm²', '15 cm²', '100 cm²'], correctAnswer: '25 cm²' },
          { id: 'g2', text: 'Um quadrado tem lado de 8cm. Qual sua área?', options: ['16 cm²', '32 cm²', '64 cm²', '24 cm²'], correctAnswer: '64 cm²' }
        ]
      })
    },
    // PORTUGUÊS
    {
      title: '📚 Gramática: Uso dos Porquês',
      description: 'Nunca mais erre a escrita dos porquês em frases!',
      type: 'QUIZ', difficulty: 'EASY', subject: 'Português', xpReward: 100, coinReward: 50, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'p1', text: 'Qual "porquê" usamos no início de perguntas?', options: ['Porque', 'Por que', 'Porquê', 'Por quê'], correctAnswer: 'Por que' },
          { id: 'p2', text: 'Completar: "Não fui à aula ______ estava doente."', options: ['porque', 'por que', 'porquê', 'por quê'], correctAnswer: 'porque' }
        ]
      })
    },
    {
      title: '📖 Literatura: O Realismo no Brasil',
      description: 'Machado de Assis e a transição do Romantismo.',
      type: 'QUIZ', difficulty: 'HARD', subject: 'Português', xpReward: 250, coinReward: 130, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'l1', text: 'Quem escreveu "Memórias Póstumas de Brás Cubas"?', options: ['José de Alencar', 'Machado de Assis', 'Castro Alves', 'Aluísio Azevedo'], correctAnswer: 'Machado de Assis' },
          { id: 'l2', text: 'Qual o nome da personagem enigmática de "Dom Casmurro"?', options: ['Capitu', 'Iracema', 'Aurélia', 'Lucíola'], correctAnswer: 'Capitu' }
        ]
      })
    },
    // HISTÓRIA
    {
      title: '🇧🇷 História: Brasil Colônia',
      description: 'O período da cana-de-açúcar e o ciclo do ouro.',
      type: 'QUIZ', difficulty: 'MEDIUM', subject: 'História', xpReward: 160, coinReward: 80, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'h1', text: 'Qual foi o primeiro produto explorado pelos portugueses no Brasil?', options: ['Café', 'Ouro', 'Pau-Brasil', 'Cana-de-açúcar'], correctAnswer: 'Pau-Brasil' },
          { id: 'h2', text: 'O que eram as Capitanias Hereditárias?', options: ['Navios de guerra', 'Terras doadas a nobres', 'Tribos indígenas', 'Fortalezas'], correctAnswer: 'Terras doadas a nobres' }
        ]
      })
    },
    {
      title: '🌍 História: Segunda Guerra Mundial',
      description: 'Os principais eventos entre 1939 e 1945.',
      type: 'QUIZ', difficulty: 'HARD', subject: 'História', xpReward: 220, coinReward: 110, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'sg1', text: 'A invasão de qual país iniciou a 2ª Guerra Mundial?', options: ['França', 'Rússia', 'Polônia', 'Inglaterra'], correctAnswer: 'Polônia' },
          { id: 'sg2', text: 'Em que ano a guerra terminou oficialmente?', options: ['1942', '1944', '1945', '1950'], correctAnswer: '1945' }
        ]
      })
    },
    // CIÊNCIAS / BIOLOGIA / FÍSICA
    {
      title: '🧬 Biologia: Sistema Imunológico',
      description: 'Como nosso corpo se defende de doenças.',
      type: 'QUIZ', difficulty: 'MEDIUM', subject: 'Biologia', xpReward: 180, coinReward: 90, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'bi1', text: 'Quais células são responsáveis pela defesa do organismo?', options: ['Hemácias', 'Leucócitos', 'Plaquetas', 'Neurônios'], correctAnswer: 'Leucócitos' },
          { id: 'bi2', text: 'O que as vacinas estimulam o corpo a produzir?', options: ['Vírus', 'Bactérias', 'Anticorpos', 'Hormônios'], correctAnswer: 'Anticorpos' }
        ]
      })
    },
    {
      title: '🔋 Física: Eletrodinâmica Básica',
      description: 'Entenda Voltagem, Corrente e Resistência.',
      type: 'QUIZ', difficulty: 'MEDIUM', subject: 'Física', xpReward: 190, coinReward: 95, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'fi1', text: 'Qual a unidade de medida da resistência elétrica?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], correctAnswer: 'Ohm' },
          { id: 'fi2', text: 'Pela Lei de Ohm, se a voltagem aumenta, a corrente:', options: ['Diminui', 'Aumenta', 'Fica igual', 'Sempre vira zero'], correctAnswer: 'Aumenta' }
        ]
      })
    },
    {
      title: '🔭 Geografia: Sistema Solar e Terra',
      description: 'Movimentos de rotação e translação.',
      type: 'QUIZ', difficulty: 'EASY', subject: 'Geografia', xpReward: 110, coinReward: 55, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'geo1', text: 'Qual movimento da Terra gera as estações do ano?', options: ['Rotação', 'Translação', 'Precessão', 'Nutação'], correctAnswer: 'Translação' },
          { id: 'geo2', text: 'Quanto tempo a Terra leva para dar uma volta em seu próprio eixo?', options: ['12 horas', '24 horas', '365 dias', '1 mês'], correctAnswer: '24 horas' }
        ]
      })
    },
    // INGLÊS
    {
      title: '🇺🇸 English: Verb to Be (Present)',
      description: 'The foundation of English grammar.',
      type: 'QUIZ', difficulty: 'EASY', subject: 'Inglês', xpReward: 100, coinReward: 50, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'en1', text: 'Choose the correct form: "She ____ a student."', options: ['am', 'is', 'are', 'be'], correctAnswer: 'is' },
          { id: 'en2', text: 'Choose the correct form: "They ____ playing soccer."', options: ['is', 'am', 'are', 'was'], correctAnswer: 'are' }
        ]
      })
    },
    // TECNOLOGIA
    {
      title: '💻 Tecnologia: Lógica de Programação',
      description: 'O que são algoritmos e variáveis?',
      type: 'QUIZ', difficulty: 'MEDIUM', subject: 'Tecnologia', xpReward: 150, coinReward: 75, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 't1', text: 'O que é um algoritmo?', options: ['Um tipo de computador', 'Uma sequência de passos para resolver um problema', 'Um componente físico do PC', 'Um vírus'], correctAnswer: 'Uma sequência de passos para resolver um problema' },
          { id: 't2', text: 'Em programação, para que serve uma variável?', options: ['Para ligar o monitor', 'Para armazenar um dado ou valor', 'Para imprimir papel', 'Para navegar na web'], correctAnswer: 'Para armazenar um dado ou valor' }
        ]
      })
    },
    {
      title: '🎮 Hardware: Componentes do PC',
      description: 'Processador, Memória RAM e Armazenamento.',
      type: 'QUIZ', difficulty: 'MEDIUM', subject: 'Tecnologia', xpReward: 150, coinReward: 75, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 'h1', text: 'Qual componente é considerado o "cérebro" do computador?', options: ['Memória RAM', 'Placa de Vídeo', 'Processador (CPU)', 'HD/SSD'], correctAnswer: 'Processador (CPU)' },
          { id: 'h2', text: 'Onde os arquivos ficam guardados permanentemente?', options: ['Memória RAM', 'HD ou SSD', 'Cooler', 'Fonte'], correctAnswer: 'HD ou SSD' }
        ]
      })
    },
    {
      title: '🛡️ Segurança Digital: Senhas e Phishing',
      description: 'Proteja seus dados na internet.',
      type: 'QUIZ', difficulty: 'EASY', subject: 'Tecnologia', xpReward: 120, coinReward: 60, createdBy: teacher.id,
      content: JSON.stringify({
        questions: [
          { id: 's1', text: 'Qual destas é a senha mais segura?', options: ['123456', 'senha123', 'Abc@123_x!', 'aniversario'], correctAnswer: 'Abc@123_x!' },
          { id: 's2', text: 'O que é Phishing?', options: ['Um esporte digital', 'Tentativa de roubar dados através de mensagens falsas', 'Um jogo de pescaria', 'Um tipo de teclado'], correctAnswer: 'Tentativa de roubar dados através de mensagens falsas' }
        ]
      })
    }
  ];

  for (const act of activities) {
    await prisma.activity.create({ data: act });
  }

  console.log(`✅ ${activities.length} atividades de ALTA QUALIDADE criadas com sucesso!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
