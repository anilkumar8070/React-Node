const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  updatePassword,
  logout
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['student', 'faculty', 'admin']).withMessage('Invalid role')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);
router.post('/logout', protect, logout);

module.exports = router;
