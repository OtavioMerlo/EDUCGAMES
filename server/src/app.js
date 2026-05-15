require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const activityRoutes = require('./routes/activity.routes');
const rewardRoutes = require('./routes/reward.routes');
const rankingRoutes = require('./routes/ranking.routes');
const adminRoutes = require('./routes/admin.routes');
const teacherRoutes = require('./routes/teacher.routes');
const notificationRoutes = require('./routes/notification.routes');
const missionRoutes = require('./routes/mission.routes');
const achievementRoutes = require('./routes/achievement.routes');
const loja24Routes = require('./routes/loja24.routes');
const friendshipRoutes = require('./routes/friendship.routes');
const searchRoutes = require('./routes/search.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Muitas requisições. Tente novamente em 15 minutos.' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/loja24', loja24Routes);
app.use('/api/friendships', friendshipRoutes);
app.use('/api/search', searchRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), service: 'EducaGames API' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 EducaGames API rodando em http://localhost:${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
});

module.exports = app;
