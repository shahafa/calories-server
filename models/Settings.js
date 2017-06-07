const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  numberOfCaloriesPerDay: { type: Number },
}, { timestamps: true });

ConfigSchema.statics.getSettings = async function (userId) {
  const settings = await this.findOne({ userId }).exec();
  if (!settings) {
    return null;
  }

  return settings;
};

ConfigSchema.statics.setSettings = async function (userId, settingsUpdates) {
  let settings = await this.findOne({ userId }).exec();
  if (settings) {
    Object.assign(settings, settingsUpdates);
  } else {
    settings = new this(Object.assign({}, { userId }, settingsUpdates));
  }

  await settings.save();
};

module.exports = mongoose.model('Setting', ConfigSchema);
