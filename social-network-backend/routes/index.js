const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const commentRoutes = require('./commentRoutes');
const messageRoutes = require('./messageRoutes');
const conversationRoutes = require('./conversationRoutes'); 

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/messages', messageRoutes);
router.use('/conversations', conversationRoutes); 

module.exports = router;
