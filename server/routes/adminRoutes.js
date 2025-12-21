const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getAnalytics,
  getAllActivities,
  getPendingUsers,
  approveUser,
  rejectUser
} = require('../controllers/adminController');
const {
  getAllMeetings,
  createMeeting,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  updateAttendeeStatus
} = require('../controllers/meetingController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Dashboard and analytics
router.get('/dashboard', getDashboard);
router.get('/analytics', getAnalytics);
router.get('/activities', getAllActivities);

// User management
router.route('/users')
  .get(getUsers)
  .post(createUser);

router.get('/users/pending', getPendingUsers);

router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

router.put('/users/:id/approve', approveUser);
router.put('/users/:id/reject', rejectUser);

// Department management
router.route('/departments')
  .get(getDepartments)
  .post(createDepartment);

router.route('/departments/:id')
  .put(updateDepartment)
  .delete(deleteDepartment);

// Meeting management
router.route('/meetings')
  .get(getAllMeetings)
  .post(createMeeting);

router.route('/meetings/:id')
  .get(getMeetingById)
  .put(updateMeeting)
  .delete(deleteMeeting);

router.put('/meetings/:id/attendee-status', updateAttendeeStatus);

module.exports = router;
