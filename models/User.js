
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  xp: {
    type: Number,
    default: 0,
  },
  tasksCompleted: {
    type: Number,
    default: 0,
  },
  referredBy: {
    type: String,  // Store the telegramId of the user who referred them
    default: null,
  }, referralCount: {
    type: Number,
    default: 0,  // Count of successful referrals
  },
});

// Check if the model already exists before defining it
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
