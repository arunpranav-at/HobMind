const mongoose = require('mongoose');

const TechniqueSchema = new mongoose.Schema({
  uuid: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  url: String
}, { _id: false });

const PlanSchema = new mongoose.Schema({
  hobby: { type: String, required: true, index: true },
  level: { type: String, required: true, index: true },
  techniques: [TechniqueSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', PlanSchema);
