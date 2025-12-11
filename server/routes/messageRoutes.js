const express = require('express');
const router = express.Router();
const {
  sendClassMessage,
  getClassMessages,
  getMyMessages,
  markMessageAsRead
} = require('../controllers/messageController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Faculty routes
router.post('/class/:classId', protect, authorize('faculty'), sendClassMessage);
router.get('/class/:classId', protect, authorize('faculty'), getClassMessages);

// Student routes
router.get('/my-messages', protect, authorize('student'), getMyMessages);
router.put('/:messageId/read', protect, authorize('student'), markMessageAsRead);

module.exports = router;
