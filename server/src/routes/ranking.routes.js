const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticate, async (req, res) => {
  try {
    const { type = 'global', limit = 10 } = req.query;
    const take = parseInt(limit);
    let ranking = [];

    if (type === 'weekly') {
      // Ranking Semanal: Soma de xpAwarded na tabela ActivitySubmission nos últimos 7 dias
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const weeklyXp = await prisma.activitySubmission.groupBy({
        by: ['userId'],
        where: {
          submittedAt: { gte: sevenDaysAgo },
          status: { in: ['APPROVED', 'GRADED'] }
        },
        _sum: { xpAwarded: true },
        orderBy: { _sum: { xpAwarded: 'desc' } },
        take: take
      });

      // Buscar detalhes dos usuários do ranking semanal
      const userIds = weeklyXp.map(item => item.userId);
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, avatarColor: true, level: true, streak: true }
      });

      ranking = weeklyXp.map((item, index) => {
        const u = users.find(user => user.id === item.userId);
        return {
          id: item.userId,
          name: u?.name || 'Usuário',
          xp: item._sum.xpAwarded || 0,
          level: u?.level || 1,
          avatarColor: u?.avatarColor,
          streak: u?.streak || 0,
          rank: index + 1
        };
      });
    } else {
      // Ranking Global: Baseado no XP total do usuário
      const globalUsers = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        orderBy: { xp: 'desc' },
        take: take,
        select: { id: true, name: true, xp: true, level: true, avatarColor: true, streak: true }
      });

      ranking = globalUsers.map((u, i) => ({ ...u, rank: i + 1 }));
    }

    // Encontrar posição do usuário logado
    let myRank = null;
    if (type === 'global') {
      const allStudents = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        orderBy: { xp: 'desc' },
        select: { id: true }
      });
      const index = allStudents.findIndex(u => u.id === req.user.userId);
      myRank = { rank: index + 1 };
    }

    res.json({ ranking, myRank });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar ranking.' });
  }
});

module.exports = router;
