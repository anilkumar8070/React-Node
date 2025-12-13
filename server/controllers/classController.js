const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Get all classes (Admin)
// @route   GET /api/classes/all
// @access  Private (Admin)
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('faculty', 'name email designation')
      .populate('department', 'name code')
      .populate('students', 'name rollNo')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: classes.length,
      classes
    });
  } catch (error) {
    console.error('Get all classes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching classes',
      error: error.message
    });
  }
};

// @desc    Get all classes assigned to faculty
// @route   GET /api/classes/my-classes
// @access  Private (Faculty)
exports.getMyClasses = async (req, res) => {
  try {
    const classes = await Class.find({ faculty: req.user.id, isActive: true })
      .populate('department', 'name code')
      .populate('students', 'name rollNo email')
      .sort('-createdAt');

    // Get total lectures and attendance stats for each class
    const classesWithStats = await Promise.all(
      classes.map(async (classItem) => {
        const totalStudents = classItem.students.length;
        const attendanceRecords = await Attendance.find({ class: classItem._id });
        
        return {
          ...classItem.toObject(),
          totalStudents,
          attendanceCount: attendanceRecords.length
        };
      })
    );

    res.status(200).json({
      success: true,
      count: classesWithStats.length,
      classes: classesWithStats
    });
  } catch (error) {
    console.error('Get my classes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching classes',
      error: error.message
    });
  }
};

// @desc    Get single class details
// @route   GET /api/classes/:id
// @access  Private (Faculty)
exports.getClassDetails = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id)
      .populate('department', 'name code')
      .populate('students', 'name rollNo email profileImage');

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check if faculty owns this class
    if (classItem.faculty.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this class'
      });
    }

    // Get attendance statistics
    const attendanceRecords = await Attendance.find({ class: req.params.id });
    const studentsWithAttendance = await Promise.all(
      classItem.students.map(async (student) => {
        const studentAttendance = attendanceRecords.filter(
          (record) => record.student.toString() === student._id.toString()
        );
        const totalPresent = studentAttendance.filter((r) => r.status === 'present').length;
        const totalLectures = classItem.totalLectures || 0;
        const attendancePercentage = totalLectures > 0 ? (totalPresent / totalLectures) * 100 : 0;

        return {
          ...student.toObject(),
          attendanceStats: {
            present: totalPresent,
            total: totalLectures,
            percentage: attendancePercentage.toFixed(2)
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      class: {
        ...classItem.toObject(),
        students: studentsWithAttendance
      }
    });
  } catch (error) {
    console.error('Get class details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching class details',
      error: error.message
    });
  }
};

// @desc    Mark attendance for a class
// @route   POST /api/classes/:id/attendance
// @access  Private (Faculty)
exports.markAttendance = async (req, res) => {
  try {
    const { attendanceData } = req.body; // Array of { studentId, status }
    const classItem = await Class.findById(req.params.id);

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check if faculty owns this class
    if (classItem.faculty.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark attendance for this class'
      });
    }

    // Increment lecture count
    classItem.totalLectures += 1;
    await classItem.save();

    // Create attendance records
    const attendanceRecords = await Promise.all(
      attendanceData.map(async (record) => {
        return await Attendance.create({
          class: classItem._id,
          student: record.studentId,
          faculty: req.user.id,
          status: record.status,
          lectureNumber: classItem.totalLectures,
          date: new Date()
        });
      })
    );

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      lectureNumber: classItem.totalLectures,
      records: attendanceRecords
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
      error: error.message
    });
  }
};

// @desc    Get student's attendance for all classes
// @route   GET /api/classes/student/my-attendance
// @access  Private (Student)
exports.getMyAttendance = async (req, res) => {
  try {
    // Find all classes where student is enrolled
    const classes = await Class.find({ students: req.user.id, isActive: true })
      .populate('faculty', 'name email')
      .populate('department', 'name code');

    // Get attendance for each class
    const attendanceData = await Promise.all(
      classes.map(async (classItem) => {
        const attendanceRecords = await Attendance.find({
          class: classItem._id,
          student: req.user.id
        }).sort('lectureNumber');

        const totalPresent = attendanceRecords.filter((r) => r.status === 'present').length;
        const totalLectures = classItem.totalLectures || 0;
        const attendancePercentage = totalLectures > 0 ? (totalPresent / totalLectures) * 100 : 0;

        return {
          class: classItem,
          attendance: {
            present: totalPresent,
            absent: attendanceRecords.filter((r) => r.status === 'absent').length,
            late: attendanceRecords.filter((r) => r.status === 'late').length,
            total: totalLectures,
            percentage: attendancePercentage.toFixed(2)
          },
          records: attendanceRecords
        };
      })
    );

    res.status(200).json({
      success: true,
      data: attendanceData
    });
  } catch (error) {
    console.error('Get my attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance',
      error: error.message
    });
  }
};

module.exports = exports;
