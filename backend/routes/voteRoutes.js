const express = require('express');
const router = express.Router();
const db = require('../models');
const { verifyToken, isMentor } = require('../middleware/auth');

const Vote = db.vote; // Assuming a 'vote' model will be created

// All routes in this file are protected and require a user to be a mentor.
router.use(verifyToken, isMentor);

// POST /api/vote - Allow a mentor to cast a vote
router.post('/', async (req, res) => {
    const { subjectId, topic, value } = req.body; // e.g., subjectId (pupil), topic, value
    const mentorId = req.userId;

    try {
        const newVote = await Vote.create({
            mentorId,
            subjectId,
            topic,
            value
        });
        res.status(201).json({ message: 'Vote cast successfully', vote: newVote });
    } catch (error) {
        res.status(500).json({ message: 'Failed to cast vote', error });
    }
});

module.exports = router;