const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Department code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  hod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  faculty: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  programs: [{
    name: String,
    duration: Number, // in years
    type: {
      type: String,
      enum: ['UG', 'PG', 'PhD']
    }
  }],
  isActive: {
    type: Boolean,
    default: true
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

departmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Department', departmentSchema);
