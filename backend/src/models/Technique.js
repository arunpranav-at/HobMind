const mongoose = require('mongoose');

const TechniqueSchema = new mongoose.Schema({
  title: String,
  description: String,
  resources: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Technique', TechniqueSchema);
