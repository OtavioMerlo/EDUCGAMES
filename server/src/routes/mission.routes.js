const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

// Get today's missions for current user
router.get('/', authenticate, async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const userId = req.user.userId;

  try {
    // Ensure daily missions exist for today
    const missions = await prisma.dailyMission.findMany({ where: { isActive: true } });

    for (const mission of missions) {
      await prisma.userMission.upsert({
        where: { userId_missionId_date: { userId, missionId: mission.id, date: today } },
        create: { userId, missionId: mission.id, date: today, progress: 0 },
        update: {}
      });
    }

    const userMissions = await prisma.userMission.findMany({
      where: { userId, date: today },
      include: { mission: true }
    });

    res.json(userMissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar missões.' });
  }
});

module.exports = router;
