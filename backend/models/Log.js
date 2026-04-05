const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  tank: { type: mongoose.Schema.Types.ObjectId, ref: 'Tank', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  temperature: { type: Number, required: true },
  ph: { type: Number, required: true },
  turbidity: { type: String, enum: ['Clear', 'Slightly Cloudy', 'Very Cloudy'], required: true },
  ammonia: { type: Number, required: true },
  status: { type: String, enum: ['good', 'warn', 'critical'], default: 'good' },
  aiAnalysis: { type: String, default: '' },
  loggedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);
