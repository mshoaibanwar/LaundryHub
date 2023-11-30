const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userID: {
    type:  mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide user id!"],
    unique: false,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: false,
    default: 'unread',
  },
  to: {
    type: String,
    required: false,
    default: 'user',
  },
});

module.exports = mongoose.model('Notification', notificationSchema);