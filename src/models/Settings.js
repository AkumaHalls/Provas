const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  allowRegistration: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
