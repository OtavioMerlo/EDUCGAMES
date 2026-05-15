const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { getProfile, updateProfile, equipAura, equipAccessory, getPublicProfile, getMyFullProfile } = require('../controllers/user.controller');

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.get('/profile/:id', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.patch('/profile/equip-aura', authenticate, equipAura);
router.patch('/profile/equip-accessory', authenticate, equipAccessory);

// New enriched profile endpoints
router.get('/my/full-profile', authenticate, getMyFullProfile);
router.get('/search', authenticate, async (req, res) => {
  const { q = '' } = req.query;
  if (q.trim().length < 2) return res.json({ users: [] });
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const users = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        name: { contains: q, mode: 'insensitive' }
      },
      select: { id: true, name: true, level: true, xp: true, avatarColor: true, equippedAura: true, equippedAccessory: true, streak: true, bio: true },
      take: 20,
      orderBy: { xp: 'desc' }
    });
    // Enrich with rank
    const allStudents = await prisma.user.findMany({ where: { role: 'STUDENT' }, orderBy: { xp: 'desc' }, select: { id: true } });
    const enriched = users.map(u => ({ ...u, rankPosition: allStudents.findIndex(s => s.id === u.id) + 1 }));
    res.json({ users: enriched });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro na busca.' });
  }
});
router.get('/:id/public-profile', authenticate, getPublicProfile);

module.exports = router;
