const ClassMessage = require('../models/ClassMessage');
const Class = require('../models/Class');

// @desc    Send message to class
// @route   POST /api/messages/class/:classId
// @access  Private (Faculty)
exports.sendClassMessage = async (req, res) => {
  try {
    const { message, priority } = req.body;
    const classId = req.params.classId;

    // Find the class
    const classData = await Class.findById(classId).populate('students');
    
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check if faculty owns this class
    if (classData.faculty.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages to this class'
      });
    }

    // Create message
    const classMessage = await ClassMessage.create({
      class: classId,
      sender: req.user.id,
      message,
      priority: priority || 'normal',
      recipients: classData.students.map(s => s._id)
    });

    // Populate for response
    await classMessage.populate('sender', 'name email');
    await classMessage.populate('class', 'code name');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: classMessage
    });
  } catch (error) {
    console.error('Send class message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

// @desc    Get messages for a class (Faculty view)
// @route   GET /api/messages/class/:classId
// @access  Private (Faculty)
exports.getClassMessages = async (req, res) => {
  try {
    const classId = req.params.classId;

    // Verify class ownership
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    if (classData.faculty.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these messages'
      });
    }

    const messages = await ClassMessage.find({ class: classId })
      .populate('sender', 'name email profileImage')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Get class messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

// @desc    Get student's messages from all classes
// @route   GET /api/messages/my-messages
// @access  Private (Student)
exports.getMyMessages = async (req, res) => {
  try {
    // Find all classes where student is enrolled
    const classes = await Class.find({ students: req.user.id });
    const classIds = classes.map(c => c._id);

    // Get all messages for these classes
    const messages = await ClassMessage.find({
      class: { $in: classIds },
      recipients: req.user.id
    })
      .populate('sender', 'name email profileImage')
      .populate('class', 'code name')
      .sort('-createdAt');

    // Group messages by class
    const messagesByClass = {};
    messages.forEach(msg => {
      const classId = msg.class._id.toString();
      if (!messagesByClass[classId]) {
        messagesByClass[classId] = {
          class: msg.class,
          messages: []
        };
      }
      messagesByClass[classId].messages.push(msg);
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: Object.values(messagesByClass)
    });
  } catch (error) {
    console.error('Get my messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:messageId/read
// @access  Private (Student)
exports.markMessageAsRead = async (req, res) => {
  try {
    const message = await ClassMessage.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is a recipient
    if (!message.recipients.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if already read
    const alreadyRead = message.readBy.some(
      r => r.user.toString() === req.user.id.toString()
    );

    if (!alreadyRead) {
      message.readBy.push({
        user: req.user.id,
        readAt: Date.now()
      });
      await message.save();
    }

    res.status(200).json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking message as read',
      error: error.message
    });
  }
};

module.exports = exports;
