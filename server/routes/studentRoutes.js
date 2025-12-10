const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { upload, handleMulterError } = require('../middlewares/uploadMiddleware');

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private (Student)
router.get('/profile', protect, authorize('student'), async (req, res) => {
  try {
    const student = await User.findById(req.user.id)
      .populate('department', 'name code')
      .populate('mentor', 'name email');

    const stats = await student.getStatistics();

    res.status(200).json({
      success: true,
      student: {
        ...student.toObject(),
        stats
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private (Student)
router.put('/profile', protect, authorize('student'), async (req, res) => {
  try {
    const allowedFields = [
      'name',
      'contactNumber',
      'address',
      'dateOfBirth',
      'stanor'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const student = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).populate('department', 'name code');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      student
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// @desc    Upload profile image
// @route   POST /api/students/profile/image
// @access  Private (Student)
router.post(
  '/profile/image',
  protect,
  authorize('student'),
  upload.single('profileImage'),
  handleMulterError,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const student = await User.findByIdAndUpdate(
        req.user.id,
        { profileImage: `/uploads/${req.file.filename}` },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Profile image uploaded successfully',
        profileImage: student.profileImage
      });
    } catch (error) {
      console.error('Upload profile image error:', error);
      res.status(500).json({
        success: false,
        message: 'Error uploading profile image',
        error: error.message
      });
    }
  }
);

module.exports = router;
