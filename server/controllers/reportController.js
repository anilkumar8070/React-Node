const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Activity = require('../models/Activity');
const User = require('../models/User');
const Report = require('../models/Report');

// @desc    Generate student activity report PDF
// @route   GET /api/reports/student/:id/pdf
// @access  Private
exports.generateStudentReport = async (req, res) => {
  try {
    const student = await User.findById(req.params.id)
      .populate('department', 'name code')
      .populate('mentor', 'name email');

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Authorization check
    if (
      req.user.role === 'student' && 
      req.user.id !== student._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const activities = await Activity.find({ 
      student: req.params.id,
      status: 'approved'
    })
      .sort('-createdAt')
      .populate('reviewedBy', 'name');

    const stats = await student.getStatistics();

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    const filename = `student-report-${student.rollNo}-${Date.now()}.pdf`;
    const filepath = path.join(__dirname, '../uploads', filename);

    doc.pipe(fs.createWriteStream(filepath));

    // Header
    doc.fontSize(20).text('Student Activity Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown(2);

    // Student Info
    doc.fontSize(14).text('Student Information', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(`Name: ${student.name}`);
    doc.text(`Roll No: ${student.rollNo}`);
    doc.text(`Email: ${student.email}`);
    doc.text(`Program: ${student.program} - Semester ${student.semester}`);
    doc.text(`Department: ${student.department?.name}`);
    doc.text(`CGPA: ${student.cgpa || 'N/A'}`);
    doc.moveDown(2);

    // Statistics
    doc.fontSize(14).text('Activity Statistics', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(`Total Activities: ${stats.totalActivities}`);
    doc.text(`Approved Activities: ${stats.approvedActivities}`);
    doc.text(`Activity Score: ${student.activityScore}`);
    doc.text(`Credits Earned: ${student.totalCredits}`);
    doc.text(`Badges: ${student.badges.length}`);
    doc.moveDown(2);

    // Badges
    if (student.badges.length > 0) {
      doc.fontSize(14).text('Badges Earned', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);
      student.badges.forEach(badge => {
        doc.text(`• ${badge.name} (${new Date(badge.earnedAt).toLocaleDateString()})`);
      });
      doc.moveDown(2);
    }

    // Activities
    doc.fontSize(14).text('Activity Details', { underline: true });
    doc.moveDown(0.5);

    activities.forEach((activity, index) => {
      if (doc.y > 700) {
        doc.addPage();
      }

      doc.fontSize(12).text(`${index + 1}. ${activity.title}`, { underline: true });
      doc.fontSize(10);
      doc.text(`Type: ${activity.type} | Category: ${activity.category}`);
      doc.text(`Level: ${activity.level} | Achievement: ${activity.achievementType}`);
      doc.text(`Date: ${new Date(activity.startDate).toLocaleDateString()}`);
      doc.text(`Score: ${activity.score} | Credits: ${activity.credits}`);
      doc.text(`Description: ${activity.description}`);
      if (activity.remarks) {
        doc.text(`Remarks: ${activity.remarks}`);
      }
      doc.moveDown(1);
    });

    // Footer
    doc.fontSize(8).text(
      'This is a system-generated report. No signature required.',
      50,
      doc.page.height - 50,
      { align: 'center' }
    );

    doc.end();

    // Wait for PDF to be created
    doc.on('finish', async () => {
      // Save report record
      await Report.create({
        generatedBy: req.user.id,
        reportType: 'student-activity',
        title: `Activity Report - ${student.name}`,
        filters: { student: student._id },
        fileUrl: `/uploads/${filename}`,
        format: 'pdf'
      });

      res.status(200).json({
        success: true,
        message: 'Report generated successfully',
        downloadUrl: `/uploads/${filename}`
      });
    });

  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating report',
      error: error.message
    });
  }
};

// @desc    Get department summary report
// @route   GET /api/reports/department/:id
// @access  Private (Faculty, Admin)
exports.getDepartmentReport = async (req, res) => {
  try {
    const students = await User.find({ 
      department: req.params.id,
      role: 'student'
    }).select('_id name rollNo activityScore totalCredits');

    const studentIds = students.map(s => s._id);

    const activities = await Activity.find({ 
      student: { $in: studentIds }
    });

    const stats = {
      totalStudents: students.length,
      totalActivities: activities.length,
      approvedActivities: activities.filter(a => a.status === 'approved').length,
      pendingActivities: activities.filter(a => a.status === 'pending').length,
      totalScore: students.reduce((sum, s) => sum + (s.activityScore || 0), 0),
      totalCredits: students.reduce((sum, s) => sum + (s.totalCredits || 0), 0),
      activityTypeBreakdown: activities.reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1;
        return acc;
      }, {}),
      topPerformers: students.sort((a, b) => b.activityScore - a.activityScore).slice(0, 10)
    };

    res.status(200).json({
      success: true,
      report: stats
    });
  } catch (error) {
    console.error('Get department report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating department report',
      error: error.message
    });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res) => {
  try {
    const { reportType, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (req.user.role === 'student') {
      filter.generatedBy = req.user.id;
    }
    if (reportType) {
      filter.reportType = reportType;
    }

    const skip = (page - 1) * limit;

    const reports = await Report.find(filter)
      .populate('generatedBy', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Report.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      reports
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message
    });
  }
};
