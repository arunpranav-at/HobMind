const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  hobby: { type: String, required: true, index: true },
  level: { type: String, index: true },
  techniqueUuid: { type: String, required: true, index: true },
  status: { type: String, enum: ['in-progress','mastered','dropped'], default: 'in-progress' },
  notesUrl: String,
  updatedAt: { type: Date, default: Date.now }
});

ProgressSchema.pre('save', function(next){ this.updatedAt = Date.now(); next(); });

ProgressSchema.index({ hobby: 1, techniqueUuid: 1 });

module.exports = mongoose.model('Progress', ProgressSchema);
