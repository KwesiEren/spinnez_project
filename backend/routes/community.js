const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { createPost, listPosts, addComment, toggleLike } = require('../controllers/communityController');

router.get('/', listPosts);
router.post('/', authMiddleware, createPost);
router.post('/:postId/comment', authMiddleware, addComment);
router.post('/:postId/like', authMiddleware, toggleLike);

module.exports = router;
