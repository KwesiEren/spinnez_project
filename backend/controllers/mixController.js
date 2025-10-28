const { Mix } = require('../models');
const path = require('path');

async function uploadMix(req, res) {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const filePath = path.join(process.env.UPLOAD_DIR || 'uploads', req.file.filename);
        const data = {
            user_id: req.user.id,
            file_url: `/${filePath}`,
            title: req.body.title || req.file.originalname,
            genre: req.body.genre,
            bpm: req.body.bpm,
            mood: req.body.mood
        };
        const mix = await Mix.create(data);
        // emit socket event (server will broadcast)
        req.app.get('io').emit('new_mix', { mix });
        res.json({ mix });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
}

async function listMixes(req, res) {
    const mixes = await Mix.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ mixes });
}

module.exports = { uploadMix, listMixes };
