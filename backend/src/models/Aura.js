const mongoose = require('mongoose');

const AuraSchema = new mongoose.Schema({
  key: { type: String, default: 'global', index: true },
  points: { type: Number, default: 0 }
});

// Keep a single document (key='global') to store global aura points
module.exports = mongoose.model('Aura', AuraSchema);
