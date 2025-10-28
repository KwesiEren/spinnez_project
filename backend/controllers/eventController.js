const { Event } = require('../models');

async function createEvent(req, res) {
    try {
        const { title, description, location, date, entry_fee, reward } = req.body;
        const ev = await Event.create({ title, description, location, date, entry_fee, reward, host_id: req.user.id });
        res.json({ event: ev });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

async function listEvents(req, res) {
    const events = await Event.findAll({ order: [['date', 'ASC']] });
    res.json({ events });
}

module.exports = { createEvent, listEvents };
