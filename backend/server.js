const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const sequelize = require('./config/database');
const db = require('./models'); // initialize models and associations

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const mixRoutes = require('./routes/mixes');
const communityRoutes = require('./routes/community');
const mentorshipRoutes = require('./routes/mentorship');
const eventsRoutes = require('./routes/events');
const badgesRoutes = require('./routes/badges');
const paystackRoutes = require('./routes/paystackRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes
const mentorRoutes = require('./routes/mentorRoutes'); // Import mentor routes
const voteRoutes = require('./routes/voteRoutes'); // Import vote routes

const app = express();
const server = http.createServer(app);

// Socket.io
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });
app.set('io', io);

io.on('connection', (socket) => {
    console.log('socket connected:', socket.id);

    // User joins a room based on their own user ID
    socket.on('join', (userId) => {
        console.log(`Socket ${socket.id} joining room for user ${userId}`);
        socket.join(userId);
    });

    // Listen for a private message
    socket.on('private_message', ({ recipientId, senderId, text }) => {
        console.log(`Message from ${senderId} to ${recipientId}: ${text}`);
        // Emit the message to the recipient's room
        io.to(recipientId).emit('new_message', {
            text,
            senderId,
            timestamp: new Date(),
        });
    });

    socket.on('disconnect', () => {
        console.log('socket disconnected:', socket.id);
    });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static uploads
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.join(__dirname, '..', uploadDir)));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mixes', mixRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/badges', badgesRoutes);
app.use('/api/paystack', paystackRoutes);
app.use('/api/admin', adminRoutes); // Use admin routes
app.use('/api/mentor', mentorRoutes); // Use mentor routes
app.use('/api/vote', voteRoutes); // Use vote routes

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// start server
const PORT = process.env.PORT || 4000;
(async () => {
    try {
        await sequelize.authenticate();
        console.log('DB connected');
        // sync models - in dev use { force: true } carefully
        await sequelize.sync({ alter: true });
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start', err);
        process.exit(1);
    }
})();
