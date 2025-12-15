const express = require('express');
const router = express.Router();
const {
  getStudentTimetable,
  getClassTimetable,
  getFacultyTimetable,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
  getAllTimetable
} = require('../controllers/timetableController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public routes (protected by auth)
router.get('/student/:studentId', protect, getStudentTimetable);
router.get('/class/:classId', protect, getClassTimetable);
router.get('/faculty/:facultyId', protect, getFacultyTimetable);

// Admin/Faculty routes
router.get('/', protect, authorize('admin', 'faculty'), getAllTimetable);
router.post('/', protect, authorize('admin', 'faculty'), createTimetableEntry);
router.put('/:id', protect, authorize('admin', 'faculty'), updateTimetableEntry);
router.delete('/:id', protect, authorize('admin'), deleteTimetableEntry);

module.exports = router;
