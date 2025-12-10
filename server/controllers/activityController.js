const Activity = require('../models/Activity');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private (Student)
exports.createActivity = async (req, res) => {
  try {
    const activityData = {
      ...req.body,
      student: req.user.id
    };

    const activity = await Activity.create(activityData);

    // Calculate and set score
    activity.score = activity.calculateScore();
    await activity.save();

    // Create notification for faculty/admin
    const notification = await Notification.create({
      recipient: req.user.mentor || req.user.department,
      sender: req.user.id,
      type: 'activity-submitted',
      title: 'New Activity Submitted',
      message: `${req.user.name} has submitted a new ${activity.type} activity: ${activity.title}`,
      relatedActivity: activity._id,
      link: `/faculty/activities/${activity._id}`
    });

    // Emit socket event
    const io = req.app.get('io');
    if (req.user.mentor) {
      io.to(req.user.mentor.toString()).emit('new-notification', notification);
    }

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      activity
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating activity',
      error: error.message
    });
  }
};

// @desc    Get all activities for logged in student
// @route   GET /api/activities
// @access  Private (Student)
exports.getMyActivities = async (req, res) => {
  try {
    const { status, type, category, semester, sortBy = '-createdAt' } = req.query;

    const filter = { student: req.user.id };

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (semester) filter.semester = semester;

    const activities = await Activity.find(filter)
      .sort(sortBy)
      .populate('reviewedBy', 'name email');

    // Calculate statistics
    const stats = {
      total: activities.length,
      pending: activities.filter(a => a.status === 'pending').length,
      approved: activities.filter(a => a.status === 'approved').length,
      rejected: activities.filter(a => a.status === 'rejected').length,
      totalScore: activities.reduce((sum, a) => sum + (a.score || 0), 0)
    };

    res.status(200).json({
      success: true,
      count: activities.length,
      stats,
      activities
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities',
      error: error.message
    });
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Private
exports.getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('student', 'name email rollNo program semester department')
      .populate('reviewedBy', 'name email role');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Check authorization
    if (
      req.user.role === 'student' && 
      activity.student._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this activity'
      });
    }

    res.status(200).json({
      success: true,
      activity
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity',
      error: error.message
    });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private (Student - own activities only)
exports.updateActivity = async (req, res) => {
  try {
    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Check authorization
    if (activity.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this activity'
      });
    }

    // Can't update approved activities
    if (activity.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update approved activities'
      });
    }

    activity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Recalculate score
    activity.score = activity.calculateScore();
    await activity.save();

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      activity
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating activity',
      error: error.message
    });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private (Student - own activities only)
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Check authorization
    if (activity.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this activity'
      });
    }

    // Can't delete approved activities
    if (activity.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete approved activities'
      });
    }

    await activity.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting activity',
      error: error.message
    });
  }
};

// @desc    Upload activity documents
// @route   POST /api/activities/:id/documents
// @access  Private (Student)
exports.uploadDocuments = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    if (activity.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const documents = req.files.map(file => ({
      name: file.originalname,
      url: `/uploads/${file.filename}`,
      type: file.mimetype
    }));

    activity.documents.push(...documents);
    await activity.save();

    res.status(200).json({
      success: true,
      message: 'Documents uploaded successfully',
      documents: activity.documents
    });
  } catch (error) {
    console.error('Upload documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading documents',
      error: error.message
    });
  }
};

// @desc    Get activity statistics
// @route   GET /api/activities/stats
// @access  Private (Student)
exports.getActivityStats = async (req, res) => {
  try {
    const activities = await Activity.find({ student: req.user.id });

    // Group by type
    const byType = activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {});

    // Group by category
    const byCategory = activities.reduce((acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + 1;
      return acc;
    }, {});

    // Group by status
    const byStatus = activities.reduce((acc, activity) => {
      acc[activity.status] = (acc[activity.status] || 0) + 1;
      return acc;
    }, {});

    // Monthly activity count (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyActivities = await Activity.aggregate([
      {
        $match: {
          student: req.user._id,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total: activities.length,
        byType,
        byCategory,
        byStatus,
        monthlyActivities,
        totalScore: activities.reduce((sum, a) => sum + (a.score || 0), 0),
        totalCredits: activities
          .filter(a => a.status === 'approved')
          .reduce((sum, a) => sum + (a.credits || 0), 0)
      }
    });
  } catch (error) {
    console.error('Get activity stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity statistics',
      error: error.message
    });
  }
};
