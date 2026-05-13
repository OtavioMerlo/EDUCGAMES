const express = require('express');
const { getLoja24Items, markLoja24AsSeen, purchaseLoja24Item } = require('../controllers/loja24.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authenticate, getLoja24Items);
router.post('/seen', authenticate, markLoja24AsSeen);
router.post('/purchase', authenticate, purchaseLoja24Item);

module.exports = router;
