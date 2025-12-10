const Activity = require('../models/Activity');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all activities for review
// @route   GET /api/faculty/activities
// @access  Private (Faculty)
exports.getActivitiesForReview = async (req, res) => {
  try {
    const { status = 'pending', department, semester, type, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (semester) filter.semester = semester;

    // Faculty can only see activities from their department
    if (req.user.role === 'faculty') {
      const students = await User.find({ 
        department: req.user.department,
        role: 'student'
      }).select('_id');
      
      filter.student = { $in: students.map(s => s._id) };
    }

    // Admin can filter by department
    if (req.user.role === 'admin' && department) {
      const students = await User.find({ 
        department,
        role: 'student'
      }).select('_id');
      
      filter.student = { $in: students.map(s => s._id) };
    }

    const skip = (page - 1) * limit;

    const activities = await Activity.find(filter)
      .populate('student', 'name email rollNo program semester department')
      .populate('reviewedBy', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Activity.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: activities.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      activities
    });
  } catch (error) {
    console.error('Get activities for review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities',
      error: error.message
    });
  }
};

// @desc    Get students list
// @route   GET /api/faculty/students
// @access  Private (Faculty)
exports.getStudents = async (req, res) => {
  try {
    const { department, semester, program, search } = req.query;

    const filter = { role: 'student' };

    // Faculty can only see students from their department
    if (req.user.role === 'faculty') {
      filter.department = req.user.department;
    }

    // Admin can filter by department
    if (req.user.role === 'admin' && department) {
      filter.department = department;
    }

    if (semester) filter.semester = semester;
    if (program) filter.program = program;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await User.find(filter)
      .populate('department', 'name code')
      .select('-password')
      .sort('name');

    // Get activity count for each student
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const stats = await student.getStatistics();
        return {
          ...student.toObject(),
          stats
        };
      })
    );

    res.status(200).json({
      success: true,
      count: studentsWithStats.length,
      students: studentsWithStats
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// @desc    Review activity (Approve/Reject)
// @route   PUT /api/faculty/activities/:id/review
// @access  Private (Faculty)
exports.reviewActivity = async (req, res) => {
  try {
    const { status, remarks, credits } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either approved or rejected'
      });
    }

    const activity = await Activity.findById(req.params.id)
      .populate('student', 'name email activityScore totalCredits badges');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Update activity
    activity.status = status;
    activity.remarks = remarks;
    activity.reviewedBy = req.user.id;
    activity.reviewedAt = Date.now();
    activity.isVerified = status === 'approved';

    if (status === 'approved' && credits) {
      activity.credits = credits;
    }

    await activity.save();

    // Update student statistics if approved
    if (status === 'approved') {
      const student = await User.findById(activity.student._id);
      student.activityScore += activity.score || 0;
      student.totalCredits += activity.credits || 0;

      // Award badges based on activity score
      if (student.activityScore >= 500 && !student.badges.some(b => b.type === 'gold')) {
        student.badges.push({
          type: 'gold',
          name: 'Gold Badge - 500+ Activity Points',
          earnedAt: Date.now()
        });

        // Create badge notification
        await Notification.create({
          recipient: student._id,
          sender: req.user.id,
          type: 'badge-earned',
          title: '🏆 Gold Badge Earned!',
          message: 'Congratulations! You have earned the Gold Badge for achieving 500+ activity points!',
          priority: 'high'
        });
      } else if (student.activityScore >= 300 && !student.badges.some(b => b.type === 'silver')) {
        student.badges.push({
          type: 'silver',
          name: 'Silver Badge - 300+ Activity Points',
          earnedAt: Date.now()
        });
      } else if (student.activityScore >= 100 && !student.badges.some(b => b.type === 'bronze')) {
        student.badges.push({
          type: 'bronze',
          name: 'Bronze Badge - 100+ Activity Points',
          earnedAt: Date.now()
        });
      }

      await student.save();
    }

    // Create notification for student
    const notification = await Notification.create({
      recipient: activity.student._id,
      sender: req.user.id,
      type: status === 'approved' ? 'activity-approved' : 'activity-rejected',
      title: `Activity ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Your activity "${activity.title}" has been ${status}. ${remarks || ''}`,
      relatedActivity: activity._id,
      link: `/activities/${activity._id}`,
      priority: status === 'approved' ? 'normal' : 'high'
    });

    // Emit socket event
    const io = req.app.get('io');
    io.to(activity.student._id.toString()).emit('new-notification', notification);

    res.status(200).json({
      success: true,
      message: `Activity ${status} successfully`,
      activity
    });
  } catch (error) {
    console.error('Review activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reviewing activity',
      error: error.message
    });
  }
};

// @desc    Get faculty dashboard stats
// @route   GET /api/faculty/dashboard
// @access  Private (Faculty)
exports.getDashboardStats = async (req, res) => {
  try {
    let studentFilter = { role: 'student' };

    // Faculty sees only their department
    if (req.user.role === 'faculty') {
      studentFilter.department = req.user.department;
    }

    const students = await User.find(studentFilter).select('_id');
    const studentIds = students.map(s => s._id);

    const [
      totalActivities,
      pendingActivities,
      approvedActivities,
      rejectedActivities,
      recentActivities
    ] = await Promise.all([
      Activity.countDocuments({ student: { $in: studentIds } }),
      Activity.countDocuments({ student: { $in: studentIds }, status: 'pending' }),
      Activity.countDocuments({ student: { $in: studentIds }, status: 'approved' }),
      Activity.countDocuments({ student: { $in: studentIds }, status: 'rejected' }),
      Activity.find({ student: { $in: studentIds } })
        .populate('student', 'name rollNo')
        .sort('-createdAt')
        .limit(10)
    ]);

    // Top performing students
    const topStudents = await User.find(studentFilter)
      .sort('-activityScore')
      .limit(5)
      .select('name rollNo activityScore badges');

    res.status(200).json({
      success: true,
      stats: {
        totalStudents: students.length,
        totalActivities,
        pendingActivities,
        approvedActivities,
        rejectedActivities,
        recentActivities,
        topStudents
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get student progress/activities
// @route   GET /api/faculty/students/:id/activities
// @access  Private (Faculty)
exports.getStudentActivities = async (req, res) => {
  try {
    const student = await User.findById(req.params.id)
      .populate('department', 'name code');

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Faculty can only access students from their department
    if (req.user.role === 'faculty' && 
        student.department._id.toString() !== req.user.department.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this student'
      });
    }

    const activities = await Activity.find({ student: req.params.id })
      .sort('-createdAt')
      .populate('reviewedBy', 'name email');

    const stats = await student.getStatistics();

    res.status(200).json({
      success: true,
      student: {
        ...student.toObject(),
        stats
      },
      activities
    });
  } catch (error) {
    console.error('Get student activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student activities',
      error: error.message
    });
  }
};
