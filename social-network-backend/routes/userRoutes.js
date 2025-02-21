const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadAvatar = require('../middleware/uploadAvatar');

router.put('/profile/avatar', authMiddleware, uploadAvatar.single('avatar'), userController.updateAvatar);
router.delete('/profile/avatar', authMiddleware, userController.deleteAvatar);
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.put('/profile/sensitive', authMiddleware, userController.updateSensitive);
router.get('/', authMiddleware, userController.getAllUsers);

module.exports = router;
