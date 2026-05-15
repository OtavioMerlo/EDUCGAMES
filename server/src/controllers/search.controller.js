const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper to remove accents/normalize strings
const normalizeString = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const globalSearch = async (req, res) => {
  const { q = '' } = req.query;
  const query = q.trim();

  if (query.length < 2) {
    return res.json({ users: [], rewards: [] });
  }

  try {
    const normalizedQuery = normalizeString(query);

    // 1. Search Users
    // We fetch a bit more to filter/rank in JS for better "intelligence"
    const users = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        OR: [
          { name: { contains: query } },
          { email: { contains: query } }
        ]
      },
      select: {
        id: true,
        name: true,
        level: true,
        xp: true,
        avatarColor: true,
        equippedAura: true,
        equippedAccessory: true,
        bio: true
      },
      take: 50
    });

    // 2. Search Rewards (Items/Games)
    const rewards = await prisma.reward.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } }
        ]
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        emoji: true,
        category: true,
        rarity: true,
        price: true
      },
      take: 30
    });

    // Scoring & Ranking Logic for Users
    const rankedUsers = users.map(user => {
      const name = normalizeString(user.name);
      let score = 0;

      if (name === normalizedQuery) score += 100; // Exact match
      else if (name.startsWith(normalizedQuery)) score += 50; // Starts with
      else if (name.includes(normalizedQuery)) score += 20; // Contains

      return { ...user, score };
    }).sort((a, b) => b.score - a.score || b.xp - a.xp);

    // Scoring & Ranking Logic for Rewards
    const rankedRewards = rewards.map(reward => {
      const title = normalizeString(reward.title);
      let score = 0;

      if (title === normalizedQuery) score += 100;
      else if (title.startsWith(normalizedQuery)) score += 50;
      else if (title.includes(normalizedQuery)) score += 20;

      return { ...reward, score };
    }).sort((a, b) => b.score - a.score);

    // Get rank position for top user results (expensive if done for all, so only for top 10)
    const topUsers = rankedUsers.slice(0, 15);
    const allStudents = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      orderBy: { xp: 'desc' },
      select: { id: true }
    });

    const enrichedUsers = topUsers.map(u => ({
      ...u,
      rankPosition: allStudents.findIndex(s => s.id === u.id) + 1
    }));

    res.json({
      users: enrichedUsers,
      rewards: rankedRewards.slice(0, 15)
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Erro ao realizar busca inteligente.' });
  }
};

module.exports = { globalSearch };
