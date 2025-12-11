const express = require('express');
const router = express.Router();
const {
  getMyClasses,
  getClassDetails,
  markAttendance,
  getMyAttendance
} = require('../controllers/classController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Faculty routes
router.get('/my-classes', protect, authorize('faculty'), getMyClasses);
router.get('/:id', protect, getClassDetails);
router.post('/:id/attendance', protect, authorize('faculty'), markAttendance);

// Student routes
router.get('/student/my-attendance', protect, authorize('student'), getMyAttendance);

module.exports = router;
