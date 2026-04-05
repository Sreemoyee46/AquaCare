const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tank: { type: mongoose.Schema.Types.ObjectId, ref: 'Tank', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['feed', 'water_change', 'filter_clean', 'parameter_check', 'custom'], default: 'custom' },
  frequency: { type: String, required: true },
  nextDue: { type: Date, required: true },
  enabled: { type: Boolean, default: true },
  icon: { type: String, default: '⏰' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reminder', reminderSchema);
