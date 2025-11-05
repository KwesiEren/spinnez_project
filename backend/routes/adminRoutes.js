const express = require('express');
const router = express.Router();
const db = require('../models');
const { isSuperAdmin } = require('../middleware/auth');

const User = db.user; // Assuming your user model is named 'user'

// NOTE: You should have a general authentication middleware that runs before these routes
// to verify the JWT and add `req.userId`. For simplicity, it's omitted here,
// but `isSuperAdmin` depends on it.

// GET /api/admin/users - Get all users
router.get('/users', isSuperAdmin, async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve users', error });
    }
});

// PUT /api/admin/users/:id/role - Update a user's role
router.put('/users/:id/role', isSuperAdmin, async (req, res) => {
    const { role } = req.body;
    if (!['pupil', 'mentor', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role specified.' });
    }
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        user.role = role;
        await user.save();
        res.json({ message: `User role updated to ${role}` });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user role', error });
    }
});

module.exports = router;