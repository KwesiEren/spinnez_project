const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'secret';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

async function register(req, res) {
    try {
        const { email, password, role, name, dj_name } = req.body;
        if (!email || !password || !role) return res.status(400).json({ error: 'Missing fields' });
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ error: 'Email already in use' });
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashed, role, name, dj_name });
        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: jwtExpiresIn });
        res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: jwtExpiresIn });
        res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { register, login };
