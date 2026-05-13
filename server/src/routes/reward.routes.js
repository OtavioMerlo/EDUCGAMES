const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const {
  getRewards, purchaseReward, getMyPurchases,
  createReward, updateReward, deleteReward
} = require('../controllers/reward.controller');

const router = express.Router();

router.get('/', authenticate, getRewards);
router.post('/purchase', authenticate, authorize('STUDENT'), purchaseReward);
router.get('/my-purchases', authenticate, getMyPurchases);
router.post('/', authenticate, authorize('ADMIN'), createReward);
router.put('/:id', authenticate, authorize('ADMIN'), updateReward);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteReward);

module.exports = router;
