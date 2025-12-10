const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: [true, 'Activity type is required'],
    enum: [
      'academic',
      'certification',
      'internship',
      'workshop',
      'seminar',
      'event',
      'competition',
      'achievement',
      'project',
      'sports',
      'cultural',
      'technical',
      'social-service',
      'research',
      'publication',
      'other'
    ]
  },
  title: {
    type: String,
    required: [true, 'Activity title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Activity description is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['curricular', 'co-curricular', 'extra-curricular'],
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  },
  duration: {
    type: Number, // in days
    default: 0
  },
  organizer: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  level: {
    type: String,
    enum: ['department', 'college', 'university', 'state', 'national', 'international'],
    default: 'college'
  },
  achievementType: {
    type: String,
    enum: ['participation', 'winner', 'runner-up', 'finalist', 'certificate', 'publication', 'none'],
    default: 'participation'
  },
  rank: {
    type: String,
    trim: true
  },
  score: {
    type: Number,
    default: 0
  },
  credits: {
    type: Number,
    default: 0
  },
  skills: [{
    type: String,
    trim: true
  }],
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  certificateNumber: {
    type: String,
    trim: true
  },
  githubLink: {
    type: String,
    trim: true
  },
  projectLink: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'under-review', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  remarks: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  visibilityScore: {
    type: Number,
    default: 0
  },
  semester: {
    type: String,
    trim: true
  },
  academicYear: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate duration if endDate is provided
activitySchema.pre('save', function(next) {
  if (this.endDate && this.startDate) {
    const diff = this.endDate - this.startDate;
    this.duration = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  this.updatedAt = Date.now();
  next();
});

// Calculate activity score based on multiple factors
activitySchema.methods.calculateScore = function() {
  let score = 0;

  // Base score by type
  const typeScores = {
    'certification': 10,
    'internship': 15,
    'research': 20,
    'publication': 25,
    'competition': 12,
    'project': 10,
    'workshop': 5,
    'seminar': 5,
    'achievement': 15,
    'academic': 8,
    'other': 3
  };
  score += typeScores[this.type] || 5;

  // Level multiplier
  const levelMultipliers = {
    'department': 1,
    'college': 1.2,
    'university': 1.5,
    'state': 1.8,
    'national': 2,
    'international': 2.5
  };
  score *= levelMultipliers[this.level] || 1;

  // Achievement type bonus
  const achievementBonus = {
    'winner': 20,
    'runner-up': 15,
    'finalist': 10,
    'publication': 25,
    'certificate': 5,
    'participation': 3,
    'none': 0
  };
  score += achievementBonus[this.achievementType] || 0;

  // Duration bonus (for internships and projects)
  if (['internship', 'project'].includes(this.type) && this.duration > 0) {
    score += Math.min(this.duration / 7, 10); // Max 10 points for duration
  }

  return Math.round(score);
};

// Indexes for better query performance
activitySchema.index({ student: 1, status: 1 });
activitySchema.index({ type: 1, status: 1 });
activitySchema.index({ createdAt: -1 });
activitySchema.index({ reviewedBy: 1 });

module.exports = mongoose.model('Activity', activitySchema);
