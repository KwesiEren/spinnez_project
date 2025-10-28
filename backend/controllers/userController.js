const { User } = require('../models');

async function getProfile(req, res) {
    const user = req.user;
    res.json({ user });
}

async function updateProfile(req, res) {
    try {
        const user = req.user;
        const update = req.body;
        // prevent role change via profile update
        delete update.role;
        if (update.password) delete update.password; // handle password separately
        await user.update(update);
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { getProfile, updateProfile };
