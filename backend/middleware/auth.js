const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'secret';

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, jwtSecret);
        const user = await User.findByPk(payload.id);
        if (!user) return res.status(401).json({ error: 'User not found' });
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

function requireRole(role) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
        next();
    };
}

module.exports = { authMiddleware, requireRole };
