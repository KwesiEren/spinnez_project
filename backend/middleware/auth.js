const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.user; // Assuming your user model is named 'user'

exports.verifyToken = (req, res, next) => {
    // This is a placeholder for your actual token verification logic.
    // You would typically get the token from the Authorization header.
    // e.g., const token = req.headers['x-access-token'] or req.headers.authorization.split(' ')[1];
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    // Replace with your actual JWT verification
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send({ message: "Unauthorized!" });
        req.userId = decoded.id; // Assuming your token payload has an 'id' field
        next();
    });
};

exports.isSuperAdmin = async (req, res, next) => {
    // This middleware should be used after a middleware that authenticates the user
    // and attaches the user object (or at least userId) to the request.
    // For this example, I'm assuming `req.userId` is available.
    if (!req.userId) {
        return res.status(403).json({ message: "Authentication required." });
    }

    try {
        const user = await User.findByPk(req.userId);
        if (user && user.role === 'admin') {
            return next();
        }
        return res.status(403).json({ message: "Require Super Admin Role!" });
    } catch (error) {
        return res.status(500).json({ message: "Unable to validate user role." });
    }
};

exports.isMentor = async (req, res, next) => {
    if (!req.userId) {
        return res.status(403).json({ message: "Authentication required." });
    }

    try {
        const user = await User.findByPk(req.userId);
        // Allow admins to perform mentor actions as well
        if (user && (user.role === 'mentor' || user.role === 'admin')) {
            return next();
        }
        return res.status(403).json({ message: "Require Mentor Role!" });
    } catch (error) {
        return res.status(500).json({ message: "Unable to validate user role." });
    }
};