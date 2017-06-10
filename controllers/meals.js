const Meal = require('../models/Meal');
const { successObject, errorObject } = require('../lib/util');
const { ERROR_VALIDATION_FAILED, ERROR_SOMETHING_BAD_HAPPEND } = require('../consts');

const getAll = async (req, res) => {
  try {
    const userId = req.user.user.id;
    const meals = await Meal.getMeals(userId);

    return res.send(successObject('', { data: { meals } }));
  } catch (err) {
    return res.status(500).send(errorObject(ERROR_SOMETHING_BAD_HAPPEND, 'Something bad happened :(', err));
  }
};

const add = async (req, res) => {
  req.assert('meal', 'meal object is missing').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errorObject(ERROR_VALIDATION_FAILED, 'Validation Failed', errors));
  }

  try {
    const userId = req.user.user.id;
    const meal = Object.assign({ userId }, req.body.meal);
    await Meal.add(meal);

    const meals = await Meal.getMeals(userId);
    return res.send(successObject('', { data: { meals } }));
  } catch (err) {
    return res.status(500).send(errorObject(ERROR_SOMETHING_BAD_HAPPEND, 'Something bad happened :(', err));
  }
};

const edit = async (req, res) => {
  req.assert('meal', 'meal object is missing').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errorObject(ERROR_VALIDATION_FAILED, 'Validation Failed', errors));
  }

  try {
    const userId = req.user.user.id;
    await Meal.edit(userId, req.body.meal);

    const meals = await Meal.getMeals(userId);
    return res.send(successObject('', { data: { meals } }));
  } catch (err) {
    return res.status(500).send(errorObject(ERROR_SOMETHING_BAD_HAPPEND, 'Something bad happened :(', err));
  }
};

const deleteMeal = async (req, res) => {
  const userId = req.user.user.id;
  const mealId = req.params.id;

  try {
    await Meal.delete(userId, mealId);

    const meals = await Meal.getMeals(userId);
    return res.send(successObject('', { data: { meals } }));
  } catch (err) {
    return res.status(500).send(errorObject(ERROR_SOMETHING_BAD_HAPPEND, 'Something bad happened :(', err));
  }
};

module.exports = {
  getAll,
  add,
  edit,
  deleteMeal,
};
