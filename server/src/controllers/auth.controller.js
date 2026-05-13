const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const { calculateLevel } = require('./user.controller');

const prisma = new PrismaClient();

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
  const refreshToken = jwt.sign(
    { userId, role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
  return { accessToken, refreshToken };
};

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'E-mail já cadastrado.' });

    const hashed = await bcrypt.hash(password, 12);
    const colors = ['#7c3aed','#ec4899','#22d3ee','#10b981','#f59e0b','#6366f1','#ef4444','#06b6d4'];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: role === 'TEACHER' ? 'TEACHER' : 'STUDENT',
        avatarColor,
        coins: 100, // Bônus inicial
        xp: 0,
      },
      select: { id: true, name: true, email: true, role: true, xp: true, coins: true, level: true, avatarColor: true, equippedAura: true },
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({ data: { userId: user.id, token: refreshToken, expiresAt } });

    // Notificação de boas-vindas
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: '🎉 Bem-vindo ao EducaGames!',
        message: 'Sua conta foi criada com sucesso. Você ganhou 100 moedas de bônus!',
        type: 'COINS',
        emoji: '🎉',
      }
    });

    // Log
    await prisma.auditLog.create({ data: { userId: user.id, action: 'REGISTER', entity: 'User', entityId: user.id } });

    res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar conta.' });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Credenciais inválidas.' });

    // Streak logic
    const today = new Date().toDateString();
    const lastLogin = user.lastLoginAt ? new Date(user.lastLoginAt).toDateString() : null;
    let streakBonus = 0;
    let newStreak = user.streak;
    let newXp = user.xp;
    let newCoins = user.coins;

    if (lastLogin !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastLogin === yesterday) {
        newStreak += 1;
        streakBonus = Math.min(newStreak * 2, 50); // Max 50 XP bônus
      } else if (lastLogin !== null && user.streakProtections > 0) {
        // streak protection
        await prisma.user.update({ where: { id: user.id }, data: { streakProtections: { decrement: 1 } } });
      } else {
        newStreak = 1;
      }
      newXp += 5 + streakBonus; // Login diário XP
      newCoins += 2;

      await prisma.user.update({
        where: { id: user.id },
        data: { streak: newStreak, xp: newXp, coins: newCoins, lastLoginAt: new Date() }
      });

      if (streakBonus > 0) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: `🔥 Streak de ${newStreak} dias!`,
            message: `Bônus de +${streakBonus} XP pelo seu streak diário!`,
            type: 'XP',
            emoji: '🔥',
          }
        });
      }
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Clean old tokens
    await prisma.refreshToken.deleteMany({ where: { userId: user.id, expiresAt: { lt: new Date() } } });
    await prisma.refreshToken.create({ data: { userId: user.id, token: refreshToken, expiresAt } });
    await prisma.auditLog.create({ data: { userId: user.id, action: 'LOGIN', entity: 'User', entityId: user.id } });

    const { password: _, ...safeUser } = user;
    const { level: calculatedLevel } = calculateLevel(newXp);
    res.json({ user: { ...safeUser, streak: newStreak, xp: newXp, coins: newCoins, level: user.level }, accessToken, refreshToken, streakBonus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'Refresh token obrigatório.' });

  try {
    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(403).json({ error: 'Refresh token inválido ou expirado.' });
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, role: true, xp: true, coins: true, level: true, avatarColor: true, streak: true, equippedAura: true }
    });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const tokens = generateTokens(user.id, user.role);

    // Rotate refresh token
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    await prisma.refreshToken.create({
      data: { userId: user.id, token: tokens.refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    });

    res.json({ user, ...tokens });
  } catch {
    res.status(403).json({ error: 'Token inválido.' });
  }
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } }).catch(() => {});
  }
  res.json({ message: 'Logout realizado com sucesso.' });
};

const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true, name: true, email: true, role: true, avatar: true, avatarColor: true,
        bio: true, xp: true, coins: true, level: true, streak: true,
        streakProtections: true, xpBoostActive: true, xpBoostExpiresAt: true,
        createdAt: true, lastLoginAt: true, equippedAura: true,
        _count: { select: { submissions: true, purchases: true, userAchievements: true } }
      }
    });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar dados.' });
  }
};

module.exports = { register, login, refresh, logout, me };
