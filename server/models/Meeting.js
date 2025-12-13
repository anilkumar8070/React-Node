const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Meeting title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Meeting date is required']
  },
  time: {
    type: String,
    required: [true, 'Meeting time is required']
  },
  duration: {
    type: Number,
    default: 60, // in minutes
    min: 15
  },
  type: {
    type: String,
    enum: ['online', 'physical'],
    default: 'physical'
  },
  location: {
    type: String,
    trim: true
  },
  meetingLink: {
    type: String,
    trim: true
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['invited', 'accepted', 'declined', 'attended'],
      default: 'invited'
    }
  }],
  agenda: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
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

// Update timestamp on modification
meetingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for total attendees count
meetingSchema.virtual('attendeeCount').get(function() {
  return this.attendees ? this.attendees.length : 0;
});

module.exports = mongoose.model('Meeting', meetingSchema);
