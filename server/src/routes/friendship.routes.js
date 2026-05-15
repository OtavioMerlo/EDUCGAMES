const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const {
  sendFriendRequest,
  respondFriendRequest,
  removeFriendship,
  getMyFriends,
  getPendingRequests,
  getFriendshipStatus
} = require('../controllers/friendship.controller');

const router = express.Router();

router.post('/request', authenticate, sendFriendRequest);
router.post('/respond', authenticate, respondFriendRequest);
router.delete('/remove/:targetId', authenticate, removeFriendship);
router.get('/my-friends', authenticate, getMyFriends);
router.get('/pending', authenticate, getPendingRequests);
router.get('/status/:targetId', authenticate, getFriendshipStatus);

module.exports = router;
