const express = require('express');
const router = express.Router();
const {
  createActivity,
  getMyActivities,
  getActivity,
  updateActivity,
  deleteActivity,
  uploadDocuments,
  getActivityStats
} = require('../controllers/activityController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { upload, handleMulterError } = require('../middlewares/uploadMiddleware');

// All routes require authentication
router.use(protect);

// Activity routes
router
  .route('/')
  .get(getMyActivities)
  .post(authorize('student'), createActivity);

router.get('/stats', authorize('student'), getActivityStats);

router
  .route('/:id')
  .get(getActivity)
  .put(authorize('student'), updateActivity)
  .delete(authorize('student'), deleteActivity);

router.post(
  '/:id/documents',
  authorize('student'),
  upload.array('documents', 5),
  handleMulterError,
  uploadDocuments
);

module.exports = router;
