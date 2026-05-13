const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { getProfile, updateProfile } = require('../controllers/user.controller');

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.get('/profile/:id', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.patch('/profile/equip-aura', authenticate, require('../controllers/user.controller').equipAura);
router.patch('/profile/equip-accessory', authenticate, require('../controllers/user.controller').equipAccessory);

module.exports = router;
