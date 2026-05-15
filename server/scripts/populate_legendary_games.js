const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🎮 Iniciando povoamento de jogos lendários...');

  const games = [
    { title: 'Star Wars Jedi: Survivor', file: 'StarWarsJediSurvivor.jpg', price: 3500 },
    { title: 'Assassin\'s Creed Shadows', file: 'assasinecreedshadow.jpg', price: 4200 },
    { title: 'Call of Duty: Black Ops 6', file: 'callofduty6.jpg', price: 5000 },
    { title: 'Dragon Ball: Sparking! ZERO', file: 'dragonballsparkingzero.jpg', price: 3800 },
    { title: 'Elden Ring', file: 'eldering.jpg', price: 3000 },
    { title: 'EA Sports FC 25', file: 'fifa25.jpg', price: 4500 },
    { title: 'God of War Ragnarök', file: 'godofwar.jpg', price: 3200 },
    { title: 'Grand Theft Auto V', file: 'gta.jpg', price: 2500 },
    { title: 'Hogwarts Legacy', file: 'hogoartslegacy.jpg', price: 2800 },
    { title: 'Minecraft Premium', file: 'minecraft.jpg', price: 1500 },
    { title: 'Mortal Kombat 1', file: 'mortalcombat.png', price: 3500 },
    { title: 'NBA 2K25', file: 'nba2025.jpg', price: 4000 },
    { title: 'Need for Speed Unbound', file: 'needforspeedunbond.jpg', price: 2200 },
    { title: 'Red Dead Redemption 2', file: 'reddead2.jpg', price: 2800 },
    { title: 'Spider-Man 2', file: 'spiderman2.jpg', price: 3600 },
    { title: 'Tekken 8', file: 'tekkend.jpg', price: 3400 },
    { title: 'The Last of Us Part II', file: 'thelastofuspartII.jpg', price: 3100 },
  ];

  for (const game of games) {
    const existing = await prisma.reward.findFirst({
      where: { title: game.title }
    });

    if (existing) {
      console.log(`Skipping ${game.title} - already exists`);
      continue;
    }

    await prisma.reward.create({
      data: {
        title: game.title,
        description: `Explore o épico mundo de ${game.title}. Jogo completo ativado diretamente na sua conta. Resgate o código e comece sua jornada agora mesmo!`,
        imageUrl: `/games/${game.file}`,
        emoji: '🎮',
        price: game.price,
        stock: -1,
        category: 'GAME',
        rarity: 'LEGENDARY',
        bgGradient: 'linear-gradient(135deg, #1C1917 0%, #44403C 50%, #CA8A04 100%)',
      }
    });
    console.log(`✅ Created ${game.title}`);
  }

  console.log('✨ Todos os jogos lendários foram adicionados!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
