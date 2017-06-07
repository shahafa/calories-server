const Settings = require('../models/Settings');
const { successObject, errorObject } = require('../lib/util');
const { ERROR_VALIDATION_FAILED, ERROR_SOMETHING_BAD_HAPPEND } = require('../consts');

const getSettings = async (req, res) => {
  try {
    const userId = req.user.user.id;
    const settings = await Settings.getSettings(userId);

    return res.send(successObject('', { data: settings }));
  } catch (err) {
    return res.status(500).send(errorObject(ERROR_SOMETHING_BAD_HAPPEND, 'Something bad happened :(', err));
  }
};

const setSettings = async (req, res) => {
  req.assert('settings', 'sttings object be blank').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errorObject(ERROR_VALIDATION_FAILED, 'Validation Failed', errors));
  }

  try {
    const userId = req.user.user.id;
    await Settings.setSettings(userId, req.body.settings);

    return res.send(successObject('', { data: await Settings.getSettings(userId) }));
  } catch (err) {
    return res.status(500).send(errorObject(ERROR_SOMETHING_BAD_HAPPEND, 'Something bad happened :(', err));
  }
};

module.exports = {
  getSettings,
  setSettings,
};
