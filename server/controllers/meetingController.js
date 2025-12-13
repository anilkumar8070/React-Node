const Meeting = require('../models/Meeting');
const User = require('../models/User');

// Get all meetings
exports.getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate('organizer', 'name email role')
      .populate('attendees.user', 'name email role')
      .sort('-date');

    res.status(200).json({
      success: true,
      count: meetings.length,
      meetings
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create new meeting
exports.createMeeting = async (req, res) => {
  try {
    const { title, description, date, time, duration, location, type, meetingLink, attendees } = req.body;

    const meeting = await Meeting.create({
      title,
      description,
      organizer: req.user._id,
      date,
      time,
      duration,
      location,
      type,
      meetingLink,
      attendees: attendees?.map(userId => ({ user: userId })) || []
    });

    const populatedMeeting = await Meeting.findById(meeting._id)
      .populate('organizer', 'name email role')
      .populate('attendees.user', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Meeting created successfully',
      meeting: populatedMeeting
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get meeting by ID
exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('organizer', 'name email role designation')
      .populate('attendees.user', 'name email role rollNo employeeId');

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    res.status(200).json({
      success: true,
      meeting
    });
  } catch (error) {
    console.error('Error fetching meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update meeting
exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('organizer', 'name email role')
     .populate('attendees.user', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Meeting updated successfully',
      meeting: updatedMeeting
    });
  } catch (error) {
    console.error('Error updating meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete meeting
exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    await Meeting.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Meeting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update attendee status
exports.updateAttendeeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    const attendeeIndex = meeting.attendees.findIndex(
      a => a.user.toString() === req.user._id.toString()
    );

    if (attendeeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'You are not an attendee of this meeting'
      });
    }

    meeting.attendees[attendeeIndex].status = status;
    await meeting.save();

    res.status(200).json({
      success: true,
      message: 'Attendance status updated successfully',
      meeting
    });
  } catch (error) {
    console.error('Error updating attendee status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
