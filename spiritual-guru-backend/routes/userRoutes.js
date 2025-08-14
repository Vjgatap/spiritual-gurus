const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile); // This route is protected

module.exports = router;