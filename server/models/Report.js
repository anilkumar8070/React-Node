const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportType: {
    type: String,
    required: true,
    enum: [
      'student-activity',
      'department-summary',
      'semester-report',
      'faculty-review',
      'comprehensive',
      'analytics'
    ]
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  filters: {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department'
    },
    semester: String,
    academicYear: String,
    startDate: Date,
    endDate: Date,
    activityTypes: [String],
    status: String
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  fileUrl: {
    type: String
  },
  format: {
    type: String,
    enum: ['pdf', 'excel', 'json'],
    default: 'pdf'
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days
  }
});

// Auto-delete expired reports
reportSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Report', reportSchema);
