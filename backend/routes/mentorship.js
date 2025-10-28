const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { requestMentorship, myMentorships } = require('../controllers/mentorshipController');

router.post('/request', authMiddleware, requestMentorship);
router.get('/my', authMiddleware, myMentorships);

module.exports = router;
