const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Povoando serviços premium...');

  const services = [
    { title: 'Spotify Premium', file: 'spotify.jpg', price: 3000, category: 'SUBSCRIPTION', rarity: 'EPIC', description: 'Ouça suas músicas favoritas sem anúncios e offline.' },
    { title: 'Netflix Standard', file: 'netflix.jpg', price: 5000, category: 'SUBSCRIPTION', rarity: 'LEGENDARY', description: 'Assista a filmes e séries em HD em até 2 telas simultâneas.' },
    { title: 'Disney+ Premium', file: 'Disney-Plus.jpg', price: 4500, category: 'SUBSCRIPTION', rarity: 'LEGENDARY', description: 'O melhor da Disney, Pixar, Marvel, Star Wars e National Geographic.' },
    { title: 'HBO Max', file: 'hbomax.jpg', price: 4200, category: 'SUBSCRIPTION', rarity: 'EPIC', description: 'A casa da HBO, Warner Bros. e o universo DC.' },
    { title: 'Prime Video', file: 'prime-video.jpg', price: 3500, category: 'SUBSCRIPTION', rarity: 'EPIC', description: 'Filmes, séries e frete grátis na Amazon.' },
    { title: 'Crunchyroll Fan', file: 'crunchyroll.jpg', price: 2800, category: 'SUBSCRIPTION', rarity: 'RARE', description: 'O maior catálogo de animes do mundo.' },
    { title: 'Apple Music', file: 'applemsuic.jpg', price: 3200, category: 'SUBSCRIPTION', rarity: 'EPIC', description: 'Milhões de músicas em áudio espacial sem perdas.' },
    { title: 'YouTube Premium', file: 'youtube_premium.jpg', price: 3800, category: 'SUBSCRIPTION', rarity: 'EPIC', description: 'YouTube sem anúncios, downloads e música em segundo plano.' },
    { title: 'Paramount+', file: 'paramountplus.jpg', price: 2500, category: 'SUBSCRIPTION', rarity: 'RARE', description: 'Uma montanha de entretenimento.' },
  ];

  for (const s of services) {
    const imageUrl = `/servicos/${s.file}`;
    
    const existing = await prisma.reward.findFirst({ where: { title: s.title } });

    if (existing) {
      await prisma.reward.update({
        where: { id: existing.id },
        data: {
          price: s.price,
          category: s.category,
          rarity: s.rarity,
          imageUrl: imageUrl,
          description: s.description,
          bgGradient: s.rarity === 'LEGENDARY' 
            ? 'linear-gradient(135deg, #000, #1a1a1a)' 
            : 'linear-gradient(135deg, #111, #222)'
        }
      });
    } else {
      await prisma.reward.create({
        data: {
          title: s.title,
          price: s.price,
          category: s.category,
          rarity: s.rarity,
          imageUrl: imageUrl,
          description: s.description,
          emoji: '💳',
          bgGradient: s.rarity === 'LEGENDARY' 
            ? 'linear-gradient(135deg, #000, #1a1a1a)' 
            : 'linear-gradient(135deg, #111, #222)'
        }
      });
    }
    console.log(`✅ ${s.title} processado.`);
  }

  console.log('✨ Todos os serviços premium foram povoados!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
