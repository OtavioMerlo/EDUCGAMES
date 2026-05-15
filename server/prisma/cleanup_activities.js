const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpando atividades de baixa qualidade...');

  // Deletar atividades que tenham "Pergunta aleatória" ou "Pergunta sobre" no conteúdo
  const result = await prisma.activity.deleteMany({
    where: {
      OR: [
        { content: { contains: 'Pergunta aleatória' } },
        { content: { contains: 'Pergunta sobre' } }
      ]
    }
  });

  console.log(`✅ ${result.count} atividades genéricas removidas.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
