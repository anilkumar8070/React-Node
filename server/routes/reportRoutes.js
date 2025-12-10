const express = require('express');
const router = express.Router();
const {
  generateStudentReport,
  getDepartmentReport,
  getReports
} = require('../controllers/reportController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(protect);

router.get('/', getReports);
router.get('/student/:id/pdf', generateStudentReport);
router.get('/department/:id', authorize('faculty', 'admin'), getDepartmentReport);

module.exports = router;
