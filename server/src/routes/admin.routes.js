const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

// Admin dashboard stats
router.get('/dashboard', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const [totalUsers, totalStudents, totalTeachers, totalActivities, totalSubmissions, totalPurchases, totalRewards] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.activity.count({ where: { isActive: true } }),
      prisma.activitySubmission.count(),
      prisma.purchase.count(),
      prisma.reward.count({ where: { isActive: true } }),
    ]);

    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }, take: 5,
      select: { id: true, name: true, email: true, role: true, xp: true, coins: true, createdAt: true }
    });

    const topStudents = await prisma.user.findMany({
      where: { role: 'STUDENT' }, orderBy: { xp: 'desc' }, take: 5,
      select: { id: true, name: true, xp: true, level: true, avatarColor: true }
    });

    const coinsInCirculation = await prisma.user.aggregate({ _sum: { coins: true } });
    const totalCoinsSpent = await prisma.purchase.aggregate({ _sum: { coinsSpent: true } });

    res.json({
      stats: { totalUsers, totalStudents, totalTeachers, totalActivities, totalSubmissions, totalPurchases, totalRewards },
      coinsInCirculation: coinsInCirculation._sum.coins || 0,
      totalCoinsSpent: totalCoinsSpent._sum.coinsSpent || 0,
      recentUsers,
      topStudents
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar dashboard.' });
  }
});

// Manage users
router.get('/users', authenticate, authorize('ADMIN'), async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const where = {};
  if (role) where.role = role;
  if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }];

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where, skip: (page - 1) * limit, take: Number(limit),
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, xp: true, coins: true, level: true, streak: true, createdAt: true }
    }),
    prisma.user.count({ where })
  ]);
  res.json({ users, total });
});

// Update user (admin)
router.patch('/users/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id }, data: req.body,
      select: { id: true, name: true, email: true, role: true, xp: true, coins: true }
    });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
});

// Audit logs
router.get('/logs', authenticate, authorize('ADMIN'), async (req, res) => {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' }, take: 100
  });
  res.json(logs);
});

// Pending submissions (for admin review)
router.get('/submissions/pending', authenticate, authorize('ADMIN', 'TEACHER'), async (req, res) => {
  const subs = await prisma.activitySubmission.findMany({
    where: { status: 'PENDING' },
    orderBy: { submittedAt: 'desc' },
    include: {
      user: { select: { name: true, avatarColor: true } },
      activity: { select: { title: true, subject: true, xpReward: true, coinReward: true } }
    }
  });
  res.json(subs);
});

module.exports = router;
