const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/chatbotController');
const { protect } = require('../middlewares/authMiddleware');

// Protected route - requires authentication
router.post('/message', protect, sendMessage);

module.exports = router;
