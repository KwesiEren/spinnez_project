const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { createEvent, listEvents } = require('../controllers/eventController');

router.post('/', authMiddleware, createEvent);
router.get('/', listEvents);

module.exports = router;
