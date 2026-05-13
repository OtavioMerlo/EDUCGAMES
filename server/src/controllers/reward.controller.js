const { PrismaClient } = require('@prisma/client');
const { awardCoins } = require('./user.controller');

const prisma = new PrismaClient();

const getRewards = async (req, res) => {
  const { category, rarity, page = 1, limit = 20 } = req.query;
  const where = { isActive: true };
  if (category) where.category = category;
  if (rarity) where.rarity = rarity;

  try {
    const [rewards, total] = await Promise.all([
      prisma.reward.findMany({
        where,
        skip: (page - 1) * limit,
        take: Number(limit),
        orderBy: [{ rarity: 'desc' }, { price: 'asc' }],
        include: { _count: { select: { purchases: true } } }
      }),
      prisma.reward.count({ where })
    ]);
    res.json({ rewards, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar recompensas.' });
  }
};

const purchaseReward = async (req, res) => {
  const { rewardId } = req.body;
  const userId = req.user.userId;

  try {
    const [user, reward] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.reward.findUnique({ where: { id: rewardId } })
    ]);

    if (!reward || !reward.isActive) return res.status(404).json({ error: 'Recompensa não encontrada.' });
    if (user.coins < reward.price) return res.status(400).json({ error: 'Moedas insuficientes.' });
    if (reward.stock === 0) return res.status(400).json({ error: 'Estoque esgotado.' });

    // Deduct coins
    await prisma.user.update({
      where: { id: userId },
      data: { coins: { decrement: reward.price } }
    });

    // Reduce stock
    if (reward.stock > 0) {
      await prisma.reward.update({ where: { id: rewardId }, data: { stock: { decrement: 1 } } });
    }

    const purchase = await prisma.purchase.create({
      data: { userId, rewardId, coinsSpent: reward.price },
      include: { reward: true }
    });

    await prisma.notification.create({
      data: {
        userId,
        title: `${reward.emoji} Compra realizada!`,
        message: `Você resgatou "${reward.title}" por ${reward.price} moedas!`,
        type: 'REWARD',
        emoji: reward.emoji,
      }
    });

    res.status(201).json(purchase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao realizar compra.' });
  }
};

const getMyPurchases = async (req, res) => {
  try {
    const purchases = await prisma.purchase.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      include: { reward: true }
    });
    res.json(purchases);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar compras.' });
  }
};

const createReward = async (req, res) => {
  try {
    const reward = await prisma.reward.create({ data: req.body });
    res.status(201).json(reward);
  } catch {
    res.status(500).json({ error: 'Erro ao criar recompensa.' });
  }
};

const updateReward = async (req, res) => {
  try {
    const reward = await prisma.reward.update({ where: { id: req.params.id }, data: req.body });
    res.json(reward);
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar recompensa.' });
  }
};

const deleteReward = async (req, res) => {
  try {
    await prisma.reward.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ message: 'Recompensa desativada.' });
  } catch {
    res.status(500).json({ error: 'Erro ao desativar recompensa.' });
  }
};

module.exports = { getRewards, purchaseReward, getMyPurchases, createReward, updateReward, deleteReward };
