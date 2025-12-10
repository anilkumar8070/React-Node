const express = require('express');
const router = express.Router();
const {
  getActivitiesForReview,
  getStudents,
  reviewActivity,
  getDashboardStats,
  getStudentActivities
} = require('../controllers/facultyController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes require faculty or admin authentication
router.use(protect);
router.use(authorize('faculty', 'admin'));

// Faculty dashboard
router.get('/dashboard', getDashboardStats);

// Students management
router.get('/students', getStudents);
router.get('/students/:id/activities', getStudentActivities);

// Activity review
router.get('/activities', getActivitiesForReview);
router.put('/activities/:id/review', reviewActivity);

module.exports = router;
