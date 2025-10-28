const { User, MentorshipRequest } = require('../models');

async function allocateMentor(mentee) {
    // find seasoned mentors with same genre first
    const where = { role: 'seasoned' };
    if (mentee.genre) where.genre = mentee.genre;

    let mentors = await User.findAll({ where });

    // fallback to any seasoned if none match exactly
    if (!mentors || mentors.length === 0) {
        mentors = await User.findAll({ where: { role: 'seasoned' } });
    }
    if (!mentors || mentors.length === 0) return null;

    // compute load for each mentor (active mentees count)
    const mentorsWithLoad = await Promise.all(mentors.map(async m => {
        const count = await MentorshipRequest.count({ where: { mentor_id: m.id, status: 'active' } });
        return { mentor: m, load: count, last_assigned: m.updatedAt || m.createdAt };
    }));

    // sort by load ascending, rating desc, last_assigned ascending
    mentorsWithLoad.sort((a, b) => {
        if (a.load !== b.load) return a.load - b.load;
        if ((b.mentor.rating || 0) !== (a.mentor.rating || 0)) return (b.mentor.rating || 0) - (a.mentor.rating || 0);
        return new Date(a.last_assigned) - new Date(b.last_assigned);
    });

    const chosen = mentorsWithLoad[0].mentor;
    return chosen;
}

module.exports = allocateMentor;
