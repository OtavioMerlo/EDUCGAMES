const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

// Teacher dashboard
router.get('/dashboard', authenticate, authorize('TEACHER', 'ADMIN'), async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const [myActivities, pendingSubmissions, totalStudents] = await Promise.all([
      prisma.activity.count({ where: { createdBy: teacherId } }),
      prisma.activitySubmission.count({
        where: { status: 'PENDING', activity: { createdBy: teacherId } }
      }),
      prisma.activitySubmission.groupBy({
        by: ['userId'], where: { activity: { createdBy: teacherId } },
        _count: true
      })
    ]);

    const recentActivities = await prisma.activity.findMany({
      where: { createdBy: teacherId },
      orderBy: { createdAt: 'desc' }, take: 5,
      include: { _count: { select: { submissions: true } } }
    });

    res.json({ myActivities, pendingSubmissions, totalStudents: totalStudents.length, recentActivities });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar dashboard.' });
  }
});

// Teacher's activities
router.get('/activities', authenticate, authorize('TEACHER', 'ADMIN'), async (req, res) => {
  const activities = await prisma.activity.findMany({
    where: { createdBy: req.user.userId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { submissions: true } } }
  });
  res.json(activities);
});

// Submissions for teacher's activities
router.get('/submissions', authenticate, authorize('TEACHER', 'ADMIN'), async (req, res) => {
  const { status } = req.query;
  const where = { activity: { createdBy: req.user.userId } };
  if (status) where.status = status;

  const submissions = await prisma.activitySubmission.findMany({
    where, orderBy: { submittedAt: 'desc' },
    include: {
      user: { select: { name: true, email: true, avatarColor: true } },
      activity: { select: { title: true, subject: true, xpReward: true, coinReward: true } }
    }
  });
  res.json(submissions);
});

// Student performance report
router.get('/reports', authenticate, authorize('TEACHER', 'ADMIN'), async (req, res) => {
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: { xp: 'desc' },
    select: {
      id: true, name: true, xp: true, level: true, coins: true, streak: true,
      _count: { select: { submissions: true } }
    }
  });
  res.json(students);
});

module.exports = router;
