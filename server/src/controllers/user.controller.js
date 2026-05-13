const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// XP required per level (cumulative)
// XP required to pass the current level
const xpForLevel = (level) => {
  // Formula: 100 + (level - 1)^2 * 2.5
  // Results: L1: 100, L10: 302, L20: 1002, L30: 2202, L50: 6102
  return Math.floor(100 + Math.pow(level - 1, 2) * 2.5);
};

const calculateLevel = (totalXp) => {
  let level = 1;
  let accumulated = 0;
  while (true) {
    const needed = xpForLevel(level);
    if (accumulated + needed > totalXp) break;
    accumulated += needed;
    level++;
    if (level > 100) break;
  }
  return { level, currentLevelXp: totalXp - accumulated, nextLevelXp: xpForLevel(level) };
};

const awardXP = async (userId, amount, reason = '') => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const multiplier = user.xpBoostActive && user.xpBoostExpiresAt > new Date() ? 2 : 1;
  const finalXp = amount * multiplier;

  const oldLevel = user.level;
  const newXpTotal = user.xp + finalXp;
  const { level: newLevel } = calculateLevel(newXpTotal);

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { xp: newXpTotal, level: newLevel },
  });

  // Level up notification
  if (newLevel > oldLevel) {
    await prisma.notification.create({
      data: {
        userId,
        title: `🎉 Level Up! Nível ${newLevel}`,
        message: `Parabéns! Você avançou para o nível ${newLevel}! Continue assim!`,
        type: 'LEVEL_UP',
        emoji: '⬆️',
      }
    });
  }

  // Check achievements
  await checkAchievements(userId, updated);

  return { xpAwarded: finalXp, newXp: newXpTotal, newLevel, leveledUp: newLevel > oldLevel };
};

const awardCoins = async (userId, amount) => {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { coins: { increment: amount } },
  });
  return updated.coins;
};

const checkAchievements = async (userId, user) => {
  const achievements = await prisma.achievement.findMany();
  const earned = await prisma.userAchievement.findMany({ where: { userId } });
  const earnedIds = new Set(earned.map(e => e.achievementId));

  for (const ach of achievements) {
    if (earnedIds.has(ach.id)) continue;
    let unlock = false;

    if (ach.condition === 'XP' && user.xp >= ach.conditionValue) unlock = true;
    if (ach.condition === 'LEVEL' && user.level >= ach.conditionValue) unlock = true;
    if (ach.condition === 'STREAK' && user.streak >= ach.conditionValue) unlock = true;
    if (ach.condition === 'COINS' && user.coins >= ach.conditionValue) unlock = true;

    if (ach.condition === 'ACTIVITIES') {
      const count = await prisma.activitySubmission.count({
        where: { userId, status: { in: ['APPROVED', 'GRADED'] } }
      });
      if (count >= ach.conditionValue) unlock = true;
    }

    if (unlock) {
      await prisma.userAchievement.create({ data: { userId, achievementId: ach.id } });
      if (ach.xpBonus > 0) await prisma.user.update({ where: { id: userId }, data: { xp: { increment: ach.xpBonus } } });
      if (ach.coinBonus > 0) await prisma.user.update({ where: { id: userId }, data: { coins: { increment: ach.coinBonus } } });

      await prisma.notification.create({
        data: {
          userId,
          title: `${ach.emoji} Conquista desbloqueada!`,
          message: `"${ach.title}" — ${ach.description}`,
          type: 'ACHIEVEMENT',
          emoji: ach.emoji,
        }
      });
    }
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id || req.user.userId },
      select: {
        id: true, name: true, email: true, role: true, avatar: true, avatarColor: true,
        bio: true, xp: true, coins: true, level: true, streak: true, createdAt: true,
        equippedAura: true,
        _count: { select: { submissions: true, purchases: true, userAchievements: true } }
      }
    });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const { currentLevelXp, nextLevelXp } = calculateLevel(user.xp);
    res.json({ ...user, levelInfo: { level: user.level, currentLevelXp, nextLevelXp } });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar perfil.' });
  }
};

const updateProfile = async (req, res) => {
  const { name, bio, avatarColor } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name, bio, avatarColor },
      select: { id: true, name: true, bio: true, avatarColor: true, email: true }
    });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar perfil.' });
  }
};

const equipAura = async (req, res) => {
  const { auraId } = req.body; // Aqui auraId na verdade é o TITULO da aura (ex: 'Aura Super Saiyajin')
  try {
    // Se auraId for null, desequipa
    if (auraId) {
      // Verificar se o usuário possui alguma compra com esse título
      const purchase = await prisma.purchase.findFirst({
        where: { 
          userId: req.user.userId,
          reward: { title: auraId }
        }
      });
      
      if (!purchase && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Você não possui esta aura no seu inventário.' });
      }
    }

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { equippedAura: auraId },
      select: { id: true, equippedAura: true }
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao equipar aura.' });
  }
};

module.exports = { awardXP, awardCoins, checkAchievements, calculateLevel, getProfile, updateProfile, equipAura };
