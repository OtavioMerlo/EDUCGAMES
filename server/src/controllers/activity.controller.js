const { PrismaClient } = require('@prisma/client');
const { awardXP, awardCoins } = require('./user.controller');

const prisma = new PrismaClient();

const getActivities = async (req, res) => {
  const { subject, difficulty, type, page = 1, limit = 20 } = req.query;
  const where = { isActive: true };
  if (subject) where.subject = subject;
  if (difficulty) where.difficulty = difficulty;
  if (type) where.type = type;

  try {
    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        skip: (page - 1) * limit,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          creator: { select: { name: true, avatarColor: true } },
          _count: { select: { submissions: true } }
        }
      }),
      prisma.activity.count({ where })
    ]);
    res.json({ activities, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar atividades.' });
  }
};

const getActivity = async (req, res) => {
  try {
    const activity = await prisma.activity.findUnique({
      where: { id: req.params.id },
      include: {
        creator: { select: { name: true } },
        _count: { select: { submissions: true } }
      }
    });
    if (!activity) return res.status(404).json({ error: 'Atividade não encontrada.' });

    // Check if user already submitted
    const submission = await prisma.activitySubmission.findFirst({
      where: { userId: req.user.userId, activityId: req.params.id }
    });

    res.json({ ...activity, userSubmission: submission || null });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar atividade.' });
  }
};

const submitActivity = async (req, res) => {
  const { answer } = req.body;
  const { id: activityId } = req.params;
  const userId = req.user.userId;

  try {
    const activity = await prisma.activity.findUnique({ where: { id: activityId } });
    if (!activity) return res.status(404).json({ error: 'Atividade não encontrada.' });

    const existing = await prisma.activitySubmission.findFirst({ where: { userId, activityId } });
    if (existing) return res.status(409).json({ error: 'Você já enviou essa atividade.' });

    let status = 'PENDING';
    let score = null;
    let xpAwarded = 0;
    let coinsAwarded = 0;

    // Auto-grade for quiz/multiple choice
    if (['QUIZ', 'MULTIPLE_CHOICE', 'TRUE_FALSE'].includes(activity.type)) {
      const content = JSON.parse(activity.content);
      const userAnswers = JSON.parse(answer || '{}');
      let correct = 0;
      let total = content.questions?.length || 1;

      for (const q of (content.questions || [])) {
        if (userAnswers[q.id] === q.correctAnswer) correct++;
      }

      score = Math.round((correct / total) * 100);
      status = score >= 60 ? 'APPROVED' : 'REJECTED';

      if (status === 'APPROVED') {
        xpAwarded = activity.xpReward;
        coinsAwarded = activity.coinReward;
        await awardXP(userId, xpAwarded, `Atividade: ${activity.title}`);
        await awardCoins(userId, coinsAwarded);
      }
    }

    const submission = await prisma.activitySubmission.create({
      data: { userId, activityId, status, score, answer, xpAwarded, coinsAwarded }
    });

    // Update missions
    await updateMissionProgress(userId, 'ACTIVITIES');
    if (xpAwarded > 0) await updateMissionProgress(userId, 'XP', xpAwarded);
    if (activity.type === 'QUIZ') await updateMissionProgress(userId, 'QUIZ');

    // Notification
    if (xpAwarded > 0) {
      await prisma.notification.create({
        data: {
          userId,
          title: '✅ Atividade concluída!',
          message: `+${xpAwarded} XP e +${coinsAwarded} moedas por "${activity.title}"!`,
          type: 'XP',
          emoji: '✅',
        }
      });
    }

    res.status(201).json({ submission, xpAwarded, coinsAwarded, score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao enviar atividade.' });
  }
};

const createActivity = async (req, res) => {
  const { title, description, type, difficulty, subject, xpReward, coinReward, content, dueDate } = req.body;
  try {
    const activity = await prisma.activity.create({
      data: {
        title, description, type, difficulty, subject,
        xpReward: Number(xpReward),
        coinReward: Number(coinReward),
        content: typeof content === 'string' ? content : JSON.stringify(content),
        createdBy: req.user.userId,
        dueDate: dueDate ? new Date(dueDate) : null,
      }
    });
    res.status(201).json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar atividade.' });
  }
};

const updateActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const activity = await prisma.activity.findUnique({ where: { id } });
    if (!activity) return res.status(404).json({ error: 'Atividade não encontrada.' });
    if (activity.createdBy !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Sem permissão para editar.' });
    }
    const updated = await prisma.activity.update({ where: { id }, data: req.body });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar atividade.' });
  }
};

const gradeSubmission = async (req, res) => {
  const { id } = req.params;
  const { score, feedback, status } = req.body;
  try {
    const submission = await prisma.activitySubmission.findUnique({
      where: { id }, include: { activity: true }
    });
    if (!submission) return res.status(404).json({ error: 'Submissão não encontrada.' });

    let xpAwarded = 0, coinsAwarded = 0;
    if (status === 'APPROVED' && submission.xpAwarded === 0) {
      xpAwarded = submission.activity.xpReward;
      coinsAwarded = submission.activity.coinReward;
      await awardXP(submission.userId, xpAwarded);
      await awardCoins(submission.userId, coinsAwarded);
    }

    const updated = await prisma.activitySubmission.update({
      where: { id },
      data: { score: Number(score), feedback, status, gradedAt: new Date(), xpAwarded, coinsAwarded }
    });

    await prisma.notification.create({
      data: {
        userId: submission.userId,
        title: status === 'APPROVED' ? '✅ Atividade aprovada!' : '❌ Atividade corrigida',
        message: feedback || `Sua atividade "${submission.activity.title}" foi corrigida.`,
        type: 'INFO',
        emoji: status === 'APPROVED' ? '✅' : '📝',
      }
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Erro ao corrigir atividade.' });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await prisma.activitySubmission.findMany({
      where: { userId: req.user.userId },
      orderBy: { submittedAt: 'desc' },
      include: { activity: { select: { title: true, subject: true, difficulty: true, xpReward: true } } }
    });
    res.json(submissions);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar submissões.' });
  }
};

const updateMissionProgress = async (userId, type, value = 1) => {
  const today = new Date().toISOString().split('T')[0];
  const missions = await prisma.dailyMission.findMany({ where: { type, isActive: true } });

  for (const mission of missions) {
    const userMission = await prisma.userMission.findUnique({
      where: { userId_missionId_date: { userId, missionId: mission.id, date: today } }
    });

    if (!userMission || userMission.completed) continue;

    const newProgress = userMission.progress + value;
    const completed = newProgress >= mission.targetValue;

    await prisma.userMission.update({
      where: { id: userMission.id },
      data: {
        progress: Math.min(newProgress, mission.targetValue),
        completed,
        completedAt: completed ? new Date() : null,
      }
    });

    if (completed) {
      await awardXP(userId, mission.xpReward);
      await awardCoins(userId, mission.coinReward);
      await prisma.notification.create({
        data: {
          userId,
          title: `${mission.emoji} Missão concluída!`,
          message: `"${mission.title}" — +${mission.xpReward} XP e +${mission.coinReward} moedas!`,
          type: 'XP',
          emoji: mission.emoji,
        }
      });
    }
  }
};

module.exports = { getActivities, getActivity, submitActivity, createActivity, updateActivity, gradeSubmission, getMySubmissions };
