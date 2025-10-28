const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { awardBadge } = require('../controllers/badgeController');

router.post('/', authMiddleware, awardBadge);

module.exports = router;
