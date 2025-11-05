const express = require('express');
const router = express.Router();
const db = require('../models');
const { verifyToken, isMentor } = require('../middleware/auth');

const User = db.user;
const Mentorship = db.mentorship; // Assuming a 'mentorship' model exists for assignments

// All routes in this file are protected and require a user to be a mentor.
router.use(verifyToken, isMentor);

// GET /api/mentor/pupils - Get all pupils assigned to the logged-in mentor
router.get('/pupils', async (req, res) => {
    try {
        const pupils = await User.findAll({
            // This assumes a 'mentorId' foreign key on the User model for pupils.
            // Adjust the query based on your actual data model (e.g., using a Mentorship join table).
            where: { mentorId: req.userId },
            attributes: ['id', 'username', 'email', 'profile_pic_url'] // Send only necessary data
        });
        res.json(pupils);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve assigned pupils', error });
    }
});

module.exports = router;