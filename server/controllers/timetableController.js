const Timetable = require('../models/Timetable');
const Class = require('../models/Class');

// @desc    Get student's timetable
// @route   GET /api/timetable/student/:studentId
// @access  Private
exports.getStudentTimetable = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find all classes the student is enrolled in
    const classes = await Class.find({ 
      students: studentId,
      isActive: true 
    });

    if (!classes || classes.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No classes found for this student'
      });
    }

    const classIds = classes.map(cls => cls._id);

    // Get timetable entries for these classes
    const timetable = await Timetable.find({
      class: { $in: classIds },
      isActive: true
    })
      .populate('class', 'code name subject')
      .populate('faculty', 'name email')
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      data: timetable
    });
  } catch (error) {
    console.error('Error fetching student timetable:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching timetable',
      error: error.message
    });
  }
};

// @desc    Get timetable for a specific class
// @route   GET /api/timetable/class/:classId
// @access  Private
exports.getClassTimetable = async (req, res) => {
  try {
    const { classId } = req.params;

    const timetable = await Timetable.find({
      class: classId,
      isActive: true
    })
      .populate('faculty', 'name email')
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      data: timetable
    });
  } catch (error) {
    console.error('Error fetching class timetable:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching timetable',
      error: error.message
    });
  }
};

// @desc    Get faculty timetable
// @route   GET /api/timetable/faculty/:facultyId
// @access  Private
exports.getFacultyTimetable = async (req, res) => {
  try {
    const { facultyId } = req.params;

    const timetable = await Timetable.find({
      faculty: facultyId,
      isActive: true
    })
      .populate('class', 'code name subject')
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      data: timetable
    });
  } catch (error) {
    console.error('Error fetching faculty timetable:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching timetable',
      error: error.message
    });
  }
};

// @desc    Create timetable entry
// @route   POST /api/timetable
// @access  Private (Admin/Faculty)
exports.createTimetableEntry = async (req, res) => {
  try {
    const {
      class: classId,
      subject,
      faculty,
      dayOfWeek,
      startTime,
      endTime,
      room,
      type,
      semester,
      academicYear
    } = req.body;

    // Check if class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check for time conflicts
    const conflict = await Timetable.findOne({
      class: classId,
      dayOfWeek,
      isActive: true,
      $or: [
        {
          startTime: { $lte: startTime },
          endTime: { $gt: startTime }
        },
        {
          startTime: { $lt: endTime },
          endTime: { $gte: endTime }
        },
        {
          startTime: { $gte: startTime },
          endTime: { $lte: endTime }
        }
      ]
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: 'Time slot conflicts with existing entry'
      });
    }

    const timetableEntry = await Timetable.create({
      class: classId,
      subject,
      faculty,
      dayOfWeek,
      startTime,
      endTime,
      room,
      type,
      semester,
      academicYear
    });

    const populatedEntry = await Timetable.findById(timetableEntry._id)
      .populate('class', 'code name')
      .populate('faculty', 'name email');

    res.status(201).json({
      success: true,
      data: populatedEntry,
      message: 'Timetable entry created successfully'
    });
  } catch (error) {
    console.error('Error creating timetable entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating timetable entry',
      error: error.message
    });
  }
};

// @desc    Update timetable entry
// @route   PUT /api/timetable/:id
// @access  Private (Admin/Faculty)
exports.updateTimetableEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If time is being updated, check for conflicts
    if (updateData.startTime || updateData.endTime || updateData.dayOfWeek) {
      const entry = await Timetable.findById(id);
      
      const conflict = await Timetable.findOne({
        _id: { $ne: id },
        class: entry.class,
        dayOfWeek: updateData.dayOfWeek || entry.dayOfWeek,
        isActive: true,
        $or: [
          {
            startTime: { $lte: updateData.startTime || entry.startTime },
            endTime: { $gt: updateData.startTime || entry.startTime }
          },
          {
            startTime: { $lt: updateData.endTime || entry.endTime },
            endTime: { $gte: updateData.endTime || entry.endTime }
          }
        ]
      });

      if (conflict) {
        return res.status(400).json({
          success: false,
          message: 'Time slot conflicts with existing entry'
        });
      }
    }

    const timetableEntry = await Timetable.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('class', 'code name')
      .populate('faculty', 'name email');

    if (!timetableEntry) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: timetableEntry,
      message: 'Timetable entry updated successfully'
    });
  } catch (error) {
    console.error('Error updating timetable entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating timetable entry',
      error: error.message
    });
  }
};

// @desc    Delete timetable entry
// @route   DELETE /api/timetable/:id
// @access  Private (Admin)
exports.deleteTimetableEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const timetableEntry = await Timetable.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!timetableEntry) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Timetable entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting timetable entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting timetable entry',
      error: error.message
    });
  }
};

// @desc    Get all timetable entries (Admin)
// @route   GET /api/timetable
// @access  Private (Admin)
exports.getAllTimetable = async (req, res) => {
  try {
    const { semester, academicYear, class: classId } = req.query;
    
    const filter = { isActive: true };
    if (semester) filter.semester = semester;
    if (academicYear) filter.academicYear = academicYear;
    if (classId) filter.class = classId;

    const timetable = await Timetable.find(filter)
      .populate('class', 'code name subject')
      .populate('faculty', 'name email')
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      data: timetable
    });
  } catch (error) {
    console.error('Error fetching all timetable:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching timetable',
      error: error.message
    });
  }
};
