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
  getAnalytics
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Dashboard and analytics
router.get('/dashboard', getDashboard);
router.get('/analytics', getAnalytics);

// User management
router.route('/users')
  .get(getUsers)
  .post(createUser);

router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

// Department management
router.route('/departments')
  .get(getDepartments)
  .post(createDepartment);

router.route('/departments/:id')
  .put(updateDepartment)
  .delete(deleteDepartment);

module.exports = router;
