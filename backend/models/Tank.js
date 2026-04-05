const mongoose = require('mongoose');

const tankSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  fishId: { type: String, required: true },
  fishName: { type: String, required: true },
  fishEmoji: { type: String, default: '🐠' },
  size: { type: String, enum: ['Small (under 20L)', 'Medium (20–60L)', 'Large (60–150L)', 'Extra Large (150L+)'], default: 'Medium (20–60L)' },
  waterType: { type: String, enum: ['Freshwater', 'Saltwater', 'Brackish'], default: 'Freshwater' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tank', tankSchema);
