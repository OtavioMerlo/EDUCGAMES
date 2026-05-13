const { PrismaClient } = require('@prisma/client');
const { checkAchievements } = require('./user.controller');
const prisma = new PrismaClient();

const getLoja24Items = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const userId = req.user.userId;

  try {
    let items = await prisma.dailyStoreItem.findMany({
      where: { date: today },
      include: { reward: true }
    });

    // Se não houver itens para hoje, gera novos
    if (items.length === 0) {
      items = await generateDailyItems(today);
    }

    // Verificar se o usuário já viu a loja hoje para a animação
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastLoja24Seen: true }
    });

    const isFirstAccess = !user.lastLoja24Seen || user.lastLoja24Seen.toISOString().split('T')[0] !== today;

    res.json({
      items,
      isFirstAccess,
      nextReset: getNextResetTime()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar itens da Loja24.' });
  }
};

const markLoja24AsSeen = async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { lastLoja24Seen: new Date() }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar status de visualização.' });
  }
};

const purchaseLoja24Item = async (req, res) => {
  const { dailyStoreItemId } = req.body;
  const userId = req.user.userId;

  try {
    const dailyItem = await prisma.dailyStoreItem.findUnique({
      where: { id: dailyStoreItemId },
      include: { reward: true }
    });

    if (!dailyItem) return res.status(404).json({ error: 'Item não encontrado na Loja24.' });

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user.coins < dailyItem.price) {
      return res.status(400).json({ error: 'Moedas insuficientes.' });
    }

    // Verificar se já possui o item (inventário persistente)
    const existingPurchase = await prisma.purchase.findFirst({
      where: { userId, rewardId: dailyItem.rewardId }
    });

    if (existingPurchase) {
      return res.status(400).json({ error: 'Você já possui este item em seu inventário.' });
    }

    // Transação para garantir consistência
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { coins: { decrement: dailyItem.price } }
      }),
      prisma.purchase.create({
        data: {
          userId,
          rewardId: dailyItem.rewardId,
          coinsSpent: dailyItem.price,
          status: 'COMPLETED'
        }
      }),
      prisma.notification.create({
        data: {
          userId,
          title: `🎁 Item Adquirido na Loja24!`,
          message: `Você aproveitou a oferta e resgatou "${dailyItem.reward.title}"!`,
          type: 'REWARD',
          emoji: dailyItem.reward.emoji
        }
      })
    ]);

    // Re-buscar usuário para checar conquistas com novos dados
    const updatedUser = await prisma.user.findUnique({ where: { id: userId } });
    await checkAchievements(userId, updatedUser);

    res.json({ success: true, message: 'Compra realizada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao realizar compra na Loja24.' });
  }
};

// --- Helpers ---

async function generateDailyItems(date) {
  const rewards = await prisma.reward.findMany({ where: { isActive: true } });
  if (rewards.length < 5) return [];

  const selectedItems = [];
  const pool = [...rewards];

  // Sorteio de 5 itens com base em raridade
  for (let i = 0; i < 5; i++) {
    const rarity = getRandomRarity();
    let candidates = pool.filter(r => r.rarity === rarity);
    
    // Fallback se não houver itens dessa raridade no pool
    if (candidates.length === 0) candidates = pool;

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const chosen = candidates[randomIndex];
    
    // Remover do pool para não repetir no mesmo dia
    const poolIndex = pool.findIndex(p => p.id === chosen.id);
    pool.splice(poolIndex, 1);

    const discountInfo = getDiscountForRarity(chosen.rarity);
    const price = Math.round(chosen.price * (1 - discountInfo.percent / 100));

    selectedItems.push({
      rewardId: chosen.id,
      originalPrice: chosen.price,
      price,
      discount: discountInfo.percent,
      date
    });
  }

  // Salvar no banco
  const created = [];
  for (const item of selectedItems) {
    const newItem = await prisma.dailyStoreItem.create({
      data: item,
      include: { reward: true }
    });
    created.push(newItem);
  }

  return created;
}

function getRandomRarity() {
  const rand = Math.random() * 100;
  if (rand < 50) return 'COMMON';      // 50%
  if (rand < 80) return 'RARE';        // 30%
  if (rand < 95) return 'EPIC';        // 15%
  return 'LEGENDARY';                  // 5%
}

function getDiscountForRarity(rarity) {
  switch (rarity) {
    case 'COMMON': return { percent: Math.floor(Math.random() * 20) + 40 }; // 40-60%
    case 'RARE': return { percent: Math.floor(Math.random() * 15) + 50 };   // 50-65%
    case 'EPIC': return { percent: Math.floor(Math.random() * 10) + 55 };   // 55-65%
    case 'LEGENDARY': return { percent: Math.floor(Math.random() * 10) + 60 }; // 60-70%
    default: return { percent: 50 };
  }
}

function getNextResetTime() {
  const now = new Date();
  const reset = new Date();
  reset.setHours(24, 0, 0, 0); // Próxima meia-noite
  return reset.getTime();
}

module.exports = { getLoja24Items, markLoja24AsSeen, purchaseLoja24Item };
