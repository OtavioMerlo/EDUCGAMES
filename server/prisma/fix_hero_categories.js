const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Corrigindo categorias dos itens de heróis...');

  const updates = [
    { title: 'Banguela', category: 'ACCESSORY' },
    { title: 'Banguela Fúria', category: 'ACCESSORY' },
    { title: 'Arqueiro Verde', category: 'ACCESSORY' },
    { title: 'Iron Man Clássico', category: 'ACCESSORY' },
    { title: 'Iron Man Mark 85', category: 'ACCESSORY' }
  ];

  for (const up of updates) {
    await prisma.reward.updateMany({
      where: { title: up.title },
      data: { category: up.category }
    });
  }

  console.log('✅ Categorias corrigidas para ACCESSORY.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
