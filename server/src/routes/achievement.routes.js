const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticate, async (req, res) => {
  try {
    const [all, earned] = await Promise.all([
      prisma.achievement.findMany({ orderBy: { conditionValue: 'asc' } }),
      prisma.userAchievement.findMany({
        where: { userId: req.user.userId },
        include: { achievement: true }
      })
    ]);
    const earnedIds = new Set(earned.map(e => e.achievementId));
    const result = all.map(a => ({
      ...a,
      unlocked: earnedIds.has(a.id),
      unlockedAt: earned.find(e => e.achievementId === a.id)?.unlockedAt || null
    }));
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar conquistas.' });
  }
});

module.exports = router;
