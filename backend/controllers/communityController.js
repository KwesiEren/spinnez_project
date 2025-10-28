const { CommunityPost, Comment, Like } = require('../models');

async function createPost(req, res) {
    try {
        const post = await CommunityPost.create({
            user_id: req.user.id,
            content: req.body.content,
            media_url: req.body.media_url
        });
        req.app.get('io').emit('new_post', { post });
        res.json({ post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

async function listPosts(req, res) {
    const posts = await CommunityPost.findAll({
        order: [['createdAt', 'DESC']]
    });
    res.json({ posts });
}

async function addComment(req, res) {
    try {
        const { postId } = req.params;
        const comment = await Comment.create({
            post_id: postId,
            user_id: req.user.id,
            comment_text: req.body.comment_text
        });
        req.app.get('io').emit('new_comment', { postId, comment });
        res.json({ comment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

async function toggleLike(req, res) {
    try {
        const { postId } = req.params;
        const existing = await Like.findOne({ where: { post_id: postId, user_id: req.user.id } });
        if (existing) {
            await existing.destroy();
            req.app.get('io').emit('like_removed', { postId, userId: req.user.id });
            return res.json({ liked: false });
        }
        const like = await Like.create({ post_id: postId, user_id: req.user.id });
        req.app.get('io').emit('like_added', { postId, userId: req.user.id });
        res.json({ liked: true, like });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { createPost, listPosts, addComment, toggleLike };
