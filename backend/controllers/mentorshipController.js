const { MentorshipRequest, User } = require('../models');
const allocateMentor = require('../utils/mentorAllocator');

async function requestMentorship(req, res) {
    try {
        // only upcoming DJs can request
        if (req.user.role !== 'upcoming') return res.status(403).json({ error: 'Only upcoming DJs can request mentorship' });

        // create request row
        const request = await MentorshipRequest.create({
            mentee_id: req.user.id,
            status: 'pending'
        });

        // if user is premium already, allocate immediately
        if (req.user.is_premium) {
            const mentor = await allocateMentor(req.user);
            if (mentor) {
                request.mentor_id = mentor.id;
                request.status = 'active';
                request.started_at = new Date();
                await request.save();
                // notify via socket
                req.app.get('io').emit('mentorship_assigned', { request, mentor });
            }
        }

        res.json({ request });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

async function myMentorships(req, res) {
    const asMentee = await MentorshipRequest.findAll({ where: { mentee_id: req.user.id } });
    const asMentor = await MentorshipRequest.findAll({ where: { mentor_id: req.user.id } });
    res.json({ asMentee, asMentor });
}

module.exports = { requestMentorship, myMentorships };
