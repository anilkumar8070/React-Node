const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const { protect } = require('../middlewares/authMiddleware');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true })
      .populate('hod', 'name email')
      .select('name code description programs')
      .sort('name');

    res.status(200).json({
      success: true,
      count: departments.length,
      departments
    });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching departments',
      error: error.message
    });
  }
});

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('hod', 'name email')
      .populate('faculty', 'name email');

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.status(200).json({
      success: true,
      department
    });
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching department',
      error: error.message
    });
  }
});

module.exports = router;
