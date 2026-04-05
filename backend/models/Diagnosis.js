const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
  tank: { type: mongoose.Schema.Types.ObjectId, ref: 'Tank', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fishName: { type: String, required: true },
  symptoms: [{ type: String }],
  disease: { type: String, required: true },
  confidence: { type: Number },
  dos: [{ type: String }],
  donts: [{ type: String }],
  aiResponse: { type: String, default: '' },
  diagnosedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Diagnosis', diagnosisSchema);
