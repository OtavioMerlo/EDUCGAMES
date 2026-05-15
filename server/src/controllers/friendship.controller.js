const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Envia pedido de amizade
const sendFriendRequest = async (req, res) => {
  const senderId = req.user.userId;
  const { receiverId } = req.body;

  if (!receiverId) return res.status(400).json({ error: 'receiverId é obrigatório.' });
  if (senderId === receiverId) return res.status(400).json({ error: 'Você não pode seguir a si mesmo.' });

  try {
    // Verifica se já existe alguma relação entre os dois
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      }
    });

    if (existing) {
      if (existing.status === 'ACCEPTED') return res.status(400).json({ error: 'Já são amigos.' });
      if (existing.status === 'PENDING') return res.status(400).json({ error: 'Pedido já enviado.' });
      if (existing.status === 'BLOCKED') return res.status(400).json({ error: 'Ação não permitida.' });
    }

    const friendship = await prisma.friendship.create({
      data: { senderId, receiverId, status: 'PENDING' }
    });

    // Notificar o receptor
    const sender = await prisma.user.findUnique({ where: { id: senderId }, select: { name: true } });
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: '👥 Pedido de Amizade',
        message: `${sender.name} enviou um pedido de amizade para você!`,
        type: 'SOCIAL',
        emoji: '👥',
        data: JSON.stringify({ friendshipId: friendship.id, senderId })
      }
    });

    res.status(201).json({ message: 'Pedido enviado!', friendship });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao enviar pedido de amizade.' });
  }
};

// Aceitar/Rejeitar pedido
const respondFriendRequest = async (req, res) => {
  const { friendshipId, action } = req.body; // action: 'ACCEPT' | 'REJECT'
  const userId = req.user.userId;

  try {
    const friendship = await prisma.friendship.findUnique({ where: { id: friendshipId } });
    if (!friendship) return res.status(404).json({ error: 'Pedido não encontrado.' });
    if (friendship.receiverId !== userId) return res.status(403).json({ error: 'Sem permissão.' });
    if (friendship.status !== 'PENDING') return res.status(400).json({ error: 'Pedido já foi respondido.' });

    const status = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';
    const updated = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status }
    });

    if (status === 'ACCEPTED') {
      const receiver = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
      await prisma.notification.create({
        data: {
          userId: friendship.senderId,
          title: '🎉 Pedido Aceito!',
          message: `${receiver.name} aceitou seu pedido de amizade!`,
          type: 'SOCIAL',
          emoji: '🎉',
        }
      });
    }

    res.json({ message: status === 'ACCEPTED' ? 'Amizade aceita!' : 'Pedido rejeitado.', friendship: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao responder pedido.' });
  }
};

// Remover amigo / Cancelar pedido
const removeFriendship = async (req, res) => {
  const { targetId } = req.params;
  const userId = req.user.userId;

  try {
    await prisma.friendship.deleteMany({
      where: {
        OR: [
          { senderId: userId, receiverId: targetId },
          { senderId: targetId, receiverId: userId }
        ]
      }
    });
    res.json({ message: 'Amizade removida.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover amizade.' });
  }
};

// Lista de amigos do usuário logado
const getMyFriends = async (req, res) => {
  const userId = req.user.userId;
  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      include: {
        sender: { select: { id: true, name: true, level: true, xp: true, avatarColor: true, equippedAura: true, equippedAccessory: true } },
        receiver: { select: { id: true, name: true, level: true, xp: true, avatarColor: true, equippedAura: true, equippedAccessory: true } }
      }
    });

    const friends = friendships.map(f => f.senderId === userId ? f.receiver : f.sender);
    res.json({ friends });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar amigos.' });
  }
};

// Pedidos pendentes recebidos
const getPendingRequests = async (req, res) => {
  const userId = req.user.userId;
  try {
    const pending = await prisma.friendship.findMany({
      where: { receiverId: userId, status: 'PENDING' },
      include: {
        sender: { select: { id: true, name: true, level: true, avatarColor: true, equippedAura: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ pending });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pedidos.' });
  }
};

// Status de amizade entre dois usuários (para usar no perfil público)
const getFriendshipStatus = async (req, res) => {
  const userId = req.user.userId;
  const { targetId } = req.params;
  try {
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: targetId },
          { senderId: targetId, receiverId: userId }
        ]
      }
    });

    if (!friendship) return res.json({ status: 'NONE' });
    
    res.json({
      status: friendship.status,
      friendshipId: friendship.id,
      isSender: friendship.senderId === userId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao checar status.' });
  }
};

module.exports = {
  sendFriendRequest,
  respondFriendRequest,
  removeFriendship,
  getMyFriends,
  getPendingRequests,
  getFriendshipStatus
};
