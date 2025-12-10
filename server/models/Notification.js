const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: [
      'activity-submitted',
      'activity-approved',
      'activity-rejected',
      'activity-under-review',
      'badge-earned',
      'mention',
      'reminder',
      'system',
      'announcement'
    ]
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  relatedActivity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  readAt: {
    type: Date
  }
});

// Indexes for efficient queries
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // Auto-delete after 30 days

module.exports = mongoose.model('Notification', notificationSchema);
