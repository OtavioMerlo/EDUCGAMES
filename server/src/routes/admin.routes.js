const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { 
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
} = require('../controllers/admin.controller');

const router = express.Router();

// Dashboard & Analytics
router.get('/dashboard', authenticate, authorize('ADMIN'), getDashboardStats);

// User Management
router.get('/users', authenticate, authorize('ADMIN'), getUsers);
router.get('/users/:id', authenticate, authorize('ADMIN'), getUserDetail);
router.patch('/users/:id', authenticate, authorize('ADMIN'), updateUser);
router.delete('/users/:id', authenticate, authorize('ADMIN'), deleteUser);

// Store & Rewards Management
router.get('/rewards', authenticate, authorize('ADMIN'), getRewards);
router.post('/rewards', authenticate, authorize('ADMIN'), createReward);
router.put('/rewards/:id', authenticate, authorize('ADMIN'), updateReward);
router.delete('/rewards/:id', authenticate, authorize('ADMIN'), deleteReward);

// Audit & Monitoring
router.get('/logs', authenticate, authorize('ADMIN'), getAuditLogs);

module.exports = router;
