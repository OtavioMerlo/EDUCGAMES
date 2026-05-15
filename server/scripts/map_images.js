const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Mapeando imagens para todos os itens...');

  const mapping = [
    { title: 'Minecraft', file: '/games/minecraft.jpg' },
    { title: 'EA Sports FC 25', file: '/games/fifa25.jpg' },
    { title: 'FC 25', file: '/games/fifa25.jpg' },
    { title: 'Spotify Premium', emoji: '🎵' }, // No image found
    { title: 'Netflix', emoji: '🎬' }, // No image found
    { title: 'Steam Gift Card R$50', file: '/games/gta.jpg' }, // Generic game image as fallback? No, better use emoji or find steam logo
  ];

  // Auras / Accessories
  const accessoryMapping = [
    { title: 'Aura Super Saiyajin', file: '/acessorios/card_ssj.png' },
    { title: 'Aura Kaioken', file: '/acessorios/deus super sayajin.png' },
    { title: 'Aura SSJ Blue', file: '/acessorios/gokublue.png' },
    { title: 'Aura Instinto Superior', file: '/acessorios/goku extinto superior completo.png' },
    { title: 'Aura SSJ God', file: '/acessorios/card_ssj_god.png' },
    { title: 'Aura SSJ Rosé', file: '/acessorios/ssj-god.png' }, // Fallback to god for now or find rose
    { title: 'Aura Lendário', file: '/acessorios/gohan.png' },
    { title: 'Aura Broly Lendário', file: '/acessorios/ultra-egoo.png' }, // Greenish
  ];

  for (const item of mapping.concat(accessoryMapping)) {
    const existing = await prisma.reward.findFirst({ where: { title: item.title } });
    if (existing) {
      await prisma.reward.update({
        where: { id: existing.id },
        data: {
          imageUrl: item.file || existing.imageUrl,
          emoji: item.emoji || existing.emoji
        }
      });
      console.log(`✅ Updated ${item.title}`);
    }
  }

  console.log('✨ Mapeamento concluído!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
