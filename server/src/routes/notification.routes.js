const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticate, async (req, res) => {
  try {
    const notifs = await prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 30
    });
    res.json(notifs);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar notificações.' });
  }
});

router.patch('/:id/read', authenticate, async (req, res) => {
  await prisma.notification.update({ where: { id: req.params.id }, data: { isRead: true } });
  res.json({ ok: true });
});

router.patch('/read-all', authenticate, async (req, res) => {
  await prisma.notification.updateMany({ where: { userId: req.user.userId }, data: { isRead: true } });
  res.json({ ok: true });
});

module.exports = router;
