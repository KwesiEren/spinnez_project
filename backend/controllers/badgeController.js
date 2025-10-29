const { Badge } = require('../models');

async function awardBadge(req, res) {
    try {
        const { user_id, badge_name } = req.body;
        const badge = await Badge.create({ user_id, badge_name });
        res.json({ badge });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { awardBadge };
