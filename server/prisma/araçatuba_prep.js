const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🏁 Preparando banco para a feira em Araçatuba...');

  // Ativar todos os itens e colocar estoque ilimitado
  const result = await prisma.reward.updateMany({
    data: {
      isActive: true,
      stock: -1
    }
  });

  console.log(`✅ ${result.count} itens atualizados para estarem ativos e com estoque ilimitado!`);

  // Garantir que todos os usuários tenham algumas moedas para testar a loja
  const users = await prisma.user.updateMany({
    data: {
      coins: { increment: 5000 }
    }
  });
  
  console.log(`🪙 Adicionadas 5000 moedas a todos os usuários para facilitar os testes na feira.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
