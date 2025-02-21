const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');


router.post('/', authMiddleware, upload.single('image'), postController.createPost);


router.get('/', authMiddleware, postController.getAllPosts);


router.get('/:id', authMiddleware, postController.getPostById);


router.put('/:id', authMiddleware, upload.single('image'), postController.updatePost);


router.delete('/:id', authMiddleware, postController.deletePost);


router.post('/:id/like', authMiddleware, postController.likePost);
router.delete('/:id/like', authMiddleware, postController.unlikePost);


router.delete('/admin/:id', authMiddleware, postController.adminDeletePost);

module.exports = router;
