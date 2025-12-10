const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    default: 'student'
  },
  rollNo: {
    type: String,
    sparse: true,
    unique: true
  },
  program: {
    type: String,
    trim: true
  },
  semester: {
    type: String,
    trim: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  stanor: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  contactNumber: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  enrollmentYear: {
    type: Number
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  totalCredits: {
    type: Number,
    default: 0
  },
  activityScore: {
    type: Number,
    default: 0
  },
  badges: [{
    type: {
      type: String,
      enum: ['gold', 'silver', 'bronze', 'participation', 'excellence']
    },
    name: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  attendance: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Update timestamp on modification
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get user statistics
userSchema.methods.getStatistics = async function() {
  const Activity = mongoose.model('Activity');
  
  const totalActivities = await Activity.countDocuments({ student: this._id });
  const pendingApprovals = await Activity.countDocuments({ 
    student: this._id, 
    status: 'pending' 
  });
  const approvedActivities = await Activity.countDocuments({ 
    student: this._id, 
    status: 'approved' 
  });

  return {
    totalActivities,
    pendingApprovals,
    creditsEarned: this.totalCredits,
    activityScore: this.activityScore,
    approvedActivities
  };
};

module.exports = mongoose.model('User', userSchema);
