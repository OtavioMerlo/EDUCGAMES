const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper for Audit Logging
const createAuditLog = async ({ userId, action, entity, entityId, details, ip }) => {
  try {
    await prisma.auditLog.create({
      data: { userId, action, entity, entityId, details, ip }
    });
  } catch (err) {
    console.error('Failed to create audit log:', err);
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalStudents, totalActivities, totalSubmissions, totalPurchases] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.activity.count({ where: { isActive: true } }),
      prisma.activitySubmission.count(),
      prisma.purchase.count(),
    ]);

    // Registrations over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const registrations = await prisma.user.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: { id: true },
    });

    // Grouping by date in JS since SQLite/Prisma grouping by date can be tricky
    const regMap = registrations.reduce((acc, curr) => {
      const date = curr.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + curr._count.id;
      return acc;
    }, {});

    const chartData = Object.entries(regMap).map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Economy stats
    const coinsInCirculation = await prisma.user.aggregate({ _sum: { coins: true } });
    const totalCoinsSpent = await prisma.purchase.aggregate({ _sum: { coinsSpent: true } });

    // Recent Users
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }, take: 8,
      select: { id: true, name: true, email: true, role: true, xp: true, coins: true, createdAt: true }
    });

    res.json({
      stats: { totalUsers, totalStudents, totalActivities, totalSubmissions, totalPurchases },
      economy: {
        circulating: coinsInCirculation._sum.coins || 0,
        spent: totalCoinsSpent._sum.coinsSpent || 0
      },
      chartData,
      recentUsers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar dashboard.' });
  }
};

const getUsers = async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const where = {};
  if (role) where.role = role;
  if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }];

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where, skip: (page - 1) * limit, take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, xp: true, coins: true, level: true, streak: true, createdAt: true }
      }),
      prisma.user.count({ where })
    ]);
    res.json({ users, total });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar usuários.' });
  }
};

const getUserDetail = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        purchases: { include: { reward: true }, orderBy: { createdAt: 'desc' }, take: 10 },
        achievements: { include: { achievement: true } },
        submissions: { include: { activity: true }, orderBy: { submittedAt: 'desc' }, take: 10 }
      }
    });

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    
    // Remove password
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar detalhes do usuário.' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const oldUser = await prisma.user.findUnique({ where: { id } });
    const user = await prisma.user.update({
      where: { id },
      data
    });

    await createAuditLog({
      userId: req.user.id,
      action: 'UPDATE_USER',
      entity: 'USER',
      entityId: id,
      details: `Updated fields: ${Object.keys(data).join(', ')}`,
      ip: req.ip
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id } });
    await createAuditLog({
      userId: req.user.id,
      action: 'DELETE_USER',
      entity: 'USER',
      entityId: id,
      details: `User deleted by admin`,
      ip: req.ip
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir usuário.' });
  }
};

const getAuditLogs = async (req, res) => {
  const { page = 1, limit = 50, action } = req.query;
  const where = {};
  if (action) where.action = action;

  try {
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where, skip: (page - 1) * limit, take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } }
      }),
      prisma.auditLog.count({ where })
    ]);
    res.json({ logs, total });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar logs.' });
  }
};

const getRewards = async (req, res) => {
  try {
    const rewards = await prisma.reward.findMany({
      orderBy: { rarity: 'desc' }
    });
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar itens.' });
  }
};

const createReward = async (req, res) => {
  try {
    const reward = await prisma.reward.create({ data: req.body });
    await createAuditLog({
      userId: req.user.id,
      action: 'CREATE_REWARD',
      entity: 'REWARD',
      entityId: reward.id,
      details: `Created reward: ${reward.title}`,
      ip: req.ip
    });
    res.json(reward);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar item.' });
  }
};

const updateReward = async (req, res) => {
  const { id } = req.params;
  try {
    const reward = await prisma.reward.update({
      where: { id },
      data: req.body
    });
    await createAuditLog({
      userId: req.user.id,
      action: 'UPDATE_REWARD',
      entity: 'REWARD',
      entityId: id,
      details: `Updated reward: ${reward.title}`,
      ip: req.ip
    });
    res.json(reward);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar item.' });
  }
};

const deleteReward = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.reward.delete({ where: { id } });
    await createAuditLog({
      userId: req.user.id,
      action: 'DELETE_REWARD',
      entity: 'REWARD',
      entityId: id,
      details: `Reward deleted by admin`,
      ip: req.ip
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir item.' });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUserDetail,
  updateUser,
  deleteUser,
  getAuditLogs,
  getRewards,
  createReward,
  updateReward,
  deleteReward
};
