const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const { globalSearch } = require('../controllers/search.controller');

const router = express.Router();

router.get('/global', authenticate, globalSearch);

module.exports = router;
