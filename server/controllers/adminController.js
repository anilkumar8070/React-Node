const User = require('../models/User');
const Activity = require('../models/Activity');
const Department = require('../models/Department');
const Notification = require('../models/Notification');

// @desc    Get admin dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboard = async (req, res) => {
  try {
    const [
      totalStudents,
      totalFaculty,
      totalActivities,
      pendingActivities,
      approvedActivities,
      rejectedActivities,
      totalDepartments
    ] = await Promise.all([
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({ role: 'faculty', isActive: true }),
      Activity.countDocuments(),
      Activity.countDocuments({ status: 'pending' }),
      Activity.countDocuments({ status: 'approved' }),
      Activity.countDocuments({ status: 'rejected' }),
      Department.countDocuments({ isActive: true })
    ]);

    // Activity trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const activityTrends = await Activity.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top performing students
    const topStudents = await User.find({ role: 'student', isActive: true })
      .sort('-activityScore')
      .limit(10)
      .select('name rollNo program department activityScore badges')
      .populate('department', 'name code');

    // Department-wise statistics
    const departments = await Department.find({ isActive: true });
    const departmentStats = await Promise.all(
      departments.map(async (dept) => {
        const students = await User.countDocuments({ 
          department: dept._id, 
          role: 'student',
          isActive: true
        });
        const studentIds = await User.find({ 
          department: dept._id, 
          role: 'student' 
        }).select('_id');
        
        const activities = await Activity.countDocuments({ 
          student: { $in: studentIds.map(s => s._id) } 
        });
        
        return {
          department: dept.name,
          code: dept.code,
          students,
          activities
        };
      })
    );

    // Activity type distribution
    const activityTypeStats = await Activity.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent activities
    const recentActivities = await Activity.find()
      .sort('-createdAt')
      .limit(10)
      .populate('student', 'name rollNo')
      .populate('reviewedBy', 'name');

    res.status(200).json({
      success: true,
      dashboard: {
        overview: {
          totalStudents,
          totalFaculty,
          totalActivities,
          pendingActivities,
          approvedActivities,
          rejectedActivities,
          totalDepartments
        },
        activityTrends,
        topStudents,
        departmentStats,
        activityTypeStats,
        recentActivities
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

// @desc    Get all activities
// @route   GET /api/admin/activities
// @access  Private (Admin)
exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('student', 'name rollNo email program')
      .populate('reviewedBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: activities.length,
      activities
    });
  } catch (error) {
    console.error('Get all activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities',
      error: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    const { role, department, isActive, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (department) filter.department = department;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .populate('department', 'name code')
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Private (Admin)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, rollNo, program, semester, department } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    if (rollNo) {
      const existingRollNo = await User.findOne({ rollNo });
      if (existingRollNo) {
        return res.status(400).json({
          success: false,
          message: 'User with this roll number already exists'
        });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      rollNo,
      program,
      semester,
      department
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow password update through this route
    if (req.body.password) {
      delete req.body.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - just deactivate
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// @desc    Get all departments
// @route   GET /api/admin/departments
// @access  Private (Admin)
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('hod', 'name email')
      .populate('faculty', 'name email')
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
};

// @desc    Create department
// @route   POST /api/admin/departments
// @access  Private (Admin)
exports.createDepartment = async (req, res) => {
  try {
    const { name, code, description, hod, programs } = req.body;

    const existingDept = await Department.findOne({ 
      $or: [{ name }, { code }] 
    });

    if (existingDept) {
      return res.status(400).json({
        success: false,
        message: 'Department with this name or code already exists'
      });
    }

    const department = await Department.create({
      name,
      code,
      description,
      hod,
      programs
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      department
    });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating department',
      error: error.message
    });
  }
};

// @desc    Update department
// @route   PUT /api/admin/departments/:id
// @access  Private (Admin)
exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('hod', 'name email');

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      department
    });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating department',
      error: error.message
    });
  }
};

// @desc    Delete department
// @route   DELETE /api/admin/departments/:id
// @access  Private (Admin)
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Soft delete
    department.isActive = false;
    await department.save();

    res.status(200).json({
      success: true,
      message: 'Department deactivated successfully'
    });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting department',
      error: error.message
    });
  }
};

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Activity status distribution
    const statusDistribution = await Activity.aggregate([
      ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Activity level distribution
    const levelDistribution = await Activity.aggregate([
      ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
      { $group: { _id: '$level', count: { $sum: 1 } } }
    ]);

    // Category distribution
    const categoryDistribution = await Activity.aggregate([
      ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // User growth
    const userGrowth = await User.aggregate([
      { $match: { role: 'student' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        statusDistribution,
        levelDistribution,
        categoryDistribution,
        userGrowth
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};
