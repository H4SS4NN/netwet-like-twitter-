
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/:postId', authMiddleware, commentController.createComment);

router.get('/:postId', authMiddleware, commentController.getCommentsByPost);

router.delete('/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router;
